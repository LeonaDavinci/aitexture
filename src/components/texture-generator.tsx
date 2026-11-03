"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MATERIAL_LABELS,
  generateTexture,
  heightToAO,
  heightToNormal,
  heightToRoughness,
  type MaterialKind,
} from "@/lib/texture-engine";

type ViewMode = "albedo" | "normal" | "roughness" | "ao" | "height";

interface Generated {
  seed: number;
  albedoUrl: string;
  mapUrls: Record<Exclude<ViewMode, "albedo">, string>;
  blobUrl: string;
  kind: MaterialKind;
}

const PRESETS = [
  { key: "brick", label: "Brick", prompt: "weathered red brick wall, mortar joints, rough surface" },
  { key: "wood", label: "Wood", prompt: "oak wood planks, visible grain, warm natural wood floor" },
  { key: "concrete", label: "Concrete", prompt: "raw concrete wall, subtle pores, grey cement surface" },
  { key: "metal", label: "Metal", prompt: "brushed steel metal plate, fine linear scratches" },
  { key: "stone", label: "Stone", prompt: "rough granite stone slab, cracked natural rock" },
  { key: "fabric", label: "Fabric", prompt: "woven linen fabric, textile weave, soft cloth" },
  { key: "marble", label: "Marble", prompt: "polished white marble with grey veins, glossy" },
  { key: "rust", label: "Rust", prompt: "rusted metal sheet, oxidized orange corroded surface" },
  { key: "tile", label: "Tile", prompt: "white ceramic tile grid, glossy glazed tiles" },
  { key: "grass", label: "Grass", prompt: "green grass lawn turf, dense blades" },
  { key: "leather", label: "Leather", prompt: "brown leather hide, pebbled grain surface" },
  { key: "sand", label: "Sand", prompt: "desert sand dunes, fine grain ripples" },
];

const RESOLUTIONS = [512, 1024, 2048];

function imageDataToUrl(data: ImageData): string {
  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL("image/png");
}

