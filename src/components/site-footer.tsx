import Link from "next/link";

const COLUMNS = [
  {
    title: "Tools",
    links: [
      { href: "/tools/ai-texture-generator", label: "AI Texture Generator" },
      { href: "/tools/seamless-texture-generator", label: "Seamless Texture Generator" },
      { href: "/tools/pbr-texture-generator", label: "PBR Texture Generator" },
      { href: "/tools/photo-to-texture", label: "Photo to Texture" },
    ],
  },
  {
    title: "Materials",
    links: [
      { href: "/tools/ai-texture-generator?preset=brick", label: "Brick" },
      { href: "/tools/ai-texture-generator?preset=wood", label: "Wood" },
      { href: "/tools/ai-texture-generator?preset=concrete", label: "Concrete" },
      { href: "/tools/ai-texture-generator?preset=metal", label: "Metal" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/guides", label: "Guides & Tutorials" },
      { href: "/guides/what-is-a-tileable-texture", label: "What is a tileable texture" },
      { href: "/guides/pbr-texture-workflow", label: "PBR texture workflow" },
      { href: "/guides/texture-for-unity-unreal-blender", label: "Unity / Unreal / Blender" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-sm font-bold text-white">
                AT
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-ink-900">
                AI<span className="text-sun-500">Texture</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              Free seamless PBR texture generator that runs entirely in your browser. No upload,
              no watermark, commercial use included.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ink-900">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-600 transition-colors hover:text-sun-600"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} AI Texture (aitexture.app). All rights reserved.</p>
          <p>Made for 3D artists, game devs and indie studios.</p>
        </div>
      </div>
    </footer>
  );
}
