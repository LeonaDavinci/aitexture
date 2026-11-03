import type { Metadata } from "next";
import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "PBR Texture Generator - Albedo, Normal, Roughness Maps Online",
  description:
    "Free PBR texture generator. Create physically based material packs with matching albedo, normal, roughness, ambient occlusion and height maps. Ready for Unity URP, Unreal Engine 5 and Blender.",
  path: "/tools/pbr-texture-generator",
  keywords: [
    "pbr texture generator",
    "normal map generator",
    "roughness map generator",
    "ambient occlusion map",
    "material pack generator",
    "physically based texture",
  ],
});

const CHANNELS = [
  {
    name: "Albedo",
    code: "BaseColor",
    body: "The pure colour of the surface with no lighting baked in. This is the map you tint and the map your artists paint over.",
  },
  {
    name: "Normal",
    code: "NormalMap",
    body: "Tangent-space direction data derived from the height field. It makes the light react to bumps and grooves without adding polygons.",
  },
  {
    name: "Roughness",
    code: "Roughness",
    body: "How scattered the reflection is. Low roughness gives polished metal and glazed ceramic; high roughness gives matte concrete and raw cloth.",
  },
  {
    name: "Ambient Occlusion",
    code: "AO",
    body: "Contact darkening in creases and gaps. It is what stops a texture from looking like a flat sticker once it is lit.",
  },
  {
    name: "Height",
    code: "Height / Displacement",
    body: "Real surface depth. Use it for parallax, displacement or POM in engines that support it.",
  },
];

const WORKFLOW = [
  {
    step: "Generate",
    body: "Type your material description and run the generator. You get four albedo variants with a full matching map set each.",
  },
  {
    step: "Check the tiling",
    body: "Use the 2x2 to 4x4 preview to confirm the repeat density matches how the surface will be used in the scene.",
  },
  {
    step: "Download the pack",
    body: "Save all five PNG maps at the same resolution so they stay pixel-aligned.",
  },
  {
    step: "Wire it up",
    body: "In Unity URP, assign the maps to Base Map, Normal Map, Smoothness / Roughness and AO. In Unreal, plug them into a material instance.",
  },
  {
    step: "Break up the repeat",
    body: "Add a low-frequency detail normal or a macro variation mask in the shader so large surfaces do not read as one repeated tile.",
  },
];

export default function PbrTexturePage() {
  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-b from-sun-50 to-white">
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
                <Link href="/tools/ai-texture-generator" className="hover:text-azure-600">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink-700">PBR Texture Generator</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            PBR Texture Generator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
            Generate a complete physically based material pack - albedo, normal, roughness, ambient
            occlusion and height - all derived from one consistent height field so the maps agree
            with each other.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TextureGenerator initialPrompt="brushed steel metal plate, fine linear scratches, subtle dents" />
      </section>

      <section className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            The five maps in every pack
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink-900 text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-display text-xs uppercase tracking-wider">
                    Map
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs uppercase tracking-wider">
                    Engine slot
                  </th>
                  <th scope="col" className="hidden px-4 py-3 font-display text-xs uppercase tracking-wider sm:table-cell">
                    What it controls
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {CHANNELS.map((c) => (
                  <tr key={c.name}>
                    <th scope="row" className="px-4 py-3 font-display font-bold text-ink-900">
                      {c.name}
                    </th>
                    <td className="px-4 py-3">
                      <code className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-xs text-ink-800">
                        {c.code}
                      </code>
                    </td>
                    <td className="hidden px-4 py-3 leading-relaxed text-ink-600 sm:table-cell">
                      {c.body}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-14 text-balance font-display text-3xl font-bold tracking-tight text-ink-900">
            From prompt to engine in five steps
          </h2>
          <ol className="mt-8 space-y-3">
            {WORKFLOW.map((w, i) => (
              <li key={w.step} className="surface-card flex gap-4 px-5 py-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-900 font-mono text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">{w.step}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{w.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href="/guides/pbr-texture-workflow"
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900">
                The full PBR texture workflow guide
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Everything about map channels, tiling density and material setup, explained properly.
              </p>
            </Link>
            <Link
              href="/tools/ai-texture-generator"
              className="surface-card p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900">
                Open the AI texture generator
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Four variants plus a complete map pack, generated free in your browser.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
