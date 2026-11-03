import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    url: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { url: "/", priority: 1, changeFrequency: "weekly" },
    { url: "/tools/ai-texture-generator", priority: 0.95, changeFrequency: "weekly" },
    { url: "/tools/seamless-texture-generator", priority: 0.9, changeFrequency: "weekly" },
    { url: "/tools/pbr-texture-generator", priority: 0.85, changeFrequency: "weekly" },
    { url: "/tools/photo-to-texture", priority: 0.6, changeFrequency: "monthly" },
    { url: "/guides", priority: 0.75, changeFrequency: "monthly" },
    { url: "/guides/what-is-a-tileable-texture", priority: 0.7, changeFrequency: "monthly" },
    { url: "/guides/pbr-texture-workflow", priority: 0.7, changeFrequency: "monthly" },
    { url: "/guides/texture-for-unity-unreal-blender", priority: 0.7, changeFrequency: "monthly" },
    { url: "/guides/texture-repetition-and-tiling-artifacts", priority: 0.65, changeFrequency: "monthly" },
    { url: "/pricing", priority: 0.6, changeFrequency: "monthly" },
    { url: "/about", priority: 0.4, changeFrequency: "yearly" },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
