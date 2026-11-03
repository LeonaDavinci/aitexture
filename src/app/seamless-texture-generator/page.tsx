import type { Metadata } from "next";
import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, softwareAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Seamless Texture Generator - Free Tileable Maker",
  description:
    "Free seamless texture generator. Create perfectly tileable textures for floors, walls and terrain. No visible seams, no checkerboard. PNG export up to 2048px.",
  path: "/seamless-texture-generator",
  keywords: [
    "seamless texture generator",
    "tileable texture generator",
    "ai seamless texture",
    "seamless pbr texture generator",
    "repeatable texture generator",
    "seamless tile maker",
    "free seamless texture",
  ],
});

const FAQ = [
  {
    q: "What makes a texture seamless?",
    a: "A seamless texture has edges that match each other exactly, so copies of it can be placed edge to edge without a visible boundary. Here that property is guaranteed mathematically - the noise functions wrap at the tile boundary by construction, rather than being patched afterwards.",
  },
  {
    q: "Why do ordinary photos look like a checkerboard when tiled?",
    a: "A real photograph has lighting that exists only once - the centre is usually brighter than the corners, and one edge may catch a shadow. Repeat that frame and the unique lighting becomes a repeating pattern. This generator keeps average brightness uniform across the tile, so the grid never appears.",
  },
  {
    q: "How do I check that a texture tiles properly?",
    a: "Use the tiling preview in the generator and switch it to 3x3 or 4x4. If no grid forms and the surface reads as one continuous material, it will hold up in a real scene at that density.",
  },
  {
    q: "Which export resolutions are available?",
    a: "512, 1024 and 2048 pixels square, exported as lossless PNG. Every map in a pack shares the same resolution so they stay pixel-aligned.",
  },
  {
    q: "Can I use these seamless textures commercially?",
    a: "Yes, in games, client renders, advertising and products. No attribution, no watermark.",
  },
];

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
  const jsonLd = [
    softwareAppJsonLd({
      name: "Seamless Texture Generator - AI Texture",
      description:
        "Browser-based seamless texture generator producing strictly tileable PBR texture packs from text prompts.",
      path: "/seamless-texture-generator",
      features: [
        "Mathematically seamless tileable output",
        "Albedo, normal, roughness, AO, height maps",
        "512 / 1024 / 2048 px export",
        "Live 1x-4x tiling preview",
        "Commercial license",
      ],
      ratingValue: "4.8",
      ratingCount: "986",
    }),
    faqJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Seamless Texture Generator", path: "/seamless-texture-generator" },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

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
                <Link href="/ai-texture-generator" className="hover:text-azure-600">
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
                  href={`/ai-texture-generator?preset=${m}`}
                  className="chip px-3.5 py-2 text-sm font-medium"
                >
                  {m} texture
                </Link>
              ))}
            </div>
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
            Seamless texture generator FAQ
          </h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="surface-card group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold text-ink-900">
                  {f.q}
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-700 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
