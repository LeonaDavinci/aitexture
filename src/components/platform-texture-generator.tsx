"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MATERIAL_LABELS,
  generateTexture,
  heightToAO,
  heightToMetalness,
  heightToNormal,
  heightToRoughness,
  packRobloxMetalness,
  packUnrealMask,
  type MaterialKind,
} from "@/lib/texture-engine";
import { GENERIC_PRESETS, type PlatformConfig } from "@/lib/platforms";

type ViewMode = "albedo" | "normal" | "roughness" | "ao" | "height" | "mask" | "metalness";

interface Generated {
  seed: number;
  kind: MaterialKind;
  albedoUrl: string;
  mapUrls: Record<string, string>;
}

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

export function PlatformTextureGenerator({
  platform,
  initialPrompt = "",
}: {
  platform: PlatformConfig;
  initialPrompt?: string;
}) {
  const presets = platform.presets.length > 0 ? platform.presets : GENERIC_PRESETS;

  const [prompt, setPrompt] = useState(initialPrompt || presets[0]?.prompt || "");
  const [seed, setSeed] = useState(20260931);
  const [resolution, setResolution] = useState<number>(platform.defaultResolution);
  const [view, setView] = useState<ViewMode>("albedo");
  const [results, setResults] = useState<Generated[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tileCount, setTileCount] = useState(2);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(presets[0]?.key ?? null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const urlsRef = useRef<string[]>([]);

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
    const match = presets.find((x) => x.prompt === v);
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
        const isMetal = tex.recipe.metallic;

        const albedo = tex.albedo;
        const normal = heightToNormal(tex.height, resolution, 2.4);
        const rough = heightToRoughness(tex.height, resolution, tex.recipe.roughness);
        const ao = heightToAO(tex.height, resolution);
        const metal = heightToMetalness(tex.height, resolution, isMetal);
        const mask = packUnrealMask(ao, rough, metal, resolution);
        const robloxMetal = packRobloxMetalness(metal, tex.height, resolution);

        // Platform specific export pack: file suffixes and channel layout follow the engine convention
        const mapUrls: Record<string, string> = {};
        const slug = `${tex.recipe.kind}-${s}`;

        if (platform.id === "roblox") {
          mapUrls.ColorMap = imageDataToUrl(albedo);
          mapUrls.NormalMap = imageDataToUrl(normal);
          mapUrls.MetalnessMap = imageDataToUrl(robloxMetal);
          mapUrls.RoughnessMap = imageDataToUrl(rough);
        } else if (platform.id === "unreal") {
          mapUrls.BaseColor = imageDataToUrl(albedo);
          mapUrls.Normal = imageDataToUrl(normal);
          mapUrls.Mask = imageDataToUrl(mask);
          mapUrls.ORM = imageDataToUrl(mask);
        } else if (platform.id === "unity") {
          mapUrls.Albedo = imageDataToUrl(albedo);
          mapUrls.Normal = imageDataToUrl(normal);
          mapUrls.Smoothness = imageDataToUrl(rough);
          mapUrls.AO = imageDataToUrl(ao);
          mapUrls.Height = imageDataToUrl(ao);
        } else {
          // Blender: the complete five channel set
          mapUrls["Base Color"] = imageDataToUrl(albedo);
          mapUrls.Normal = imageDataToUrl(normal);
          mapUrls.Roughness = imageDataToUrl(rough);
          mapUrls.AO = imageDataToUrl(ao);
          mapUrls.Height = imageDataToUrl(ao);
        }

        // Generic views used by the preview panel
        mapUrls.__albedo = imageDataToUrl(albedo);
        mapUrls.__normal = imageDataToUrl(normal);
        mapUrls.__roughness = imageDataToUrl(rough);
        mapUrls.__ao = imageDataToUrl(ao);
        mapUrls.__mask = imageDataToUrl(mask);
        mapUrls.__metalness = imageDataToUrl(metal);

        urlsRef.current.push(...Object.values(mapUrls));

        out.push({ seed: s, kind: tex.recipe.kind, albedoUrl: mapUrls.__albedo, mapUrls });
        mapUrls[`__slug_${i}`] = slug;

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
  }, [prompt, resolution, seed, platform.id]);

  const activeUrl = useMemo(() => {
    if (!results.length) return "";
    const m = results[0].mapUrls;
    switch (view) {
      case "albedo":
        return m.__albedo;
      case "normal":
        return m.__normal;
      case "roughness":
        return m.__roughness;
      case "ao":
        return m.__ao;
      case "mask":
        return m.__mask;
      case "metalness":
        return m.__metalness;
      case "height":
        return m.__ao;
      default:
        return m.__albedo;
    }
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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(platform.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1800);
    } catch {
      setError("Clipboard is unavailable in this browser context.");
    }
  };

  /** Channels available in the current view */
  const viewOptions: Array<{ key: ViewMode; label: string }> = useMemo(() => {
    const base: Array<{ key: ViewMode; label: string }> = [
      { key: "albedo", label: "Albedo" },
      { key: "normal", label: "Normal" },
      { key: "roughness", label: "Roughness" },
      { key: "ao", label: "AO" },
    ];
    if (platform.id === "roblox") {
      base.push({ key: "metalness", label: "Metalness" });
    } else if (platform.id === "unreal") {
      base.push({ key: "mask", label: "Mask" });
    } else {
      base.push({ key: "height", label: "Height" });
    }
    return base;
  }, [platform.id]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Control panel */}
      <div className="surface-card h-fit p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink-900">Generator</h2>
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ background: platform.brandSoft, color: platform.brandInk }}
          >
            {platform.shortName} preset
          </span>
        </div>

        <label className="mt-5 block text-sm font-semibold text-ink-800" htmlFor={`prompt-${platform.id}`}>
          Material prompt
        </label>
        <textarea
          id={`prompt-${platform.id}`}
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
          <span className="text-sm font-semibold text-ink-800">
            {platform.name} presets
          </span>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {presets.map((p) => (
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
          {activePreset && presets.find((p) => p.key === activePreset)?.engineMaterial && (
            <p className="mt-2.5 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
              <span className="font-semibold text-ink-800">Engine material: </span>
              {presets.find((p) => p.key === activePreset)?.engineMaterial}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`res-${platform.id}`} className="text-sm font-semibold text-ink-800">
              Resolution
            </label>
            <select
              id={`res-${platform.id}`}
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
            <label htmlFor={`seed-${platform.id}`} className="text-sm font-semibold text-ink-800">
              Seed
            </label>
            <div className="mt-2 flex gap-1.5">
              <input
                id={`seed-${platform.id}`}
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

        <p className="mt-2 text-xs leading-relaxed text-ink-500">{platform.resolutionNote}</p>

        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="btn-primary mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? `Generating... ${progress}%` : "Generate 4 Textures"}
        </button>

        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          Runs 100% in your browser. Nothing is uploaded, commercial use allowed.
          {elapsed !== null && !busy && (
            <span className="ml-1 font-semibold text-ink-600">Last run: {elapsed}ms.</span>
          )}
        </p>

        {error && (
          <p
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="surface-card overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-ink-200 px-4 py-3">
            <div className="flex flex-wrap gap-1.5">
              {viewOptions.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setView(v.key)}
                  className="chip px-3 py-1.5 text-xs font-semibold"
                  data-active={view === v.key}
                >
                  {v.label}
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
                }}
              />
            </div>
          ) : (
            <div className="grid-noise flex min-h-[320px] flex-col items-center justify-center gap-3 p-8 text-center">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm"
                style={{ color: platform.brand }}
              >
                ◧
              </div>
              <p className="font-display text-base font-bold text-ink-900">
                {platform.name}-ready textures appear here
              </p>
              <p className="max-w-sm text-sm text-ink-600">
                {platform.exportMaps.length} maps in {platform.name}&apos;s exact structure —{" "}
                {platform.exportMaps.map((m) => m.suffix).join(", ")}.
              </p>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <>
            {/* Variants */}
            <div className="surface-card p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Generated variants
                <span className="ml-2 text-sm font-medium text-ink-500">
                  {MATERIAL_LABELS[results[0].kind]} · {resolution}×{resolution}
                </span>
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {results.map((r, i) => (
                  <figure key={r.seed} className="overflow-hidden rounded-xl border border-ink-200">
                    <div
                      className="aspect-square w-full"
                      style={{ backgroundImage: `url(${r.albedoUrl})`, backgroundSize: "cover" }}
                    />
                    <figcaption className="flex items-center justify-between gap-2 border-t border-ink-200 bg-ink-50 px-3 py-2">
                      <span className="font-mono text-[11px] text-ink-600">seed {r.seed}</span>
                      <a
                        href={r.mapUrls.__albedo}
                        download={`aitexture-${platform.id}-${r.kind}-${r.seed}.png`}
                        className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: platform.brand }}
                      >
                        PNG
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* Platform export pack */}
            <div className="surface-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  {platform.name} export pack
                </h2>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                  style={{ background: platform.brandSoft, color: platform.brandInk }}
                >
                  variant 1
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {platform.exportMaps.length} maps, named and packed for {platform.name}. Channel
                layout and file naming follow what the engine expects — no manual re-wiring.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {platform.exportMaps.map((m) => {
                  const url = results[0].mapUrls[m.suffix];
                  return (
                    <figure
                      key={m.suffix}
                      className="flex gap-3 overflow-hidden rounded-xl border border-ink-200"
                    >
                      <div
                        className="h-20 w-20 shrink-0 border-r border-ink-200 bg-ink-50"
                        style={{ backgroundImage: `url(${url})`, backgroundSize: "cover" }}
                      />
                      <figcaption className="flex min-w-0 flex-1 flex-col justify-center py-2.5 pr-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold text-ink-900">
                            {m.label}
                          </span>
                          {m.special && (
                            <span
                              className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                              style={{ background: platform.brandSoft, color: platform.brandInk }}
                            >
                              packed
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-snug text-ink-500">{m.role}</p>
                        <a
                          href={url}
                          download={`aitexture-${platform.id}-${results[0].kind}-${results[0].seed}-${m.suffix}.png`}
                          className="mt-1.5 w-fit rounded-lg border border-ink-300 bg-white px-2.5 py-1 text-[11px] font-bold text-ink-800 transition-colors hover:bg-ink-100"
                        >
                          Save PNG
                        </a>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>

            {/* Engine setup script */}
            <div className="surface-card overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 border-b border-ink-200 px-5 py-4">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  {platform.name} setup script
                </h2>
                <span className="rounded bg-ink-100 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-ink-700">
                  {platform.codeLanguage}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="ml-auto rounded-lg border border-ink-300 bg-white px-3 py-1.5 text-xs font-bold text-ink-800 transition-colors hover:bg-ink-100"
                >
                  {codeCopied ? "Copied!" : "Copy script"}
                </button>
              </div>
              <p className="px-5 pt-4 text-sm text-ink-600">{platform.codeCaption}</p>
              <pre className="max-h-[420px] overflow-auto bg-ink-900 p-5 text-[13px] leading-relaxed text-ink-100">
                <code>{platform.code}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
