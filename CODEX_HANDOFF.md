# 📋 CODEX HANDOFF — Hoc_chu Educational App
> Cập nhật: 2026-04-30 | Session: `90067be1-04c0-46e5-822f-c724b4cefb24`

---

## 🎯 Mục tiêu dự án

Ứng dụng học tập tương tác cho trẻ tiểu học (Lớp 1–5), chạy local (không cần backend), gồm:
- **App shell chính** (`index.html` + `app.js` + `styles.css`): Dashboard, thư viện bài học, trò chơi, avatar 3D, quiz
- **NanoBanana** (`NanoBanana/`): Pipeline tạo bài học dạng slideshow từ script → ảnh AI → HTML viewer
- **Lessons** (`lessons/`): Các bài học HTML tĩnh đã được generate sẵn

---

## 📁 Cấu trúc thư mục quan trọng

```
Hoc_chu/
├── index.html              # Shell chính của app
├── app.js                  # Toàn bộ logic (~2964 dòng)
├── styles.css              # CSS (~3834 dòng)
├── assets/
│   └── characters/         # File .glb 3D avatar
│       ├── capybara.glb
│       ├── cinnamoroll.glb
│       ├── spider-man_spider-man_no_way_home.glb
│       ├── hello_kitty.glb
│       ├── my_melody.glb
│       ├── pompompurin.glb
│       ├── iron_man.glb
│       ├── pochacco_sanrio_3d.glb
│       └── 14c1ac1045fd4fc7a91f53be03310cf7.glb  ← nhân vật bí ẩn
├── lessons/                # Bài học HTML tĩnh (generated)
│   ├── grade5_on_tap_toan_ti_so_phan_tram/
│   ├── grade5_trac_nghiem_lich_su/
│   └── ...
├── NanoBanana/
│   ├── generate_ppt.py     # Pipeline tạo bài học (Python)
│   └── templates/
│       └── viewer.html     # Template HTML viewer cho slideshow (~909 dòng)
├── DAN_Y_BAI_HOC.md        # Hướng dẫn cấu trúc bài học
└── README_LESSON.md
```

---

## ✅ Việc đã hoàn thành trong session này

### 1. `app.js` — Core application logic

#### 1.1 Avatar Characters — GLB 3D paths
Đã cập nhật `avatarCharacters` array với đầy đủ đường dẫn `.glb`:

```js
const avatarCharacters = [
  { id: "capy",           glb: "assets/characters/capybara.glb" },
  { id: "miko",           /* procedural only */ },
  { id: "nam",            /* procedural only */ },
  { id: "lan",            /* procedural only */ },
  { id: "cinnamoroll",    glb: "assets/characters/cinnamoroll.glb" },
  { id: "spiderman",      glb: "assets/characters/spider-man_spider-man_no_way_home.glb" },
  { id: "hello-kitty",    glb: "assets/characters/hello_kitty.glb" },
  { id: "my-melody",      glb: "assets/characters/my_melody.glb" },
  { id: "kuromi",         /* procedural only */ },
  { id: "pompompurin",    glb: "assets/characters/pompompurin.glb" },
  { id: "ironman",        glb: "assets/characters/iron_man.glb" },
  { id: "pochacco",       glb: "assets/characters/pochacco_sanrio_3d.glb" },
  { id: "captain-america",/* procedural only */ },
  { id: "mystery-char",   glb: "assets/characters/14c1ac1045fd4fc7a91f53be03310cf7.glb" }
];
```

Avatar có file `.glb` sẽ hiển thị nhãn **"3D"** trên thẻ chọn nhân vật.

#### 1.2 `buildAvatarModel()` — Load GLB vào Three.js
- Kiểm tra `character.glb && THREE.GLTFLoader`
- Load file → auto-scale → center → cast/receiveShadow
- Fallback sang `buildProceduralModel()` nếu lỗi hoặc không có glb
- Nếu GLB có animation, auto-play animation đầu tiên

#### 1.3 Library UI — Nút "Tạo bài học mới" (AI Đặc biệt)
Thêm card đặc biệt đầu tiên trong `renderLessons()`:

```html
<button class="library-card ai-card" data-action="generate-custom-quiz">
  <div class="ai-glow"></div>
  AI Đặc biệt | Tạo bài học mới
  <!-- Gemini sẽ soạn riêng một bài học cho bé ngay lập tức -->
</button>
```

