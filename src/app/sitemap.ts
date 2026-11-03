import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Sitemap 按关键词集群的搜索意图排优先级：
 * 主工具词 > 无缝 > PBR > 软件工作流 > 材质分类 > 内容与信任页
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: Array<{
    url: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    // 集群 1：主工具词
    { url: "/", priority: 1.0, changeFrequency: "weekly" },
    { url: "/ai-texture-generator", priority: 0.95, changeFrequency: "weekly" },

    // 集群 2：无缝纹理（搜索意图最强）
    { url: "/seamless-texture-generator", priority: 0.9, changeFrequency: "weekly" },

    // 集群 3：PBR 材质（技术向、商业价值高）
    { url: "/pbr-texture-generator", priority: 0.88, changeFrequency: "weekly" },

    // 集群 4：软件工作流
    { url: "/blender-texture-generator", priority: 0.82, changeFrequency: "monthly" },
    { url: "/unreal-engine-texture-generator", priority: 0.82, changeFrequency: "monthly" },
    { url: "/unity-texture-generator", priority: 0.8, changeFrequency: "monthly" },

    // 集群 5：材质分类
    { url: "/wood-texture-generator", priority: 0.75, changeFrequency: "monthly" },
    { url: "/concrete-texture-generator", priority: 0.75, changeFrequency: "monthly" },
    { url: "/fabric-texture-generator", priority: 0.73, changeFrequency: "monthly" },
    { url: "/stone-texture-generator", priority: 0.73, changeFrequency: "monthly" },

    // 内容集群
    { url: "/guides", priority: 0.7, changeFrequency: "monthly" },
    { url: "/guides/what-is-a-tileable-texture", priority: 0.66, changeFrequency: "monthly" },
    { url: "/guides/pbr-texture-workflow", priority: 0.66, changeFrequency: "monthly" },
    { url: "/guides/texture-for-unity-unreal-blender", priority: 0.68, changeFrequency: "monthly" },
    { url: "/guides/texture-repetition-and-tiling-artifacts", priority: 0.64, changeFrequency: "monthly" },

    // 待上线功能
    { url: "/photo-to-texture", priority: 0.5, changeFrequency: "monthly" },

    // 商业与信任页
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
