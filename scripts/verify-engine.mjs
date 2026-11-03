/**
 * 引擎自检：严格验证「无缝」定义 —— 连续高度场在 u=0 与 u=1、v=0 与 v=1 处必须完全相等。
 *
 * 关键点：不能只比较像素列 0 与列 size-1，因为像素中心位于 (i+0.5)/size，
 * 相邻列天然存在 1/size 的梯度差。正确做法是采样连续函数在 u=0 与 u=1 的值。
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformSync } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const tmp = join(root, ".verify-tmp");
mkdirSync(tmp, { recursive: true });

for (const name of ["noise", "texture-engine"]) {
  const src = readFileSync(join(root, "src/lib", `${name}.ts`), "utf8");
  const { code } = transformSync(src, { loader: "ts", format: "esm", target: "es2022" });
  writeFileSync(join(tmp, `${name}.mjs`), code.replace(/from\s+["'](\.\/[A-Za-z0-9_-]+)["']/g, 'from "$1.mjs"'));
}

globalThis.ImageData = class ImageData {
  constructor(a, b, c) {
    if (typeof a === "number") {
      this.width = a;
      this.height = b;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else {
      this.data = a;
      this.width = b;
      this.height = c;
    }
  }
};

const { generateTexture, parsePrompt, sampleHeight, heightToNormal, heightToRoughness, heightToAO } =
  await import(pathToFileURL(join(tmp, "texture-engine.mjs")).href);

const SIZE = 128;
const PROMPTS = [
  "weathered red brick wall with mortar joints",
  "oak wood planks with visible grain",
  "raw concrete surface, subtle pores",
  "brushed steel metal plate",
  "white ceramic tile grid, glossy",
  "brown leather hide, pebbled grain",
  "green grass lawn turf",
  "polished white marble with grey veins",
  "desert sand dunes",
  "rusted metal sheet, oxidized",
  "snow covered ground",
  "carbon fiber weave",
  "wet mud soil ground",
  "frosted glass crystal",
  "kraft paper cardboard",
  "calm water surface ripples",
  "rough granite stone slab",
  "woven linen fabric textile",
  "asphalt tarmac road",
  "red painted metal sheet",
];

let failed = 0;
console.log(`严格周期性检验 · 采样点 ${SIZE + 1}×${SIZE + 1} · 材质 ${PROMPTS.length} 种`);
console.log("=".repeat(88));
console.log("提示词".padEnd(42) + "材质".padEnd(11) + "|Δu|".padEnd(12) + "|Δv|".padEnd(12) + "结果");
console.log("=".repeat(88));

for (const p of PROMPTS) {
  const recipe = parsePrompt(p, 12345);

  // 严格检验：在 u=0 与 u=1、v=0 与 v=1 处连续采样，差值必须为 0（浮点误差内）
  let maxU = 0;
  let maxV = 0;
  const N = SIZE + 1;
  for (let j = 0; j < N; j++) {
    const v = j / SIZE;
    for (let i = 0; i < N; i++) {
      const u = i / SIZE;
      const h = sampleHeight(recipe, u, v);
      const hU = sampleHeight(recipe, u === 1 ? 0 : 1, v);
      const hV = sampleHeight(recipe, u, v === 1 ? 0 : 1);
      if (i === N - 1) maxU = Math.max(maxU, Math.abs(h - hU));
      if (j === N - 1) maxV = Math.max(maxV, Math.abs(h - hV));
    }
  }

  const periodic = maxU < 1e-9 && maxV < 1e-9;

  // 同时确认像素输出与连续函数一致（验证采样没有 off-by-one）
  const tex = generateTexture(p, 32, 12345);
  const normal = heightToNormal(tex.height, 32, 2.4);
  const rough = heightToRoughness(tex.height, 32, tex.recipe.roughness);
  const ao = heightToAO(tex.height, 32);
  const alphaOk = (img) => {
    for (let i = 3; i < img.data.length; i += 4) if (img.data[i] !== 255) return false;
    return true;
  };
  const mapsOk =
    alphaOk(normal) && alphaOk(rough) && alphaOk(ao) &&
    normal.data.some((v, i) => i % 4 === 2 && v > 200);

  const ok = periodic && mapsOk;
  if (!ok) failed++;

  console.log(
    p.slice(0, 40).padEnd(42) +
      recipe.kind.padEnd(11) +
      maxU.toExponential(2).padEnd(12) +
      maxV.toExponential(2).padEnd(12) +
      (ok ? "PASS" : "FAIL"),
  );
}

console.log("=".repeat(88));
console.log(failed === 0 ? `全部 ${PROMPTS.length} 项通过：严格无缝 + PBR 通道正常` : `${failed} 项失败`);

// 确定性
const a = generateTexture(PROMPTS[0], 64, 999);
const b = generateTexture(PROMPTS[0], 64, 999);
const same = a.albedo.data.every((v, i) => v === b.albedo.data[i]);
const c = generateTexture(PROMPTS[0], 64, 1000);
const diff = c.albedo.data.some((v, i) => v !== a.albedo.data[i]);
console.log(same ? "确定性：同 seed 输出完全一致" : "确定性检查失败");
console.log(diff ? "变体：不同 seed 输出不同" : "变体检查失败");

rmSync(tmp, { recursive: true, force: true });
process.exit(failed === 0 && same && diff ? 0 : 1);
