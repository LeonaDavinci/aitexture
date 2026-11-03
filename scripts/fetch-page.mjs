/**
 * 抓取豆包等客户端渲染页面的正文内容。
 * 用法： node scripts/fetch-page.mjs <url> [waitMs]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const URL_ = process.argv[2];
const WAIT = Number(process.argv[3] || 8000);
const PORT = 9355;
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

if (!URL_) {
  console.error("用法: node scripts/fetch-page.mjs <url> [waitMs]");
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), "fetchpage-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + profile,
  "--window-size=1440,1200",
  "--lang=zh-CN",
  URL_,
], { stdio: ["ignore", "pipe", "pipe"] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error("DevTools 未就绪");
}

const ws = new WebSocket(await getWsUrl());
await new Promise((r) => ws.addEventListener("open", r));

let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
const send = (method, params = {}) => {
  const i = ++id;
  return new Promise((resolve, reject) => {
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => {
      if (pending.has(i)) { pending.delete(i); reject(new Error("超时 " + method)); }
    }, 60000);
  });
};

await send("Page.enable");
await send("Runtime.enable");
await sleep(WAIT);

const r = await send("Runtime.evaluate", {
  expression: `(() => {
    // 抓取主要可见文本
    const main = document.querySelector('main') || document.body;
    const clone = main.cloneNode(true);
    clone.querySelectorAll('script,style,noscript,svg').forEach(e => e.remove());
    const text = clone.innerText || clone.textContent || '';
    return JSON.stringify({
      title: document.title,
      url: location.href,
      text: text.replace(/\\n{3,}/g, '\\n\\n').trim(),
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.innerText.trim()).slice(0, 60),
    });
  })()`,
  returnByValue: true,
});

const data = JSON.parse(r.result.value);
console.log("=== TITLE ===");
console.log(data.title);
console.log("\n=== HEADINGS ===");
data.headings.forEach((h) => console.log("  " + h));
console.log("\n=== TEXT (" + data.text.length + " chars) ===");
console.log(data.text);

const outPath = join(__dirname, "..", ".preview", "fetched-" + Date.now() + ".txt");
writeFileSync(outPath, `URL: ${data.url}\nTITLE: ${data.title}\n\n${data.text}`, "utf8");
console.log("\n\n[已保存] " + outPath);

ws.close();
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
