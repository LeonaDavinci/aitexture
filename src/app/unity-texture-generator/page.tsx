import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform-page";
import { PLATFORMS, getPlatform } from "@/lib/platforms";
import { pageMetadata } from "@/lib/seo";

const CFG = getPlatform("unity");

export const metadata: Metadata = pageMetadata({
  title: CFG.title,
  description: CFG.description,
  path: "/unity-texture-generator",
  keywords: CFG.keywords,
  ogTitle: CFG.title,
  ogDescription: CFG.description,
});

const SIBLINGS = PLATFORMS.filter((p) => p.id !== "unity").map((p) => ({
  href:
    p.id === "unreal"
      ? "/unreal-engine-texture-generator"
      : p.id === "blender"
        ? "/blender-texture-generator"
        : "/roblox-texture-generator",
  name: p.name,
  short: p.shortName,
  brand: p.brand,
}));

export default function UnityTextureGeneratorPage() {
  return <PlatformPage config={CFG} siblings={SIBLINGS} />;
}
