import type { Metadata } from "next";
import { EngineWorkflowPage } from "@/components/engine-workflow-page";
import { ENGINE_WORKFLOWS } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = ENGINE_WORKFLOWS.find((c) => c.slug === "unity-texture-generator")!;

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
    q: "How do I import these textures into Unity?",
    a: "Drop the PNG files into your project. Set the albedo to sRGB and the normal, roughness and AO maps to Linear - Unity's Normal map import type handles the channel packing correctly when the texture is marked as a normal map.",
  },
  {
    q: "Do these work with URP and HDRP?",
    a: "Both. Create a URP Lit or HDRP Lit material, assign the albedo to Base Map, the normal map to Normal Map with the Normal Map checkbox enabled, and the AO map to the Occlusion slot with its checkbox enabled.",
  },
  {
    q: "Should I use a roughness map or a smoothness map?",
    a: "URP's Lit shader exposes Smoothness, which is the inverse of roughness. Either connect the roughness map through an invert node, or set the material's smoothness to 1 and rely on the map - but the direct approach is a single Invert node on the roughness texture feeding Smoothness.",
  },
  {
    q: "How do I make the texture tile in Unity?",
    a: "Set the texture's Wrap Mode to Repeat on the importer settings. Then control the density with the Tiling X and Y fields on the material rather than the importer, so the same texture asset can be reused at different scales.",
  },
  {
    q: "What resolution should I use for mobile?",
    a: "512x512 is usually enough for mobile surfaces, and 1024x1024 for hero props. Keep all five maps at the same resolution so the normal map stays aligned with the colour detail after compression.",
  },
  {
    q: "Are these textures usable in a commercial Unity game?",
    a: "Yes. Commercial license, no attribution, no watermark, no runtime cost.",
  },
];

export default function UnityTextureGeneratorPage() {
  return (
    <EngineWorkflowPage
      config={CFG}
      faq={FAQ}
      steps={[
        {
          title: "Generate the material",
          body: "Type a description of the surface. Four seamless variants come back with a matching five-map PBR pack each.",
        },
        {
          title: "Download the maps",
          body: "Save albedo, normal, roughness, AO and height as PNG files at the same resolution.",
        },
        {
          title: "Set the import settings",
          body: "For each texture: albedo stays sRGB, normal / roughness / AO switch to Linear, and the normal map gets the Normal map import type. Set Wrap Mode to Repeat.",
        },
        {
          title: "Build the material",
          body: "Create a URP Lit material. Assign Base Map, Normal Map (tick the checkbox), the AO map to Occlusion (tick the checkbox), and route roughness through an Invert node into Smoothness.",
        },
        {
          title: "Adjust tiling per material",
          body: "Set Tiling X and Y on the material inspector. Keeping tiling on the material rather than the importer lets you reuse one texture asset across a fine floor and a coarse wall.",
        },
      ]}
      code={[
        "Unity URP - material setup",
        "",
        "  Inspector > Texture Import Settings",
        "    albedo.png      -> sRGB: ON,  Wrap Mode: Repeat",
        "    normal.png      -> sRGB: OFF, Normal map: ON, Wrap Mode: Repeat",
        "    roughness.png   -> sRGB: OFF, Wrap Mode: Repeat",
        "    ao.png          -> sRGB: OFF, Wrap Mode: Repeat",
        "",
        "  Material (URP Lit)",
        "    Base Map        <- albedo",
        "    Normal Map      <- normal   (Normal Map checkbox ON)",
        "    Smoothness      <- Invert(roughness)",
        "    Occlusion       <- ao       (Occlusion checkbox ON)",
        "    Tiling X / Y    <- per-material density",
      ].join("\n")}
      tips={[
        "Set the normal map's import type to Normal map - Unity then handles the channel swizzle for you.",
        "An Invert node on the roughness map into Smoothness is simpler than remembering which convention your pipeline expects.",
        "Keep all five maps at the same resolution or the normal map drifts away from the colour detail.",
        "Use a Shader Graph with a detail normal sampled at 8-16x the base tiling to break up repetition on large surfaces.",
      ]}
      notes={[
        {
          h2: "URP vs HDRP: what actually changes",
          p: [
            "The map wiring is identical. What differs is the lighting model underneath. HDRP's physical lighting and its higher-precision shadow maps expose rough materials much more critically, so getting the roughness map right matters more there.",
            "If you are switching between render pipelines in the same project, keep the same texture assets and let the material handle the difference - that is one of the practical benefits of keeping every map at an identical resolution.",
          ],
        },
        {
          h2: "Mobile considerations",
          p: [
            "On mobile, texture memory is the binding constraint, not generation cost. A 1024x1024 RGBA map with mipmaps takes about 5.3 MB in VRAM, and five maps per material multiplies that quickly.",
            "Use 512x512 for surfaces the player rarely gets close to, enable mipmap streaming on the larger maps, and consider dropping the AO map entirely on mobile - a baked-in darkening in the albedo often reads nearly as well at a fraction of the memory.",
          ],
        },
      ]}
    />
  );
}
