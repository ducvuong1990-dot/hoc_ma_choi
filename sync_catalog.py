import json
import re
from pathlib import Path


LESSONS_DIR = Path("lessons")
DEFAULT_THUMBNAIL = "assets/default_thumb.png"
PRIORITY_GRADES = [1, 5]


SUBJECT_RULES = [
    ("toan", "Toán"),
    ("tieng_viet", "Tiếng Việt"),
    ("abc", "Tiếng Việt"),
    ("lich_su", "Lịch sử"),
    ("dia_ly", "Địa lý"),
    ("dia_li", "Địa lý"),
    ("khoa_hoc", "Khoa học"),
    ("dao_duc", "Đạo đức"),
    ("tieng_anh", "Tiếng Anh"),
    ("am_nhac", "Âm nhạc"),
    ("my_thuat", "Mỹ thuật"),
    ("stem", "STEM"),
]


def load_json(path):
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as error:
        print(f"WARN: Cannot read {path}: {error}")
        return {}


def infer_grade(folder_name):
    lowered = folder_name.lower()
    match = re.search(r"(?:grade|lop|lớp)[_\s-]*(\d)", lowered)
    if match:
        return int(match.group(1))
    return "Chưa rõ"


def numeric_grade(value):
    try:
        grade = int(value)
        return grade if grade > 0 else 0
    except (TypeError, ValueError):
        return 0


def is_priority_grade(value):
    return numeric_grade(value) in PRIORITY_GRADES


def infer_subject(folder_name):
    lowered = folder_name.lower()
    for token, subject in SUBJECT_RULES:
        if token in lowered:
            return subject
    return "Khác"


def infer_title(folder_name):
    lowered = folder_name.lower()
    if lowered.startswith("lesson_script_"):
        parts = folder_name.split("_")[2:-1]
        if parts:
            return " ".join(parts).replace("mega", "MEGA").title()
    return folder_name.replace("_", " ").replace("-", " ").title()


def rel(path):
    return path.as_posix()


def first_existing(paths):
    for path in paths:
        if path.exists():
            return rel(path)
    return DEFAULT_THUMBNAIL


def count_slides(lesson_dir, manifest, prompts):
    manifest_slides = manifest.get("slides")
    if isinstance(manifest_slides, list) and manifest_slides:
        return len(manifest_slides)

    prompt_slides = prompts.get("slides")
    if isinstance(prompt_slides, list) and prompt_slides:
        return len(prompt_slides)

    metadata_count = prompts.get("metadata", {}).get("total_slides")
    if isinstance(metadata_count, int) and metadata_count > 0:
        return metadata_count

    image_count = len(list((lesson_dir / "images").glob("slide-*.*")))
    if image_count:
        return image_count
    return 0


def has_audio(lesson_dir, manifest):
    if list((lesson_dir / "audio").glob("slide-*.mp3")):
        return True
    slides = manifest.get("slides")
    if isinstance(slides, list):
        return any(slide.get("audio") for slide in slides if isinstance(slide, dict))
    return False


def has_quiz(lesson_dir, manifest, prompts):
    for source in (manifest, prompts):
        for key in ("quiz", "quizzes"):
            value = source.get(key)
            if isinstance(value, list) and value:
                return True
    index_path = lesson_dir / "index.html"
    if index_path.exists():
        text = index_path.read_text(encoding="utf-8", errors="ignore").lower()
        return "quiz" in text
    return False


def build_description(slide_count, audio, quiz):
    parts = []
    if slide_count:
        parts.append(f"{slide_count} slide")
    if audio:
        parts.append("Audio")
    if quiz:
        parts.append("Quiz")
    return " · ".join(parts) if parts else "Bài học HTML tương tác"


def build_catalog_item(lesson_dir):
    lesson_id = lesson_dir.name
    manifest = load_json(lesson_dir / "manifest.json")
    prompts = load_json(lesson_dir / "prompts.json")
    prompt_meta = prompts.get("metadata", {}) if isinstance(prompts.get("metadata"), dict) else {}

    title = manifest.get("title") or prompt_meta.get("title") or infer_title(lesson_id)
    grade = manifest.get("grade") or prompt_meta.get("grade") or infer_grade(lesson_id)
    subject = manifest.get("subject") or prompt_meta.get("subject") or infer_subject(lesson_id)
    slide_count = count_slides(lesson_dir, manifest, prompts)
    audio = has_audio(lesson_dir, manifest)
    quiz = has_quiz(lesson_dir, manifest, prompts)
    thumbnail = first_existing([
        lesson_dir / "images2" / "slide-01.png",
        lesson_dir / "images" / "slide-01.png",
        lesson_dir / "images" / "slide-01.svg",
    ])

    item = {
        "id": lesson_id,
        "title": title,
        "grade": grade,
        "subject": subject,
        "slide_count": slide_count,
        "path": rel(lesson_dir / "index.html"),
        "thumbnail": thumbnail,
        "desc": build_description(slide_count, audio, quiz),
        "hasAudio": audio,
        "hasQuiz": quiz,
        "priority": is_priority_grade(grade),
    }

    keywords = manifest.get("keywords")
    if isinstance(keywords, list) and keywords:
        item["keywords"] = keywords
    return item


def sync_catalog():
    if not LESSONS_DIR.exists():
        raise SystemExit(f"ERROR: {LESSONS_DIR} not found.")

    catalog = []
    for lesson_dir in sorted(path for path in LESSONS_DIR.iterdir() if path.is_dir()):
        if not (lesson_dir / "index.html").exists():
            continue
        catalog.append(build_catalog_item(lesson_dir))

    catalog.sort(key=lambda item: (
        0 if numeric_grade(item.get("grade")) == 1 else 1 if numeric_grade(item.get("grade")) == 5 else 2,
        item.get("subject") or "",
        item.get("title") or "",
    ))

    catalog_path = LESSONS_DIR / "catalog.json"
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"DONE: Synced {len(catalog)} lessons into {catalog_path}")


if __name__ == "__main__":
    sync_catalog()
