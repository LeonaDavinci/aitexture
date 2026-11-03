import type { Metadata } from "next";
import { MaterialCategoryPage } from "@/components/material-category-page";
import { MATERIAL_PAGES } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = MATERIAL_PAGES.find((c) => c.slug === "wood-texture-generator")!;

export const metadata: Metadata = pageMetadata({
  title: CFG.title,
  description: CFG.description,
  path: `/${CFG.slug}`,
  keywords: CFG.keywords,
  ogTitle: CFG.title,
  ogDescription: CFG.description,
});

const FAQ = [
  {
    q: "Can the wood textures be used for flooring?",
    a: "Yes. The grain runs along a fixed axis, so a floor reads correctly. Generate at 2048px for large surfaces, and check the tiling preview at 4x4 to confirm the plank rhythm does not become obvious across a wide room.",
  },
  {
    q: "How do I get a different wood species?",
    a: "Change the colour word in the prompt. Oak, walnut, pine and other species are handled by describing the tone - 'dark walnut', 'pale birch', 'warm cherry' - and the material model adjusts the grain contrast and colour accordingly.",
  },
  {
    q: "Do you support plank seams?",
    a: "Yes - include 'planks' or 'plank' in the prompt and the material model adds board divisions with visible joints and end lines, which is what makes a wood floor read as boards rather than a continuous grain pattern.",
  },
  {
    q: "Are the wood textures seamless?",
    a: "Strictly. The grain runs continuously across the tile boundary, so a board pattern repeats without a visible break. The generator guarantees this mathematically rather than by patching.",
  },
  {
    q: "Can I use generated wood textures commercially?",
    a: "Yes, including in shipped games and client renders. Commercial license, no attribution.",
  },
];

export default function WoodTextureGeneratorPage() {
  return (
    <MaterialCategoryPage
      config={CFG}
      faq={FAQ}
      related={MATERIAL_PAGES.filter((m) => m.slug !== CFG.slug).map((m) => ({ slug: m.slug, name: m.name }))}
    />
  );
}
