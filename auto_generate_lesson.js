const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const input = process.argv[2];
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!input) {
  console.error("Lỗi: vui lòng nhập chủ đề hoặc đường dẫn JSON trong pending_scripts/.");
  console.error('Ví dụ: node auto_generate_lesson.js "Vòng đời của cây đậu"');
  console.error("Ví dụ: node auto_generate_lesson.js pending_scripts/script_abc_grade1.json");
  process.exit(1);
}

function slugify(value) {
  return String(value || "lesson")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 52) || "lesson";
}

function normalizeQuizItem(item, index = 0) {
  const answers = item.answers || item.options || item.choices || [];
  const correctIndex = Number.isInteger(item.correctIndex) ? item.correctIndex : Number(item.correct_index);
  const correct = item.correct ?? item.answer ?? item.correct_answer ?? answers[correctIndex] ?? answers[0];

  // Validation: Ensure at least 2 answers
  if (!Array.isArray(answers) || answers.length < 2) {
    throw new Error(`Quiz ${index + 1}: cần ít nhất 2 đáp án, nhận được ${answers.length}`);
  }

  const normalizedAnswers = answers.map(String).filter(Boolean);
  const normalizedCorrect = String(correct || "");

  // Validation: Ensure correct answer exists in answers
  if (!normalizedCorrect || !normalizedAnswers.includes(normalizedCorrect)) {
    throw new Error(`Quiz ${index + 1}: đáp án đúng "${normalizedCorrect}" không có trong danh sách đáp án`);
  }

  return {
    question: item.question || item.q || `Câu hỏi ${index + 1}`,
    answers: normalizedAnswers,
    correct: normalizedCorrect,
    feedback_correct: item.feedback_correct || item.feedbackCorrect || item.explanation || "Giỏi quá, con trả lời đúng rồi!",
    feedback_wrong: item.feedback_wrong || item.feedbackWrong || `Gần đúng rồi. Đáp án đúng là: ${normalizedCorrect}`
  };
}

function normalizeSlide(slide, index) {
  const slideNumber = index + 1;
  return {
    slide_number: slideNumber,
    page_type: slide.page_type || slide.type || (slideNumber === 1 ? "cover" : "content"),
    content: slide.content || slide.title || slide.heading || slide.text || "",
    script: slide.script || slide.narration || slide.voiceover || slide.text || "",
    visual_prompt: slide.visual_prompt || slide.image_prompt || slide.prompt || ""
  };
}

function normalizePlan(rawPlan, sourceName) {
  const title = rawPlan.title || rawPlan.lesson_title || rawPlan.name || sourceName || "Bài học mới";
  const sourceSlides = Array.isArray(rawPlan.slides) ? rawPlan.slides : [];
  const slides = [];

  if (rawPlan.introduction && !sourceSlides.some((slide) => slide.page_type === "cover")) {
    slides.push({
      slide_number: 1,
      page_type: "cover",
      content: title,
      script: rawPlan.introduction,
      visual_prompt: `Vietnamese primary school lesson cover about "${title}", friendly vector illustration, clear educational style`
    });
  }

  sourceSlides.forEach((slide) => slides.push(normalizeSlide(slide, slides.length)));

  if (rawPlan.conclusion) {
    slides.push({
      slide_number: slides.length + 1,
      page_type: "data",
      content: "Cùng ôn lại bài học",
      script: rawPlan.conclusion,
      visual_prompt: `Cheerful lesson summary for "${title}", children education, vector bento grid`
    });
  }

  const rawQuiz = rawPlan.quiz || rawPlan.quizzes || rawPlan.questions || [];
  return {
    title,
    grade: Number(rawPlan.grade) || 1,
    subject: rawPlan.subject || rawPlan.category || "Khám phá",
    description: rawPlan.description || rawPlan.introduction || `${slides.length} slide · Audio · Karaoke · Quiz`,
    slides: slides.map((slide, index) => ({ ...slide, slide_number: index + 1 })),
    quiz: rawQuiz.map(normalizeQuizItem).filter((item) => item.question && item.answers.length >= 2 && item.correct)
  };
}

