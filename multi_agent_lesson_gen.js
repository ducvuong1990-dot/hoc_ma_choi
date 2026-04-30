#!/usr/bin/env node

/**
 * Multi-Agent Lesson Generation System
 *
 * Sử dụng nhiều agents song song để tạo bài học nhanh hơn:
 * - Agent 1: Content Creator (tạo kịch bản + quiz)
 * - Agent 2: Image Generator (tạo images cho slides)
 * - Agent 3: Audio Generator (tạo audio + karaoke)
 * - Agent 4: Quality Assurance (validate output)
 * - Agent 5: Deployer (sync catalog + commit)
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync, spawn } = require("child_process");

const API_KEY = process.env.GEMINI_API_KEY || "";

// Configuration
const CONFIG = {
  maxParallelAgents: 3,
  timeout: 300000, // 5 minutes per agent
  retryAttempts: 2
};

/**
 * Agent base class
 */
class Agent {
  constructor(name, task) {
    this.name = name;
    this.task = task;
    this.status = "pending";
    this.result = null;
    this.error = null;
    this.startTime = null;
    this.endTime = null;
  }

  async execute() {
    this.status = "running";
    this.startTime = Date.now();
    console.log(`[${this.name}] Starting...`);

    try {
      this.result = await this.task();
      this.status = "completed";
      this.endTime = Date.now();
      console.log(`[${this.name}] Completed in ${this.duration()}ms`);
      return this.result;
    } catch (error) {
      this.status = "failed";
      this.error = error;
      this.endTime = Date.now();
      console.error(`[${this.name}] Failed: ${error.message}`);
      throw error;
    }
  }

  duration() {
    return this.endTime - this.startTime;
  }
}

/**
 * Content Creator Agent
 * Tạo kịch bản bài học và quiz
 */
class ContentCreatorAgent extends Agent {
  constructor(topic, grade = 1) {
    super("ContentCreator", async () => {
      if (!API_KEY) {
        console.log(`[${this.name}] No API key, using local generator`);
        return this.createLocalContent(topic, grade);
      }

      try {
        return await this.createWithGemini(topic, grade);
      } catch (error) {
        console.warn(`[${this.name}] Gemini failed, fallback to local`);
        return this.createLocalContent(topic, grade);
      }
    });
    this.topic = topic;
    this.grade = grade;
  }

  async createWithGemini(topic, grade) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    const prompt = `
Bạn là giáo viên tiểu học Việt Nam. Tạo bài học cho lớp ${grade} về "${topic}".
Trả về JSON thuần:
{
  "title": "Tên bài",
  "grade": ${grade},
  "subject": "Môn học",
  "description": "Mô tả ngắn",
  "slides": [
    {"slide_number": 1, "page_type": "cover", "content": "Text", "script": "Lời dẫn", "visual_prompt": "Prompt ảnh"}
  ],
  "quiz": [
    {"question": "Câu hỏi", "answers": ["A","B","C","D"], "correct": "A", "feedback_correct": "Khen", "feedback_wrong": "Gợi ý"}
  ]
}
Yêu cầu: 5-7 slide, 4-6 câu quiz.`;

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
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }

    return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
  }

  createLocalContent(topic, grade) {
    return {
      title: topic,
      grade: grade,
      subject: "Khám phá",
      description: `Bài học về ${topic}`,
      slides: [
        {
          slide_number: 1,
          page_type: "cover",
          content: topic,
          script: `Chào con! Hôm nay chúng mình cùng học về ${topic}.`,
          visual_prompt: `Vietnamese primary school lesson cover about ${topic}, friendly vector illustration`
        },
        {
          slide_number: 2,
          page_type: "content",
          content: "Quan sát và học hỏi",
          script: "Con hãy quan sát kỹ các chi tiết trong bài học này nhé.",
          visual_prompt: `Educational scene about ${topic}, children learning, vector style`
        },
        {
          slide_number: 3,
          page_type: "data",
          content: "Cùng luyện tập",
          script: "Bây giờ chúng mình cùng làm bài tập để ghi nhớ kiến thức.",
          visual_prompt: `Quiz practice scene for ${topic}, cheerful children, vector illustration`
        }
      ],
      quiz: [
        {
          question: `Bài học hôm nay nói về chủ đề gì?`,
          answers: [topic, "Chủ đề khác", "Không biết", "Tất cả đều đúng"],
          correct: topic,
          feedback_correct: "Đúng rồi! Con nhớ rất tốt.",
          feedback_wrong: `Chủ đề của bài là ${topic} nhé.`
        },
        {
          question: "Khi học bài, con nên làm gì?",
          answers: ["Quan sát kỹ", "Bỏ qua", "Ngủ", "Chơi game"],
          correct: "Quan sát kỹ",
          feedback_correct: "Chính xác! Quan sát giúp con hiểu bài hơn.",
          feedback_wrong: "Con nên quan sát kỹ để hiểu bài nhé."
        }
      ]
    };
  }
}

