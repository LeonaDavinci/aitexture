/**
 * 材质生成引擎：把自然语言提示词解析成材质配方，程序化生成可平铺的 albedo + height。
 *
 * 设计目标：
 * 1. 完全在浏览器端运行，零上传、零 API 成本；
 * 2. 输出严格无缝 —— 所有高度函数只使用「归一化瓦片坐标 + 整数频率」，
 *    因此 f(0,v) ≡ f(1,v)，边缘天然闭合；
 * 3. 同一配方 + 同一种子 => 稳定复现，可分享 seed。
 */

import {
  clamp01,
  fbmTiled,
  hash2,
  hexToRgb,
  mix,
  mixRgb,
  ridgedTiled,
  smoothMix,
  stripesTiled,
  valueNoiseTiled,
  worleyTiled,
  type RGB,
  type Seed,
} from "./noise";

export type MaterialKind =
  | "wood"
  | "brick"
  | "concrete"
  | "stone"
  | "fabric"
  | "leather"
  | "marble"
  | "metal"
  | "rust"
  | "tile"
  | "asphalt"
  | "sand"
  | "snow"
  | "grass"
  | "mud"
  | "glass"
  | "carbon"
  | "paper"
  | "water";

export interface MaterialRecipe {
  kind: MaterialKind;
  base: RGB;
  accent: RGB;
  /** 尺度倍率：作用于频率，值越大细节越密 */
  scale: number;
  /** 0-1，表面粗糙程度 */
  roughness: number;
  /** 0-1，缝隙/裂纹强度 */
  gap: number;
  /** 0-1，细节层级强度 */
  detail: number;
  /** 是否为金属材质（决定金属度通道） */
  metallic: boolean;
  seed: Seed;
}

export interface TextureResult {
  albedo: ImageData;
  height: Float32Array;
  size: number;
  recipe: MaterialRecipe;
}

const MATERIAL_DEFAULTS: Record<
  MaterialKind,
  {
    base: string;
    accent: string;
    scale: number;
    roughness: number;
    gap: number;
    detail: number;
    metallic: boolean;
  }
> = {
  wood: { base: "#8b5a2b", accent: "#5a3418", scale: 1, roughness: 0.62, gap: 0.35, detail: 0.6, metallic: false },
  brick: { base: "#a4472c", accent: "#d9cfc0", scale: 1, roughness: 0.8, gap: 0.85, detail: 0.55, metallic: false },
  concrete: { base: "#9a9a97", accent: "#6d6d6a", scale: 1, roughness: 0.85, gap: 0.15, detail: 0.5, metallic: false },
  stone: { base: "#8d8a83", accent: "#4f4d48", scale: 1, roughness: 0.78, gap: 0.45, detail: 0.7, metallic: false },
  fabric: { base: "#c8b9a3", accent: "#8a7a63", scale: 1, roughness: 0.9, gap: 0.3, detail: 0.45, metallic: false },
  leather: { base: "#7a4a2e", accent: "#3d2415", scale: 1, roughness: 0.6, gap: 0.5, detail: 0.7, metallic: false },
  marble: { base: "#efeeea", accent: "#8a8b8f", scale: 1, roughness: 0.25, gap: 0.1, detail: 0.35, metallic: false },
  metal: { base: "#a9adb4", accent: "#6a6f77", scale: 1, roughness: 0.35, gap: 0.08, detail: 0.5, metallic: true },
  rust: { base: "#8c4a21", accent: "#3a2417", scale: 1, roughness: 0.88, gap: 0.45, detail: 0.75, metallic: true },
  tile: { base: "#e8e6e1", accent: "#b9b4ab", scale: 1, roughness: 0.2, gap: 0.8, detail: 0.25, metallic: false },
  asphalt: { base: "#3a3a3c", accent: "#1c1c1e", scale: 1, roughness: 0.92, gap: 0.25, detail: 0.8, metallic: false },
  sand: { base: "#d9c39a", accent: "#b39a6e", scale: 1, roughness: 0.9, gap: 0.12, detail: 0.45, metallic: false },
  snow: { base: "#f4f8ff", accent: "#d3dff0", scale: 1, roughness: 0.55, gap: 0.1, detail: 0.4, metallic: false },
  grass: { base: "#4f7f36", accent: "#2d4a20", scale: 1, roughness: 0.88, gap: 0.3, detail: 0.85, metallic: false },
  mud: { base: "#5b4326", accent: "#33240f", scale: 1, roughness: 0.85, gap: 0.3, detail: 0.6, metallic: false },
  glass: { base: "#cfe6f2", accent: "#8fb6c9", scale: 1, roughness: 0.08, gap: 0.05, detail: 0.2, metallic: false },
  carbon: { base: "#22262c", accent: "#0d1014", scale: 1, roughness: 0.32, gap: 0.2, detail: 0.6, metallic: true },
  paper: { base: "#f3f0e6", accent: "#d8d2c2", scale: 1, roughness: 0.9, gap: 0.1, detail: 0.35, metallic: false },
  water: { base: "#2f6f8f", accent: "#173f57", scale: 1, roughness: 0.15, gap: 0.05, detail: 0.4, metallic: false },
};

