import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Sitemap priority follows the search intent of each keyword cluster:
 * core tool > seamless > PBR > software workflow > material categories > content and trust pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    url: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    // Cluster 1: core tool
    { url: "/", priority: 1.0, changeFrequency: "weekly" },
    { url: "/ai-texture-generator", priority: 0.95, changeFrequency: "weekly" },

    // Cluster 2: seamless textures, the strongest search intent
    { url: "/seamless-texture-generator", priority: 0.9, changeFrequency: "weekly" },

    // Cluster 3: PBR materials, technical and commercially valuable
    { url: "/pbr-texture-generator", priority: 0.88, changeFrequency: "weekly" },

    // Cluster 4: software workflows
    { url: "/roblox-texture-generator", priority: 0.85, changeFrequency: "monthly" },
    { url: "/blender-texture-generator", priority: 0.82, changeFrequency: "monthly" },
    { url: "/unreal-engine-texture-generator", priority: 0.82, changeFrequency: "monthly" },
    { url: "/unity-texture-generator", priority: 0.8, changeFrequency: "monthly" },

    // Cluster 5: material categories
    { url: "/wood-texture-generator", priority: 0.75, changeFrequency: "monthly" },
    { url: "/concrete-texture-generator", priority: 0.75, changeFrequency: "monthly" },
    { url: "/fabric-texture-generator", priority: 0.73, changeFrequency: "monthly" },
    { url: "/stone-texture-generator", priority: 0.73, changeFrequency: "monthly" },

    // Content cluster
    { url: "/guides", priority: 0.7, changeFrequency: "monthly" },
    { url: "/guides/what-is-a-tileable-texture", priority: 0.66, changeFrequency: "monthly" },
    { url: "/guides/pbr-texture-workflow", priority: 0.66, changeFrequency: "monthly" },
    { url: "/guides/texture-for-unity-unreal-blender", priority: 0.68, changeFrequency: "monthly" },
    { url: "/guides/texture-repetition-and-tiling-artifacts", priority: 0.64, changeFrequency: "monthly" },

    // Features still to ship
    { url: "/photo-to-texture", priority: 0.5, changeFrequency: "monthly" },

    // Commercial and trust pages
    { url: "/pricing", priority: 0.6, changeFrequency: "monthly" },
    { url: "/about", priority: 0.4, changeFrequency: "yearly" },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
