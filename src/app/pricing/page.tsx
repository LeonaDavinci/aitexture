import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing - Free AI Texture Generator, No Paid Tier Required",
  description:
    "AI Texture is free: unlimited generations, 2048px exports, full PBR map packs and a commercial license. No subscriptions, no credits, no watermarks.",
  path: "/pricing",
  keywords: ["ai texture pricing", "free texture generator", "free pbr textures"],
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    highlight: true,
    features: [
      "Unlimited texture generations",
      "4 variants per run",
      "512 / 1024 / 2048 px export",
      "Full PBR map pack (normal, roughness, AO, height)",
      "Seamless tiling preview",
      "Commercial use license",
      "No watermark, no signup",
    ],
    cta: "Start generating",
    href: "/tools/ai-texture-generator",
  },
  {
    name: "Batch & API",
    price: "Contact",
    period: "for teams",
    highlight: false,
    features: [
      "Everything in Free",
      "Batch generation pipelines",
      "Team asset libraries",
      "Priority feature requests",
      "Commercial licensing for redistribution",
    ],
    cta: "Talk to us",
    href: "/about",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            One plan. Free. Actually free.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            Generation runs on your own hardware, so there is no compute bill to pass on. No credits,
            no watermarks, no gated resolution.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={
                p.highlight
                  ? "relative rounded-2xl border-2 border-sun-500 bg-white p-8 shadow-lg"
                  : "relative rounded-2xl border border-ink-200 bg-white p-8"
              }
            >
              {p.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-sun-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-bold text-ink-900">{p.name}</h2>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold text-ink-900">{p.price}</span>
                <span className="text-sm font-medium text-ink-500">{p.period}</span>
              </p>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink-700">
                    <span className="mt-0.5 text-mint-600" aria-hidden="true">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={
                  p.highlight
                    ? "btn-primary mt-8 block rounded-xl px-5 py-3 text-center text-sm font-bold"
                    : "btn-secondary mt-8 block rounded-xl px-5 py-3 text-center text-sm font-bold"
                }
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-ink-200 bg-ink-50 p-6">
          <h2 className="font-display text-lg font-bold text-ink-900">Licensing in plain words</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Everything you generate is yours. Use it in commercial games, client renders, marketing
            imagery, physical products and films. No attribution required. You cannot resell the
            generator itself or redistribute it as a competing service.
          </p>
        </div>
      </section>
    </>
  );
}
