/**
 * SEO 校验：遍历全部路由，检查标题/描述/canonical/H1/OG/schema/重定向/内链。
 * 用法： node scripts/seo-check.mjs [baseUrl]
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || "http://127.0.0.1:3111";

const ROUTES = [
  "/",
  "/ai-texture-generator",
  "/seamless-texture-generator",
  "/pbr-texture-generator",
  "/roblox-texture-generator",
  "/blender-texture-generator",
  "/unreal-engine-texture-generator",
  "/unity-texture-generator",
  "/wood-texture-generator",
  "/concrete-texture-generator",
  "/fabric-texture-generator",
  "/stone-texture-generator",
  "/photo-to-texture",
  "/guides",
  "/guides/what-is-a-tileable-texture",
  "/guides/pbr-texture-workflow",
  "/guides/texture-for-unity-unreal-blender",
  "/guides/texture-repetition-and-tiling-artifacts",
  "/pricing",
  "/about",
  "/privacy",
  "/terms",
];

const issues = [];
const note = (route, level, msg) => {
  issues.push({ route, level, msg });
  const icon = level === "ERROR" ? "✗" : level === "WARN" ? "!" : "·";
  console.log(`  ${icon} [${level}] ${msg}`);
};

console.log("=".repeat(78));
console.log("SEO 校验 · " + BASE);
console.log("=".repeat(78));

let titleMin = 999;
let descMin = 999;

for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  const html = await res.text();
  console.log(`\n${route}`);

  if (res.status !== 200) {
    note(route, "ERROR", `HTTP ${res.status}`);
    continue;
  }

  // title
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/);
  const title = t ? t[1].trim() : "";
  if (!title) note(route, "ERROR", "缺少 title");
  else {
    titleMin = Math.min(titleMin, title.length);
    if (title.length < 25) note(route, "WARN", `title 偏短 (${title.length}): ${title}`);
    else if (title.length > 65) note(route, "WARN", `title 偏长 (${title.length})`);
    else console.log(`  · title ${title.length} 字符`);
  }

  // description
  const d = html.match(/<meta name="description" content="([^"]*)"/);
  const desc = d ? d[1] : "";
  if (!desc) note(route, "ERROR", "缺少 meta description");
  else {
    descMin = Math.min(descMin, desc.length);
    if (desc.length < 70) note(route, "WARN", `description 偏短 (${desc.length})`);
    else if (desc.length > 175) note(route, "WARN", `description 偏长 (${desc.length})`);
    else console.log(`  · description ${desc.length} 字符`);
  }

  // canonical
  const c = html.match(/<link rel="canonical" href="([^"]*)"/);
  if (!c) note(route, "ERROR", "缺少 canonical");
  else {
    const expected = `https://www.aitexture.app${route === "/" ? "" : route}`;
    if (c[1] !== expected) note(route, "ERROR", `canonical 不匹配: ${c[1]} (期望 ${expected})`);
    else console.log(`  · canonical ✓`);
  }

  // H1 唯一性
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1s.length === 0) note(route, "ERROR", "缺少 H1");
  else if (h1s.length > 1) note(route, "ERROR", `H1 不唯一 (${h1s.length} 个)`);
  else {
    const text = h1s[0][1].replace(/<[^>]+>/g, "").trim();
    console.log(`  · H1 唯一: "${text.slice(0, 55)}"`);
  }

  // OG / Twitter
  if (!/<meta property="og:image"/.test(html)) note(route, "ERROR", "缺少 og:image");
  if (!/<meta property="og:title"/.test(html)) note(route, "ERROR", "缺少 og:title");
  if (!/<meta name="twitter:card"/.test(html)) note(route, "ERROR", "缺少 twitter:card");
  if (!/<meta name="twitter:image"/.test(html)) note(route, "WARN", "缺少 twitter:image");

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) note(route, "WARN", "无 JSON-LD");
  else {
    const types = [];
    for (const b of blocks) {
      try {
        const j = JSON.parse(b[1]);
        if (j["@graph"]) types.push(...j["@graph"].map((x) => x["@type"]));
        else types.push(j["@type"]);
      } catch {
        note(route, "ERROR", "JSON-LD 解析失败");
      }
    }
    console.log(`  · JSON-LD: ${types.join(", ")}`);
  }

  // 内部链接
  const links = [...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
  const internal = [...new Set(links.filter((l) => !l.startsWith("/_next")))];
  if (internal.length < 3) note(route, "WARN", `内部链接偏少 (${internal.length})`);
  else console.log(`  · 内部链接 ${internal.length} 个`);

  // 图片 alt
  const imgs = [...html.matchAll(/<img[^>]*>/g)];
  const noAlt = imgs.filter((m) => !/alt=/.test(m[0]));
  if (noAlt.length) note(route, "WARN", `${noAlt.length} 个 img 缺 alt`);
}

console.log("\n" + "=".repeat(78));
console.log("重定向检查");
console.log("=".repeat(78));
for (const [from, to] of [
  ["/tools/ai-texture-generator", "/ai-texture-generator"],
  ["/tools/seamless-texture-generator", "/seamless-texture-generator"],
  ["/tools/pbr-texture-generator", "/pbr-texture-generator"],
  ["/tools/photo-to-texture", "/photo-to-texture"],
]) {
  const r = await fetch(BASE + from, { redirect: "manual" });
  const loc = r.headers.get("location");
  const ok = r.status === 301 && loc === to;
  console.log(`  ${ok ? "✓" : "✗"} ${from} -> ${r.status} ${loc}`);
  if (!ok) issues.push({ route: from, level: "ERROR", msg: `重定向异常: ${r.status} ${loc}` });
}

console.log("\n" + "=".repeat(78));
console.log("sitemap 检查");
console.log("=".repeat(78));
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const urls = [...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
console.log(`  · sitemap 含 ${urls.length} 个 URL`);
const missing = ROUTES.filter((r) => r !== "/" && !urls.some((u) => u.endsWith(r)));
if (missing.length) note("sitemap", "ERROR", `缺少路由: ${missing.join(", ")}`);
else console.log("  · 全部主要路由已收录");

console.log("\n" + "=".repeat(78));
console.log("robots 检查");
console.log("=".repeat(78));
const rb = await (await fetch(BASE + "/robots.txt")).text();
console.log("  · " + rb.split("\n").filter(Boolean).join("\n  · "));
if (!/Sitemap:/i.test(rb)) note("robots", "WARN", "未声明 Sitemap");

const errors = issues.filter((i) => i.level === "ERROR");
const warns = issues.filter((i) => i.level === "WARN");
console.log("\n" + "=".repeat(78));
console.log(
  errors.length === 0
    ? `结论：无错误，${warns.length} 条提示 ✅`
    : `结论：${errors.length} 个错误，${warns.length} 条提示 ❌`,
);
console.log(
  `title 最短 ${titleMin} 字符 / description 最短 ${descMin} 字符`,
);
process.exit(errors.length === 0 ? 0 : 1);
