const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const lessonPath = process.env.LESSON_PATH || "lessons/lesson_Vong_doi_cua_cay_dau_1777524933652/index.html";
const baseUrl = process.env.APP_URL || "http://127.0.0.1:3000/";
const url = new URL(lessonPath, baseUrl).toString();
const port = Number(process.env.CDP_PORT || 9223);
const userDataDir = path.join(process.env.TEMP || "C:\\tmp", `eduplay-lesson-cdp-${Date.now()}`);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestJson(target) {
  return new Promise((resolve, reject) => {
    http.get(target, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (error) { reject(error); }
      });
    }).on("error", reject);
  });
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const tabs = await requestJson(`http://127.0.0.1:${port}/json`);
      const page = tabs.find((tab) => tab.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(120);
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let seq = 0;
  const callbacks = new Map();
  const handlers = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result || {});
      return;
    }
    (handlers.get(msg.method) || []).forEach((handler) => handler(msg.params || {}));
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      const send = (method, params = {}) => new Promise((res, rej) => {
        const id = ++seq;
        callbacks.set(id, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id, method, params }));
      });
      const on = (method, handler) => handlers.set(method, [...(handlers.get(method) || []), handler]);
      resolve({ ws, send, on });
    };
    ws.onerror = reject;
  });
}

async function main() {
  if (!fs.existsSync(chromePath)) throw new Error(`Chrome not found: ${chromePath}`);
  fs.mkdirSync(userDataDir, { recursive: true });
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: "ignore" });

  try {
    const wsUrl = await getWebSocketDebuggerUrl();
    const client = await connect(wsUrl);
    const { send, on } = client;
    const consoleErrors = [];
    const exceptions = [];
    const failedRequests = [];
    on("Runtime.consoleAPICalled", (params) => {
      if (["error", "warning"].includes(params.type)) {
        consoleErrors.push(params.args.map((arg) => arg.value || arg.description || "").join(" "));
      }
    });
    on("Runtime.exceptionThrown", (params) => exceptions.push(params.exceptionDetails?.exception?.description || params.exceptionDetails?.text));
    on("Network.loadingFailed", (params) => failedRequests.push({ requestId: params.requestId, errorText: params.errorText }));

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Network.enable");
    await send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url });
    await sleep(3500);

    const before = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => ({
        slideCount: slides.length,
        quizCount: quizData.length,
        loadedImages: [...document.querySelectorAll('.slide-img')].filter((img) => img.complete && img.naturalWidth > 0).length,
        activeQuiz: document.querySelector('#quizScreen').classList.contains('active')
      }))()`
    });

    await send("Runtime.evaluate", { expression: `document.querySelector('#quizBtn').click();` });
    await sleep(500);
    await send("Runtime.evaluate", {
      expression: `(() => {
        const item = normalizeQuizItem(quizData[quizIdx], quizIdx);
        const correct = [...document.querySelectorAll('.quiz-answer')].find((button) => button.textContent === String(item.correct));
        correct?.click();
      })()`
    });
    await sleep(500);
    await send("Runtime.evaluate", { expression: `document.querySelector('#nextQuizBtn').click();` });
    await sleep(1200);

    const after = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => ({
        slideCount: slides.length,
        quizCount: quizData.length,
        quizCounter: document.querySelector('#quizCounter').textContent,
        quizScore: document.querySelector('#quizScore').textContent,
        activeQuiz: document.querySelector('#quizScreen').classList.contains('active'),
        questionText: document.querySelector('#quizQuestion').textContent,
        answerCount: document.querySelectorAll('.quiz-answer').length
      }))()`
    });

    const result = { url, before: before.result.value, after: after.result.value, consoleErrors, exceptions, failedRequests };
    console.log(JSON.stringify(result, null, 2));

    if (result.before.slideCount !== 6) throw new Error(`Expected 6 slides, got ${result.before.slideCount}`);
    if (result.before.loadedImages !== 6) throw new Error(`Expected 6 loaded images, got ${result.before.loadedImages}`);
    if (result.before.quizCount < 4) throw new Error(`Expected initial quiz count >= 4, got ${result.before.quizCount}`);
    if (result.after.quizCount < result.before.quizCount + 10) throw new Error(`Expected auto quiz +10, got ${result.after.quizCount}`);
    if (!result.after.activeQuiz) throw new Error("Quiz screen is not active");
    if (!/10/.test(result.after.quizScore)) throw new Error(`Expected score to include 10, got ${result.after.quizScore}`);
    if (exceptions.length) throw new Error(`Runtime exceptions: ${exceptions.join("; ")}`);
    client.ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
