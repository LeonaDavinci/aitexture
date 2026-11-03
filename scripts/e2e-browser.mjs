/**
 * 真实浏览器端 E2E 验证：驱动无头 Chrome 打开页面，执行生成流程，
 * 检查纹理是否真的渲染出来、平铺预览是否生效、下载链接是否有效。
 *
 * 用法： node scripts/e2e-browser.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createConnection } from "node:net";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BASE = process.argv[2] || "http://127.0.0.1:3111";
const CHROME = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe";

const profile = mkdtempSync(join(tmpdir(), "aitexture-e2e-"));
const shotDir = join(root, ".preview", "e2e");
mkdirSync(shotDir, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--remote-debugging-port=9333",
  "--user-data-dir=" + profile,
  "--window-size=1440,1000",
  "--hide-scrollbars",
  "about:blank",
], { stdio: ["ignore", "pipe", "pipe"] });

let chromeErr = "";
chrome.stderr.on("data", (d) => (chromeErr += d.toString()));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      // 找到页面级 target 的 ws 地址（浏览器级端点不支持 Page.* 域）
      const res = await fetch("http://127.0.0.1:9333/json/list");
      const list = await res.json();
      const page = list.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(300);
  }
  throw new Error("Chrome DevTools 页面 target 未就绪\n" + chromeErr.slice(0, 800));
}

/* 极简 CDP 客户端 */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 超时: ${method}`));
        }
      }, 60000);
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) {
      throw new Error("页面脚本异常: " + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    }
    return r.result.value;
  }
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.addEventListener("open", r)));
const cdp = new CDP(ws);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Log.enable");

const failures = [];
const pass = (m) => console.log("  ✓ " + m);
const fail = (m) => {
  failures.push(m);
  console.log("  ✗ " + m);
};

async function goto(url) {
  await cdp.send("Page.navigate", { url });
  await sleep(2500);
}

async function shot(name) {
  const r = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(shotDir, `${name}.png`), Buffer.from(r.data, "base64"));
}

console.log("目标:", BASE);
console.log("\n[1] 首页加载与首屏渲染");
await goto(BASE + "/");
const h1 = await cdp.eval(`document.querySelector('h1')?.textContent?.trim()`);
h1 ? pass(`H1 渲染: "${h1}"`) : fail("H1 缺失");

const heroCta = await cdp.eval(
  `!!document.querySelector('a[href="/tools/ai-texture-generator"]')`,
);
heroCta ? pass("CTA 链接存在") : fail("CTA 链接缺失");

await shot("01-home");

console.log("\n[2] 工具页：执行一次真实生成");
await goto(BASE + "/tools/ai-texture-generator");

// 填入提示词
await cdp.eval(`(() => {
  const ta = document.querySelector('#prompt');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, 'weathered red brick wall with mortar joints');
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  return ta.value;
})()`);
await sleep(400);

// 点击 Generate
const clicked = await cdp.eval(`(() => {
  const btns = [...document.querySelectorAll('button')];
  const b = btns.find(x => /Generate 4 Textures|Generating/.test(x.textContent));
  if (b) { b.click(); return b.textContent.trim(); }
  return null;
})()`);
clicked ? pass(`点击生成按钮: "${clicked}"`) : fail("未找到生成按钮");

// 等待生成完成（最多 90s）
let done = false;
for (let i = 0; i < 90; i++) {
  await sleep(1000);
  const state = await cdp.eval(`(() => {
    const txt = document.body.innerText;
    const variants = document.body.innerText.includes('Generated variants');
    const pack = document.body.innerText.includes('PBR map pack');
    const err = document.querySelector('[role="alert"]')?.textContent || '';
    return { variants, pack, err, busy: /Generating\\.\\.\\./.test(txt) };
  })()`);
  if (state.err) {
    fail("生成报错: " + state.err);
    break;
  }
  if (state.variants && state.pack) {
    done = true;
    pass(`生成完成（约 ${i + 1}s）`);
    break;
  }
}
if (!done && failures.length === 0) fail("生成超时，未出现结果区");

if (done) {
  const info = await cdp.eval(`(() => {
    const figs = [...document.querySelectorAll('figure')];
    const dl = [...document.querySelectorAll('a[download]')];
    const imgs = [...document.querySelectorAll('div[style*="background-image"]')];
    return {
      figureCount: figs.length,
      downloadCount: dl.length,
      downloadNames: dl.slice(0, 6).map(a => a.getAttribute('download')),
      bgCount: imgs.length,
      hasDataUrl: imgs.some(d => (d.style.backgroundImage||'').includes('data:image/png')),
    };
  })()`);

  info.figureCount >= 5
    ? pass(`渲染出 ${info.figureCount} 张图（4 变体 + PBR 贴图）`)
    : fail(`图片数量不足: ${info.figureCount}`);
  info.downloadCount >= 5
    ? pass(`生成 ${info.downloadCount} 个下载链接`)
    : fail(`下载链接不足: ${info.downloadCount}`);
  info.hasDataUrl
    ? pass("纹理已渲染为 data URL（生成真实发生）")
    : fail("未发现渲染出的纹理");
  console.log("    下载文件名样例: " + info.downloadNames.join(", "));
}

await shot("02-generated");

console.log("\n[3] 通道切换与平铺密度");
await cdp.eval(`(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'normal');
  if (b) b.click();
  return !!b;
})()`);
await sleep(800);
await shot("03-normal-map");

const tiles = await cdp.eval(`(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '4x');
  if (b) b.click();
  return !!b;
})()`);
await sleep(800);
if (tiles) pass("可切换 4x 平铺密度");
else fail("平铺密度按钮缺失");

const bgSize = await cdp.eval(`(() => {
  const el = [...document.querySelectorAll('div')].find(d => (d.style.backgroundImage||'').includes('data:image/png') && d.style.backgroundSize);
  return el ? el.style.backgroundSize : null;
})()`);
bgSize ? pass(`平铺背景尺寸生效: ${bgSize}`) : fail("平铺背景未生效");
await shot("04-tiling-4x");

console.log("\n[4] 预设切换");
await goto(BASE + "/tools/ai-texture-generator?preset=marble");
await sleep(1200);
const presetVal = await cdp.eval(`document.querySelector('#prompt')?.value || ''`);
presetVal.includes("marble")
  ? pass(`URL 预设生效: "${presetVal.slice(0, 40)}..."`)
  : fail(`预设未生效，当前值: "${presetVal}"`);

console.log("\n[5] 其余页面 HTTP 与 SSR");
for (const p of [
  "/",
  "/tools/seamless-texture-generator",
  "/tools/pbr-texture-generator",
  "/tools/photo-to-texture",
  "/guides",
  "/guides/pbr-texture-workflow",
  "/pricing",
  "/about",
  "/privacy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt",
]) {
  const r = await fetch(BASE + p);
  const body = await r.text();
  const hasH1 = /<h1[^>]*>/.test(body);
  const ok = r.status === 200 && (p.endsWith(".xml") || p.endsWith(".txt") || hasH1);
  ok
    ? pass(`${r.status} ${p}${hasH1 ? " (含 H1)" : ""}`)
    : fail(`${r.status} ${p}`);
}

console.log("\n[6] 控制台错误检查");
const errs = cdp.events.filter(
  (e) => e.method === "Log.entryAdded" && e.params.entry.level === "error",
);
const realErrs = errs.filter((e) => !/favicon|DevTools/i.test(e.params.entry.text));
realErrs.length === 0
  ? pass("无控制台错误")
  : fail("控制台错误: " + realErrs.map((e) => e.params.entry.text).join(" | ").slice(0, 300));

ws.close();
chrome.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch {}

console.log("\n" + "=".repeat(60));
console.log(failures.length === 0 ? "E2E 全部通过 ✅" : `${failures.length} 项失败 ❌`);
console.log("截图目录: " + shotDir);
process.exit(failures.length === 0 ? 0 : 1);