Handler trong `bindRoute()`:
```js
document.querySelector("[data-action='generate-custom-quiz']")?.addEventListener("click", async () => {
  const topic = prompt("Bé muốn học về chủ đề gì?");
  if (!topic) return;
  state.activeLesson = `custom-${topic.toLowerCase().replace(/\s+/g, "-")}`;
  state.currentQuestionIndex = 0;
  setRoute("lesson");
});
```

#### 1.4 `renderLesson()` — Hỗ trợ custom AI lessons
- Detect `state.activeLesson.startsWith("custom-")` → tạo lesson object động
- Auto-register `state.lessons[lesson.id]` nếu chưa có
- Trigger `fetchGeminiQuiz()` khi nội dung là placeholder

#### 1.5 `getOrCreateGeneratedContent()` — Unified (xóa duplicate)
- Đã xóa bản duplicate ở dòng ~2351
- Bản duy nhất ở dòng ~1998:
  - Lớp 1–2: dùng hardcoded bank (`generateGeminiContent`)
  - Lớp 3–5 hoặc custom topic: trả về placeholder → trigger async fetch

#### 1.6 `fetchGeminiQuiz()` — Gọi Gemini API
```js
async function fetchGeminiQuiz(topicId, grade, difficulty) {
  // POST đến gemini-2.5-flash
  // Prompt: 5 câu hỏi trắc nghiệm tiếng Việt, đúng chuẩn lớp
  // Return: { id, difficulty, questions: [{question, answers, correct, prompt, explanation, imagePrompt}] }
}
```

#### 1.7 Skip button cho bài đã hoàn thành
Trong `renderLesson()`: nếu `isCompleted`, hiển thị nút:
```html
<button class="mini-pill success-btn" data-action="skip-lesson">
  <span>double_arrow</span> Bỏ qua
</button>
```
Handler: `setRoute("lessons")` + showToast.

#### 1.8 Grade-aware Game Challenges (`pickGameChallenge`)
- `getGradeGameBanks(grade)`: trả về bank câu hỏi phù hợp lớp 1–5
- Lớp 5: Toán tỉ số, phân số, số thập phân, Lịch sử, Khoa học

---

### 2. `styles.css` — CSS additions

```css
/* Badge 3D trên char-card */
.badge-3d { position: absolute; top: 4px; right: 4px; background: var(--accent); ... }

/* AI card trong library */
.ai-card { background: linear-gradient(135deg, #2d3436, #000000) !important; ... }
.ai-glow { animation: rotate 10s linear infinite; ... }

/* Skip button */
.success-btn { background: #27ae60; color: white; ... }
.success-btn:hover { background: #2ecc71; transform: scale(1.05); }
```

---

### 3. `NanoBanana/generate_ppt.py` — Pipeline nâng cấp

#### 3.1 `generate_prompt()` — Thêm `visual_prompt`
```python
def generate_prompt(style_template, page_type, content_text, slide_number, total_slides, visual_prompt=""):
    # Thêm instruction Vietnamese font
    # Thêm visual_prompt từ script nếu có
```

#### 3.2 `build_html()` — Inject quiz + meta vào template
```python
prompts_data = {
    "title": ..., "grade": ..., "subject": ..., "description": ...,
    "quiz": slides_plan.get("quiz") or slides_plan.get("quizzes") or [],
    ...
}
# Replace placeholders:
# /* QUIZ_DATA_PLACEHOLDER */ → JSON.stringify(quizData)
# /* LESSON_META_PLACEHOLDER */ → JSON.stringify({title, grade, subject, description})
```

#### 3.3 Flexible slide field parsing
```python
slide_number = slide_info.get("slide_number") or slide_info.get("slide") or slide_info.get("id")
content_text = slide_info.get("content") or slide_info.get("text") or ""
script = slide_info.get("script") or slide_info.get("narration") or slide_info.get("text", "")
```

---

### 4. `NanoBanana/templates/viewer.html` — Bộ viewer mới hoàn chỉnh

#### 4.1 Layout
- `app-container`: grid 2 rows (slide area + script area)
- `slide-area`: hiển thị ảnh slide với animation fadeIn
- `script-area`: script text với word-highlight khi audio chạy

