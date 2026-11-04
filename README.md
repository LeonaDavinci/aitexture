# AI Texture — www.aitexture.app

Free, browser-based AI texture generator. Turns a text prompt into **seamless, tileable PBR
texture packs** — albedo, normal, roughness, AO and height — with no upload, no watermark and no
sign-up.

> Requirements analysis and competitor research: [REQUIREMENTS.md](./REQUIREMENTS.md)

---

## What makes this different

Most AI texture tools produce "a nice looking image" rather than "a material you can tile". The
core differences here:

| | Common approach | This project |
| --- | --- | --- |
| Seamless | Offset + clone stamp afterwards, which smears structure and leaves low frequency checkerboard | Noise lattice indices wrap by the period, so edges close **by construction** |
| PBR | Each channel generated separately, so they do not agree | All channels derive from **one height field**, so they stay physically consistent |
| Cost | Free tier watermarks or locks the download | Generation runs in the browser, so compute cost is zero and the tool stays free forever |

---

## Platform specific exports

Differentiation lives in the **exported artefacts**, not in the copy. Each engine gets the map
structure it actually reads:

| Platform | Export pack | Key detail |
| --- | --- | --- |
| **Roblox** | ColorMap, NormalMap, MetalnessMap, RoughnessMap | SurfaceAppearance takes exactly four maps. The MetalnessMap is packed Roblox style: R = metalness, G = reflectance |
| **Unreal Engine** | BaseColor, Normal, Mask (R=AO G=Roughness B=Metallic) plus an ORM variant | The Mask Map is the UE5 standard and saves two texture samples |
| **Blender** | Base Color, Normal, Roughness, AO, Height | Full five channel set, and AO plus Height both have real uses here |
| **Unity** | Albedo, Normal, Smoothness, AO, Height | URP consumes smoothness, which is the inverse of roughness |