/**
 * Image Generator Agent
 * Tạo images cho slides (chạy song song)
 */
class ImageGeneratorAgent extends Agent {
  constructor(plan, outputDir) {
    super("ImageGenerator", async () => {
      const planPath = path.resolve(outputDir, "plan.json");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf8");

      return new Promise((resolve, reject) => {
        const process = spawn(
          "python",
          [
            "generate_ppt.py",
            "--plan", planPath,
            "--style", "styles/vector-illustration.md",
            "--output", outputDir
          ],
          {
            cwd: path.join(__dirname, "NanoBanana"),
            env: { ...process.env, GEMINI_API_KEY: API_KEY },
            stdio: "pipe"
          }
        );

        let stdout = "";
        let stderr = "";

        process.stdout.on("data", (data) => {
          stdout += data.toString();
          console.log(`[${this.name}] ${data.toString().trim()}`);
        });

        process.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        process.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, outputDir });
          } else {
            reject(new Error(`Image generation failed with code ${code}: ${stderr}`));
          }
        });

        process.on("error", (error) => {
          reject(error);
        });
      });
    });
    this.plan = plan;
    this.outputDir = outputDir;
  }
}

/**
 * Audio Generator Agent
 * Tạo audio + karaoke timestamps (chạy song song)
 */
class AudioGeneratorAgent extends Agent {
  constructor(plan, outputDir) {
    super("AudioGenerator", async () => {
      const promptsPath = path.resolve(outputDir, "prompts.json");
      fs.writeFileSync(promptsPath, JSON.stringify(plan, null, 2), "utf8");

      return new Promise((resolve, reject) => {
        const process = spawn(
          "python",
          ["generate_audio.py", "--script", promptsPath, "--output_dir", outputDir],
          {
            cwd: __dirname,
            stdio: "pipe"
          }
        );

        let stdout = "";
        let stderr = "";

        process.stdout.on("data", (data) => {
          stdout += data.toString();
          console.log(`[${this.name}] ${data.toString().trim()}`);
        });

        process.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        process.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, outputDir });
          } else {
            reject(new Error(`Audio generation failed with code ${code}: ${stderr}`));
          }
        });

        process.on("error", (error) => {
          reject(error);
        });
      });
    });
    this.plan = plan;
    this.outputDir = outputDir;
  }
}

/**
 * Quality Assurance Agent
 * Validate output của các agents khác
 */
class QualityAssuranceAgent extends Agent {
  constructor(plan, outputDir) {
    super("QualityAssurance", async () => {
      const issues = [];

      // Check slides
      if (!plan.slides || plan.slides.length < 3) {
        issues.push("Cần ít nhất 3 slides");
      }

      // Check quiz
      if (!plan.quiz || plan.quiz.length < 2) {
        issues.push("Cần ít nhất 2 câu quiz");
      }

      plan.quiz.forEach((q, i) => {
        if (!q.answers || q.answers.length < 2) {
          issues.push(`Quiz ${i + 1}: cần ít nhất 2 đáp án`);
        }
        if (!q.correct || !q.answers.includes(q.correct)) {
          issues.push(`Quiz ${i + 1}: đáp án đúng không hợp lệ`);
        }
      });

      // Check images exist
      const imagesDir = path.join(outputDir, "images");
      if (fs.existsSync(imagesDir)) {
        const imageFiles = fs.readdirSync(imagesDir);
        if (imageFiles.length < plan.slides.length) {
          issues.push(`Thiếu images: có ${imageFiles.length}/${plan.slides.length}`);
        }
      } else {
        issues.push("Thư mục images không tồn tại");
      }

      // Check audio exist
      const audioDir = path.join(outputDir, "audio");
      if (fs.existsSync(audioDir)) {
        const audioFiles = fs.readdirSync(audioDir).filter(f => f.endsWith(".mp3"));
        if (audioFiles.length < plan.slides.length) {
          issues.push(`Thiếu audio: có ${audioFiles.length}/${plan.slides.length}`);
        }
      } else {
        issues.push("Thư mục audio không tồn tại");
      }

      if (issues.length > 0) {
        throw new Error(`QA failed:\n- ${issues.join("\n- ")}`);
      }

      return { success: true, issues: [] };
    });
    this.plan = plan;
    this.outputDir = outputDir;
  }
}

/**
 * Deployer Agent
 * Sync catalog và commit changes
 */
class DeployerAgent extends Agent {
  constructor(lessonEntry) {
    super("Deployer", async () => {
      // Update catalog
      const catalogPath = path.join(__dirname, "lessons", "catalog.json");
      let catalog = [];
      if (fs.existsSync(catalogPath)) {
        catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
      }
      catalog.unshift(lessonEntry);
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");

      // Append to collaboration log
      const logPath = path.join(__dirname, "COLLABORATION_LOG.md");
      const line = `\n- ${new Date().toISOString().slice(0, 10)} Multi-Agent: Done building ${lessonEntry.title}.\n`;
      fs.appendFileSync(logPath, line, "utf8");

      return { success: true, catalogUpdated: true };
    });
    this.lessonEntry = lessonEntry;
  }
}

