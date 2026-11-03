import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About AI Texture - Seamless PBR Texture Engine",
  description:
    "AI Texture is a free, browser-based seamless PBR texture generator built on periodic noise. No uploads, no accounts, no watermark - by design.",
  path: "/about",
  keywords: ["about ai texture", "texture generator company"],
});

export default function AboutPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About AI Texture",
      url: "https://www.aitexture.app/about",
      description:
        "AI Texture is a free, browser-based seamless PBR texture generator built on periodic noise.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "AI Texture",
      url: "https://www.aitexture.app",
      logo: "https://www.aitexture.app/icon.svg",
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
        About AI Texture
      </h1>

      <div className="mt-7 space-y-5 text-base leading-relaxed text-ink-700">
        <p>
          AI Texture exists because of one recurring frustration: almost every AI-generated texture
          looks fine on its own and falls apart the moment you repeat it across a wall, a floor or a
          terrain.
        </p>
        <p>
          The problem is not the model, it is the output format. General image generators produce
          unique images with a unique border, and a unique border cannot tile. Most texture tools
          then bolt a Photoshop-style offset-and-blend workflow on top, which softens the structure
          and leaves the low-frequency lighting of the original frame repeating as a visible grid.
        </p>
        <p>
          We took the opposite approach. Every texture here is generated from periodic noise
          functions whose lattice wraps exactly at the tile boundary, so the edges match by
          construction rather than by repair. That same height field then produces the normal,
          roughness, ambient occlusion and height maps, which is why the map set stays internally
          consistent.
        </p>
        <p>
          The whole engine runs client-side in your browser. That is not a privacy feature bolted on
          afterwards - it is the reason the tool is free, instant and works with no connection at
          all.
        </p>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
        What we care about
      </h2>
      <ul className="mt-5 space-y-3">
        {[
          "Correctness over spectacle - a texture that tiles beats a texture that looks dramatic.",
          "No dark patterns - no watermarks, no credit walls, no fake urgency.",
          "No data collection - if it runs in the browser, we never see it.",
          "Clear documentation - the guides explain the maths, not just the buttons.",
        ].map((v) => (
          <li key={v} className="surface-card flex gap-3 px-5 py-4">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-500 text-xs font-bold text-white">
              ✓
            </span>
            <span className="text-sm leading-relaxed text-ink-700">{v}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl border border-azure-200 bg-azure-50 p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Start creating</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          The generator is free, needs no account and works offline once loaded.
        </p>
        <Link
          href="/ai-texture-generator"
          className="mt-4 inline-flex rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink-700"
        >
          Open the generator
        </Link>
      </div>
    </section>
    </>
  );
}
