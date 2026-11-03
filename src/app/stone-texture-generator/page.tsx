import type { Metadata } from "next";
import { MaterialCategoryPage } from "@/components/material-category-page";
import { MATERIAL_PAGES } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = MATERIAL_PAGES.find((c) => c.slug === "stone-texture-generator")!;

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
    q: "What stone types are supported?",
    a: "The material model covers fractured rock surfaces - granite, slate, rough stone and similar. Describe the tone with a colour word, and add 'cracked' for a heavier fracture network or 'polished' for a smoother, lower-roughness finish.",
  },
  {
    q: "Do the stone textures have visible cracks?",
    a: "Yes. The fracture structure comes from a cell-based model, so the crack network follows the boundaries between stone fragments rather than being painted on. The normal map picks up the fracture edges so they catch light correctly.",
  },
  {
    q: "Can I use these for terrain in an open-world game?",
    a: "Yes, and stone works particularly well for cliffs and rocky ground. Pair the tiling texture with a macro variation mask in the landscape shader, or blend two or three variants with vertex weights to break up the grid at grazing angles.",
  },
  {
    q: "Are the stone textures seamless?",
    a: "Strictly seamless - the fracture structure continues across the tile boundary with no visible break, so a rock face tiled across a cliff face reads as continuous rock.",
  },
  {
    q: "Can I use the stone textures commercially?",
    a: "Yes. Commercial license, no attribution, no watermark.",
  },
];

export default function StoneTextureGeneratorPage() {
  return (
    <MaterialCategoryPage
      config={CFG}
      faq={FAQ}
      related={MATERIAL_PAGES.filter((m) => m.slug !== CFG.slug).map((m) => ({ slug: m.slug, name: m.name }))}
    />
  );
}
