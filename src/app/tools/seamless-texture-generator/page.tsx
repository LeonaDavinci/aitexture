import type { Metadata } from "next";
import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Seamless Texture Generator - Free Tileable Texture Maker Online",
  description:
    "Free seamless texture generator. Create perfectly tileable, repeating textures for floors, walls and terrain. No visible seams, no checkerboard pattern. Exports PNG up to 4K.",
  path: "/tools/seamless-texture-generator",
  keywords: [
    "seamless texture generator",
    "tileable texture generator",
    "seamless tile maker",
    "free seamless texture",
    "repeat texture generator",
    "tile texture online",
  ],
});

const METHODS = [
  {
    title: "Why ordinary images do not tile",
    body: "A photo or an AI image has a unique border. When you repeat it, the border becomes a hard line and the low-frequency lighting in the frame becomes a repeating checkerboard. The eye spots that grid instantly, which is why most generated textures fail in a 3D scene.",
  },
  {
    title: "Periodic noise instead of patching",
    body: "This generator samples lattice noise whose grid wraps exactly at the tile edge. There is no border to blend and no offset filter to run, so nothing can smear or soften the structure of the material.",
  },
  {
    title: "Low-frequency consistency",
    body: "Because the pattern is defined by math rather than by a frame, the average brightness across the tile stays uniform. Large surfaces keep an even tone instead of developing the bright-centre, dark-corner grid that gives away a repeated texture.",
  },
  {
    title: "Structure survives the repeat",
    body: "Brick mortar lines stay crisp, wood grain keeps its direction, and woven fabric keeps its weave. Tiling a wall 40 times still reads as one continuous surface rather than a collage.",
  },
];

const TIPS = [
  "Ask for the specific surface, not the vibe - \"red brick wall with mortar joints\" beats \"brick\".",
  "Add finish words: glossy, matte, weathered, worn, cracked, fine, coarse.",
  "Check the tiling preview at 3x3 or 4x4 before downloading - that is the density most real scenes use.",
  "Keep the same seed when you want four variations of one material instead of four unrelated materials.",
  "For terrain-scale surfaces, pair the albedo with a low-frequency detail normal map in the shader to hide repetition.",
];

export default function SeamlessTexturePage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-b from-mint-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-azure-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/tools/ai-texture-generator" className="hover:text-azure-600">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">Seamless Texture Generator</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            Seamless Texture Generator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            A tileable texture generator built for surfaces that repeat. Generate seamless textures
            for floors, walls, terrain and fabrics - no visible edges, no checkerboarding, free PNG
            export up to 2048px.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TextureGenerator initialPrompt="weathered concrete wall, subtle pores, seamless surface" />
      </section>

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            How seamless tiling actually works
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {METHODS.map((m, i) => (
              <article key={m.title} className="surface-card p-6">
                <span className="font-mono text-xs font-bold text-mint-600">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-ink-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.body}</p>
              </article>
            ))}
          </div>

          <h2 className="mt-14 text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            Tips for better repeating surfaces
          </h2>
          <ul className="mt-6 space-y-3">
            {TIPS.map((t) => (
              <li key={t} className="surface-card flex gap-3 px-5 py-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-500 text-xs font-bold text-white">
                  ✓
                </span>
                <span className="text-sm leading-relaxed text-ink-700">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-ink-200 bg-white p-6">
            <h3 className="font-display text-lg font-bold text-ink-900">
              Which seamless texture should I make?
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "brick",
                "wood",
                "concrete",
                "stone",
                "fabric",
                "marble",
                "metal",
                "grass",
                "sand",
                "tile",
              ].map((m) => (
                <Link
                  key={m}
                  href={`/tools/ai-texture-generator?preset=${m}`}
                  className="chip px-3.5 py-2 text-sm font-medium"
                >
                  {m} texture
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
