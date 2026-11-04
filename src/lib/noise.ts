/**
 * Procedural noise library with strictly tileable output.
 *
 * Core ideas:
 * 1. Every noise function wraps its lattice indices by the period, so the result is strictly periodic on [0,1)^2;
 * 2. Input coordinates must be normalised tile coordinates in [0,1) (or an integer multiple of them),
 *    and anisotropy comes from separating frequencies rather than scaling coordinates by a non-integer, which would break periodicity;
 * 3. Worley uses a circular distance so feature points stay continuous across the boundary.
 */

/** Random seed type (32-bit unsigned integer) */
export type Seed = number;

/** Fast 32-bit integer hash, returns a value in [0,1) */
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
 * Periodic value noise.
 * @param x lattice coordinate on the horizontal axis, within an integer multiple of [0, periodX)
 * @param y lattice coordinate on the vertical axis
 * @param periodX horizontal period in lattice cells, a positive integer
 * @param periodY vertical period in lattice cells
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
 * Periodic fBm noise.
 * @param u normalised tile coordinate on the horizontal axis, [0,1)
 * @param v normalised tile coordinate on the vertical axis, [0,1)
 * @param freqX base horizontal frequency, an integer
 * @param freqY base vertical frequency, separated from freqX to create anisotropy
 * @param octaves number of octaves
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

/** Periodic ridged fBm, good for rock, mountains and wood grain */
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
 * Periodic Worley (Voronoi) noise.
 * Feature points sit on fixed lattice cells and distances use a circular metric, so the field stays continuous across tile boundaries.
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

      // Circular distance: fold the difference into [-0.5, 0.5]
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
 * Periodic stripes, used for brushed metal and woven cloth.
 * @param freq integer frequency
 * @param skew integer skew amount (must stay an integer multiple of freq for the boundary to close)
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