const KIND_KEYWORDS: Array<[MaterialKind, string[]]> = [
  ["wood", ["wood", "timber", "plank", "floorboard", "oak", "pine", "walnut", "bamboo", "wooden", "木板", "木材", "木纹"]],
  ["brick", ["brick", "masonry", "wall brick", "red brick", "砖", "砖块", "红砖"]],
  ["concrete", ["concrete", "cement", "brutalist", "raw concrete", "水泥", "混凝土"]],
  ["stone", ["stone", "rock", "granite", "marble slab", "slate", "cobble", "岩石", "石头", "花岗岩"]],
  ["fabric", ["fabric", "cloth", "textile", "canvas", "linen", "cotton", "wool", "silk", "fabric weave", "布料", "织物", "棉麻"]],
  ["leather", ["leather", "hide", "suede", "皮革"]],
  ["marble", ["marble", "veined marble", "carrara", "大理石"]],
  ["metal", ["metal", "steel", "aluminium", "aluminum", "brushed", "chrome", "copper", "金属", "钢", "拉丝"]],
  ["rust", ["rust", "rusty", "corroded", "oxidized", "锈", "生锈"]],
  ["tile", ["tile", "tiles", "ceramic", "mosaic", "tiled", "瓷砖", "马赛克"]],
  ["asphalt", ["asphalt", "tarmac", "road", "bitumen", "沥青"]],
  ["sand", ["sand", "desert", "dune", "beach", "沙", "沙漠"]],
  ["snow", ["snow", "ice", "frost", "frozen", "雪", "冰"]],
  ["grass", ["grass", "lawn", "meadow", "moss", "turf", "草地", "苔藓"]],
  ["mud", ["mud", "dirt", "soil", "earth", "clay", "泥", "泥土"]],
  ["glass", ["glass", "crystal", "frosted glass", "玻璃"]],
  ["carbon", ["carbon fiber", "carbon-fibre", "carbon", "碳纤维"]],
  ["paper", ["paper", "cardboard", "kraft", "纸", "牛皮纸"]],
  ["water", ["water", "liquid", "caustics", "水"]],
];

const COLOR_KEYWORDS: Array<[string, string]> = [
  ["red", "#a83c2a"], ["crimson", "#8f2233"], ["maroon", "#6d2733"],
  ["orange", "#c9682a"], ["amber", "#c58a2a"], ["yellow", "#d4b13f"],
  ["olive", "#6d7038"], ["green", "#4a7a3c"], ["emerald", "#1f7a55"], ["mint", "#7cc6a5"],
  ["teal", "#2f7a7a"], ["cyan", "#3d8fa8"], ["blue", "#33558f"], ["navy", "#233a63"],
  ["purple", "#5c3f7a"], ["violet", "#6a4a94"], ["magenta", "#8f3560"], ["pink", "#cf8fa0"],
  ["brown", "#7a5230"], ["tan", "#b08b5e"], ["beige", "#cdb898"], ["cream", "#e8dcc2"],
  ["grey", "#8b8d90"], ["gray", "#8b8d90"], ["silver", "#c3c7cc"], ["charcoal", "#3a3d42"],
  ["black", "#1c1c1e"], ["white", "#eceae4"], ["gold", "#b8912f"], ["bronze", "#8a5f2b"],
];

