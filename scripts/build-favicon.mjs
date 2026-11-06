/**
 * Generate public/favicon.ico from public/logo.png.
 *
 * Each ICO entry embeds a PNG image (PNG-in-ICO is supported by Windows Vista+
 * and every modern browser), so no native image codec / extra dependency is needed.
 *
 * Usage: node scripts/build-favicon.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = join(root, "public", "logo.png");
const OUT = join(root, "public", "favicon.ico");
const SIZES = [16, 32, 48, 64, 128, 256];

const logo = readFileSync(LOGO);
const images = await Promise.all(
  SIZES.map(async (size) => ({
    size,
    png: await sharp(logo)
      .resize(size, size, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  })),
);

// ICONDIR: reserved(0), type(1 = icon), count
const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0);
dir.writeUInt16LE(1, 2);
dir.writeUInt16LE(images.length, 4);

// ICONDIRENTRY (16 bytes each): size, palette, planes, bpp, bytes, offset
const entries = Buffer.alloc(16 * images.length);
let offset = dir.length + entries.length;
images.forEach((img, i) => {
  const p = i * 16;
  const dimension = img.size >= 256 ? 0 : img.size; // 0 encodes 256
  entries.writeUInt8(dimension, p);
  entries.writeUInt8(dimension, p + 1);
  entries.writeUInt8(0, p + 2); // bColorCount
  entries.writeUInt8(0, p + 3); // bReserved
  entries.writeUInt16LE(1, p + 4); // wPlanes
  entries.writeUInt16LE(32, p + 6); // wBitCount
  entries.writeUInt32LE(img.png.length, p + 8); // dwBytesInRes
  entries.writeUInt32LE(offset, p + 12); // dwImageOffset
  offset += img.png.length;
});

const ico = Buffer.concat([dir, entries, ...images.map((img) => img.png)]);
writeFileSync(OUT, ico);

// Read back and verify the container before reporting success.
const check = readFileSync(OUT);
if (check.readUInt16LE(2) !== 1 || check.readUInt16LE(4) !== SIZES.length) {
  throw new Error("ICO header mismatch");
}
for (let i = 0; i < SIZES.length; i++) {
  const p = 6 + i * 16;
  const at = check.readUInt32LE(p + 12);
  if (check.subarray(at, at + 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error(`ICO entry ${SIZES[i]}px is not a PNG`);
  }
}

// Small contact sheet so the generated icon is easy to eyeball.
const previewDir = join(root, ".preview");
mkdirSync(previewDir, { recursive: true });
const W = 720;
const H = 190;
const previewSizes = [16, 32, 48, 64, 128];
const background = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 245, g: 247, b: 251, alpha: 1 } },
})
  .png()
  .toBuffer();
const layers = previewSizes.map((size, i) => {
  const png = images.find((img) => img.size === size).png;
  return {
    input: png,
    left: Math.round(72 + i * 144 - size / 2),
    top: Math.round(88 - size / 2),
  };
});
const labels = previewSizes
  .map(
    (size, i) =>
      `<text x="${72 + i * 144}" y="162" font-family="Arial, sans-serif" font-size="13" fill="#35486a" text-anchor="middle">${size}px</text>`,
  )
  .join("");
const labelLayer = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${labels}</svg>`,
  ),
)
  .png()
  .toBuffer();
layers.push({ input: labelLayer, left: 0, top: 0 });
writeFileSync(
  join(previewDir, "favicon-preview.png"),
  await sharp(background).composite(layers).png().toBuffer(),
);

console.log(`public/favicon.ico  ${ico.length} bytes`);
for (const img of images) {
  console.log(`  ${String(img.size).padStart(3)}x${String(img.size).padEnd(3)} ${String(img.png.length).padStart(7)} bytes`);
}
console.log(".preview/favicon-preview.png  (contact sheet)");
