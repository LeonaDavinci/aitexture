import Link from "next/link";

const NAV = [
  { href: "/ai-texture-generator", label: "Texture Generator" },
  { href: "/seamless-texture-generator", label: "Seamless Tiles" },
  { href: "/pbr-texture-generator", label: "PBR Maps" },
  { href: "/roblox-texture-generator", label: "Roblox Texture", dot: "#e2231a" },
  { href: "/blender-texture-generator", label: "Blender Texture", dot: "#f5792a" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

const PLATFORM_SHORTCUTS = [
  {
    href: "/roblox-texture-generator",
    label: "Roblox Texture",
    logo: "/logos/roblox-icon.png",
    color: "#e2231a",
  },
  {
    href: "/blender-texture-generator",
    label: "Blender Texture",
    logo: "/logos/blender.png",
    color: "#f5792a",
  },
  {
    href: "/unreal-engine-texture-generator",
    label: "Unreal Texture",
    color: "#313131",
  },
  {
    href: "/unity-texture-generator",
    label: "Unity Texture",
    color: "#222c37",
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="AI Texture home">
          <img
            src="/logo.png"
            width={36}
            height={36}
            alt=""
            aria-hidden="true"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            AI<span className="text-sun-500">Texture</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900 xl:px-3 xl:text-sm"
            >
              {item.dot ? (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.dot }}
                  aria-hidden="true"
                />
              ) : null}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/ai-texture-generator"
            className="btn-primary hidden rounded-xl px-4 py-2.5 text-sm font-semibold xl:inline-flex"
          >
            Start Generating
          </Link>
          <Link
            href="/ai-texture-generator"
            className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-semibold text-ink-700 xl:hidden"
          >
            Try it
          </Link>
        </div>
      </div>

      <div className="border-t border-ink-100 lg:hidden">
        <nav
          aria-label="Platform shortcuts"
          className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 [scrollbar-width:none]"
        >
          {PLATFORM_SHORTCUTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:border-sun-300 hover:bg-sun-50 hover:text-ink-900"
            >
              {item.logo ? (
                <img
                  src={item.logo}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="h-4 w-4 rounded-sm bg-white object-contain"
                />
              ) : (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