const FINISH_KEYWORDS: Array<
  [string, Partial<Pick<MaterialRecipe, "roughness" | "detail" | "gap" | "scale">>]
> = [
  ["glossy", { roughness: 0.15 }], ["polished", { roughness: 0.12 }],
  ["mirror", { roughness: 0.08 }], ["matte", { roughness: 0.92 }],
  ["rough", { roughness: 0.95 }], ["weathered", { roughness: 0.88, detail: 0.85, gap: 0.5 }],
  ["worn", { roughness: 0.85, detail: 0.8 }], ["old", { roughness: 0.85, detail: 0.8 }],
  ["cracked", { gap: 0.9, detail: 0.9 }], ["crumble", { gap: 0.85 }],
  ["fine", { scale: 2.2 }], ["coarse", { scale: 0.6 }], ["chunky", { scale: 0.55 }],
  ["detailed", { detail: 0.9 }],
];

/** 从提示词解析出材质配方 */
export function parsePrompt(prompt: string, seed: Seed = 1): MaterialRecipe {
  const p = prompt.toLowerCase();

  let kind: MaterialKind | null = null;
  let best = 0;
  for (const [k, words] of KIND_KEYWORDS) {
    for (const w of words) {
      if (p.includes(w) && w.length > best) {
        best = w.length;
        kind = k;
      }
    }
  }
  if (!kind) kind = "concrete";

  const d = MATERIAL_DEFAULTS[kind];

  let base = hexToRgb(d.base);
  const accent = hexToRgb(d.accent);

  for (const [word, hex] of COLOR_KEYWORDS) {
    if (new RegExp(`\\b${word}\\b`).test(p)) {
      base = hexToRgb(hex);
      break;
    }
  }
  // 主色命中后，副色做明暗派生，避免不协调的撞色
  const lum = base[0] * 0.299 + base[1] * 0.587 + base[2] * 0.114;
  const derivedAccent = lum > 0.55 ? mixRgb(base, [0, 0, 0], 0.45) : mixRgb(base, [1, 1, 1], 0.28);

  const recipe: MaterialRecipe = {
    kind,
    base,
    accent: derivedAccent,
    scale: d.scale,
    roughness: d.roughness,
    gap: d.gap,
    detail: d.detail,
    metallic: d.metallic,
    seed: seed >>> 0,
  };

  for (const [word, patch] of FINISH_KEYWORDS) {
    if (p.includes(word)) Object.assign(recipe, patch);
  }

  // 提示词里的像素数隐含分辨率意图（粗糙大块 vs 细腻）
  const fine = p.match(/\b(\d{2,4})\s?(px|pixel)\b/);
  if (fine) {
    const px = parseInt(fine[1], 10);
    recipe.scale = clamp01(px / 1024) * 1.4 + 0.4;
  }

  return recipe;
}

/* ------------------------------------------------------------------ */
/* 材质高度函数                                                          */
/*                                                                     */
/* 约定：u/v 为归一化瓦片坐标 [0,1)；各向异性用 freqX/freqY 分离表达。   */
/* 每个函数必须满足 f(0,v) === f(1,v) 且 f(u,0) === f(u,1)。            */
/* ------------------------------------------------------------------ */

type HeightFn = (u: number, v: number, r: MaterialRecipe) => number;

/** 把基础频率按 scale 缩放并取整，保证始终为整数周期 */
function F(base: number, scale: number): number {
  return Math.max(1, Math.round(base * scale));
}

function woodHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  // 年轮线沿 u 方向延展（横向年轮），warp 负责让年轮轻微起伏而非形成大波浪
  const warp = fbmTiled(u, v, F(3, r.scale), F(8, r.scale), 4, s + 11) - 0.5;
  const ringFreq = F(11, r.scale);
  // 正模保证 v=0 与 v=1 的相位严格一致
  const ringPhase = (((v * ringFreq + warp * 0.5) % 1) + 1) % 1;
  // 年轮早晚材：靠近年轮线处更暗
  const rings = Math.abs(ringPhase - 0.5) * 2;
  // 纤维沿 u 方向拉长（纵向细丝）
  const fiber = fbmTiled(u, v, F(2, r.scale), F(30, r.scale), 3, s + 31);
  const knot = smoothMix(
    0.88,
    1,
    valueNoiseTiled(u * F(2, r.scale), v * F(2, r.scale), F(2, r.scale), F(2, r.scale), s + 77),
  );
  return clamp01(rings * 0.5 + fiber * 0.34 + (1 - knot) * 0.16);
}

function brickHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const rows = F(6, r.scale);
  const cols = F(4, r.scale);
  const ry = v * rows;
  const row = Math.floor(ry);
  // 奇偶行错缝：错缝量必须是 cols 的一半整数倍才闭合
  const offset = row % 2 === 0 ? 0 : 0.5;
  const rx = u * cols + offset;
  const col = Math.floor(rx);
  const fx = rx - col;
  const fy = ry - row;

  const mortarW = 0.055;
  const mortarH = 0.09;
  const mortar =
    smoothMix(0, mortarW, fx) *
    smoothMix(0, mortarH, fy) *
    smoothMix(1, 1 - mortarW, fx) *
    smoothMix(1, 1 - mortarH, fy);

  const id = hash2(((col % cols) + cols) % cols, ((row % rows) + rows) % rows, s);
  const brickTex = fbmTiled(u * F(4, r.scale), v * F(4, r.scale), F(6, r.scale), F(6, r.scale), 4, s + 5 + Math.floor(id * 64));
  return clamp01(mortar * (0.55 + brickTex * 0.55) + (1 - mortar) * 0.12);
}

function concreteHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const base = fbmTiled(u, v, F(4, r.scale), F(4, r.scale), 5, s);
  const pores = 1 - smoothMix(0, 0.3, worleyTiled(u, v, F(26, r.scale), F(26, r.scale), s + 3).f1);
  const stain = ridgedTiled(u, v, F(3, r.scale), F(3, r.scale), 4, s + 9);
  return clamp01(base * 0.6 + pores * 0.16 * r.detail + stain * 0.24);
}

function stoneHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const w = worleyTiled(u, v, F(7, r.scale), F(7, r.scale), s);
  const crack = smoothMix(0, 0.22, w.f2 - w.f1);
  const rough = fbmTiled(u, v, F(10, r.scale), F(10, r.scale), 5, s + 21);
  return clamp01(crack * 0.55 + rough * 0.35 + (1 - w.id) * 0.1);
}

function fabricHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const threads = F(48, r.scale);
  const warp = Math.sin(u * Math.PI * 2 * threads);
  const weft = Math.sin(v * Math.PI * 2 * threads);
  const weave = warp * weft * 0.5 + 0.5;
  const slub = fbmTiled(u, v, F(12, r.scale), F(12, r.scale), 3, s + 41);
  return clamp01(weave * 0.7 + slub * 0.3);
}

function leatherHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const w = worleyTiled(u, v, F(16, r.scale), F(16, r.scale), s + 2);
  const cell = smoothMix(0, 0.35, w.f1);
  const grain = fbmTiled(u, v, F(22, r.scale), F(22, r.scale), 4, s + 13);
  return clamp01(cell * 0.6 + grain * 0.4);
}

function marbleHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const warp = fbmTiled(u, v, F(3, r.scale), F(3, r.scale), 4, s + 2) - 0.5;
  // 脉络方向：整数系数保证相位在边界处闭合
  const phase = u * F(2, r.scale) + v * F(1, r.scale) + warp * 3.4;
  const vein = Math.abs(Math.sin(phase * Math.PI));
  const fine = fbmTiled(u, v, F(8, r.scale), F(8, r.scale), 4, s + 55);
  return clamp01(Math.pow(1 - vein, 3) * 0.8 + fine * 0.2);
}

function metalHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  // 拉丝纹：沿 v 方向的高频细条（横向拉丝），无横向叠加以避免规则网格感
  const brush = stripesTiled(u, v, F(72, r.scale), s, 0);
  const brushSoft = fbmTiled(u, v, F(64, r.scale), F(3, r.scale), 3, s + 51);
  const dent = fbmTiled(u, v, F(5, r.scale), F(5, r.scale), 3, s + 17);
  return clamp01(brush * 0.34 + brushSoft * 0.34 + dent * 0.32);
}

function rustHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const patch = ridgedTiled(u, v, F(5, r.scale), F(5, r.scale), 5, s);
  const flake = fbmTiled(u, v, F(16, r.scale), F(16, r.scale), 4, s + 8);
  return clamp01(patch * 0.6 + flake * 0.4);
}

function tileHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const n = F(4, r.scale);
  const fx = (u * n) % 1;
  const fy = (v * n) % 1;
  const grout =
    smoothMix(0, 0.05, fx) *
    smoothMix(1, 0.95, fx) *
    smoothMix(0, 0.05, fy) *
    smoothMix(1, 0.95, fy);
  const cell = fbmTiled(u, v, F(3, r.scale), F(3, r.scale), 3, s + 4);
  return clamp01(grout * 0.85 + cell * 0.15);
}

function asphaltHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const grit = worleyTiled(u, v, F(34, r.scale), F(34, r.scale), s + 6);
  const base = fbmTiled(u, v, F(6, r.scale), F(6, r.scale), 4, s);
  return clamp01(base * 0.45 + (1 - grit.f1) * 0.4 * r.detail);
}

function sandHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const rippleFreq = F(6, r.scale);
  const ripple = Math.sin((u * rippleFreq + fbmTiled(u, v, F(4, r.scale), F(4, r.scale), 3, s) * 2) * Math.PI) * 0.5 + 0.5;
  const grain = fbmTiled(u, v, F(40, r.scale), F(40, r.scale), 3, s + 19);
  return clamp01(ripple * 0.45 + grain * 0.55);
}

function snowHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const drift = fbmTiled(u, v, F(4, r.scale), F(4, r.scale), 5, s);
  const sparkleFreq = F(90, r.scale);
  const sparkle = valueNoiseTiled(u * sparkleFreq, v * sparkleFreq, sparkleFreq, sparkleFreq, s + 7);
  return clamp01(drift * 0.85 + sparkle * 0.15);
}

function grassHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  // 草叶沿 v 方向拉长：纵轴低频
  const blades = fbmTiled(u, v, F(24, r.scale), F(4, r.scale), 4, s + 2);
  const clumps = fbmTiled(u, v, F(5, r.scale), F(5, r.scale), 3, s + 33);
  const cells = 1 - smoothMix(0, 0.4, worleyTiled(u, v, F(12, r.scale), F(12, r.scale), s + 9).f1);
  return clamp01(blades * 0.45 + clumps * 0.35 + cells * 0.2);
}

function mudHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const w = worleyTiled(u, v, F(9, r.scale), F(9, r.scale), s + 5);
  const wet = fbmTiled(u, v, F(6, r.scale), F(6, r.scale), 4, s + 12);
  return clamp01(smoothMix(0, 0.5, w.f1) * 0.55 + wet * 0.45);
}

function glassHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const f = F(18, r.scale);
  const sf = F(50, r.scale);
  return (
    fbmTiled(u, v, f, f, 3, s) * 0.6 +
    valueNoiseTiled(u * sf, v * sf, sf, sf, s + 1) * 0.4
  );
}

function carbonHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const n = F(16, r.scale);
  const cw = Math.sin(u * Math.PI * 2 * n);
  const ch = Math.sin(v * Math.PI * 2 * n);
  const checker =
    ((Math.floor(u * n) + Math.floor(v * n)) % 2 === 0 ? cw : ch) * 0.5 + 0.5;
  return clamp01(checker * 0.75 + fbmTiled(u, v, F(30, r.scale), F(30, r.scale), 3, s) * 0.25);
}

function paperHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const f = F(26, r.scale);
  const g = F(4, r.scale);
  return fbmTiled(u, v, f, f, 4, s) * 0.7 + fbmTiled(u, v, g, g, 3, s + 3) * 0.3;
}

function waterHeight(u: number, v: number, r: MaterialRecipe): number {
  const s = r.seed;
  const warp = fbmTiled(u, v, F(3, r.scale), F(3, r.scale), 3, s) * 0.3;
  const w1 = fbmTiled(u + warp, v, F(6, r.scale), F(6, r.scale), 4, s + 2);
  const w2 = ridgedTiled(u, v, F(8, r.scale), F(8, r.scale), 4, s + 6);
  return clamp01(w1 * 0.55 + w2 * 0.45);
}

