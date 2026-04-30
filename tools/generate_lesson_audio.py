from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
LESSONS_DIR = ROOT / "lessons"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate Vietnamese MP3 narration for lesson slides.")
    parser.add_argument("--lessons-dir", default=str(LESSONS_DIR), help="Lessons root directory.")
    parser.add_argument("--lesson", action="append", help="Lesson folder id, for example grade1_tieng_viet_a_a_aa. Can be repeated.")
    parser.add_argument(
        "--voice",
        default="vi-VN-NamMinhNeural",
        help="Vietnamese Edge TTS voice. Default uses NamMinh for a northern/standard Vietnamese voice.",
    )
    parser.add_argument("--rate", default="-4%", help="Speech rate, for example -4% or +0%.")
    parser.add_argument("--pitch", default="+0Hz", help="Speech pitch, for example +0Hz.")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate existing audio files.")
    parser.add_argument("--limit", type=int, default=0, help="Maximum number of slides to generate, 0 means all.")
    parser.add_argument("--sleep", type=float, default=0.2, help="Delay between requests in seconds.")
    parser.add_argument("--retries", type=int, default=3, help="Retry count for transient TTS failures.")
    return parser.parse_args()


def iter_manifests(lessons_dir: Path, lesson_ids: list[str] | None) -> list[Path]:
    if lesson_ids:
        return [lessons_dir / lesson_id / "manifest.json" for lesson_id in lesson_ids]
    return sorted(lessons_dir.glob("grade1_*/manifest.json"))


async def generate_one(text: str, output_path: Path, voice: str, rate: str, pitch: str) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = output_path.with_suffix(output_path.suffix + ".tmp")
    if temp_path.exists():
        temp_path.unlink()
    communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
    await communicate.save(str(temp_path))
    if not temp_path.exists() or temp_path.stat().st_size <= 1000:
        if temp_path.exists():
            temp_path.unlink()
        raise RuntimeError("TTS output was empty or too small.")
    temp_path.replace(output_path)


async def main() -> None:
    args = parse_args()
    lessons_dir = Path(args.lessons_dir)
    manifests = iter_manifests(lessons_dir, args.lesson)
    made = 0
    skipped = 0
    failed = 0

    for manifest_path in manifests:
        if not manifest_path.exists():
            print(f"Missing manifest: {manifest_path}")
            continue

        data = json.loads(manifest_path.read_text(encoding="utf-8"))
        lesson_dir = manifest_path.parent
        for slide in data.get("slides", []):
            slide_no = int(slide["slide_number"])
            output_path = lesson_dir / "audio" / f"slide-{slide_no:02d}.mp3"
            if output_path.exists() and output_path.stat().st_size > 1000 and not args.overwrite:
                skipped += 1
                continue

            text = slide.get("audio_script") or slide.get("title") or data.get("title") or ""
            if not text.strip():
                skipped += 1
                continue

            print(f"Generating {output_path.relative_to(ROOT)}")
            for attempt in range(1, args.retries + 1):
                try:
                    await generate_one(text, output_path, args.voice, args.rate, args.pitch)
                    break
                except Exception as exc:
                    if attempt >= args.retries:
                        failed += 1
                        print(f"Failed {output_path.relative_to(ROOT)}: {exc}")
                        break
                    await asyncio.sleep(max(args.sleep, 1.0) * attempt)
            if not output_path.exists() or output_path.stat().st_size <= 1000:
                continue
            made += 1
            if args.limit and made >= args.limit:
                print(f"Generated {made} audio files, skipped {skipped}, failed {failed}.")
                return
            if args.sleep:
                await asyncio.sleep(args.sleep)

    print(f"Generated {made} audio files, skipped {skipped}, failed {failed}.")


if __name__ == "__main__":
    asyncio.run(main())
