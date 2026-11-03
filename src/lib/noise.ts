/**
 * 可无缝平铺（tileable）的程序化噪声库。
 *
 * 核心思路：
 * 1. 所有噪声的格点索引都对「周期」取模，因此函数在 [0,1)² 上严格周期；
 * 2. 传入的坐标必须是归一化的 [0,1) 瓦片坐标（或整数倍偏移），
 *    各向异性通过「频率分离」表达，而不是通过对坐标做非整数缩放 —— 后者会破坏周期性；
 * 3. Worley 用环形距离计算，保证跨边界的特征点连续。
 */

/** 随机种子类型（32 位无符号整数） */
export type Seed = number;

/** 32-bit 整数哈希（快速混合），返回 [0,1) */
export function hash2(ix: number, iy: number, seed: number): number {
  let h = (ix | 0) * 374761393 + (iy | 0) * 668265263 + (seed | 0) * 2147483647;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smoothstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * 周期性 value noise。
 * @param x 格点坐标（横轴），需落在 [0, periodX) 的整数倍范围内
 * @param y 格点坐标（纵轴）
 * @param periodX 横轴周期（格点数，必须为正整数）
 * @param periodY 纵轴周期
 */
export function valueNoiseTiled(
  x: number,
  y: number,
  periodX: number,
  periodY: number,
  seed: number,
): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;

  const xa = ((x0 % periodX) + periodX) % periodX;
  const ya = ((y0 % periodY) + periodY) % periodY;
  const xb = (xa + 1) % periodX;
  const yb = (ya + 1) % periodY;

  const v00 = hash2(xa, ya, seed);
  const v10 = hash2(xb, ya, seed);
  const v01 = hash2(xa, yb, seed);
  const v11 = hash2(xb, yb, seed);

  const u = smoothstep(fx);
  const v = smoothstep(fy);

  return lerp(lerp(v00, v10, u), lerp(v01, v11, u), v);
}

/**
 * 周期性 fBm 噪声。
 * @param u 横轴归一化瓦片坐标 [0,1)
 * @param v 纵轴归一化瓦片坐标 [0,1)
 * @param freqX 横轴基础频率（整数，频率越高特征越密）
 * @param freqY 纵轴基础频率（与 freqX 分离即产生各向异性）
 * @param octaves 倍频数
 */
export function fbmTiled(
  u: number,
  v: number,
  freqX: number,
  freqY: number,
  octaves: number,
  seed: number,
  gain = 0.5,
): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let fx = 1;
  let fy = 1;
  for (let o = 0; o < octaves; o++) {
    const px = Math.max(1, Math.round(freqX * fx));
    const py = Math.max(1, Math.round(freqY * fy));
    sum += amp * valueNoiseTiled(u * px, v * py, px, py, seed + o * 1013);
    norm += amp;
    amp *= gain;
    fx *= 2;
    fy *= 2;
  }
  return sum / norm;
}

/** 周期性 ridged fBm（适合岩石、山脉、木纹走向） */
export function ridgedTiled(
  u: number,
  v: number,
  freqX: number,
  freqY: number,
  octaves: number,
  seed: number,
): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let fx = 1;
  let fy = 1;
  for (let o = 0; o < octaves; o++) {
    const px = Math.max(1, Math.round(freqX * fx));
    const py = Math.max(1, Math.round(freqY * fy));
    const n = Math.abs(valueNoiseTiled(u * px, v * py, px, py, seed + o * 733) * 2 - 1);
    sum += amp * (1 - n);
    norm += amp;
    amp *= 0.5;
    fx *= 2;
    fy *= 2;
  }
  return sum / norm;
}

/**
 * 周期性 Worley（Voronoi）噪声。
 * 特征点固定在格点上，距离使用环形距离，因此跨瓦片边界依然连续。
 */
export function worleyTiled(
  u: number,
  v: number,
  cellsX: number,
  cellsY: number,
  seed: number,
): { f1: number; f2: number; id: number } {
  const gx = Math.floor(u * cellsX);
  const gy = Math.floor(v * cellsY);

  let f1 = Infinity;
  let f2 = Infinity;
  let id = 0;

  for (let oy = -1; oy <= 1; oy++) {
    for (let ox = -1; ox <= 1; ox++) {
      const cx = gx + ox;
      const cy = gy + oy;
      const wx = ((cx % cellsX) + cellsX) % cellsX;
      const wy = ((cy % cellsY) + cellsY) % cellsY;

      const px = (wx + hash2(wx, wy, seed)) / cellsX;
      const py = (wy + hash2(wx, wy, seed + 7717)) / cellsY;

      // 环形距离：把差值折算到 [-0.5, 0.5]
      let dx = px - u;
      dx -= Math.round(dx);
      let dy = py - v;
      dy -= Math.round(dy);

      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < f1) {
        f2 = f1;
        f1 = d;
        id = hash2(wx, wy, seed + 31337);
      } else if (d < f2) {
        f2 = d;
      }
    }
  }

  return { f1: f1 * cellsX, f2: f2 * cellsY, id };
}

/**
 * 周期性条纹（用于拉丝金属、布纹）。
 * @param freq 整数频率
 * @param skew 整数倾斜量（乘以 freq 后必须为整数，才能保证边界闭合）
 */
export function stripesTiled(
  u: number,
  v: number,
  freq: number,
  seed: number,
  skew = 0,
): number {
  const a = u + skew * v;
  const cell = Math.floor(a * freq);
  const wrapped = ((cell % freq) + freq) % freq;
  const jitter = (hash2(wrapped, 0, seed) - 0.5) * 0.35;
  return (((a * freq) % 1) + jitter + 1) % 1;
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothMix(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}
