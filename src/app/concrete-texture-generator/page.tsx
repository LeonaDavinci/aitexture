import type { Metadata } from "next";
import { MaterialCategoryPage } from "@/components/material-category-page";
import { MATERIAL_PAGES } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = MATERIAL_PAGES.find((c) => c.slug === "concrete-texture-generator")!;

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
    q: "Will concrete textures look flat when tiled across a facade?",
    a: "No. The generator produces a uniform average brightness across the tile, so a large surface does not develop the bright-centre checkerboard that photographs create. Add a macro variation mask in the shader if the surface is very large.",
  },
  {
    q: "Can I get polished or raw concrete?",
    a: "Yes. Add 'polished' for a smoother, lower-roughness surface, or 'raw' / 'brutalist' for a heavier, more porous one. The roughness map follows the surface finish automatically.",
  },
  {
    q: "Do the concrete textures include form marks and pour lines?",
    a: "The material model includes broad low-frequency staining and uneven porosity, which reads as cast concrete rather than grey noise. Explicit form-board lines are a separate feature and are not included in this version.",
  },
  {
    q: "What resolution suits architectural visualization?",
    a: "2048x2048 for hero facades and close-up renders, 1024x1024 for standard surfaces. The tiling preview lets you check the repeat at 3x3 or 4x4 before downloading.",
  },
  {
    q: "Are the concrete textures commercially usable?",
    a: "Yes. Commercial license, no attribution and no watermark.",
  },
];

export default function ConcreteTextureGeneratorPage() {
  return (
    <MaterialCategoryPage
      config={CFG}
      faq={FAQ}
      related={MATERIAL_PAGES.filter((m) => m.slug !== CFG.slug).map((m) => ({ slug: m.slug, name: m.name }))}
    />
  );
}
