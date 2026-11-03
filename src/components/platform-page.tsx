import Link from "next/link";
import { PlatformBanner } from "@/components/platform-banner";
import { PlatformTextureGenerator } from "@/components/platform-texture-generator";
import type { PlatformConfig } from "@/lib/platforms";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";

interface Props {
  config: PlatformConfig;
  /** 相关平台页（内链） */
  siblings: Array<{ href: string; name: string; short: string; brand: string }>;
  /** 额外的专章（平台特有内容） */
  extraSection?: React.ReactNode;
  /** 额外 FAQ */
  extraFaq?: Array<{ q: string; a: string }>;
}

export function PlatformPage({ config, siblings, extraSection, extraFaq }: Props) {
  const allFaq = [...config.faq, ...(extraFaq ?? [])];

  const jsonLd = [
    softwareAppJsonLd({
      name: `${config.h1} - AI Texture`,
      description: config.description,
      path: `/${config.id === "unreal" ? "unreal-engine-texture-generator" : `${config.id}-texture-generator`}`,
      features: [
        ...config.exportMaps.map((m) => `${m.label} (${m.role.split(".")[0]})`),
        "Strictly seamless tileable output",
        "Runs locally in browser",
        "Commercial license",
      ],
    }),
    faqJsonLd(allFaq),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: config.name, path: `/${config.id === "unreal" ? "unreal-engine-texture-generator" : `${config.id}-texture-generator`}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="border-b border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            {config.h1}
          </h1>

          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            {config.intro}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            {[
              `Built for ${config.name}`,
              `${config.exportMaps.length} maps in engine format`,
              "No watermark",
              "Commercial license",
              `${config.defaultResolution}px default`,
            ].map((t) => (
              <li
                key={t}
                className="rounded-full px-3 py-1.5"
                style={{ background: config.brandSoft, color: config.brandInk }}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 平台 Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <PlatformBanner config={config} />
      </section>

      {/* 生成器 */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PlatformTextureGenerator platform={config} />
      </section>

      {/* 用户画像 */}
      <section className="border-y border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-card p-6">
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                style={{ background: config.brandSoft, color: config.brandInk }}
              >
                Who this is for
              </span>
              <p className="mt-4 text-base leading-relaxed text-ink-700">{config.audience}</p>
            </div>
            <div className="surface-card p-6">
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                style={{ background: config.brandSoft, color: config.brandInk }}
              >
                The real pain point
              </span>
              <p className="mt-4 text-base leading-relaxed text-ink-700">{config.painPoint}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 接入步骤 */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
          How to use these textures in {config.name}
        </h2>
        <ol className="mt-8 space-y-3">
          {config.steps.map((s, i) => (
            <li key={s.title} className="surface-card flex gap-4 px-5 py-4">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold text-white"
                style={{ background: config.brand }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* 导出包结构 */}
        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          What&apos;s in the {config.name} export pack
        </h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-ink-900 text-white">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  File suffix
                </th>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  What it controls
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {config.exportMaps.map((m) => (
                <tr key={m.suffix}>
                  <th scope="row" className="px-5 py-3.5">
                    <span className="flex items-center gap-2">
                      <code className="rounded bg-ink-100 px-2 py-0.5 font-mono text-xs font-semibold text-ink-800">
                        {m.suffix}
                      </code>
                      {m.special && (
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                          style={{ background: config.brandSoft, color: config.brandInk }}
                        >
                          packed
                        </span>
                      )}
                    </span>
                  </th>
                  <td className="px-5 py-3.5 leading-relaxed text-ink-600">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 平台专属论述 */}
        {config.notes.map((n) => (
          <section key={n.h2} className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">{n.h2}</h2>
            {n.p.map((para) => (
              <p key={para.slice(0, 32)} className="mt-4 text-base leading-relaxed text-ink-700">
                {para}
              </p>
            ))}
          </section>
        ))}

        {extraSection}

        {/* 材质映射表 */}
        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          Prompt to {config.name} material mapping
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-700">
          Start from the left column, and the generated texture will match what the engine expects
          on the right.
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-ink-50">
              <tr>
                <th scope="col" className="px-5 py-3 font-display text-xs uppercase tracking-wider text-ink-700">
                  Prompt
                </th>
                <th scope="col" className="px-5 py-3 font-display text-xs uppercase tracking-wider text-ink-700">
                  {config.name} material
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {config.materialMap.map((m) => (
                <tr key={m.prompt}>
                  <td className="px-5 py-3 text-ink-700">{m.prompt}</td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-ink-100 px-2 py-0.5 font-mono text-xs font-semibold text-ink-800">
                      {m.engine}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          {config.name} texture generator FAQ
        </h2>
        <div className="mt-6 space-y-3">
          {allFaq.map((f) => (
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

        {/* 兄弟平台 */}
        <h2 className="mt-12 font-display text-2xl font-bold tracking-tight text-ink-900">
          Other engine workflows
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {siblings.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="surface-card flex items-center gap-3 p-4 transition-shadow hover:shadow-md"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
                style={{ background: s.brand }}
              >
                {s.short.slice(0, 2)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-bold text-ink-900">{s.name}</span>
                <span className="block text-xs text-ink-500">Open workflow</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
