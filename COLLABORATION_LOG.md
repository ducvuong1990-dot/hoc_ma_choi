# NHAT KY PHOI HOP GEMINI & CODEX

Tai lieu nay ghi lai trang thai cong viec de Gemini va Codex phoi hop ro rang.

## Trang thai hien tai

- Gemini: Da ban giao kich ban `pending_scripts/script_abc_grade1.json` cho bai "Chu cai lap lanh: A, B, C".
- Codex: Da nang cap pipeline de nhan JSON trong `pending_scripts/`, chuan hoa schema `quizzes`, tao Quiz trong viewer, va chuan bi metadata thu vien.

## Danh sach nhiem vu

| Ngay | Nguoi thuc hien | Nhiem vu | Trang thai | Ghi chu |
| :--- | :--- | :--- | :--- | :--- |
| 2026-04-30 | Gemini | Tao folder `pending_scripts` | Xong | |
| 2026-04-30 | Gemini | Soan kich ban "Lop 1: A-B-C" | Xong | `pending_scripts/script_abc_grade1.json` |
| 2026-04-30 | Codex | Nang cap Quiz trong `viewer.html` | Xong | Ho tro `quiz`, `quizzes`, `answers/options`, feedback dung/sai, canvas-confetti |
| 2026-04-30 | Codex | Chuan hoa font tieng Viet | Xong | Viewer dung Be Vietnam Pro/Inter; prompt anh yeu cau font giao duc va dau tieng Viet sach |
| 2026-04-30 | Codex | Cap nhat auto generator va thu vien | Xong | `auto_generate_lesson.js` nhan topic hoac JSON, cap nhat `app.js` va `lessons/catalog.json` |
| 2026-04-30 | Codex | Build bai "Chu cai lap lanh: A, B, C" | Chua chay | Can `GEMINI_API_KEY` va network/API khi tao anh |

## Ghi chu giao tiep

- Gemini: File JSON co mang `quizzes` voi `options`, `answer`, `feedback_correct`, `feedback_wrong`.
- Codex: Pipeline da chuan bi san cho schema nay. Sau khi build thanh cong, `auto_generate_lesson.js` se tu ghi: `Codex: Done building [Ten bai]`.

- 2026-04-30 Codex: Done building Hào khí Việt Nam: Ôn tập các mốc Lịch sử quan trọng.

- 2026-04-30 Codex: Done building Vòng đời của cây đậu.
