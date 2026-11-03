import Link from "next/link";

const NAV = [
  { href: "/ai-texture-generator", label: "Texture Generator" },
  { href: "/seamless-texture-generator", label: "Seamless Tiles" },
  { href: "/pbr-texture-generator", label: "PBR Maps" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="AI Texture home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-sm font-bold text-white">
            AT
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink-900">
            AI<span className="text-sun-500">Texture</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/ai-texture-generator"
            className="btn-primary hidden rounded-xl px-4 py-2.5 text-sm font-semibold sm:inline-flex"
          >
            Start Generating
          </Link>
          <Link
            href="/ai-texture-generator"
            className="rounded-xl border border-ink-200 px-3 py-2.5 text-sm font-semibold text-ink-700 sm:hidden"
          >
            Try it
          </Link>
        </div>
      </div>
    </header>
  );
}
