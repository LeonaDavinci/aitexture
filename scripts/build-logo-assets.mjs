/**
 * 生成站点 logo 资源。
 *
 * 1. 从用户提供的纹理图裁出一块无水印区域，生成站点 logo PNG
 *    （512x512 方形，透明圆角由 CSS 负责）
 * 2. 把平台 SVG logo 转成透明背景 PNG（256x256）
 *
 * 用法： node scripts/build-logo-assets.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const logoDir = join(publicDir, "logos");
mkdirSync(logoDir, { recursive: true });

/** 用户提供的纹理图（带 3D66.COM 水印，需裁掉） */
const TEXTURE_SRC =
  process.env.TEXTURE_SRC ||
  "C:/Users/wangj/.workbuddy/clipboard-images/clipboard-2026-11-04T14-55-50-970Z-2ede1c0f.jpg";

/**
 * 无水印的裁剪区域。
 * 原图 1290x1309，水印呈网格分布（约 y=30 / 505 / 1020 三行）。
 * 该区域经边缘能量检测确认最平滑，放大后无任何水印残留。
 */
const CROP = { left: 430, top: 654, width: 420, height: 420 };

async function buildSiteLogo() {
  const out = [];

  // 512x512 主 logo
  const main = await sharp(TEXTURE_SRC)
    .extract(CROP)
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(publicDir, "logo.png"), main);
  out.push(["public/logo.png", main.length, "512x512 site logo"]);

  // 180x180 apple-touch-icon
  const apple = await sharp(TEXTURE_SRC)
    .extract(CROP)
    .resize(180, 180, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(publicDir, "apple-touch-icon.png"), apple);
  out.push(["public/apple-touch-icon.png", apple.length, "180x180 apple touch icon"]);

  // 32x32 favicon
  const fav = await sharp(TEXTURE_SRC)
    .extract(CROP)
    .resize(32, 32, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(publicDir, "favicon.png"), fav);
  out.push(["public/favicon.png", fav.length, "32x32 favicon"]);

  return out;
}

/** SVG -> 透明背景 PNG，统一缩放到 256x256 并保留长宽比 */
async function svgToPng(svgRel, outName, size = 256) {
  const svg = readFileSync(join(root, svgRel));
  const png = await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(logoDir, outName), png);
  return [join("public/logos", outName), png.length, `${size}x${size} transparent PNG`];
}

const results = [];
results.push(...(await buildSiteLogo()));
results.push(await svgToPng("public/logos/roblox-icon.svg", "roblox-icon.png"));
results.push(await svgToPng("public/logos/blender.svg", "blender.png"));

console.log("Generated:");
for (const [p, size, note] of results) {
  console.log(`  ${p.padEnd(38)} ${String(size).padStart(7)} bytes  ${note}`);
}
