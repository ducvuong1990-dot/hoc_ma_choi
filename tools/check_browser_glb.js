const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.APP_URL || "http://127.0.0.1:3000/";
const port = Number(process.env.CDP_PORT || 9223);
const userDataDir = path.join(process.env.TEMP || "C:\\tmp", `eduplay-cdp-${Date.now()}`);
const screenshotDir = path.join(process.cwd(), "tools", "browser-check");
const fastMode = process.env.FAST === "1";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
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
  for (let i = 0; i < 50; i += 1) {
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
    const list = handlers.get(msg.method) || [];
    list.forEach((handler) => handler(msg.params || {}));
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      const send = (method, params = {}) => new Promise((res, rej) => {
        const id = ++seq;
        callbacks.set(id, { resolve: res, reject: rej });
        ws.send(JSON.stringify({ id, method, params }));
      });
      const on = (method, handler) => {
        handlers.set(method, [...(handlers.get(method) || []), handler]);
      };
      resolve({ ws, send, on });
    };
    ws.onerror = reject;
  });
}

async function runViewport(client, viewport, label) {
  const { send, on } = client;
  const glbResponses = [];
  const failedRequests = [];
  const consoleErrors = [];
  const exceptions = [];

  on("Network.responseReceived", (params) => {
    const url = params.response?.url || "";
    if (url.includes("/assets/characters/") && url.endsWith(".glb")) {
      glbResponses.push({
        url,
        status: params.response.status,
        mimeType: params.response.mimeType
      });
    }
  });
  on("Network.loadingFailed", (params) => failedRequests.push(params));
  on("Runtime.consoleAPICalled", (params) => {
    if (["error", "warning"].includes(params.type)) {
      consoleErrors.push(params.args.map((arg) => arg.value || arg.description || "").join(" "));
    }
  });
  on("Runtime.exceptionThrown", (params) => {
    const details = params.exceptionDetails || {};
    exceptions.push({
      text: details.text,
      description: details.exception?.description,
      url: details.url,
      lineNumber: details.lineNumber,
      columnNumber: details.columnNumber
    });
  });

  await send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile || false
  });
  await send("Page.navigate", { url: baseUrl });
  await new Promise((resolve) => {
    const done = setTimeout(resolve, 4500);
    on("Page.loadEventFired", () => {
      clearTimeout(done);
      setTimeout(resolve, 2200);
    });
  });

  const state = {
    isLoggedIn: true,
    route: "parent",
    name: "Alex",
    grade: 5,
    avatarId: "capy",
    avatarCosmetics: {},
    characterProgress: { capy: { xp: 260, level: 3 }, capybara: { xp: 260, level: 3 } },
    studyLog: {},
    categoryLog: {},
    lessons: {},
    games: {},
    stickerAwards: [],
    stickers: []
  };
  await send("Runtime.evaluate", {
    expression: `localStorage.setItem("hoc_ma_choi_state_v2", ${JSON.stringify(JSON.stringify(state))}); location.reload();`,
    awaitPromise: true
  });
  await sleep(fastMode ? 3500 : 5000);
  if (process.env.SCROLL_AVATAR === "1") {
    await send("Runtime.evaluate", {
      expression: `document.querySelector(".avatar-studio")?.scrollIntoView({ block: "center" });`,
      awaitPromise: true
    });
    await sleep(fastMode ? 6500 : 9000);
  }

  const layout = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const q = (sel) => document.querySelector(sel);
      const r = (sel) => {
        const el = q(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      };
      const overflow = [...document.querySelectorAll("*")].filter((el) => el.scrollWidth > el.clientWidth + 2).slice(0, 12).map((el) => ({
        tag: el.tagName,
        cls: el.className,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      }));
      return {
        bodyWidth: document.body.scrollWidth,
        viewportWidth: innerWidth,
        horizontalOverflow: document.body.scrollWidth > innerWidth + 2,
        parentContainer: r(".parent-route-container"),
        hero: r(".parent-hero-section"),
        grid: r(".parent-grid-layout"),
        main: r(".main-column"),
        side: r(".side-column"),
        avatarCanvasCount: document.querySelectorAll("[data-avatar-stage] canvas").length,
        fallbackOnlyCount: document.querySelectorAll(".fallback-only").length,
        overflow
      };
    })()`
  });

  let screenshotPath = "";
  if (!fastMode) {
    fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    screenshotPath = path.join(screenshotDir, `${label}.png`);
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
  }

  return {
    label,
    viewport,
    glbResponses,
    failedRequests: failedRequests.map((item) => ({ requestId: item.requestId, errorText: item.errorText })),
    consoleErrors,
    exceptions,
    layout: layout.result.value,
    screenshotPath
  };
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
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");

    const results = [];
    results.push(await runViewport(client, { width: 1440, height: 1000 }, "parent-desktop"));
    if (!fastMode) {
      results.push(await runViewport(client, { width: 390, height: 844, mobile: true }, "parent-mobile"));
    }

    console.log(JSON.stringify(results, null, 2));
    client.ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
