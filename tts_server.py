import os
import tempfile
from pathlib import Path

from faster_whisper import WhisperModel
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

MODEL_SIZE = os.environ.get("WHISPER_MODEL", "small")
DEVICE = os.environ.get("WHISPER_DEVICE", "cpu")
COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE", "int8")
_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(MODEL_SIZE, device=DEVICE, compute_type=COMPUTE_TYPE)
    return _model


@app.get("/health")
def health():
    return jsonify({
        "ok": True,
        "engine": "faster-whisper",
        "model": MODEL_SIZE,
        "device": DEVICE,
        "computeType": COMPUTE_TYPE,
        "endpoints": ["POST /transcribe"],
    })


@app.post("/transcribe")
def transcribe():
    audio = request.files.get("audio") or request.files.get("file")
    if audio is None:
        return jsonify({"error": "Missing multipart file field named audio"}), 400

    suffix = Path(audio.filename or "reading.webm").suffix or ".webm"
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_path = Path(temp_file.name)
            audio.save(temp_file)

        segments, info = get_model().transcribe(
            str(temp_path),
            language="vi",
            beam_size=5,
            vad_filter=True,
            initial_prompt="Đây là bài đọc tiếng Việt của học sinh tiểu học, giọng miền Bắc, phát âm rõ dấu tiếng Việt.",
        )
        segment_list = [
            {"start": round(segment.start, 2), "end": round(segment.end, 2), "text": segment.text.strip()}
            for segment in segments
        ]
        text = " ".join(segment["text"] for segment in segment_list).strip()
        return jsonify({
            "text": text,
            "transcript": text,
            "language": info.language,
            "languageProbability": info.language_probability,
            "segments": segment_list,
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    finally:
        if temp_path:
            temp_path.unlink(missing_ok=True)


@app.post("/tts")
def tts():
    print("Received TTS request")
    try:
        data = request.get_json(force=True)
        text = data.get("text")
        # print(f"Text: {text}") # Removed due to encoding issues on Windows console
        if not text:
            return jsonify({"error": "Missing text"}), 400

        voice = data.get("voice", "vi-VN-HoaiMyNeural")
        
        # Create a temporary file for the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            temp_path = Path(temp_file.name)
            
        async def generate():
            import edge_tts
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(temp_path))
        
        import asyncio
        asyncio.run(generate())
        
        from flask import send_file
        return send_file(str(temp_path), mimetype="audio/mpeg")
    except Exception as exc:
        print(f"TTS Error: {exc}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)