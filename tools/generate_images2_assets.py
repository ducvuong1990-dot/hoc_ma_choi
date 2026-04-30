from __future__ import annotations

import argparse
import base64
import json
import os
import subprocess
import urllib.error
import urllib.request
from pathlib import Path
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"
DEFAULT_BASE_URL = "https://api.openai.com/v1"


ASSETS = [
    # --- CORE CHARACTERS (LEVEL 1-3) ---
    {
        "name": "capy-lv1",
        "prompt": "A tiny baby capybara 3D toy, extremely cute, sitting simply, soft rounded forms, pastel background, high quality 3D. No text.",
    },
    {
        "name": "capy-lv2",
        "prompt": "A young capybara student 3D toy, wearing a small teal backpack, smiling, high quality 3D, cinematic lighting, soft rounded forms. No text.",
    },
    {
        "name": "capy-lv3",
        "prompt": "An epic capybara master 3D toy, wearing a glowing badge and a majestic explorer cape, cinematic pose, warm lighting, premium 3D. No text.",
    },
    {
        "name": "miko-lv1",
        "prompt": "A tiny simple ball-shaped robot 3D toy, cute blue eyes, minimal detail, high quality 3D, pastel background. No text.",
    },
    {
        "name": "miko-lv2",
        "prompt": "A sleek student robot 3D toy, with floating digital screen showing a heart, friendly, high quality 3D, cinematic lighting. No text.",
    },
    {
        "name": "miko-lv3",
        "prompt": "A powerful high-tech hero robot 3D toy, with wings and glowing energy core, cinematic lighting, premium 3D. No text.",
    },
    {
        "name": "nam-lv1",
        "prompt": "A tiny baby version of a 6-year-old Vietnamese boy 3D toy, big head, tiny body, cute pajamas, high quality 3D, pastel background. No text.",
    },
    {
        "name": "nam-lv2",
        "prompt": "A young schoolboy named Nam 3D toy, wearing a striped t-shirt and school backpack, smiling, high quality 3D, cinematic lighting. No text.",
    },
    {
        "name": "nam-lv3",
        "prompt": "An explorer hero version of Nam 3D toy, wearing an aviator hat and goggles, heroic pose, cinematic lighting, premium 3D. No text.",
    },
    {
        "name": "lan-lv1",
        "prompt": "A tiny baby version of a 6-year-old Vietnamese girl 3D toy, big head, tiny body, cute floral onesie, high quality 3D, pastel background. No text.",
    },
    {
        "name": "lan-lv2",
        "prompt": "A young schoolgirl named Lan 3D toy, with pigtails and a pretty dress, carrying a book, high quality 3D, cinematic lighting. No text.",
    },
    {
        "name": "lan-lv3",
        "prompt": "A magical hero version of Lan 3D toy, with a flower wand and sparkling dress, cinematic lighting, premium 3D. No text.",
    },

    # --- GUEST CHARACTERS (SANRIO) ---
    {
        "name": "hello-kitty-lv1",
        "prompt": "A tiny baby 3D toy render of Hello Kitty, sitting simply, soft rounded forms, pastel background. No text.",
    },
    {
        "name": "hello-kitty-lv2",
        "prompt": "A cute 3D toy render of Hello Kitty, friendly pose, high quality 3D, cinematic lighting. No text.",
    },
    {
        "name": "my-melody-lv1",
        "prompt": "A tiny baby 3D toy render of My Melody with her pink hood, soft rounded forms, pastel background. No text.",
    },
    {
        "name": "my-melody-lv2",
        "prompt": "A cute 3D toy render of My Melody, friendly pose, high quality 3D, cinematic lighting. No text.",
    },

    # --- GUEST CHARACTERS (SUPERHEROES) ---
    {
        "name": "spiderman-lv1",
        "prompt": "A tiny baby chibi 3D toy of a hero in a red and blue spider suit, soft rounded forms, pastel background. No text.",
    },
    {
        "name": "spiderman-lv2",
        "prompt": "A cute chibi 3D toy of a hero in a red and blue spider suit, friendly pose, high quality 3D, cinematic lighting. No text.",
    },

    # --- ENVIRONMENT ---
    {
        "name": "background-forest",
        "prompt": "Create a magical Vietnamese-inspired learning forest background for a grade 1 phonics lesson. Scene: glowing leaves, soft hills, bamboo-like plants, friendly classroom objects made of wood, small sparkling sound orbs, subtle Kinh Bac folk color inspiration. Style: high quality 3D illustration, wide 16:9 scenery. No text.",
    },
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate reusable lesson art assets with OpenAI Images 2 / gpt-image-2.")
    parser.add_argument("--lesson", default="grade1_tieng_viet_a_a_aa", help="Lesson id or path.")
    parser.add_argument("--model", default="gpt-image-2", help="OpenAI image model.")
    parser.add_argument("--base-url", default=os.environ.get("OPENAI_BASE_URL", DEFAULT_BASE_URL), help="API base URL.")
    parser.add_argument("--transport", choices=["auto", "python", "curl"], default="auto", help="HTTP transport.")
    parser.add_argument("--size", default="auto", help="Image size. Use 'auto' unless the model requires a specific size.")
    parser.add_argument("--quality", default="", help="Optional quality value, for example low, medium, high.")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate existing assets.")
    parser.add_argument("--dry-run", action="store_true", help="Print planned assets without calling the API.")
    return parser.parse_args()


def resolve_lesson(value: str) -> Path:
    path = Path(value)
    if not path.is_absolute():
        path = LESSONS_DIR / value
    if not path.exists():
        raise SystemExit(f"Lesson not found: {path}")
    return path


def request_image(prompt: str, model: str, size: str, quality: str, base_url: str, transport: str) -> bytes:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise SystemExit("OPENAI_API_KEY is not set. Set it before running without --dry-run.")

    payload: dict[str, object] = {"model": model, "prompt": prompt, "n": 1, "size": size}
    if quality:
        payload["quality"] = quality

    if transport == "curl" or (transport == "auto" and "apikey.click" in base_url):
        return request_image_with_curl(payload, api_key, base_url)

    request = urllib.request.Request(
        base_url.rstrip("/") + "/images/generations",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI image request failed: {error.code} {detail}") from error
    return decode_image_response(data)


def request_image_with_curl(payload: dict[str, object], api_key: str, base_url: str) -> bytes:
    with TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        body_path = temp / "body.json"
        response_path = temp / "response.json"
        body_path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        result = subprocess.run(
            [
                "curl.exe",
                "-sS",
                "-o",
                str(response_path),
                "-w",
                "%{http_code}",
                "-X",
                "POST",
                base_url.rstrip("/") + "/images/generations",
                "-H",
                f"Authorization: Bearer {api_key}",
                "-H",
                "Content-Type: application/json",
                "--data-binary",
                f"@{body_path}",
            ],
            capture_output=True,
            text=True,
            timeout=240,
        )
        status = result.stdout.strip()
        if result.returncode != 0:
            raise RuntimeError(f"curl failed: {result.stderr.strip()}")
        response_text = response_path.read_text(encoding="utf-8", errors="replace")
        if status != "200":
            raise RuntimeError(f"OpenAI image request failed: {status} {response_text[:500]}")
        return decode_image_response(json.loads(response_text))


def decode_image_response(data: dict) -> bytes:
    item = data.get("data", [{}])[0]
    if item.get("b64_json"):
        return base64.b64decode(item["b64_json"])
    if item.get("url"):
        with urllib.request.urlopen(item["url"], timeout=180) as image_response:
            return image_response.read()
    raise RuntimeError("OpenAI image response did not include b64_json or url.")


def main() -> None:
    args = parse_args()
    lesson_dir = resolve_lesson(args.lesson)
    output_dir = lesson_dir / "images2" / "assets"
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Lesson: {lesson_dir.name}")
    print(f"Output: {output_dir.relative_to(ROOT)}")
    for asset in ASSETS:
        output_path = output_dir / f"{asset['name']}.png"
        if output_path.exists() and not args.overwrite:
            print(f"  skip {output_path.name}: exists")
            continue
        print(f"  generate {output_path.name}")
        if args.dry_run:
            print(f"    prompt: {asset['prompt'][:160]}...")
            continue
        image = request_image(asset["prompt"], args.model, args.size, args.quality, args.base_url, args.transport)
        output_path.write_bytes(image)

    print("Done.")


if __name__ == "__main__":
    main()