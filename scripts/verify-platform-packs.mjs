/**
 * 验证平台导出包的实际像素结构：
 * - Roblox MetalnessMap : R = 金属度, G = 反射率
 * - Unreal Mask Map     : R = AO, G = Roughness, B = 金属度
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
      this.width = a; this.height = b;
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    } else { this.data = a; this.width = b; this.height = c; }
  }
};

const { generateTexture, heightToAO, heightToRoughness, heightToMetalness, packRobloxMetalness, packUnrealMask } =
  await import(pathToFileURL(join(tmp, "texture-engine.mjs")).href);

const SIZE = 64;
let failed = 0;

console.log("=".repeat(74));
console.log("平台导出包结构验证");
console.log("=".repeat(74));

/* ---------- Roblox ---------- */
console.log("\n[Roblox] MetalnessMap  R=金属度  G=反射率");
for (const [label, prompt, expectMetal] of [
  ["非金属 wood", "oak wood planks with visible grain", false],
  ["金属 metal", "brushed steel metal plate", true],
]) {
  const tex = generateTexture(prompt, SIZE, 777);
  const metal = heightToMetalness(tex.height, SIZE, tex.recipe.metallic);
  const packed = packRobloxMetalness(metal, tex.height, SIZE);

  let rSum = 0, gSum = 0, n = SIZE * SIZE;
  for (let i = 0; i < n; i++) {
    rSum += packed.data[i * 4];
    gSum += packed.data[i * 4 + 1];
  }
  const rAvg = rSum / n;
  const gAvg = gSum / n;

  // 非金属区 G 应约 0.5（128），金属区 G 应约 0.7（179）
  const gOk = expectMetal ? Math.abs(gAvg - 179) < 12 : Math.abs(gAvg - 128) < 12;
  // 金属度：非金属应接近 0，金属应显著大于 0
  const rOk = expectMetal ? rAvg > 120 : rAvg < 20;

  const ok = gOk && rOk && tex.recipe.metallic === expectMetal;
  if (!ok) failed++;
  console.log(
    `  ${label.padEnd(18)} R平均=${rAvg.toFixed(1).padStart(6)}  G平均=${gAvg.toFixed(1).padStart(6)}  ` +
    `预期金属=${expectMetal ? "是" : "否"}  ${ok ? "PASS" : "FAIL"}`
  );
}

/* ---------- Unreal ---------- */
console.log("\n[Unreal] Mask Map  R=AO  G=Roughness  B=Metallic");
{
  const tex = generateTexture("brushed steel metal plate", SIZE, 555);
  const ao = heightToAO(tex.height, SIZE);
  const rough = heightToRoughness(tex.height, SIZE, tex.recipe.roughness);
  const metal = heightToMetalness(tex.height, SIZE, tex.recipe.metallic);
  const mask = packUnrealMask(ao, rough, metal, SIZE);

  // 逐像素验证 mask 的三个通道与源图一致
  let maxDiff = 0;
  for (let i = 0; i < SIZE * SIZE; i++) {
    maxDiff = Math.max(
      maxDiff,
      Math.abs(mask.data[i * 4] - ao.data[i * 4]),
      Math.abs(mask.data[i * 4 + 1] - rough.data[i * 4]),
      Math.abs(mask.data[i * 4 + 2] - metal.data[i * 4]),
    );
  }
  // AO 通道应在中间区间，粗糙度随材质变化，金属度应显著
  let bAvg = 0;
  for (let i = 0; i < SIZE * SIZE; i++) bAvg += mask.data[i * 4 + 2];
  bAvg /= SIZE * SIZE;

  const ok = maxDiff === 0 && bAvg > 100;
  if (!ok) failed++;
  console.log(
    `  通道一致性         最大偏差=${maxDiff}（应为 0）  B金属度平均=${bAvg.toFixed(1)}  ${ok ? "PASS" : "FAIL"}`
  );
}

/* ---------- 通用金属度判定 ---------- */
console.log("\n[通用] 材质金属度判定");
for (const [prompt, expect] of [
  ["brushed steel metal plate", true],
  ["rusted metal sheet oxidized", true],
  ["carbon fiber weave", true],
  ["raw concrete wall subtle pores", false],
  ["oak wood planks visible grain", false],
  ["woven linen fabric textile weave", false],
  ["polished white marble with grey veins", false],
]) {
  const tex = generateTexture(prompt, SIZE, 321);
  const ok = tex.recipe.metallic === expect;
  if (!ok) failed++;
  console.log(
    `  ${prompt.slice(0, 38).padEnd(40)} metallic=${String(tex.recipe.metallic).padEnd(6)} ${ok ? "PASS" : "FAIL"}`
  );
}

console.log("\n" + "=".repeat(74));
console.log(failed === 0 ? "导出包结构验证全部通过 ✅" : `${failed} 项失败 ❌`);

rmSync(tmp, { recursive: true, force: true });
process.exit(failed === 0 ? 0 : 1);
