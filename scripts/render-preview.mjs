/**
 * 渲染实际纹理为 PNG，用于肉眼验收材质效果与平铺表现。
 * 输出：.preview/out/<材质>.png（单图） 与 .preview/out/tiles-<材质>.png（2x2 平铺）
 * 运行： node scripts/render-preview.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformSync } from "esbuild";
import { deflateSync } from "node:zlib";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const tmp = join(root, ".verify-tmp");
const outDir = join(root, ".preview", "out");
mkdirSync(tmp, { recursive: true });
mkdirSync(outDir, { recursive: true });

for (const name of ["noise", "texture-engine"]) {
  const src = readFileSync(join(root, "src/lib", `${name}.ts`), "utf8");
  const { code } = transformSync(src, { loader: "ts", format: "esm", target: "es2022" });
  writeFileSync(join(tmp, `${name}.mjs`), code.replace(/from\s+["'](\.\/[A-Za-z0-9_-]+)["']/g, 'from "$1.mjs"'));
}

globalThis.ImageData = class ImageData {
  constructor(a, b, c) {
    if (typeof a === "number") {
      this.width = a; this.height = b;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else { this.data = a; this.width = b; this.height = c; }
  }
};

const { generateTexture, heightToNormal, heightToRoughness, heightToAO } =
  await import(pathToFileURL(join(tmp, "texture-engine.mjs")).href);

/* --- 极简 PNG 编码器（RGBA，无滤波） --- */
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = c ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(rgba, w, h) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.buffer ?? rgba, rgba.byteOffset ?? 0, rgba.length)
      .copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** 把 ImageData 平铺 n×n 拼接 */
function tile(img, n) {
  const { width: w, height: h, data } = img;
  const W = w * n, H = h * n;
  const out = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    const sy = y % h;
    for (let x = 0; x < W; x++) {
      const sx = x % w;
      const s = (sy * w + sx) * 4, d = (y * W + x) * 4;
      out[d] = data[s]; out[d + 1] = data[s + 1]; out[d + 2] = data[s + 2]; out[d + 3] = 255;
    }
  }
  return { data: out, width: W, height: H };
}

const CASES = [
  ["brick", "weathered red brick wall with mortar joints"],
  ["wood", "oak wood planks with visible grain"],
  ["concrete", "raw concrete surface, subtle pores"],
  ["metal", "brushed steel metal plate"],
  ["stone", "rough granite stone slab"],
  ["fabric", "woven linen fabric textile"],
  ["marble", "polished white marble with grey veins"],
  ["rust", "rusted metal sheet oxidized"],
  ["tile", "white ceramic tile grid glossy"],
  ["grass", "green grass lawn turf"],
  ["leather", "brown leather hide pebbled grain"],
  ["sand", "desert sand dunes"],
  ["snow", "snow covered ground"],
  ["carbon", "carbon fiber weave"],
  ["mud", "wet mud soil ground"],
  ["water", "calm water surface ripples"],
  ["asphalt", "asphalt tarmac road"],
  ["paper", "kraft paper cardboard"],
  ["glass", "frosted glass crystal"],
];

const SIZE = 256;
const files = [];

for (const [name, prompt] of CASES) {
  const tex = generateTexture(prompt, SIZE, 424242);

  const single = join(outDir, `${name}.png`);
  writeFileSync(single, encodePNG(tex.albedo.data, SIZE, SIZE));
  files.push(single);

  const tiled = tile(tex.albedo, 2);
  const tp = join(outDir, `tiles-${name}.png`);
  writeFileSync(tp, encodePNG(tiled.data, tiled.width, tiled.height));
  files.push(tp);

  // 法线图也存一张，肉眼检查 PBR 派生
  const nrm = heightToNormal(tex.height, SIZE, 2.4);
  const np = join(outDir, `normal-${name}.png`);
  writeFileSync(np, encodePNG(nrm.data, SIZE, SIZE));
  files.push(np);
}

console.log(`已输出 ${files.length} 张预览图到：${outDir}`);
for (const f of files.slice(0, 6)) console.log("  " + f.replace(root, "."));
console.log("  ...");

rmSync(tmp, { recursive: true, force: true });