const HEIGHT_FNS: Record<MaterialKind, HeightFn> = {
  wood: woodHeight,
  brick: brickHeight,
  concrete: concreteHeight,
  stone: stoneHeight,
  fabric: fabricHeight,
  leather: leatherHeight,
  marble: marbleHeight,
  metal: metalHeight,
  rust: rustHeight,
  tile: tileHeight,
  asphalt: asphaltHeight,
  sand: sandHeight,
  snow: snowHeight,
  grass: grassHeight,
  mud: mudHeight,
  glass: glassHeight,
  carbon: carbonHeight,
  paper: paperHeight,
  water: waterHeight,
};

export const MATERIAL_LABELS: Record<MaterialKind, string> = {
  wood: "Wood",
  brick: "Brick",
  concrete: "Concrete",
  stone: "Stone",
  fabric: "Fabric",
  leather: "Leather",
  marble: "Marble",
  metal: "Metal",
  rust: "Rusted metal",
  tile: "Ceramic tile",
  asphalt: "Asphalt",
  sand: "Sand",
  snow: "Snow & ice",
  grass: "Grass",
  mud: "Mud & soil",
  glass: "Glass",
  carbon: "Carbon fiber",
  paper: "Paper",
  water: "Water",
};

/**
 * 在任意连续坐标 (u,v) ∈ [0,1]² 上采样材质高度场。
 * 暴露这个函数是为了让自检可以严格验证周期性：f(0,v) 必须严格等于 f(1,v)。
 */
export function sampleHeight(recipe: MaterialRecipe, u: number, v: number): number {
  return HEIGHT_FNS[recipe.kind](u, v, recipe);
}

/** 生成一张纹理（albedo + height），size 必须是 2 的幂便于严格周期 */
export function generateTexture(prompt: string, size: number, seed: Seed): TextureResult {
  const recipe = parsePrompt(prompt, seed);
  const heightFn = HEIGHT_FNS[recipe.kind];
  const px = size * size;

  const height = new Float32Array(px);
  const albedo = new ImageData(size, size);
  const d = albedo.data;

  const inv = 1 / size;
  const detail = recipe.detail;
  const gapAmt = recipe.gap;
  const rough = recipe.roughness;
  const grainFreq = Math.max(1, Math.round(size * 0.5));

  for (let j = 0; j < size; j++) {
    const v = j * inv;
    for (let i = 0; i < size; i++) {
      const u = i * inv;
      const idx = j * size + i;

      const h = heightFn(u, v, recipe);
      height[idx] = h;

      const t = clamp01(h * 0.85 + detail * 0.15);
      let [cr, cg, cb] = mixRgb(recipe.accent, recipe.base, t);

      // 缝隙/裂纹处压暗
      const crevice = smoothMix(0.42, 0, h);
      const dark = 1 - crevice * gapAmt * 0.55;
      cr *= dark;
      cg *= dark;
      cb *= dark;

      // 粗糙表面的高频颗粒：同样使用周期噪声，保持边界闭合
      const grain =
        (valueNoiseTiled(u * grainFreq, v * grainFreq, grainFreq, grainFreq, recipe.seed + 999) - 0.5) *
        0.05 *
        rough;
      cr = clamp01(cr + grain);
      cg = clamp01(cg + grain);
      cb = clamp01(cb + grain);

      const o = idx * 4;
      d[o] = Math.round(cr * 255);
      d[o + 1] = Math.round(cg * 255);
      d[o + 2] = Math.round(cb * 255);
      d[o + 3] = 255;
    }
  }

  return { albedo, height, size, recipe };
}

/* ------------------------------------------------------------------ */
/* PBR 贴图派生：normal / roughness / AO / height                     */
/* ------------------------------------------------------------------ */

/** 由高度场生成切线空间法线贴图 */
export function heightToNormal(height: Float32Array, size: number, strength = 2.2): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let y = 0; y < size; y++) {
    const yn = ((y - 1 + size) % size) * size;
    const yp = ((y + 1) % size) * size;
    const yc = y * size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const dx = (height[yc + xp] - height[yc + xm]) * strength;
      const dy = (height[yp + x] - height[yn + x]) * strength;
      const len = Math.sqrt(dx * dx + dy * dy + 1);
      const o = (yc + x) * 4;
      d[o] = Math.round((-dx / len * 0.5 + 0.5) * 255);
      d[o + 1] = Math.round((-dy / len * 0.5 + 0.5) * 255);
      d[o + 2] = Math.round((1 / len * 0.5 + 0.5) * 255);
      d[o + 3] = 255;
    }
  }
  return out;
}

