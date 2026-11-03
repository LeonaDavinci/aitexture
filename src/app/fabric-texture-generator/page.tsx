import type { Metadata } from "next";
import { MaterialCategoryPage } from "@/components/material-category-page";
import { MATERIAL_PAGES } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = MATERIAL_PAGES.find((c) => c.slug === "fabric-texture-generator")!;

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
    q: "What kinds of fabric can be generated?",
    a: "The weave model covers woven cloth - linen, cotton, canvas, wool and similar. Include the fabric word in your prompt to set the fibre character. Very specific patterns like tweed or herringbone are not modelled yet.",
  },
  {
    q: "Do the fabric textures work for clothing in a game?",
    a: "Yes, and they are among the most useful applications. Set the tiling to a small value on a garment so the weave stays at a believable physical scale, and use the normal map to get the thread-level light response that sells it.",
  },
  {
    q: "Can I get a knitted or felted look?",
    a: "Not in this version - the model produces woven structure. For knitted surfaces you would currently need a custom material, though the same PBR export format applies.",
  },
  {
    q: "Are the fabric textures seamless?",
    a: "Yes, strictly. The weave structure wraps exactly at the tile boundary, so a large curtain or a repeated upholstery pattern has no visible break.",
  },
  {
    q: "Can I use the fabric textures commercially?",
    a: "Yes, for garments in shipped games, product renders and textile design work. Commercial license, no attribution.",
  },
];

export default function FabricTextureGeneratorPage() {
  return (
    <MaterialCategoryPage
      config={CFG}
      faq={FAQ}
      related={MATERIAL_PAGES.filter((m) => m.slug !== CFG.slug).map((m) => ({ slug: m.slug, name: m.name }))}
    />
  );
}
