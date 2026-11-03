import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import type { EngineWorkflow } from "@/lib/keyword-clusters";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";

const ACCENT_BG: Record<string, string> = {
  orange: "bg-sun-500",
  blue: "bg-azure-600",
  mint: "bg-mint-500",
};

const ACCENT_TEXT: Record<string, string> = {
  orange: "text-sun-700 bg-sun-100",
  blue: "text-azure-700 bg-azure-100",
  mint: "text-mint-700 bg-mint-50",
};

interface Props {
  config: EngineWorkflow;
  faq: Array<{ q: string; a: string }>;
  /** 引擎接入步骤 */
  steps: Array<{ title: string; body: string }>;
  /** 引擎设置代码块 */
  code: string;
  codeLang?: string;
  /** 引擎小贴士 */
  tips: string[];
  /** 引擎专属的额外说明段落 */
  notes: Array<{ h2: string; p: string[] }>;
}

export function EngineWorkflowPage({ config, faq, steps, code, codeLang, tips, notes }: Props) {
  const jsonLd = [
    softwareAppJsonLd({
      name: `${config.h1} - AI Texture`,
      description: config.description,
      path: `/${config.slug}`,
      features: [
        "Seamless tileable output",
        "Albedo, normal, roughness, AO, height maps",
        "512 / 1024 / 2048 px export",
        "Runs locally in browser",
        "Commercial license",
      ],
    }),
    faqJsonLd(faq),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: config.name, path: `/${config.slug}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="border-b border-ink-200 bg-gradient-to-b from-azure-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs font-medium text-ink-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-azure-600">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">{config.name}</li>
            </ol>
          </nav>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${ACCENT_TEXT[config.accent]}`}
            >
              {config.name} workflow
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

          <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            {[
              "Free forever",
              "No watermark",
              "No signup",
              "Commercial license",
              `${config.name}-ready`,
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
            How to use these textures in {config.name}
          </h2>
          <ol className="mt-8 space-y-3">
            {steps.map((s, i) => (
              <li key={s.title} className="surface-card flex gap-4 px-5 py-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-900 font-mono text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
            {config.name} settings that matter
          </h2>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-ink-900 p-5 text-sm leading-relaxed text-ink-100">
            <code>{code}</code>
          </pre>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="surface-card p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">Pro tips</h3>
              <ul className="mt-4 space-y-2.5">
                {tips.map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                    <span className="mt-0.5 text-mint-600" aria-hidden="true">
                      ✓
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card p-6">
              <h3 className="font-display text-lg font-bold text-ink-900">
                What {config.name} users generate most
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Ground and terrain surfaces",
                  "Wall and facade materials",
                  "Floor and tiling surfaces",
                  "Prop and furniture skins",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${ACCENT_BG[config.accent]}`} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {notes.map((n) => (
            <section key={n.h2} className="mt-12">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">{n.h2}</h2>
              {n.p.map((para) => (
                <p key={para.slice(0, 32)} className="mt-4 text-base leading-relaxed text-ink-700">
                  {para}
                </p>
              ))}
            </section>
          ))}

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

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/ai-texture-generator"
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900">
                Generic AI texture generator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The full tool - all 19 material types, four variants per run, complete PBR map pack.
              </p>
            </Link>
            <Link
              href={`/guides/texture-for-unity-unreal-blender`}
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900">
                Cross-engine setup guide
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Wrap modes, tiling values and material graph wiring for every major engine.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