export function TextureGenerator({ initialPrompt = "" }: { initialPrompt?: string }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [seed, setSeed] = useState(20260931);
  const [resolution, setResolution] = useState(512);
  const [view, setView] = useState<ViewMode>("albedo");
  const [results, setResults] = useState<Generated[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tileCount, setTileCount] = useState(2);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const urlsRef = useRef<string[]>([]);

  // 支持通过 ?preset=brick 直达某个预设
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("preset");
    if (!p) return;
    const found = PRESETS.find((x) => x.key === p);
    if (found) {
      setPrompt(found.prompt);
      setActivePreset(found.key);
    }
  }, []);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const applyPreset = (key: string, text: string) => {
    setPrompt(text);
    setActivePreset(key);
  };

  const onPromptChange = (v: string) => {
    setPrompt(v);
    const match = PRESETS.find((x) => x.prompt === v);
    setActivePreset(match ? match.key : null);
  };

  const generate = useCallback(async () => {
    setBusy(true);
    setError(null);
    setProgress(0);
    setElapsed(null);
    const started = performance.now();
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];

    try {
      await new Promise((r) => setTimeout(r, 16));
      const out: Generated[] = [];
      const count = 4;

      for (let i = 0; i < count; i++) {
        const s = (seed + i * 7919) >>> 0;
        const tex = generateTexture(prompt, resolution, s);

        const albedoUrl = imageDataToUrl(tex.albedo);
        const normalUrl = imageDataToUrl(heightToNormal(tex.height, resolution, 2.4));
        const roughUrl = imageDataToUrl(
          heightToRoughness(tex.height, resolution, tex.recipe.roughness),
        );
        const aoUrl = imageDataToUrl(heightToAO(tex.height, resolution));

        // 单独构造 height 灰度图
        const hCanvas = document.createElement("canvas");
        hCanvas.width = resolution;
        hCanvas.height = resolution;
        const hCtx = hCanvas.getContext("2d");
        if (hCtx) {
          const hData = hCtx.createImageData(resolution, resolution);
          for (let p = 0; p < tex.height.length; p++) {
            const v = Math.round(Math.max(0, Math.min(1, tex.height[p])) * 255);
            hData.data[p * 4] = v;
            hData.data[p * 4 + 1] = v;
            hData.data[p * 4 + 2] = v;
            hData.data[p * 4 + 3] = 255;
          }
          hCtx.putImageData(hData, 0, 0);
        }
        const heightReal = hCanvas.toDataURL("image/png");

        // 下载用 blob（把 albedo 画到 canvas 再 toBlob）
        const blob = await new Promise<Blob | null>((res) => {
          const c = document.createElement("canvas");
          c.width = resolution;
          c.height = resolution;
          const cx = c.getContext("2d");
          if (!cx) {
            res(null);
            return;
          }
          cx.putImageData(tex.albedo, 0, 0);
          c.toBlob((b) => res(b), "image/png");
        });
        const blobUrl = blob ? URL.createObjectURL(blob) : albedoUrl;
        urlsRef.current.push(blobUrl);

        out.push({
          seed: s,
          albedoUrl,
          mapUrls: {
            normal: normalUrl,
            roughness: roughUrl,
            ao: aoUrl,
            height: heightReal,
          },
          blobUrl,
          kind: tex.recipe.kind,
        });

        setProgress(Math.round(((i + 1) / count) * 100));
        await new Promise((r) => setTimeout(r, 16));
      }

      setResults(out);
      setElapsed(Math.round(performance.now() - started));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Texture generation failed.");
    } finally {
      setBusy(false);
    }
  }, [prompt, resolution, seed]);

  const activeUrl = useMemo(() => {
    if (!results.length) return "";
    return view === "albedo" ? results[0].albedoUrl : results[0].mapUrls[view];
  }, [results, view]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard is unavailable in this browser context.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* 控制面板 */}
      <div className="surface-card h-fit p-5 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-bold text-ink-900">Generator</h2>

        <label className="mt-5 block text-sm font-semibold text-ink-800" htmlFor="prompt">
          Material prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="e.g. weathered red brick wall with mortar joints"
          className="mt-2 w-full resize-y rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-azure-500 focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={copyPrompt}
            className="text-xs font-medium text-ink-500 transition-colors hover:text-azure-600"
          >
            {copied ? "Copied!" : "Copy prompt"}
          </button>
          <span className="text-xs text-ink-400">{prompt.length}/280</span>
        </div>

        <div className="mt-5">
          <span className="text-sm font-semibold text-ink-800">Quick presets</span>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => applyPreset(p.key, p.prompt)}
                className="chip px-3 py-1.5 text-xs font-medium"
                data-active={activePreset === p.key}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="res" className="text-sm font-semibold text-ink-800">
              Resolution
            </label>
            <select
              id="res"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-900 focus:border-azure-500 focus:outline-none"
            >
              {RESOLUTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} x {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="seed" className="text-sm font-semibold text-ink-800">
              Seed
            </label>
            <div className="mt-2 flex gap-1.5">
              <input
                id="seed"
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 0)}
                className="w-full min-w-0 rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-900 focus:border-azure-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSeed(Math.floor(Math.random() * 99999999))}
                title="Randomize seed"
                aria-label="Randomize seed"
                className="shrink-0 rounded-xl border border-ink-200 bg-white px-3 text-base leading-none text-ink-600 transition-colors hover:border-ink-400 hover:text-ink-900"
              >
                🎲
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="btn-primary mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? `Generating... ${progress}%` : "Generate 4 Textures"}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          Runs 100% in your browser. Nothing is uploaded, no watermark, commercial use allowed.
          {elapsed !== null && !busy && (
            <span className="ml-1 font-semibold text-ink-600">
              Last run: {elapsed}ms for 4 textures + 20 PBR maps.
            </span>
          )}
        </p>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* 结果区 */}
      <div className="space-y-6">
        <div className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-ink-200 px-4 py-3">
            <div className="flex flex-wrap gap-1.5">
              {(["albedo", "normal", "roughness", "ao", "height"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className="chip px-3 py-1.5 text-xs font-semibold capitalize"
                  data-active={view === v}
                >
                  {v === "ao" ? "AO" : v}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-medium text-ink-500">Tiling</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setTileCount(n)}
                    className="chip h-8 w-8 text-xs font-bold"
                    data-active={tileCount === n}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeUrl ? (
            <div className="tile-grid p-4">
              <div
                className="mx-auto overflow-hidden rounded-xl border border-ink-200 shadow-sm"
                style={{
                  width: "100%",
                  maxWidth: 620,
                  aspectRatio: "1 / 1",
                  backgroundImage: `url(${activeUrl})`,
                  backgroundSize: `${100 / tileCount}% ${100 / tileCount}%`,
                  backgroundRepeat: "repeat",
                  imageRendering: "auto",
                }}
              />
            </div>
          ) : (
            <div className="grid-noise flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
                🎨
              </div>
              <p className="font-display text-base font-bold text-ink-900">
                Your textures will appear here
              </p>
              <p className="max-w-sm text-sm text-ink-600">
                Type a material description or pick a preset, then hit Generate. You get 4 seamless
                variants with full PBR maps.
              </p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <>
            <div className="surface-card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Generated variants
                <span className="ml-2 text-sm font-medium text-ink-500">
                  {MATERIAL_LABELS[results[0].kind]} · {resolution}×{resolution}
                </span>
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {results.map((r) => (
                  <figure key={r.seed} className="overflow-hidden rounded-xl border border-ink-200">
                    <div
                      className="aspect-square w-full"
                      style={{ backgroundImage: `url(${r.albedoUrl})`, backgroundSize: "cover" }}
                    />
                    <figcaption className="flex items-center justify-between gap-2 border-t border-ink-200 bg-ink-50 px-3 py-2">
                      <span className="font-mono text-[11px] text-ink-600">seed {r.seed}</span>
                      <a
                        href={r.blobUrl}
                        download={`aitexture-${r.kind}-${r.seed}.png`}
                        className="rounded-lg bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-ink-700"
                      >
                        PNG
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">
                PBR map pack
                <span className="ml-2 text-sm font-medium text-ink-500">
                  Normal / Roughness / AO / Height for variant 1
                </span>
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                Drop these four maps next to your albedo and plug them straight into a Unity URP,
                Unreal Engine or Blender shader graph.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(
                  [
                    ["Normal", "normal"],
                    ["Roughness", "roughness"],
                    ["AO", "ao"],
                    ["Height", "height"],
                  ] as Array<[string, Exclude<ViewMode, "albedo">]>
                ).map(([label, key]) => (
                  <figure key={key} className="overflow-hidden rounded-xl border border-ink-200">
                    <div
                      className="aspect-square w-full"
                      style={{ backgroundImage: `url(${results[0].mapUrls[key]})`, backgroundSize: "cover" }}
                    />
                    <figcaption className="flex items-center justify-between gap-2 border-t border-ink-200 bg-ink-50 px-3 py-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-ink-700">
                        {label}
                      </span>
                      <a
                        href={results[0].mapUrls[key]}
                        download={`aitexture-${results[0].kind}-${results[0].seed}-${key}.png`}
                        className="rounded-lg border border-ink-300 bg-white px-2.5 py-1 text-[11px] font-bold text-ink-800 transition-colors hover:bg-ink-100"
                      >
                        Save
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
