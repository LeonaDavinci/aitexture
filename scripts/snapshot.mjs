/**
 * 截图指定路由，用于视觉验收。
 * 用法： node scripts/snapshot.mjs <baseUrl> <name=path> [name=path] ...
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BASE = process.argv[2] || "http://127.0.0.1:3111";
const targets = process.argv.slice(3).map((s) => {
  // 格式 name:path[@scrollY]
  const at = s.indexOf("@");
  const scroll = at === -1 ? 0 : Number(s.slice(at + 1));
  const body = at === -1 ? s : s.slice(0, at);
  // 用最后一个冒号分隔名称与路径（路径本身可能含冒号）
  const i = body.lastIndexOf(":");
  return { name: body.slice(0, i), path: body.slice(i + 1), scroll };
});
const PORT = 9366;
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";
const outDir = join(root, ".preview", "snapshots");
mkdirSync(outDir, { recursive: true });

const profile = mkdtempSync(join(tmpdir(), "snapshot-"));
const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  `--remote-debugging-port=${PORT}`,
  "--user-data-dir=" + profile,
  "--window-size=1440,1100",
  "--hide-scrollbars",
  "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      // 用页面级 target（浏览器级端点不支持 Page.* 域）
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
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
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

for (const t of targets) {
  await send("Page.navigate", { url: BASE + t.path });
  await sleep(3200);
  // 支持指定滚动位置后再截图
  if (t.scroll) {
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${t.scroll})` });
    await sleep(900);
  }
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const file = join(outDir, `${t.name}.png`);
  writeFileSync(file, Buffer.from(r.data, "base64"));
  console.log("saved " + file.replace(root, "."));
}

ws.close();
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}
process.exit(0);