/**
 * 金属度贴图：由材质类型决定是否为金属，非金属区域为 0。
 * 金属表面（metal / rust / carbon）在磨损处降低金属度，露出基底。
 */
export function heightToMetalness(
  height: Float32Array,
  size: number,
  isMetal: boolean,
  wearAmount = 0.35,
): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let i = 0; i < height.length; i++) {
    // 凸起处保持金属度，凹陷/磨损处按 wearAmount 衰减，露出非金属基底
    const h = height[i];
    const wear = isMetal ? clamp01(1 - smoothMix(0.25, 0.75, h) * wearAmount) : 0;
    const m = isMetal ? clamp01(0.55 + h * 0.45) * wear : 0;
    const o = i * 4;
    d[o] = d[o + 1] = d[o + 2] = Math.round(m * 255);
    d[o + 3] = 255;
  }
  return out;
}

/**
 * Roblox 专用打包：MetalnessMap（R = 金属度，G = 反射率）
 * Roblox Studio 的 SurfaceAppearance 使用这张图同时控制金属与反射。
 */
export function packRobloxMetalness(
  metalness: ImageData,
  height: Float32Array,
  size: number,
  reflectance = 0.5,
): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  const s = metalness.data;
  for (let i = 0; i < size * size; i++) {
    const o = i * 4;
    // R = 金属度；G = 反射率（非金属区约 0.5，金属区约 0.7）
    const m = s[o] / 255;
    const h = height[i];
    const isMetal = m > 0.5;
    const r = isMetal ? 0.7 : reflectance;
    d[o] = s[o];
    d[o + 1] = Math.round(r * 255);
    d[o + 2] = 0;
    d[o + 3] = 255;
  }
  return out;
}

/**
 * Unreal Engine 专用打包：Mask Map（R = AO，G = Roughness，B = Metallic）
 * UE5 的标准做法，把三张灰度图合成一张，省三次采样。
 */
export function packUnrealMask(
  ao: ImageData,
  roughness: ImageData,
  metalness: ImageData,
  size: number,
): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let i = 0; i < size * size; i++) {
    const o = i * 4;
    d[o] = ao.data[o];
    d[o + 1] = roughness.data[o];
    d[o + 2] = metalness.data[o];
    d[o + 3] = 255;
  }
  return out;
}

/** 粗糙度贴图：高度越高（凸起）越光滑，凹槽更粗糙 */
export function heightToRoughness(
  height: Float32Array,
  size: number,
  baseRoughness: number,
): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let i = 0; i < height.length; i++) {
    const h = height[i];
    const r = clamp01(mix(baseRoughness, clamp01(baseRoughness * 0.6), h));
    const o = i * 4;
    d[o] = d[o + 1] = d[o + 2] = Math.round(r * 255);
    d[o + 3] = 255;
  }
  return out;
}

/** 简易 AO：与周围平均高度比较得到遮蔽估计 */
export function heightToAO(height: Float32Array, size: number, radius = 4): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = y * size + x;
      const h = height[idx];
      let sum = 0;
      let cnt = 0;
      for (let k = -radius; k <= radius; k += 2) {
        const y2 = ((y + k) % size + size) % size;
        const x2 = ((x + k) % size + size) % size;
        sum += height[y2 * size + x2];
        cnt++;
      }
      const avg = sum / cnt;
      const occ = clamp01(0.55 + (h - avg) * 2.2);
      const o = idx * 4;
      d[o] = d[o + 1] = d[o + 2] = Math.round(occ * 255);
      d[o + 3] = 255;
    }
  }
  return out;
}

/** 高度图转灰度 ImageData */
export function heightToImageData(height: Float32Array, size: number): ImageData {
  const out = new ImageData(size, size);
  const d = out.data;
  for (let i = 0; i < height.length; i++) {
    const v = Math.round(clamp01(height[i]) * 255);
    const o = i * 4;
    d[o] = d[o + 1] = d[o + 2] = v;
    d[o + 3] = 255;
  }
  return out;
}
