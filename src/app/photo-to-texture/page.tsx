import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, softwareAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Photo to Texture - Seamless PBR Maps",
  description:
    "Convert a photo of a real surface into a tileable PBR texture with matching normal, roughness, AO and height maps. Free, in-browser, no upload.",
  path: "/photo-to-texture",
  keywords: [
    "photo to texture",
    "image to texture ai",
    "image to seamless texture",
    "photo to pbr material",
    "texture from photo",
  ],
});

const FAQ = [
  {
    q: "How will the photo to texture tool work?",
    a: "The pipeline mirrors the prompt generator: detect the dominant lighting gradient and flatten it, mirror the edges so the tile matches itself, extract a height field from luminance, and derive the normal, roughness and AO maps from that height field.",
  },
  {
    q: "What kind of photo works best?",
    a: "Shoot straight on, perpendicular to the surface, with the material filling the frame. Avoid harsh directional shadows and strong vignetting - the flatter the lighting, the less the tool has to correct.",
  },
  {
    q: "Will the result tile seamlessly?",
    a: "Yes. Edge mirroring produces a border that matches itself by construction, which is the same guarantee the prompt-based generator gives.",
  },
  {
    q: "Can I use the resulting texture commercially?",
    a: "Yes, with the same commercial license as every other texture - games, client renders, advertising and products, no attribution.",
  },
];

export default function PhotoToTexturePage() {
  const jsonLd = [
    softwareAppJsonLd({
      name: "Photo to Texture - AI Texture",
      description:
        "Convert photographs of real surfaces into seamless, tileable PBR texture packs with matched normal, roughness, AO and height maps.",
      path: "/photo-to-texture",
      features: [
        "Edge-mirrored seamless output",
        "Low-frequency lighting removal",
        "Albedo, normal, roughness, AO, height maps",
        "Runs locally in browser",
        "Commercial license",
      ],
    }),
    faqJsonLd(FAQ),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Photo to Texture", path: "/photo-to-texture" },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
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
              <li className="text-ink-700">Photo to Texture</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            Photo to seamless PBR texture
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            Shoot a wall, a floor or a piece of fabric, and turn it into a repeatable material with a
            full map set - without leaving your browser.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface-card p-8 text-center">
          <span className="inline-flex rounded-full bg-sun-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sun-700">
            In development
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink-900">
            Photo import lands in the next release
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600">
            The photo pipeline will share the same engine as the prompt generator: edge-mirrored
            tiling, low-frequency lighting removal and PBR maps derived from the extracted height.
            It is being wired into the same editor now.
          </p>
          <Link
            href="/ai-texture-generator"
            className="mt-6 inline-flex rounded-xl bg-ink-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-ink-700"
          >
            Use the prompt generator instead
          </Link>
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          How the photo workflow will work
        </h2>
        <ol className="mt-6 space-y-3">
          {[
            "Drop in a photo taken straight-on, filling the frame with the surface.",
            "The tool detects the dominant lighting gradient and flattens it, removing the bright-centre / dark-corner checkerboard.",
            "Edge mirroring produces a border that matches itself exactly.",
            "A height field is extracted from luminance, and normal, roughness and AO maps are derived from it.",
          ].map((step, i) => (
            <li key={step} className="surface-card flex gap-4 px-5 py-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-900 font-mono text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ink-700">{step}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          Photo to texture FAQ
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
      </section>
    </>
  );
}
