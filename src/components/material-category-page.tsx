import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import type { MaterialPage } from "@/lib/keyword-clusters";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";

const ACCENT_BG: Record<string, string> = {
  orange: "bg-sun-500",
  blue: "bg-azure-600",
  mint: "bg-mint-500",
  ink: "bg-ink-700",
};

const ACCENT_TEXT: Record<string, string> = {
  orange: "text-sun-700 bg-sun-100",
  blue: "text-azure-700 bg-azure-100",
  mint: "text-mint-700 bg-mint-50",
  ink: "text-ink-700 bg-ink-100",
};

interface Props {
  config: MaterialPage;
  faq: Array<{ q: string; a: string }>;
  /** 相关材质页 */
  related: Array<{ slug: string; name: string }>;
}

export function MaterialCategoryPage({ config, faq, related }: Props) {
  const jsonLd = [
    softwareAppJsonLd({
      name: `${config.h1} - AI Texture`,
      description: config.description,
      path: `/${config.slug}`,
      features: [
        `Dedicated ${config.name.toLowerCase()} material models`,
        "Strictly seamless tileable output",
        "Albedo, normal, roughness, AO, height maps",
        "512 / 1024 / 2048 px export",
        "Commercial license",
      ],
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: `${config.name} textures`, path: `/${config.slug}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-azure-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">{config.name} textures</li>
            </ol>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${ACCENT_TEXT[config.accent]}`}
            >
              {config.name} material
            </span>
            <span className="text-xs font-semibold text-ink-500">
              Seamless · Tileable · Full PBR map pack
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            {config.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            {config.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TextureGenerator initialPrompt={config.prompt} />
      </section>

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            What makes a convincing {config.name.toLowerCase()} texture
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {config.traits.map((t, i) => (
              <article key={t} className="surface-card p-6">
                <span className={`block h-1.5 w-12 rounded-full ${ACCENT_BG[config.accent]}`} aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold text-ink-900">
                  {config.name} detail {i + 1}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{t}</p>
              </article>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
            Prompting for {config.name.toLowerCase()}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            The generator maps your prompt onto a material recipe: base surface, dominant colour,
            finish and detail scale. Naming the surface precisely beats describing a mood.
          </p>
          <ul className="mt-5 space-y-2.5">
            {[
              `Start with the surface itself - "${config.prompt.split(",")[0]}".`,
              "Add a colour word to set the base tone - red, blue, grey, oak, cream.",
              "Add a finish word to steer the surface - glossy, matte, weathered, cracked, fine, coarse.",
              "Add a pixel hint to control density - for example \"512px coarse\" for large architectural surfaces.",
            ].map((t) => (
              <li key={t} className="surface-card flex gap-3 px-5 py-4">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-500 text-xs font-bold text-white">
                  ✓
                </span>
                <span className="text-sm leading-relaxed text-ink-700">{t}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
            {config.name} texture generator FAQ
          </h2>
          <div className="mt-6 space-y-3">
            {faq.map((f) => (
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

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href="/ai-texture-generator"
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900">All 19 material types</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Wood, brick, concrete, stone, fabric, leather, marble, metal, rust, tile, asphalt,
                sand, snow, grass, mud, glass, carbon fibre, paper and water.
              </p>
            </Link>
            <div className="surface-card p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">
                Other {config.name.toLowerCase()} texture pages
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.slug}`}
                    className="chip px-3.5 py-2 text-sm font-medium"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
