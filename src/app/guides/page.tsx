import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { GUIDES } from "@/lib/guides-data";

export const metadata: Metadata = pageMetadata({
  title: "Texture Guides for Game Dev and 3D Artists",
  description:
    "Practical guides on tileable textures, seamless surfaces, PBR map channels and texture setup for Unity, Unreal Engine, Godot and Blender.",
  path: "/guides",
  keywords: ["texture guides", "tileable texture tutorial", "pbr workflow guide"],
});

export default function GuidesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Texture Guides",
      url: "https://www.aitexture.app/guides",
      description:
        "Practical guides on tileable textures, PBR workflows and texture setup for Unity, Unreal Engine, Godot and Blender.",
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="border-b border-ink-200 bg-gradient-to-b from-azure-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            Texture guides
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            Straightforward, engine-specific writing on tileable textures, PBR channels and the
            little details that decide whether a material looks convincing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {GUIDES.map((g) => (
            <article
              key={g.slug}
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="rounded-full bg-azure-100 px-3 py-1 uppercase tracking-wide text-azure-700">
                  {g.category}
                </span>
                <span className="text-ink-400">{g.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-ink-900">
                <Link href={`/guides/${g.slug}`} className="hover:text-azure-600">
                  {g.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{g.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
