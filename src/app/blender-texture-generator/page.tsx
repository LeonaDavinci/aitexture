import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform-page";
import { PLATFORMS, getPlatform } from "@/lib/platforms";
import { pageMetadata } from "@/lib/seo";

const CFG = getPlatform("blender");

export const metadata: Metadata = pageMetadata({
  title: CFG.title,
  description: CFG.description,
  path: "/blender-texture-generator",
  keywords: CFG.keywords,
  ogTitle: CFG.title,
  ogDescription: CFG.description,
});

const SIBLINGS = PLATFORMS.filter((p) => p.id !== "blender").map((p) => ({
  href:
    p.id === "unreal"
      ? "/unreal-engine-texture-generator"
      : p.id === "roblox"
        ? "/roblox-texture-generator"
        : "/unity-texture-generator",
  name: p.name,
  short: p.shortName,
  brand: p.brand,
}));

export default function BlenderTextureGeneratorPage() {
  return <PlatformPage config={CFG} siblings={SIBLINGS} />;
}