#### 4.2 Controls (top-center, glassmorphism)
```
← | Nghe | → | Quiz
```
- `→` ở slide cuối + có quiz → trigger `showQuiz()`
- `→` disable nếu slide cuối VÀ không có quiz

#### 4.3 3D Coach Widget (bottom-right)
- CSS-only 3D Capybara character
- Mood states: `idle`, `happy`, `thinking`
- Bubble text thay đổi theo trạng thái quiz

#### 4.4 Quiz System
```js
// Data flow:
const quizData = JSON.parse("/* QUIZ_DATA_PLACEHOLDER */");
const lessonMeta = JSON.parse("/* LESSON_META_PLACEHOLDER */");

// normalizeQuizItem(): đồng nhất các format quiz khác nhau
// showQuiz(): hiển thị câu hỏi, update counter/score
// answerQuiz(): check đáp án, feedback đúng/sai riêng
// maybeGenerateMoreQuiz(): prefetch khi còn ≤2 câu
// requestMoreQuizQuestions(): gọi Gemini tạo thêm batch 10 câu
```

#### 4.5 Auto-generate Quiz với Gemini
```js
const AUTO_QUIZ_BATCH_SIZE = 10;
const AUTO_QUIZ_PREFETCH_REMAINING = 2;

async function requestMoreQuizQuestions() {
  // Đọc geminiKey từ URL params hoặc localStorage (hoc_ma_choi_state_v2)
  // Build prompt từ slide scripts + existing questions
  // Call gemini-2.5-flash với response_mime_type: "application/json"
  // Deduplicate + append vào quizData[]
}
```

---

## 🔧 State Management

```js
// localStorage key: "hoc_ma_choi_state_v2"
state = {
  name: "Bạn nhỏ",
  grade: 1,           // 1-5
  isLoggedIn: false,
  avatarId: "capy",
  activeLesson: null, // lessonId hoặc "custom-{slug}"
  currentQuestionIndex: 0,
  contentDifficulty: 1,
  completedLessons: {},  // {lessonId: true}
  lessonAttempts: {},    // {lessonId: count}
  contentLibrary: {},    // cache câu hỏi đã gen
  geminiApiKey: "",
  coins: 0,
  lessons: {},           // {lessonId: {completed, progress, stars}}
  achievementHistory: [], // [{date, title, grade, xp, coins}]
  ...
}
```

---

## ⚠️ Vấn đề cần theo dõi

1. **Duplicate CSS**: `styles.css` có thể còn một số block bị duplicate từ các lần edit. Nên run `grep -n "char-card" styles.css` để kiểm tra.

2. **`app.js` size**: File đã ~164KB, ~2964 dòng. Cần chú ý khi edit để tránh syntax error.

3. **GLB Loading**: `buildAvatarModel()` check `THREE.GLTFLoader` — cần đảm bảo `GLTFLoader` được import đúng trong `index.html`.

4. **API Key flow**: 
   - App chính: lưu trong `state.geminiApiKey` → localStorage
   - Viewer lesson: đọc từ `?geminiKey=` URL param HOẶC từ localStorage `hoc_ma_choi_state_v2`

5. **Custom lessons**: `state.lessons["custom-{slug}"]` được init động trong `renderLesson()` — cần đảm bảo không bị overwrite khi `saveState()`.

---

## 🚀 Việc cần làm tiếp (TODO)

- [x] **Error UI**: Đã thêm Toast notifications khi có lỗi gọi API Gemini trong `fetchGeminiQuiz`.
- [x] **Grade 3-5 hardcoded bank**: Đã bổ sung bank offline theo lớp 3, 4, 5 cho các topic chuẩn `letters`, `vocabulary`, `numbers`, `colors` trong `generateGeminiContent`.
- [x] **Progress tracking cho custom lessons**: Đã thêm helper `buildCustomLesson`, `ensureLessonProgress`, `getActiveLesson`, `getPlayableLessons`; `getNextLesson()` và `checkLessonAnswer()` đã hỗ trợ custom lessons.
- [x] **Lesson catalog đồng bộ**: `renderLessons()` đã dùng catalog động từ `lessons/catalog.json` qua `loadLibraryCatalog()`.
- [x] **Test GLB loading**: Đã thêm loading spinner/fallback CSS và verify bằng `tools/check_browser_glb.js`.
- [x] **NanoBanana audio**: Viewer đã có fallback Web Speech API khi thiếu `audio/slide-XX.mp3`; script vẫn hiển thị và highlight bằng timestamp ước lượng.
- [x] **Dọn dẹp CSS**: Đã sửa block thư viện bị trùng/lệch cấu trúc; exact duplicate CSS scan = 0.

