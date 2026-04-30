from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"
DEFAULT_BASE_URL = "https://api.openai.com/v1"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate lesson slide PNGs with OpenAI Images 2 / gpt-image-2."
    )
    parser.add_argument(
        "--lesson",
        help="Lesson id or path, for example grade1_tieng_viet_a_a_aa. Omit to process all grade1_* lessons.",
    )
    parser.add_argument("--model", default="gpt-image-2", help="OpenAI image model.")
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", DEFAULT_BASE_URL), help="API base URL, for example https://apikey.click/v1")
    parser.add_argument("--transport", choices=["auto", "python", "curl"], default="auto", help="HTTP transport. Use curl for Cloudflare-protected gateways.")
    parser.add_argument("--size", default="auto", help="Image size. Use 'auto' unless you know the model supports a specific size.")
    parser.add_argument("--quality", default="", help="Optional image quality parameter, for example low, medium, high.")
    parser.add_argument("--limit", type=int, default=0, help="Maximum number of slides to generate per lesson. 0 means all.")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate existing images2/slide-*.png files.")
    parser.add_argument("--update-viewer", action="store_true", help="Deprecated: slide viewers should keep SVG text for Vietnamese accuracy.")
    parser.add_argument("--dry-run", action="store_true", help="Print planned work without calling the API.")
    parser.add_argument("--sleep", type=float, default=0.0, help="Seconds to sleep between API calls.")
    return parser.parse_args()


def resolve_lessons(value: str | None) -> list[Path]:
    if value:
        path = Path(value)
        if not path.is_absolute():
            path = LESSONS_DIR / value
        if not path.exists():
            raise SystemExit(f"Lesson not found: {path}")
        return [path]
    return sorted(path for path in LESSONS_DIR.glob("grade*_*") if (path / "prompts.json").exists())


def load_prompts(lesson_dir: Path) -> dict:
    with (lesson_dir / "prompts.json").open("r", encoding="utf-8") as file:
        return json.load(file)


def build_images2_prompt(prompt: str) -> str:
    return (
        "Create a warm child-friendly vector illustration inspired by this lesson prompt.\n"
        f"{prompt}\n"
        "Important: do not include any letters, words, numbers, captions, labels, UI text, handwriting, or readable text in the image. "
        "The Vietnamese lesson text will be rendered separately by HTML/SVG to avoid font and spelling errors. "
        "Use only objects, children, classroom materials, nature, shapes, colors, and simple scenes. "
        "No copyrighted characters, no watermark, no logo."
    )


def request_image(prompt: str, model: str, size: str, quality: str, base_url: str, transport: str = "auto") -> bytes:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is not set. Set it before running without --dry-run.")

    payload: dict[str, object] = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": size,
    }
    if quality:
        payload["quality"] = quality

    if transport == "curl" or (transport == "auto" and "apikey.click" in base_url):
        return request_image_with_curl(payload, api_key, base_url)

    api_url = base_url.rstrip("/") + "/images/generations"
    request = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI image request failed: {error.code} {detail}") from error

    item = data.get("data", [{}])[0]
    if item.get("b64_json"):
        return base64.b64decode(item["b64_json"])
    if item.get("url"):
        with urllib.request.urlopen(item["url"], timeout=180) as image_response:
            return image_response.read()
    raise RuntimeError("OpenAI image response did not include b64_json or url.")


def request_image_with_curl(payload: dict[str, object], api_key: str, base_url: str) -> bytes:
    api_url = base_url.rstrip("/") + "/images/generations"
    with TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        body_path = temp / "body.json"
        response_path = temp / "response.json"
        body_path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        command = [
            "curl.exe",
            "-sS",
            "-o",
            str(response_path),
            "-w",
            "%{http_code}",
            "-X",
            "POST",
            api_url,
            "-H",
            f"Authorization: Bearer {api_key}",
            "-H",
            "Content-Type: application/json",
            "--data-binary",
            f"@{body_path}",
        ]
        result = subprocess.run(command, capture_output=True, text=True, timeout=240)
        status = result.stdout.strip()
        if result.returncode != 0:
            raise RuntimeError(f"curl failed: {result.stderr.strip()}")
        response_text = response_path.read_text(encoding="utf-8", errors="replace") if response_path.exists() else ""
        if status != "200":
            raise RuntimeError(f"OpenAI image request failed: {status} {response_text[:500]}")
        data = json.loads(response_text)
        item = data.get("data", [{}])[0]
        if item.get("b64_json"):
            return base64.b64decode(item["b64_json"])
        if item.get("url"):
            with urllib.request.urlopen(item["url"], timeout=180) as image_response:
                return image_response.read()
        raise RuntimeError("OpenAI image response did not include b64_json or url.")


def patch_viewer_for_images2(lesson_dir: Path) -> None:
    # Kept for backward compatibility, but intentionally does nothing.
    # Vietnamese text must remain rendered by SVG/HTML, not by AI-generated bitmap text.
    return None


def generate_lesson(lesson_dir: Path, args: argparse.Namespace) -> int:
    prompts = load_prompts(lesson_dir)
    all_slides = prompts.get("slides", [])
    slides = all_slides
    if args.limit:
        slides = slides[: args.limit]

    output_dir = lesson_dir / "images2"
    output_dir.mkdir(exist_ok=True)
    generated = 0

    print(f"\nLesson: {lesson_dir.name}")
    print(f"Slides: {len(slides)}")

    for slide in slides:
        slide_number = int(slide["slide_number"])
        output_path = output_dir / f"slide-{slide_number:02d}.png"
        if output_path.exists() and not args.overwrite:
            print(f"  skip slide {slide_number:02d}: exists")
            continue

        prompt = build_images2_prompt(slide["prompt"])
        print(f"  generate slide {slide_number:02d} -> {output_path.relative_to(ROOT)}")
        if args.dry_run:
            continue

        try:
            image_bytes = request_image(prompt, args.model, args.size, args.quality, args.base_url, args.transport)
            output_path.write_bytes(image_bytes)
            generated += 1
        except Exception as error:
            error_log = output_dir / "errors.log"
            with error_log.open("a", encoding="utf-8") as file:
                file.write(f"slide-{slide_number:02d}: {error}\n")
            print(f"  error slide {slide_number:02d}: {error}")
        finally:
            if args.sleep:
                time.sleep(args.sleep)

    if args.update_viewer and not args.dry_run:
        generated_images = list(output_dir.glob("slide-*.png"))
        if len(generated_images) >= len(all_slides):
            patch_viewer_for_images2(lesson_dir)
            print("  viewer updated to use images2 PNG")
        else:
            print(f"  viewer not updated: {len(generated_images)}/{len(all_slides)} PNG files available")

    return generated


def main() -> None:
    args = parse_args()
    lessons = resolve_lessons(args.lesson)
    if not lessons:
        raise SystemExit("No lesson prompts found.")

    total = 0
    for lesson_dir in lessons:
        total += generate_lesson(lesson_dir, args)

    if args.dry_run:
        print("\nDry run complete. No API calls were made.")
    else:
        print(f"\nGenerated {total} Images 2 slide(s).")


if __name__ == "__main__":
    main()
