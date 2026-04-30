
import json
import os
import time
import shutil
import sys
from gtts import gTTS
from mutagen.mp3 import MP3

# Ensure output is UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def build_lesson(json_path):
    print(f"--- Building lesson from: {json_path} ---")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"ERROR reading JSON {json_path}: {e}")
        return

    # 1. Tao thu muc bai hoc
    timestamp = int(time.time())
    base_name = os.path.basename(json_path).replace('.json', '')
    lesson_id = f"lesson_{base_name}_{timestamp}"
    lesson_dir = os.path.join("lessons", lesson_id)
    os.makedirs(lesson_dir, exist_ok=True)
    os.makedirs(os.path.join(lesson_dir, "audio"), exist_ok=True)
    os.makedirs(os.path.join(lesson_dir, "images"), exist_ok=True)

    # 2. Tao Audio va thong tin Karaoke
    slides_info = []
    for i, slide in enumerate(data['slides']):
        text = slide.get('text', '')
        if not text:
            continue
            
        audio_filename = f"slide-{str(i+1).zfill(2)}.mp3"
        audio_path = os.path.join(lesson_dir, "audio", audio_filename)
        
        # Tao audio bang gTTS
        try:
            tts = gTTS(text=text, lang='vi')
            tts.save(audio_path)
            
            # Tao file JSON Karaoke gia lap
            audio_info = MP3(audio_path)
            duration = audio_info.info.length
            
            words = text.split()
            time_per_word = duration / max(len(words), 1)
            timestamps = []
            for j, word in enumerate(words):
                timestamps.append({
                    "text": word,
                    "start": j * time_per_word,
                    "end": (j + 1) * time_per_word
                })
            
            # Luu file JSON karaoke cho tung slide
            json_audio_path = audio_path.replace(".mp3", ".json")
            with open(json_audio_path, 'w', encoding='utf-8') as jf:
                json.dump(timestamps, jf, ensure_ascii=False)
                
            print(f"  + Slide {i+1}: Audio & timestamps done ({duration:.2f}s)")
        except Exception as e:
            print(f"  ! Error processing audio for slide {i+1}: {e}")

    # 3. Chuan bi du lieu Quiz
    quizzes = data.get("quizzes", [])

    # 4. Doc template viewer.html
    template_path = "NanoBanana/templates/viewer.html"
    if not os.path.exists(template_path):
        print(f"ERROR: Template {template_path} not found")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # 5. Nhung du lieu vao HTML
    image_paths = [f"images/slide-{str(i+1).zfill(2)}.png" for i in range(len(data['slides']))]
    
    html_content = html_content.replace("[/* IMAGE_LIST_PLACEHOLDER */]", json.dumps(image_paths, ensure_ascii=False))
    html_content = html_content.replace("[/* SCRIPTS_LIST_PLACEHOLDER */]", json.dumps(data['slides'], ensure_ascii=False))
    html_content = html_content.replace("/* QUIZ_DATA_PLACEHOLDER */", json.dumps(quizzes, ensure_ascii=False))
    
    lesson_title = data.get('lesson_title', 'Bài giảng EduPlay')
    html_content = html_content.replace("<title>Bài giảng EduPlay</title>", f"<title>{lesson_title}</title>")

    # 6. Ghi file index.html
    with open(os.path.join(lesson_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"SUCCESS: Created {lesson_dir}")
    return lesson_id

if __name__ == "__main__":
    pending_dir = "pending_scripts"
    if os.path.exists(pending_dir):
        files = [f for f in os.listdir(pending_dir) if f.endswith(".json")]
        print(f"Found {len(files)} scripts in {pending_dir}")
        for filename in files:
            build_lesson(os.path.join(pending_dir, filename))
    else:
        print(f"ERROR: Directory {pending_dir} not found")