---

## 📝 Key Functions Reference

| Function | File | Dòng | Mô tả |
|---|---|---|---|
| `renderLessons()` | app.js | ~624 | Render library với AI card |
| `renderLesson()` | app.js | ~688 | Render quiz lesson, handle custom |
| `fetchGeminiQuiz()` | app.js | ~1961 | Gọi Gemini tạo quiz |
| `getOrCreateGeneratedContent()` | app.js | ~1998 | Cache/fetch content |
| `buildAvatarModel()` | app.js | ~1292 | Load GLB hoặc procedural |
| `bindRoute()` | app.js | ~1512 | Event handlers cho routes |
| `pickGameChallenge()` | app.js | ~1738 | Grade-aware game questions |
| `getGradeGameBanks()` | app.js | ~1780 | Bank câu hỏi game theo lớp |

---

## 🔑 API & Dependencies

- **Gemini API**: `gemini-2.5-flash` tại `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Three.js + GLTFLoader**: Import qua CDN trong `index.html`
- **canvas-confetti**: `node_modules/canvas-confetti/dist/confetti.browser.js`
- **Google Fonts**: Be Vietnam Pro, Inter

---

*Handoff document tạo tự động. Kiểm tra lại code trực tiếp trước khi apply changes.*

> Current truth note: Các mục cập nhật theo ngày 2026-04-30 ở bên dưới ghi trạng thái mới nhất. Một số ví dụ cũ phía trên còn nhắc `custom-${slug}` hoặc bank lớp 1-2; runtime hiện đã dùng `custom-g{grade}-{topic-slug}` và bank offline đã mở rộng cho lớp 3-5.
---

## 2026-04-30 Codex infra update

- `app.js`: `libraryCatalog` is no longer the primary source of truth. The app now calls `loadLibraryCatalog()` after initial render and loads lesson cards from `lessons/catalog.json` with `cache: "no-store"`.
- `app.js`: added catalog normalization helpers for `grade`, `category/subject`, `desc`, `path`, and `thumbnail`. Paths that do not start with `lessons/` or `assets/` are normalized under `lessons/`.
- `app.js`: retained a small `fallbackLibraryCatalog` for offline/file-protocol fallback. This fallback is infrastructure only and does not change Quiz Bank or pedagogical content.
- `styles.css`: cleaned the duplicated/malformed library CSS block around `.library-card p` / `.library-header`, then added `.catalog-status` and `.library-empty` for dynamic catalog loading/fallback states.
- Python scripts: moved old hardcoded app patchers to `tools/legacy/update_app_catalog.py` and `tools/legacy/update_app_catalog_v2.py`. Do not use them for new catalog work.
- Python scripts: added `tools/PYTHON_SCRIPTS.md` to document supported scripts vs legacy one-off scripts.
- `package.json`: added `npm run catalog:sync` as a wrapper for `python sync_catalog.py`.

Notes for GEMINI:
- Keep writing lesson metadata to `lessons/catalog.json`; the app shell will pick it up at runtime.
- Do not patch `app.js` to add generated lessons manually unless the runtime catalog loader is intentionally removed.
- Quiz Bank and educational content were not edited in this pass.

---

## 2026-04-30 Codex infra update 2

- `app.js`: added GLB loading lifecycle for avatar stages. `createAvatarStage()` now keeps the existing fallback visual while a remote `.glb` is loading and marks stages with `is-loading`, `is-loaded`, or `load-failed`.
- `app.js`: `buildAvatarModel()` now calls the load callback for models with or without animation, and also calls fallback status when GLB loading fails or procedural avatar is used.
- `styles.css`: added `.avatar-load-status` and `.avatar-spinner`, with compact sizing for `char-avatar-stage` and `topbar-preview-stage`.
- Verification: `npm run check`, CSS brace balance check, `lessons/catalog.json` JSON parse, and `$env:FAST='1'; node tools\check_browser_glb.js` all passed.

TODO status update:
- `Lesson catalog đồng bộ`: done by runtime `lessons/catalog.json` loader.
- `Test GLB loading`: done for capybara GLB via browser check; no failed requests, console errors, or exceptions.
- `Dọn dẹp CSS`: malformed/duplicated library block fixed; exact duplicate CSS block scan currently reports 0 exact duplicate blocks.

---

## 2026-04-30 Codex content/runtime update

- Scope permission changed: user allowed Codex to edit Quiz Bank and GEMINI-owned content/runtime areas.
- `app.js`: custom lessons now have shared runtime helpers:
  - `buildCustomLesson(lessonId)`
  - `ensureLessonProgress(lessonId)`
  - `getActiveLesson()`
  - `getPlayableLessons()`
- `app.js`: `startLessonAttempt()`, `renderLesson()`, `checkLessonAnswer()`, and `getNextLesson()` now use the shared custom lesson flow. This fixes the bug where completing a custom lesson could fall back to the first standard lesson.
- `app.js`: `getOrCreateGeneratedContent()` now tries the local quiz bank for all standard topics before asking Gemini, not only for grades 1-2.
- `app.js`: `generateGeminiContent()` now includes `advancedBank` for grades 3, 4, and 5 across `letters`, `vocabulary`, `numbers`, and `colors`.
- Verification: `npm run check`, CSS brace balance check, and `lessons/catalog.json` JSON parse passed.

---

## 2026-04-30 Codex catalog/script update

- `sync_catalog.py`: replaced the old folder-name-only scanner with a metadata-aware catalog builder.
- `sync_catalog.py`: now reads `manifest.json` and `prompts.json` when present, infers missing grade/subject/title from folder names, detects `slide_count`, `hasAudio`, `hasQuiz`, and picks a real thumbnail from `images2/slide-01.png`, `images/slide-01.png`, or `images/slide-01.svg`.
- `lessons/catalog.json`: rebuilt via `npm run catalog:sync`; current catalog contains 180 lessons.
- `tools/PYTHON_SCRIPTS.md`: updated to document the normalized catalog fields and the current rebuild flow.
- Verification: `python -m py_compile sync_catalog.py`, `npm run catalog:sync`, `npm run check`, and CSS brace balance check passed.

---

## 2026-04-30 Priority update: grade 1 and grade 5

- User requested priority for grades 1 and 5.
- `app.js`: added `PRIORITY_LESSON_GRADES = [1, 5]`.
- `app.js`: dynamic library sorting now prioritizes the active grade first. If the active grade is not 1 or 5 and has fewer than 6 exact-grade lessons, the app also includes priority-grade lessons from grades 1 and 5 instead of showing mostly unknown-grade content.
- `app.js`: lesson cards from priority grades show an `Ưu tiên` badge via `.priority-cat`.
- `sync_catalog.py`: added `PRIORITY_GRADES = [1, 5]`, writes `priority: true` for grade 1 and grade 5 lessons, and sorts catalog as grade 1 first, grade 5 second, then remaining/unknown lessons.
- `lessons/catalog.json`: rebuilt with 180 lessons; current counts are grade 1 = 86, grade 5 = 73, unknown = 21, priority = 159.
- `tools/PYTHON_SCRIPTS.md`: documented `priority` field and grade 1/5 sort order.
- Verification: `python -m py_compile sync_catalog.py`, `npm run catalog:sync`, `npm run check`, CSS brace balance check, and catalog priority check passed.

---

## 2026-04-30 Custom lesson generation update

- User clarified that missing lessons may be handled by the UI "Tạo bài học mới" flow, and that generated content must be grade-correct and non-duplicated.
- `app.js`: restored/bound the `[data-action='generate-custom-quiz']` click handler via `createCustomLessonFromPrompt()`.
- `app.js`: added topic normalization helpers:
  - `slugifyTopic(value)`
  - `getCustomLessonId(topic, grade)`
  - `getCustomLessonTopic(lessonId)`
  - `findExistingLibraryLesson(topic, grade)`
- Custom lesson IDs now include grade: `custom-g{grade}-{topic-slug}`. Same topic in different grades is allowed; same topic in the same grade reopens the existing custom lesson instead of creating a duplicate.
- Before creating a custom lesson, the app checks the loaded `libraryCatalog` for an existing same-grade lesson. If found, it opens the existing static lesson instead of generating duplicate content.
- `fetchGeminiQuiz()` now requires a saved Gemini API key for custom generation and validates Gemini output:
  - keeps only questions with 4 unique answers,
  - requires `correct` to match one answer exactly,
  - removes duplicate question text,
  - caps each generated batch at 5 valid questions.
- Verification: `npm run check`, CSS brace balance check, and catalog JSON parse passed.

---

## 2026-04-30 Fullstack completion update

- User changed scope from infrastructure specialist to fullstack and requested completion of unfinished work.
- `app.js`: Gemini custom quiz requests now send an additional `gradeGuardPrompt` part requiring content to match the active grade, avoid duplicates, avoid too-easy lower-grade content, and avoid above-grade content.
- `NanoBanana/templates/viewer.html`: added resilient narration fallback for missing audio files:
  - `getSlideScriptText(index)` reads `script`, `audio_script`, `narration`, `text`, or `content`.
  - `estimateWordTimestamps(text)` creates lightweight timing data when `audio/slide-XX.json` is missing.
  - `playFallbackNarration(index)` uses browser `speechSynthesis` with `vi-VN` and synthetic word highlighting when `audio/slide-XX.mp3` is missing or cannot play.
  - `playSlideNarration(index)` centralizes normal audio playback and fallback.
- `NanoBanana/templates/viewer.html`: Play button and spacebar now use the same audio/fallback path, so generated lessons do not require audio files to be present before the viewer can function.
- TODO update: NanoBanana audio item is now complete from the viewer/runtime side. Asset generation scripts may still create real MP3/JSON files for higher quality, but missing audio no longer blocks the lesson.
- Verification: `npm run check`, CSS brace balance check, catalog JSON parse, and viewer fallback hook check passed.

---

## 2026-04-30 PRD alignment update

- User requested: "Kiểm tra PRD và tiếp tục"; scope remains fullstack, with priority for grade 1 and grade 5.
- `app.js`: added paid Hint Cost flow for quiz lessons:
  - `lessonHints` state cache prevents double-charging for the same grade/difficulty/question.
  - Hint cost is 5 xu for lower grades and 10 xu for grade 5.
  - Hint guide tone uses Nhện Nhí for younger learners and Dơi Đêm for grade 5.
- `app.js`: reading assessment now follows PRD's `/10` direction:
  - stores `lastReadingScore10` and `lastReadingMetrics`.
  - score combines accuracy, speed, and estimated intonation.
  - Gemini feedback prompt now receives the `/10` metrics and asks for Northern Vietnamese guidance.
- `app.js`: added "Hộp quà tri thức" reward runtime:
  - new `knowledgeGiftCatalog` for grade 1/5 tips, Kinh Bắc facts, and history mnemonics.
  - `knowledgeGifts` state stores non-duplicate gifts.
  - lesson/game/reading completions can award knowledge gifts.
  - Parent dashboard shows recent knowledge gifts below stickers.
- `app.js`: reward exchange is now labeled "Bách hóa Kinh Bắc" and includes Kinh Bắc/superhero-themed purchasable items.
- `styles.css`: added compact styles for reading metric chips and knowledge gift cards.
- Verification: `npm run check`, CSS brace balance check, catalog JSON parse, and `$env:FAST='1'; node tools\check_browser_glb.js` passed. Browser check had no failed requests, console errors, or exceptions.

---

## 2026-04-30 PRD review/title polish update

- User requested title cleanup and a PRD review of completed vs unfinished work.
- `app.js`: dashboard hero title changed from a long single H1 to a deliberate two-line title:
  - greeting line: `Chào {name}!`
  - main line: `Hôm nay mình học gì?`
  This avoids awkward wrapping like "Học mà chơi hôm / nay".
- `styles.css`: added `.dashboard-title` and `.dashboard-subtitle`; removed negative letter spacing from `.hero h1`.
- Added `PRD_STATUS.md`:
  - lists PRD items already implemented,
  - lists missing/partial items,
  - proposes next implementation priorities.