/**
 * Multi-Agent Orchestrator
 * Điều phối các agents
 */
class MultiAgentOrchestrator {
  constructor() {
    this.agents = [];
    this.results = {};
  }

  addAgent(agent) {
    this.agents.push(agent);
  }

  async executeSequential() {
    console.log(`\n🤖 Executing ${this.agents.length} agents sequentially...\n`);

    for (const agent of this.agents) {
      try {
        this.results[agent.name] = await agent.execute();
      } catch (error) {
        console.error(`❌ Agent ${agent.name} failed:`, error.message);
        throw error;
      }
    }

    return this.results;
  }

  async executeParallel(agents) {
    console.log(`\n🤖 Executing ${agents.length} agents in parallel...\n`);

    const promises = agents.map(agent => agent.execute());
    const results = await Promise.all(promises);

    agents.forEach((agent, i) => {
      this.results[agent.name] = results[i];
    });

    return results;
  }

  printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 MULTI-AGENT EXECUTION SUMMARY");
    console.log("=".repeat(60));

    this.agents.forEach(agent => {
      const status = agent.status === "completed" ? "✅" : "❌";
      const duration = agent.duration() ? `${agent.duration()}ms` : "N/A";
      console.log(`${status} ${agent.name.padEnd(20)} ${duration.padStart(10)}`);
    });

    const totalTime = this.agents.reduce((sum, a) => sum + (a.duration() || 0), 0);
    console.log("=".repeat(60));
    console.log(`Total time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
    console.log("=".repeat(60) + "\n");
  }
}

/**
 * Main function
 */
async function generateLessonMultiAgent(topic, grade = 1) {
  console.log(`\n🚀 Multi-Agent Lesson Generation`);
  console.log(`Topic: ${topic}`);
  console.log(`Grade: ${grade}\n`);

  const orchestrator = new MultiAgentOrchestrator();
  const startTime = Date.now();

  try {
    // Phase 1: Content Creation (sequential)
    console.log("📝 Phase 1: Content Creation");
    const contentAgent = new ContentCreatorAgent(topic, grade);
    orchestrator.addAgent(contentAgent);
    await contentAgent.execute();
    const plan = contentAgent.result;

    // Prepare output directory
    const safeTitle = topic.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-zA-Z0-9]+/g, "_").substring(0, 52);
    const buildId = crypto.randomUUID().replace(/-/g, "").substring(0, 16);
    const lessonDirName = `lesson_${safeTitle}_${buildId}`;
    const outputDir = path.resolve(__dirname, "lessons", lessonDirName);

    // Phase 2: Image & Audio Generation (parallel)
    console.log("\n🎨 Phase 2: Media Generation (Parallel)");
    const imageAgent = new ImageGeneratorAgent(plan, outputDir);
    const audioAgent = new AudioGeneratorAgent(plan, outputDir);
    orchestrator.addAgent(imageAgent);
    orchestrator.addAgent(audioAgent);
    await orchestrator.executeParallel([imageAgent, audioAgent]);

    // Phase 3: Quality Assurance (sequential)
    console.log("\n✅ Phase 3: Quality Assurance");
    const qaAgent = new QualityAssuranceAgent(plan, outputDir);
    orchestrator.addAgent(qaAgent);
    await qaAgent.execute();

    // Phase 4: Deployment (sequential)
    console.log("\n🚀 Phase 4: Deployment");
    const lessonEntry = {
      id: `gen_${safeTitle}_${buildId}`,
      title: plan.title,
      grade: plan.grade,
      subject: plan.subject || "Khám phá",
      slide_count: plan.slides.length,
      path: `${lessonDirName}/index.html`,
      thumbnail: `${lessonDirName}/images/slide-01.png`,
      keywords: [plan.title, safeTitle],
      hasAudio: true,
      hasQuiz: true
    };
    const deployAgent = new DeployerAgent(lessonEntry);
    orchestrator.addAgent(deployAgent);
    await deployAgent.execute();

    // Summary
    const totalTime = Date.now() - startTime;
    orchestrator.printSummary();

    console.log("✅ SUCCESS!");
    console.log(`📁 Output: ${outputDir}`);
    console.log(`⏱️  Total time: ${(totalTime / 1000).toFixed(2)}s\n`);

    return { success: true, outputDir, lessonEntry };

  } catch (error) {
    console.error("\n❌ FAILED:", error.message);
    orchestrator.printSummary();
    throw error;
  }
}

// CLI
if (require.main === module) {
  const topic = process.argv[2];
  const grade = parseInt(process.argv[3]) || 1;

  if (!topic) {
    console.error("Usage: node multi_agent_lesson_gen.js <topic> [grade]");
    console.error('Example: node multi_agent_lesson_gen.js "Vòng đời của bướm" 1');
    process.exit(1);
  }

  generateLessonMultiAgent(topic, grade)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { generateLessonMultiAgent, MultiAgentOrchestrator };
