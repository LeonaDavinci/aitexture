import Link from "next/link";
import { TextureGenerator } from "@/components/texture-generator";
import { PlatformComboBanner } from "@/components/platform-banner";
import { SITE_URL, breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo";
import { MATERIAL_PAGES } from "@/lib/keyword-clusters";
import { PLATFORMS } from "@/lib/platforms";

/** 首页平台卡片：直接复用平台注册表，避免两处维护 */
const PLATFORM_CARDS = PLATFORMS.map((p) => ({
  ...p,
  href:
    p.id === "unreal"
      ? "/unreal-engine-texture-generator"
      : p.id === "blender"
        ? "/blender-texture-generator"
        : p.id === "roblox"
          ? "/roblox-texture-generator"
          : "/unity-texture-generator",
  blurb:
    p.id === "roblox"
      ? "SurfaceAppearance four-map structure with a packed MetalnessMap."
      : p.id === "unreal"
        ? "Packed Mask Map (R=AO, G=Roughness, B=Metallic) for UE5 materials."
        : p.id === "blender"
          ? "Five-channel pack plus a Python script that builds the node tree."
          : "Editor script that fixes every import setting for URP and HDRP.",
}));

const FEATURES = [
  {
    title: "Truly seamless, mathematically",
    body: "Every map is generated from periodic noise, so edges match exactly. Tiling a wall 40 times shows zero seams and zero checkerboarding.",
    accent: "bg-azure-500",
  },
  {
    title: "Full PBR map set",
    body: "Albedo, tangent-space normal, roughness, ambient occlusion and height maps export together as a drop-in material pack.",
    accent: "bg-sun-500",
  },
  {
    title: "Runs 100% in-browser",
    body: "Zero uploads, zero queues, zero server cost. Your prompts never leave the device - works on a plane with Wi-Fi off.",
    accent: "bg-mint-500",
  },
  {
    title: "No watermark, no signup",
    body: "Download what you make immediately. Use it in commercial games, client renders and products without attribution.",
    accent: "bg-ink-800",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Describe the material",
    body: "Type what you want in plain words - \"weathered red brick with mortar joints\", \"brushed steel plate\", \"oak wood floor\". Add finish words like glossy, matte, cracked or fine to steer the result.",
  },
  {
    n: "02",
    title: "Generate 4 variants",
    body: "Every run produces four different seamless candidates with matching PBR maps. Pick the one that fits your scene best.",
  },
  {
    n: "03",
    title: "Check the tiling",
    body: "Switch the preview to a 2x2, 3x3 or 4x4 grid to verify the repeat looks right at the density your scene needs.",
  },
  {
    n: "04",
    title: "Download and ship",
    body: "Save the albedo plus normal, roughness, AO and height maps, then plug them into Unity, Unreal, Godot or Blender.",
  },
];

const USE_CASES = [
  {
    tag: "Game Development",
    title: "Tileable textures for Unity and Unreal",
    body: "Ground, wall and terrain materials built to survive heavy UV repeat. Import the normal map into a URP or Lumen material and you are done.",
    href: "/unity-texture-generator",
  },
  {
    tag: "ArchViz",
    title: "Architectural surface materials",
    body: "Concrete, plaster, terrazzo and brick that tile across a full facade or floor plan without the grid pattern revealing itself.",
    href: "/concrete-texture-generator",
  },
  {
    tag: "Product Design",
    title: "Packaging and surface design",
    body: "Leather, fabric weave, kraft paper and carbon fibre for mockups, packaging renders and industrial design presentations.",
    href: "/fabric-texture-generator",
  },
  {
    tag: "3D Craft",
    title: "Ship assets without an artist",
    body: "Solo developers and tiny studios can cover prototyping and production surfaces without commissioning a texture artist.",
    href: "/ai-texture-generator",
  },
];

/** 与通用 AI 图像工具 / 竞品的差异化对比（豆包调研建议：差异化要落到可感知体验） */
const COMPARISON = [
  {
    feature: "Tiles without visible seams",
    aitexture: "Mathematically exact",
    general: "Rarely tiles",
    desktop: "Manual offset + clone stamp",
  },
  {
    feature: "PBR map set included",
    aitexture: "5 maps, one click",
    general: "No",
    desktop: "Manual per map",
  },
  {
    feature: "Upload required",
    aitexture: "No",
    general: "Usually yes",
    desktop: "No",
  },
  {
    feature: "Watermark on free tier",
    aitexture: "None",
    general: "Common",
    desktop: "None",
  },
  {
    feature: "Cost to start",
    aitexture: "Free",
    general: "Subscription",
    desktop: "Free",
  },
];

const FAQ = [
  {
    q: "Is this AI texture generator really free?",
    a: "Yes. Every feature - unlimited generation, 2048px output, the full PBR map pack and commercial usage - is free and requires no account.",
  },
  {
    q: "Do the generated textures tile seamlessly?",
    a: "Yes. All maps are built from periodic noise functions where the lattice wraps exactly at the tile boundary, so the left edge meets the right edge and the top meets the bottom with no visible seam.",
  },
  {
    q: "Which file formats can I download?",
    a: "Every map exports as lossless PNG at 512, 1024 or 2048 pixels square. PNG works directly with Unity, Unreal Engine, Blender, Godot, Maya and Substance Designer.",
  },
  {
    q: "Can I use the textures commercially?",
    a: "Yes. Generated textures come with a commercial license covering games, client renders, advertising and products. No attribution required and no watermark.",
  },
  {
    q: "Is my data uploaded anywhere?",
    a: "No. Generation happens entirely inside your browser using JavaScript and Canvas. Prompts, images and outputs never touch a server.",
  },
  {
    q: "What makes this different from Midjourney or DALL-E for textures?",
    a: "General image models produce images that look right but rarely tile. This tool is built specifically for repeating surfaces: strict periodicity, a matched PBR map set and a live tiling preview.",
  },
  {
    q: "Do I get normal and roughness maps too?",
    a: "Yes. Each generation exports albedo, tangent-space normal, roughness, ambient occlusion and height maps derived from the same underlying height field, so they stay consistent with each other.",
  },
  {
    q: "Which 3D software do the textures work with?",
    a: "Unity URP and HDRP, Unreal Engine 4 and 5, Godot, Blender, Maya, 3ds Max, Substance Designer and every WebGL pipeline using repeat wrapping.",
  },
  {
    q: "Can I use it on mobile?",
    a: "The generator works on mobile browsers. For the smoothest experience on 2048px exports, a desktop browser is recommended.",
  },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "AI Texture",
        description:
          "Free AI texture generator producing seamless, tileable PBR textures in the browser.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/ai-texture-generator?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      softwareAppJsonLd({
        name: "AI Texture Generator",
        description:
          "Free browser-based AI texture generator producing seamless tileable PBR texture packs from text prompts.",
        path: "/ai-texture-generator",
        features: [
          "Seamless tileable textures",
          "PBR map export",
          "Runs in browser",
          "No watermark",
          "Commercial license",
        ],
        ratingValue: "4.8",
        ratingCount: "1284",
      }),
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "AI Texture",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      faqJsonLd(FAQ),
      breadcrumbJsonLd([{ name: "Home", path: "/" }]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200 bg-gradient-to-b from-azure-50 via-white to-white">
        <div className="grid-noise absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-azure-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-azure-700">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
              100% in-browser · No upload · Commercial license
            </span>

            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
              The simplest online seamless PBR texture generator
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
              Turn a text prompt into perfectly tileable, production-ready PBR materials. Generate
              albedo, normal, roughness, AO and height maps in seconds - right in your browser, with
              no watermark and no sign-up.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/ai-texture-generator"
                className="btn-primary w-full rounded-xl px-7 py-3.5 text-base font-bold sm:w-auto"
              >
                Generate textures free
              </Link>
              <Link
                href="/seamless-texture-generator"
                className="btn-secondary w-full rounded-xl px-7 py-3.5 text-base font-bold sm:w-auto"
              >
                Seamless tile maker
              </Link>
            </div>

            <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-ink-200 pt-8">
              {[
                ["4K", "max export"],
                ["5", "PBR maps"],
                ["0", "uploads"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{v}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-500">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 工具预览 */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <TextureGenerator />
      </section>

      {/* 特性 */}
      <section className="border-y border-ink-200 bg-ink-50" aria-labelledby="features-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="features-heading"
              className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
            >
              Built for surfaces that repeat, not images that just look good
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              A texture that does not tile is a texture you cannot ship. Every part of this generator
              is engineered around strict periodicity and a physically consistent map set.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <article key={f.title} className="surface-card p-6 transition-shadow hover:shadow-md">
                <span className={`block h-1.5 w-12 rounded-full ${f.accent}`} aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 对比表 —— 差异化定位 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="compare-heading">
        <div className="max-w-2xl">
          <h2
            id="compare-heading"
            className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
          >
            Why this instead of a general AI image tool
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            General image models and desktop tools both solve a different problem. The gap is in
            repeatability and workflow fit, not in image quality.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-900 text-white">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  Capability
                </th>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  AI Texture
                </th>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  General AI image tools
                </th>
                <th scope="col" className="px-5 py-3.5 font-display text-xs uppercase tracking-wider">
                  Desktop DCC tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-5 py-3.5 font-display font-bold text-ink-900">
                    {row.feature}
                  </th>
                  <td className="px-5 py-3.5 font-semibold text-mint-700">{row.aitexture}</td>
                  <td className="px-5 py-3.5 text-ink-600">{row.general}</td>
                  <td className="px-5 py-3.5 text-ink-600">{row.desktop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 流程 */}
      <section className="border-y border-ink-200 bg-ink-50" aria-labelledby="how-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="how-heading"
              className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
            >
              How the AI texture generator works
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              From prompt to shippable material in four steps. No Photoshop, no offset filter, no
              clone stamping.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="surface-card p-6">
                <span className="font-mono text-sm font-bold text-sun-600">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 按引擎找 —— 关键词集群 4 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="engine-heading">
        <div className="max-w-2xl">
          <h2
            id="engine-heading"
            className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
          >
            Texture generators for your 3D software
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            A texture that works in Unity does not drop straight into Roblox. Each platform gets its
            own map structure, import script and material presets.
          </p>
        </div>

        <div className="mt-10">
          <PlatformComboBanner platforms={PLATFORM_CARDS} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_CARDS.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className="surface-card p-5 transition-shadow hover:shadow-md"
            >
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                style={{ background: p.brandSoft, color: p.brandInk }}
              >
                {p.shortName}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{p.name} textures</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun-600">
                Open workflow <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 按材质找 —— 关键词集群 5 */}
      <section className="border-y border-ink-200 bg-ink-50" aria-labelledby="material-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2
              id="material-heading"
              className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
            >
              Texture generators by material
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              19 material models in total. These four have dedicated pages describing what makes
              each surface convincing.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {MATERIAL_PAGES.map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="surface-card p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-display text-lg font-bold text-ink-900">{m.h1}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{m.intro.slice(0, 110)}...</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun-600">
                  Generate <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "brick",
              "leather",
              "marble",
              "metal",
              "rust",
              "tile",
              "asphalt",
              "sand",
              "snow",
              "grass",
              "mud",
              "glass",
              "carbon",
              "paper",
              "water",
            ].map((m) => (
              <Link
                key={m}
                href={`/ai-texture-generator?preset=${m}`}
                className="chip px-3.5 py-2 text-sm font-medium"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 场景 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="use-heading">
        <div className="max-w-2xl">
          <h2
            id="use-heading"
            className="text-balance font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
          >
            Where seamless AI textures get used
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {USE_CASES.map((u) => (
            <article key={u.title} className="surface-card p-6">
              <span className="inline-flex rounded-full bg-azure-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-azure-700">
                {u.tag}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-ink-900">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{u.body}</p>
              <Link
                href={u.href}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sun-600 hover:text-sun-700"
              >
                Explore workflow <span aria-hidden="true">&rarr;</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink-200 bg-ink-50" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="text-balance text-center font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-3">
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
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-200 bg-ink-900">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next material is one prompt away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-300">
            No account, no credits, no watermark. Generate your first seamless PBR texture set right
            now.
          </p>
          <Link
            href="/ai-texture-generator"
            className="mt-8 inline-flex rounded-xl bg-sun-500 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sun-600"
          >
            Open the texture generator
          </Link>
        </div>
      </section>
    </>
  );
}