Each platform page also ships its own setup script (Lua, Editor Python, Blender Python, C# Editor)
and presets mapped to that engine's own material names.

---

## Stack

- **Next.js 16** (App Router, SSR) · React 19 · TypeScript 5.7 · Tailwind CSS 4
- The texture engine is a self-contained procedural implementation on Canvas 2D, with **zero third
  party runtime dependencies**

---

## Quick start

```bash
npm install
npm run dev        # development server
npm run build      # production build (webpack pipeline, see the note below)
npm start          # production server
```

### Verification scripts

```bash
node scripts/verify-engine.mjs         # engine self-check: strict seamlessness across 20 materials + PBR derivation
node scripts/verify-platform-packs.mjs  # pixel-level check of the Roblox and Unreal packed maps
node scripts/render-preview.mjs         # renders material previews to .preview/out/
node scripts/seo-check.mjs              # site-wide SEO audit across 22 routes
node scripts/e2e-browser.mjs            # real headless Chrome E2E (requires npm start first)
node scripts/fetch-page.mjs <url>       # extracts the body text of a client-rendered page
node scripts/snapshot.mjs <base> <name:path>   # screenshots a route, optionally with @scrollY
```

`verify-engine.mjs` checks that the **continuous function is exactly equal at u=0 and u=1**
(error below 1e-9), rather than comparing pixel columns — the latter produces false failures
because of the sampling offset.

`seo-check.mjs` covers 22 routes and inspects title and description length, canonical uniqueness,
H1 uniqueness, OG and Twitter tags, JSON-LD parsing, internal link counts, 301 redirects, sitemap
coverage and the robots configuration.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                      landing page (hero, tool, features, comparison, workflow, clusters, use cases, FAQ, CTA)
│   ├── layout.tsx                    root layout and global metadata
│   ├── globals.css                   design tokens (@theme) plus component classes
│   ├── sitemap.ts / robots.ts        generated at build time
│   ├── opengraph-image.tsx           dynamic OG share card (1200x630)
│   ├── ai-texture-generator/         core tool page (primary keyword)
│   ├── seamless-texture-generator/   long tail: seamless, tileable
│   ├── pbr-texture-generator/        long tail: PBR, normal, roughness
│   ├── photo-to-texture/             long tail: photo to texture (in development)
│   ├── roblox-texture-generator/     engine workflow page x4
│   ├── blender-texture-generator/
│   ├── unreal-engine-texture-generator/
│   ├── unity-texture-generator/
│   ├── wood|concrete|fabric|stone-texture-generator/   material category pages x4
│   ├── guides/[slug]/                4 technical guides (SSG)
│   └── pricing / about / privacy / terms
├── components/
│   ├── texture-generator.tsx         client interaction island (generate, preview, download)
│   ├── platform-texture-generator.tsx platform aware generator with per platform export packs
│   ├── platform-page.tsx             engine workflow page template
│   ├── platform-banner.tsx           platform banners and the homepage combo banner
│   ├── material-category-page.tsx    material category page template
│   ├── site-header.tsx / site-footer.tsx
├── lib/
│   ├── noise.ts                      tileable noise library (periodic value, fbm, ridged, worley, stripes)
│   ├── texture-engine.ts             prompt parsing + 19 material height functions + PBR derivation
│   ├── platforms.ts                  platform registry with per platform exports, scripts and copy
│   ├── keyword-clusters.ts           the five keyword clusters and their page configuration
│   ├── seo.ts                        metadata factory and JSON-LD factory
│   └── guides-data.ts                guide content
├── proxy.ts                          301 redirects from the old /tools/* paths
└── scripts/                          verification and preview scripts

public/logos/
├── roblox-icon.svg                   Roblox logo mark, extracted from Roblox Logo 2022.svg
└── blender.svg                       Blender logo without text, from Wikimedia Commons
```

---

## Keyword cluster architecture

The site is organised around five clusters, which avoids building 25 near-duplicate pages:

| Cluster | Landing page | Target keywords |
| --- | --- | --- |
| Core tool | `/ai-texture-generator/` | ai texture generator, free ai texture generator |
| Seamless | `/seamless-texture-generator/` | seamless texture generator, tileable texture generator |
| PBR materials | `/pbr-texture-generator/` | ai pbr texture generator, pbr material generator |
| Software workflow | `/roblox-…` `/blender-…` `/unreal-engine-…` `/unity-…` | roblox texture generator, blender texture generator, unreal engine texture generator, unity texture generator |
| Material categories | `/wood-…` `/concrete-…` `/fabric-…` `/stone-…` | ai wood texture generator, ai concrete texture generator… |

The old `/tools/*` paths 301 to the root-level paths through `src/proxy.ts`, which puts the keyword
at the root of the URL where it carries more weight.

---

## Core algorithm

**What seamless actually means** — the noise lattice has to close at the period boundary:

```ts
valueNoiseTiled(x, y, periodX, periodY, seed) {
  const xa = ((x0 % periodX) + periodX) % periodX;  // wrap the lattice index
  const xb = (xa + 1) % periodX;
  // → f(0) ≡ f(1) by construction
}
```

**Constraints to respect when changing the engine**:

1. Height functions only accept **normalised tile coordinates** in `[0,1)`;
2. Express anisotropy by **separating frequencies** (`freqX` / `freqY`). Never scale coordinates by
   a non-integer factor, because that breaks periodicity;
3. Every modulo must use a positive form, `((x % 1) + 1) % 1`, since JavaScript's `%` returns a
   negative value for negative operands;
4. Worley must use a **circular distance**, otherwise feature points jump across the boundary.

**PBR derivation chain**

```
height field height[]
  ├─ heightToNormal()      → Sobel gradient → tangent space normal
  ├─ heightToRoughness()   → height up ⇒ roughness down
  ├─ heightToMetalness()   → metalness by material type, worn areas reveal the base
  ├─ heightToAO()          → compare against the neighbourhood average → occlusion estimate
  ├─ packRobloxMetalness() → R = metalness, G = reflectance
  ├─ packUnrealMask()      → R = AO, G = roughness, B = metallic
  └─ grayscale             → Height / Displacement
```

---

## Known build note

Next.js 16 runs the TypeScript check inside a jest-worker child process, and on some Windows
machines that worker hangs (the CPU sits idle and the build never returns). `next.config.ts`
enables `experimental.useTypeScriptCli` to run the check in-process instead, and the build script
is pinned to `next build --webpack` because Turbopack has the same worker problem.

---

## Roadmap

- [ ] Photo to seamless texture (edge mirroring plus low frequency lighting removal)
- [ ] Negative prompts
- [ ] Live 3D sphere UV preview
- [ ] Batch ZIP export for material variants
- [ ] Public gallery with forkable seeds
- [ ] Web Worker and OffscreenCanvas for large exports
