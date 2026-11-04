import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform-page";
import { PLATFORMS, getPlatform } from "@/lib/platforms";
import { pageMetadata } from "@/lib/seo";

const CFG = getPlatform("roblox");

export const metadata: Metadata = pageMetadata({
  title: CFG.title,
  description: CFG.description,
  path: "/roblox-texture-generator",
  keywords: CFG.keywords,
  ogTitle: CFG.title,
  ogDescription: CFG.description,
});

const SIBLINGS = PLATFORMS.filter((p) => p.id !== "roblox").map((p) => ({
  href:
    p.id === "unreal"
      ? "/unreal-engine-texture-generator"
      : p.id === "blender"
        ? "/blender-texture-generator"
        : "/unity-texture-generator",
  name: p.name,
  short: p.shortName,
  brand: p.brand,
}));

/** Region layout of the official Roblox avatar skin UV template */
const AVATAR_UV = [
  { region: "Head & face", uv: "0.00–0.50 (face front), 0.50–1.00 (head back)", note: "Head" },
  { region: "Torso front", uv: "0.00–0.50, 0.50–1.00", note: "Torso" },
  { region: "Torso back", uv: "0.00–0.50, 0.00–0.50", note: "Torso" },
  { region: "Left arm", uv: "0.00–0.25", note: "Left Arm" },
  { region: "Right arm", uv: "0.25–0.50", note: "Right Arm" },
  { region: "Left leg", uv: "0.50–0.75", note: "Left Leg" },
  { region: "Right leg", uv: "0.75–1.00", note: "Right Leg" },
];

export default function RobloxTextureGeneratorPage() {
  return (
    <PlatformPage
      config={CFG}
      siblings={SIBLINGS}
      extraSection={
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink-900">
            Avatar skin UV template
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            Roblox clothing does not use a tiling texture. Every avatar body part has a fixed
            region in a single &quot;template&quot; image, and the clothing mesh&apos;s UVs are mapped
            onto it. That means a seamless tileable texture is the wrong tool here — what you need
            is a colour image composed into the template&apos;s regions.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            {/* UV template diagram */}
            <div className="surface-card p-5">
              <h3 className="font-display text-base font-bold text-ink-900">
                Classic 587×640 template layout
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Roblox&apos;s classic template splits into a 2×4 grid of body regions. The face
                shares the head block, and the front/back split applies to the torso.
              </p>
              <svg
                viewBox="0 0 200 280"
                className="mt-4 w-full"
                role="img"
                aria-label="Roblox avatar UV template region map"
              >
                <rect x="0" y="0" width="200" height="280" fill="#f5f7fb" stroke="#cdd6e6" />
                {/* Head */}
                <rect x="50" y="6" width="100" height="60" fill="#fde68a" stroke="#a16207" strokeWidth="1.5" />
                <text x="100" y="32" textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="700">
                  Head
                </text>
                <text x="100" y="48" textAnchor="middle" fontSize="8" fill="#92400e">
                  face + back
                </text>
                {/* Torso */}
                <rect x="50" y="70" width="100" height="56" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="1.5" />
                <text x="100" y="94" textAnchor="middle" fontSize="11" fill="#1e3a8a" fontWeight="700">
                  Torso
                </text>
                <text x="100" y="110" textAnchor="middle" fontSize="8" fill="#1e40af">
                  front / back
                </text>
                {/* Arms */}
                <rect x="10" y="132" width="44" height="52" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" />
                <text x="32" y="154" textAnchor="middle" fontSize="9" fill="#166534" fontWeight="700">
                  LArm
                </text>
                <rect x="146" y="132" width="44" height="52" fill="#bbf7d0" stroke="#15803d" strokeWidth="1.5" />
                <text x="168" y="154" textAnchor="middle" fontSize="9" fill="#166534" fontWeight="700">
                  RArm
                </text>
                {/* Legs */}
                <rect x="10" y="190" width="44" height="80" fill="#fbcfe8" stroke="#be185d" strokeWidth="1.5" />
                <text x="32" y="228" textAnchor="middle" fontSize="9" fill="#9d174d" fontWeight="700">
                  LLeg
                </text>
                <rect x="146" y="190" width="44" height="80" fill="#fbcfe8" stroke="#be185d" strokeWidth="1.5" />
                <text x="168" y="228" textAnchor="middle" fontSize="9" fill="#9d174d" fontWeight="700">
                  RLeg
                </text>
              </svg>
            </div>

            {/* Region breakdown */}
            <div className="surface-card p-5">
              <h3 className="font-display text-base font-bold text-ink-900">Region breakdown</h3>
              <ul className="mt-4 space-y-2.5">
                {AVATAR_UV.map((r) => (
                  <li key={r.region} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink-100 pb-2.5 last:border-0">
                    <span className="font-display text-sm font-bold text-ink-900">{r.region}</span>
                    <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[11px] text-ink-700">
                      {r.uv}
                    </code>
                    <span className="ml-auto text-xs text-ink-500">{r.note}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-amber-50 p-4">
                <h4 className="font-display text-sm font-bold text-amber-900">
                  How to use this generator for clothing
                </h4>
                <ol className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-800">
                  <li>1. Generate the material you want — leather, denim, knit, metal trim.</li>
                  <li>2. Use the albedo as the reference for how each panel should look.</li>
                  <li>3. Paint each region of the template with the matching part of that albedo.</li>
                  <li>4. Upload to Roblox via the Avatar Editor (Shirt / Pants / Texture).</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      }
      extraFaq={[
        {
          q: "How do I make a Roblox avatar skin from a generated texture?",
          a: "Generate the material you want, then use the albedo as a visual reference and paint each region of Roblox's avatar template - head, torso, arms, legs - with the matching part of that texture. Then upload it through the Avatar Editor as a Shirt, Pants or Texture.",
        },
        {
          q: "What resolution does Roblox clothing need?",
          a: "The classic template is 587x640 pixels. Roblox also accepts larger source images that get scaled down, but the region boundaries must stay proportional, so working at the native template size avoids misalignment.",
        },
      ]}
    />
  );
}
