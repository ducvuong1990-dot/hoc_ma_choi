import argparse
import json
import math
import os
import sys
import wave

from gtts import gTTS
from mutagen.mp3 import MP3


# Constants for word complexity calculation
VOWEL_WEIGHT = 0.42  # Trọng số cho nguyên âm tiếng Việt
CHAR_WEIGHT = 0.1    # Trọng số cho độ dài từ
MIN_COMPLEXITY = 1.0 # Độ phức tạp tối thiểu

# Punctuation weights for timing
SENTENCE_END_WEIGHT = 1.2   # Dấu câu kết thúc (. ! ?)
CLAUSE_PAUSE_WEIGHT = 0.55  # Dấu ngắt câu (, ; :)

def word_complexity(word):
    """Calculate complexity score for Vietnamese word based on vowels and length."""
    vowels = "aeiouyáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự"
    vowel_count = sum(1 for char in word.lower() if char in vowels)
    return max(MIN_COMPLEXITY, vowel_count * VOWEL_WEIGHT + len(word) * CHAR_WEIGHT)


def estimate_word_timestamps(text, actual_duration=None):
    words = str(text or "").split()
    if not words:
        return []

    weights = []
    for word in words:
        weight = word_complexity(word)
        if word.endswith((".", "!", "?")):
            weight += SENTENCE_END_WEIGHT
        elif word.endswith((",", ";", ":")):
            weight += CLAUSE_PAUSE_WEIGHT
        weights.append(weight)

    total_weight = sum(weights) or 1
    duration = actual_duration or max(2.2, total_weight * 0.34)
    time_unit = duration / total_weight
    current_time = 0.0
    word_data = []

    for index, word in enumerate(words):
        segment_duration = weights[index] * time_unit
        visible_duration = (word_complexity(word) / weights[index]) * segment_duration
        if index == len(words) - 1:
            visible_duration = segment_duration
        word_data.append({
            "start": round(current_time, 2),
            "end": round(current_time + visible_duration, 2),
            "text": word,
        })
        current_time += segment_duration

    return word_data


def write_placeholder_audio(output_mp3, duration=2.4):
    # Local fallback: a short WAV payload kept at the expected file path.
    # Browsers usually sniff it correctly from localhost; if not, the viewer
    # still has word timestamps and continues without crashing.
    sample_rate = 22050
    frames = int(duration * sample_rate)
    with wave.open(output_mp3, "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        for i in range(frames):
            envelope = math.exp(-i / max(1, frames) * 4)
            tone = int(700 * math.sin(2 * math.pi * 440 * i / sample_rate) * envelope)
            wav.writeframesraw(tone.to_bytes(2, byteorder="little", signed=True))


def generate_audio_local(text, output_mp3, output_json):
    os.makedirs(os.path.dirname(output_mp3), exist_ok=True)
    clean_text = str(text or "").replace("  ", " ").strip()

    try:
        tts = gTTS(text=clean_text, lang="vi", slow=False)
        tts.save(output_mp3)
        duration = MP3(output_mp3).info.length
        print(f"  Audio generated with gTTS: {duration:.2f}s")
    except (OSError, IOError) as error:
        print(f"  Warning: File I/O error, using local placeholder audio. Error: {error}")
        timestamps = estimate_word_timestamps(clean_text)
        duration = (timestamps[-1]["end"] + 0.4) if timestamps else 2.4
        write_placeholder_audio(output_mp3, duration)
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(timestamps, f, ensure_ascii=False, indent=2)
        return
    except Exception as error:
        print(f"  Warning: gTTS unavailable, using local placeholder audio. Error: {error}")
        import traceback
        traceback.print_exc()
        timestamps = estimate_word_timestamps(clean_text)
        duration = (timestamps[-1]["end"] + 0.4) if timestamps else 2.4
        write_placeholder_audio(output_mp3, duration)
        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(timestamps, f, ensure_ascii=False, indent=2)
        return

    timestamps = estimate_word_timestamps(clean_text, duration)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(timestamps, f, ensure_ascii=False, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Generate lesson audio and word-level karaoke timestamps.")
    parser.add_argument("--script", required=True, help="Path to prompts.json containing slide scripts")
    parser.add_argument("--output_dir", required=True, help="Directory to save audio files")
    args = parser.parse_args()

    if not os.path.exists(args.script):
        print(f"Error: Script file {args.script} not found")
        sys.exit(1)

    with open(args.script, "r", encoding="utf-8") as f:
        data = json.load(f)

    audio_dir = os.path.join(args.output_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)

    for slide in data.get("slides", []):
        number = slide.get("slide_number") or slide.get("slide")
        script_text = slide.get("script", "")
        if number is None or not script_text:
            print(f"Skipping slide {number}: missing slide number or script")
            continue

        print(f"Generating audio for slide {number}...")
        mp3_path = os.path.join(audio_dir, f"slide-{int(number):02d}.mp3")
        json_path = os.path.join(audio_dir, f"slide-{int(number):02d}.json")
        generate_audio_local(script_text, mp3_path, json_path)
        print(f"  Done: {mp3_path}")


if __name__ == "__main__":
    main()
