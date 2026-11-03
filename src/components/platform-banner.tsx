import type { PlatformConfig, PlatformId } from "@/lib/platforms";

/**
 * 平台视觉标识 —— 用各平台标志性的几何母题做 SVG 图形，
 * 配合品牌色让用户一眼认出这是哪个平台的页面。
 *
 * 母题设计：
 * - Roblox   : 倾斜方块 + 圆形孔洞（Roblox 经典图标结构）
 * - Unreal   : 分段圆环 + 纵向切口（引擎标志的环形与负形）
 * - Blender  : 双层同心圆环（Blender 标志的球体与眼形）
 * - Unity    : 等轴立方体线框（Unity 标志的立方体）
 */

function RobloxMark({ color }: { color: string }) {
  return (
    <g>
      <rect x="14" y="14" width="52" height="52" rx="6" fill={color} transform="rotate(-12 40 40)" />
      <circle cx="40" cy="40" r="11" fill="#fff" transform="rotate(-12 40 40)" />
    </g>
  );
}

function UnrealMark({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="7">
      <circle cx="40" cy="40" r="21" strokeDasharray="96 36" />
      <path d="M40 12 L40 30" strokeWidth="9" strokeLinecap="round" />
    </g>
  );
}

function BlenderMark({ color }: { color: string }) {
  return (
    <g>
      <circle cx="40" cy="40" r="24" fill={color} />
      <circle cx="40" cy="40" r="11" fill="#fff" />
      <circle cx="40" cy="40" r="5" fill={color} />
    </g>
  );
}

function UnityMark({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth="5" fill="none" strokeLinejoin="round">
      <path d="M40 13 L65 26 L65 52 L40 65 L15 52 L15 26 Z" />
      <path d="M40 13 L40 39 L15 52" />
      <path d="M40 39 L65 52" />
    </g>
  );
}

const MARKS: Record<PlatformId, (p: { color: string }) => React.JSX.Element> = {
  roblox: RobloxMark,
  unreal: UnrealMark,
  blender: BlenderMark,
  unity: UnityMark,
};

export function PlatformMark({
  platform,
  size = 80,
  className = "",
}: {
  platform: PlatformId;
  size?: number;
  className?: string;
}) {
  const cfg = PLATFORM_CONFIG_MAP[platform];
  const Mark = MARKS[platform];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      role="img"
      aria-label={`${cfg.name} logo`}
    >
      <Mark color={cfg.brand} />
    </svg>
  );
}

/** 平台配置的本地副本，避免循环导入 */
const PLATFORM_CONFIG_MAP: Record<PlatformId, { brand: string; name: string }> = {
  roblox: { brand: "#E2231A", name: "Roblox" },
  unreal: { brand: "#2E6BC8", name: "Unreal Engine" },
  blender: { brand: "#E87D0D", name: "Blender" },
  unity: { brand: "#222C37", name: "Unity" },
};

/* ------------------------------------------------------------------ */
/* 平台 Banner                                                          */
/* ------------------------------------------------------------------ */

export function PlatformBanner({ config }: { config: PlatformConfig }) {
  const Mark = MARKS[config.id];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(120deg, ${config.brand} 0%, ${config.brandAlt} 100%)`,
      }}
    >
      {/* 纹理网格底纹 */}
      <div
        className="absolute inset-0 opacity-[0.13]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #ffffff 0 1px, transparent 1px 34px), repeating-linear-gradient(0deg, #ffffff 0 1px, transparent 1px 34px)",
        }}
      />
      {/* 斜向光带 */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.14) 48%, transparent 58%)",
        }}
      />

      <div className="relative flex flex-col gap-6 p-7 sm:p-9 lg:flex-row lg:items-center lg:gap-10">
        {/* 标志 */}
        <div
          className="grid shrink-0 place-items-center rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(6px)" }}
        >
          <svg width="88" height="88" viewBox="0 0 80 80" role="img" aria-label={`${config.name} logo`}>
            <Mark color="#ffffff" />
          </svg>
        </div>

        {/* 文案 */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.18)", color: "#ffffff" }}
            >
              {config.name} workflow
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.95)", color: config.brandInk }}
            >
              {config.exportMaps.length} maps · {config.defaultResolution}px
            </span>
          </div>

          <p
            className="mt-3 text-balance font-display text-2xl font-bold leading-tight sm:text-3xl"
            style={{ color: "#ffffff" }}
          >
            {config.painPoint}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
            {config.highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                <span
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,0.9)", color: config.brandInk }}
                >
                  ✓
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 底部能力条 */}
      <div
        className="relative flex flex-wrap gap-x-6 gap-y-2 border-t px-7 py-4 sm:px-9"
        style={{ borderColor: "rgba(255,255,255,0.22)", background: "rgba(0,0,0,0.14)" }}
      >
        {config.exportMaps.map((m) => (
          <span
            key={m.suffix}
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            <span
              className="grid h-5 w-5 place-items-center rounded text-[10px] font-bold"
              style={{ background: "rgba(255,255,255,0.22)", color: "#ffffff" }}
            >
              {m.suffix.charAt(0)}
            </span>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 首页组合 Banner                                                      */
/* ------------------------------------------------------------------ */

export function PlatformComboBanner({
  platforms,
}: {
  platforms: Array<PlatformConfig & { href: string }>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900">
      <div
        className="absolute inset-0 opacity-[0.09]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #ffffff 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, #ffffff 0 1px, transparent 1px 40px)",
        }}
      />
      <div
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)" }}
      />

      <div className="relative px-6 py-9 sm:px-9 sm:py-11">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-400" />
            One engine, four workflows
          </span>
          <h2 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
            Textures built for your engine&apos;s pipeline, not a generic export
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300 sm:text-base">
            Each platform gets its own map structure, its own import script and its own presets —
            because a texture that works in Unity does not drop straight into Roblox.
          </p>
        </div>

        {/* 四平台卡片 */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((p) => {
            const Mark = MARKS[p.id];
            return (
              <a
                key={p.id}
                href={p.href}
                className="group relative overflow-hidden rounded-xl p-5 transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(140deg, ${p.brand} 0%, ${p.brandAlt} 100%)` }}
              >
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #ffffff 0 1px, transparent 1px 22px), repeating-linear-gradient(0deg, #ffffff 0 1px, transparent 1px 22px)",
                  }}
                />
                <div className="relative">
                  <svg width="42" height="42" viewBox="0 0 80 80" aria-hidden="true">
                    <Mark color="#ffffff" />
                  </svg>
                  <h3 className="mt-3 font-display text-base font-bold text-white">{p.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                    {p.exportMaps.length} maps · {p.codeLanguage} setup script
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white">
                    Open workflow
                    <span
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
