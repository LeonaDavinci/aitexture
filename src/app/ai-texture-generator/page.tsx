import type { Metadata } from "next";
import { TextureGenerator } from "@/components/texture-generator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Texture Generator - Free Seamless PBR",
  description:
    "Free AI texture generator. Turn a prompt into seamless, tileable PBR textures with albedo, normal, roughness and AO maps. Runs in your browser - no watermark.",
  path: "/ai-texture-generator",
  keywords: [
    "ai texture generator",
    "text to texture",
    "seamless texture generator",
    "pbr texture generator",
    "free texture generator",
    "tileable texture maker",
    "ai material generator",
  ],
  ogTitle: "AI Texture Generator - Free Seamless PBR",
  ogDescription:
    "Free AI texture generator. Turn a prompt into seamless, tileable PBR textures with albedo, normal, roughness and AO maps. Runs in your browser - no watermark.",
});

const FAQ = [
  {
    q: "How does the generator decide what to draw?",
    a: "Your prompt is parsed into a material recipe - the base surface (brick, wood, concrete, metal, fabric, marble and more), the dominant colour, the finish (glossy, matte, weathered, cracked) and the detail scale. The recipe then drives a procedural material model built on periodic noise, which is why every output tiles perfectly.",
  },
  {
    q: "How many textures do I get per generation?",
    a: "Four unique variants per run, each with its own seed. Seeds are shown under every result so you can reproduce an exact texture later by typing the same seed number.",
  },
  {
    q: "Can I use these textures commercially?",
    a: "Yes, without attribution and without a watermark. Games, client renders, advertising, film and product design are all covered.",
  },
  {
    q: "Which engines are the maps compatible with?",
    a: "Unity URP and HDRP, Unreal Engine 4 and 5, Godot, Blender, Maya, 3ds Max, Substance Designer and every WebGL pipeline using repeat wrapping.",
  },
  {
    q: "What is the difference between seamless and tileable?",
    a: "They describe the same property from two angles. Tileable means the texture repeats cleanly; seamless means the boundary itself is invisible. Every export here is both.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Once the page is loaded, generation runs entirely on your own hardware, so it keeps working on a plane, on a spotty connection or with the network completely off.",
  },
];

export default function TextureGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Texture Generator",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    url: "https://www.aitexture.app/ai-texture-generator",
    description:
      "Browser-based AI texture generator producing seamless tileable PBR texture packs from text prompts.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Seamless tileable output",
      "Albedo, normal, roughness, AO, height maps",
      "512 / 1024 / 2048 px export",
      "Runs locally in browser",
      "No watermark, commercial license",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="border-b border-ink-200 bg-gradient-to-b from-azure-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a href="/" className="hover:text-azure-600">
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/ai-texture-generator" className="hover:text-azure-600">
                  Tools
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">AI Texture Generator</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            AI Texture Generator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            Describe any material and get four seamless, tileable PBR texture variants with matched
            normal, roughness, AO and height maps. Everything runs in your browser.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            {[
              "Free forever",
              "No watermark",
              "No signup",
              "Commercial license",
              "2048×2048 export",
            ].map((t) => (
              <li
                key={t}
                className="rounded-full border border-mint-200 bg-mint-50 px-3 py-1.5 text-mint-700"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TextureGenerator />
      </section>

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            AI texture generator FAQ
          </h2>
          <div className="mt-8 space-y-3">
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

          <div className="mt-10 rounded-2xl border border-azure-200 bg-azure-50 p-6">
            <h3 className="font-display text-lg font-bold text-ink-900">
              Next: make it tile perfectly in your engine
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Generated maps are ready to drop in, but the tiling density and UV setup still matter.
              Read the practical walkthrough for Unity, Unreal and Blender.
            </p>
            <a
              href="/guides/texture-for-unity-unreal-blender"
              className="mt-4 inline-flex rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-700"
            >
              Read the engine guide
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
