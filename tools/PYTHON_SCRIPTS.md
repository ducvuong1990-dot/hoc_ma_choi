# Python Script Management

This project keeps Python utilities in three groups:

- `tools/*.py`: supported generators and maintenance scripts for lesson assets.
- Root-level service/build scripts: kept at the repo root when the app or docs call them directly.
- `tools/legacy/*.py`: old one-off migration scripts. Do not run these in normal workflows.

## Current Catalog Flow

The app now loads lesson cards from `lessons/catalog.json` at runtime. To refresh the catalog, update lesson folders and run:

```powershell
python sync_catalog.py
```

Do not use `tools/legacy/update_app_catalog.py` or `tools/legacy/update_app_catalog_v2.py` for new work. Those scripts patched a hardcoded `libraryCatalog` block in `app.js`, which is no longer the source of truth.

`sync_catalog.py` scans `lessons/*/index.html`, then reads `manifest.json` and `prompts.json` when available. It writes normalized catalog fields:

- `id`, `title`, `grade`, `subject`
- `slide_count`, `desc`
- `path`, `thumbnail`
- `hasAudio`, `hasQuiz`
- `priority` for the current priority grades: 1 and 5
- optional `keywords`

Catalog sort order also prioritizes grade 1 first, grade 5 second, then remaining/unknown lessons.

## Root-Level Scripts

- `auto_generate_lesson.js`: main JS lesson generation pipeline.
- `sync_catalog.py`: rebuilds `lessons/catalog.json`.
- `generate_audio.py`: generates slide audio and karaoke timestamps for a specific script.
- `build_mega_lesson.py`: older batch builder for JSON files in `pending_scripts/`.
- `tts_server.py`: local Flask service for transcription/TTS endpoints used by the app.
- `scan_syntax.py`: lightweight local sanity scanner for `app.js`.

## Supported Tools Folder

Use scripts in `tools/` for repeatable lesson asset generation:

- `generate_grade1_materials.py`
- `generate_grade5_quizzes.py`
- `generate_grade5_review_sets.py`
- `generate_images2_assets.py`
- `generate_images2_slides.py`
- `generate_lesson_audio.py`
- `generate_more_materials.py`