function createLocalPlan(topic) {
  const title = topic || "Bài học mới";
  return {
    title,
    grade: 1,
    subject: "Khám phá",
    description: `Bài học tự động về ${title}, có minh họa, audio, karaoke và quiz.`,
    slides: [
      {
        slide_number: 1,
        page_type: "cover",
        content: title,
        script: `Chào con! Hôm nay chúng mình cùng khám phá chủ đề ${title}. Hãy quan sát hình minh họa và lắng nghe thật kỹ nhé.`,
        visual_prompt: `Friendly Vietnamese primary school cover about ${title}, clear educational vector illustration, warm colors`
      },
      {
        slide_number: 2,
        page_type: "content",
        content: "Quan sát thật kỹ",
        script: "Trước tiên, con hãy nhìn các chi tiết chính trong bài. Khi biết quan sát, con sẽ hiểu bài nhanh hơn.",
        visual_prompt: `Bento grid education scene showing a child observing key details about ${title}, vector style`
      },
      {
        slide_number: 3,
        page_type: "content",
        content: "Ghi nhớ ý quan trọng",
        script: "Bây giờ chúng mình ghi nhớ những ý quan trọng nhất. Con có thể đọc chậm từng phần và nhắc lại bằng lời của mình.",
        visual_prompt: `Learning notes, stars, friendly teacher mascot, topic ${title}, Vietnamese education illustration`
      },
      {
        slide_number: 4,
        page_type: "data",
        content: "Cùng luyện tập",
        script: "Cuối cùng là phần luyện tập. Con hãy bình tĩnh chọn đáp án đúng. Nếu sai cũng không sao, mình sẽ học lại từ gợi ý nhé.",
        visual_prompt: `Cheerful quiz practice scene for children, topic ${title}, rounded cards, vector illustration`
      }
    ],
    quiz: [
      {
        question: "Bài học hôm nay nói về chủ đề nào?",
        answers: [title, "Nấu ăn", "Thể thao", "Âm nhạc"],
        correct: title,
        feedback_correct: "Đúng rồi! Con đã nhớ chủ đề bài học.",
        feedback_wrong: `Gợi ý: chủ đề của bài là ${title}.`
      },
      {
        question: "Khi học bài, con nên làm gì trước?",
        answers: ["Quan sát kỹ", "Bấm bừa", "Bỏ qua hình", "Tắt bài học"],
        correct: "Quan sát kỹ",
        feedback_correct: "Chính xác! Quan sát kỹ giúp con hiểu bài hơn.",
        feedback_wrong: "Mình nên quan sát kỹ hình và nội dung trước nhé."
      }
    ]
  };
}

async function generatePlan(topic) {
  if (!API_KEY) {
    console.log(`[1/3] Không có GEMINI_API_KEY. Dùng local generator cho chủ đề: "${topic}"...`);
    return createLocalPlan(topic);
  }

  console.log(`[1/3] Đang dùng Gemini để tạo cấu trúc bài giảng: "${topic}"...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  const prompt = `
Bạn là giáo viên tiểu học Việt Nam. Hãy tạo bài học ngắn bằng tiếng Việt về chủ đề "${topic}".
Trả về JSON thuần, không markdown:
{
  "title": "Tên bài",
  "grade": 1,
  "subject": "Môn học",
  "description": "Mô tả ngắn",
  "slides": [
    {"slide_number": 1, "page_type": "cover", "content": "Text trên slide", "script": "Lời dẫn", "visual_prompt": "Prompt ảnh 16:9 đúng nội dung"}
  ],
  "quiz": [
    {"question": "Câu hỏi", "answers": ["A","B","C","D"], "correct": "A", "feedback_correct": "Khen", "feedback_wrong": "Gợi ý"}
  ]
}
Yêu cầu 4-5 slide và ít nhất 4 câu quiz.`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    console.warn(`Gemini plan failed, using local generator. Reason: ${data.error?.message || response.status}`);
    return createLocalPlan(topic);
  }
  try {
    return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
  } catch (error) {
    console.warn(`Gemini JSON parse failed, using local generator. Reason: ${error.message}`);
    return createLocalPlan(topic);
  }
}

function loadPlan(inputPathOrTopic) {
  const resolvedPath = path.resolve(__dirname, inputPathOrTopic);
  if (fs.existsSync(resolvedPath) && resolvedPath.toLowerCase().endsWith(".json")) {
    console.log(`[1/3] Đang đọc kịch bản từ: ${resolvedPath}`);
    const rawPlan = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    return Promise.resolve(normalizePlan(rawPlan, rawPlan.title || rawPlan.lesson_title || path.basename(resolvedPath, ".json")));
  }
  return generatePlan(inputPathOrTopic).then((plan) => normalizePlan(plan, inputPathOrTopic));
}

function updateAppLibrary(entry) {
  const appJsPath = path.join(__dirname, "app.js");
  if (!fs.existsSync(appJsPath)) return;
  let appJs = fs.readFileSync(appJsPath, "utf8");
  const marker = "const libraryCatalog = [";
  if (!appJs.includes(marker)) return;
  const entryStr = `  ${JSON.stringify(entry, null, 2)},`;
  appJs = appJs.replace(marker, `${marker}\n${entryStr}`);
  fs.writeFileSync(appJsPath, appJs, "utf8");
  console.log("- Đã thêm bài giảng vào libraryCatalog trong app.js");
}

function updateLessonCatalog(entry) {
  const catalogPath = path.join(__dirname, "lessons", "catalog.json");
  let catalog = [];
  if (fs.existsSync(catalogPath)) {
    catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  }
  catalog.unshift(entry);
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  console.log("- Đã cập nhật lessons/catalog.json");
}

function appendCollaborationLog(title) {
  const logPath = path.join(__dirname, "COLLABORATION_LOG.md");
  const line = `\n- ${new Date().toISOString().slice(0, 10)} Codex: Done building ${title}.\n`;
  fs.appendFileSync(logPath, line, "utf8");
}

async function main() {
  const plan = await loadPlan(input);
  if (!plan.slides.length) {
    console.error("Lỗi: kịch bản không có slide hợp lệ.");
    process.exit(1);
  }
  if (!plan.quiz.length) {
    plan.quiz = createLocalPlan(plan.title).quiz;
  }

  const safeTitle = slugify(plan.title);
  const buildId = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  const lessonDirName = `lesson_${safeTitle}_${buildId}`;
  const outDir = path.resolve(__dirname, "lessons", lessonDirName);
  const planPath = path.resolve(__dirname, `temp_plan_${buildId}.json`);

  // Validate paths to prevent directory traversal
  if (!outDir.startsWith(path.resolve(__dirname, "lessons"))) {
    throw new Error("Invalid output directory path");
  }
  if (!planPath.startsWith(path.resolve(__dirname))) {
    throw new Error("Invalid plan path");
  }

  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf8");

  console.log("[2/3] Đã chuẩn hóa kịch bản. Bắt đầu tạo ảnh slide...");
  try {
    execFileSync(
      "python",
      ["generate_ppt.py", "--plan", planPath, "--style", "styles/vector-illustration.md", "--output", outDir],
      {
        cwd: path.join(__dirname, "NanoBanana"),
        stdio: "inherit",
        env: { ...process.env, GEMINI_API_KEY: API_KEY }
      }
    );

    console.log("\n[2.5/3] Đang tạo audio và dữ liệu karaoke...");
    execFileSync(
      "python",
      ["generate_audio.py", "--script", path.join(outDir, "prompts.json"), "--output_dir", outDir],
      { cwd: __dirname, stdio: "inherit" }
    );

    const id = `gen_${safeTitle}_${buildId}`;
    const thumbnail = `lessons/${lessonDirName}/images/slide-01.png`;
    const appEntry = {
      id,
      grade: plan.grade,
      category: plan.subject || "Khám phá",
      title: plan.title,
      desc: `${plan.slides.length} slide · Audio · Karaoke · Quiz`,
      path: `lessons/${lessonDirName}/index.html`,
      thumbnail,
      hasQuiz: true
    };

    updateAppLibrary(appEntry);
    updateLessonCatalog({
      id,
      title: plan.title,
      grade: plan.grade,
      subject: plan.subject || "Khám phá",
      slide_count: plan.slides.length,
      path: `${lessonDirName}/index.html`,
      thumbnail: `${lessonDirName}/images/slide-01.png`,
      keywords: [plan.title, safeTitle],
      hasAudio: true,
      hasQuiz: true
    });
    appendCollaborationLog(plan.title);

    console.log(`\n[3/3] HOÀN TẤT: ${path.join(outDir, "index.html")}`);
  } finally {
    if (fs.existsSync(planPath)) {
      try {
        fs.unlinkSync(planPath);
      } catch (error) {
        console.warn(`Warning: could not remove temp plan ${planPath}: ${error.message}`);
      }
    }
  }
}

main().catch((error) => {
  console.error("Lỗi trong quá trình tạo bài giảng:", error);
  process.exit(1);
});
