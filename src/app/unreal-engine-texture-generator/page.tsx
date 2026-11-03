import type { Metadata } from "next";
import { EngineWorkflowPage } from "@/components/engine-workflow-page";
import { ENGINE_WORKFLOWS } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = ENGINE_WORKFLOWS.find((c) => c.slug === "unreal-engine-texture-generator")!;

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
    q: "Are these textures compatible with Unreal Engine 5 and Lumen?",
    a: "Yes. All five maps export at identical resolution as PNG, which is exactly what UE5 expects for a material instance. Lumen's global illumination is unforgiving about seams - because the tiling is mathematically exact, a large floor lit by Lumen does not develop the bright-centre grid that photographs do.",
  },
  {
    q: "How do I set up the material in Unreal Engine?",
    a: "Create a material instance from a parent material that samples the five textures. Set Address X and Address Y to Wrap on the texture asset itself, then connect the maps: Base Color, Normal, Roughness and Ambient Occlusion. Keep the tiling values in the material instance rather than the texture import settings so one material can be reused at different densities.",
  },
  {
    q: "What texture resolution should I use for Unreal?",
    a: "1024x1024 is the standard for most real-time surfaces. Use 2048x2048 for hero surfaces and close-up cinematics. For landscape materials, pair the tiling texture with a macro variation mask so the repeat does not read at grazing angles.",
  },
  {
    q: "Will the textures work with Nanite?",
    a: "Yes. Nanite meshes still need valid material maps, and the normal and roughness maps generated here are pixel-aligned with the albedo, so Nanite's virtualized geometry does not reveal any mismatch.",
  },
  {
    q: "How do I stop tiling artifacts on large landscapes?",
    a: "Use a Landscape Layer Blend with two or three different variants of the same material, blended by painted vertex weights. Combined with a low-frequency detail normal, this removes the visible grid almost entirely - the standard UE5 technique for open-world terrain.",
  },
  {
    q: "Can I use the textures commercially in an Unreal project?",
    a: "Yes, including in shipped games. Commercial license, no attribution, no watermark.",
  },
];

export default function UnrealTextureGeneratorPage() {
  return (
    <EngineWorkflowPage
      config={CFG}
      faq={FAQ}
      steps={[
        {
          title: "Generate the texture set",
          body: "Describe the material you need. Four seamless variants are produced with matching albedo, normal, roughness, AO and height maps.",
        },
        {
          title: "Download and import",
          body: "Save the PNG files and drop them into your Unreal content folder. Unreal detects them as textures automatically.",
        },
        {
          title: "Set the texture address mode",
          body: "Open each texture asset and set Address X and Address Y to Wrap. The default Clamp mode will stretch the edge pixels instead of tiling.",
        },
        {
          title: "Build the material",
          body: "In your parent material, wire Base Color, Normal, Roughness and Ambient Occlusion to the matching texture sample nodes, then create a Material Instance.",
        },
        {
          title: "Tune tiling per instance",
          body: "Set the Tiling values on the material instance. Keeping them here rather than in the texture means the same material serves a floor at 2m and a wall at 8m without duplicating assets.",
        },
      ]}
      code={[
        "Unreal Engine 5 - texture asset settings",
        "",
        "  Texture Asset -> Details",
        "    Address X = Wrap",
        "    Address Y = Wrap",
        "    Compression Settings = Default (Normal map -> Normalmap)",
        "    sRGB = ON for albedo, OFF for normal / roughness / AO",
        "",
        "  Material instance",
        "    Tiling X / Y  = per-instance density",
        "    Parent material nodes:",
        "      Base Color          <- Sample: albedo",
        "      Normal              <- Sample: normal",
        "      Roughness           <- Sample: roughness",
        "      Ambient Occlusion   <- Sample: AO",
        "      Displacement        <- Sample: height (optional, needs tessellation)",
      ].join("\n")}
      tips={[
        "Set Address X and Y to Wrap on the texture asset, not only in the material - it applies everywhere the texture is used.",
        "Turn off sRGB on the normal, roughness and AO textures or the engine will gamma-correct them and lighting will be wrong.",
        "Use the parent material for the wiring and material instances for the tiling - it keeps the asset count down.",
        "For terrain, add a Landscape Layer Blend with two or three variants instead of tiling a single texture.",
      ]}
      notes={[
        {
          h2: "Lumen and the checkerboard problem",
          p: [
            "Lumen's global illumination solves indirect lighting, which means every bounce of light carries the texture's own low-frequency variation. A photograph with a bright centre and darker corners, repeated across a floor, produces a checkerboard that Lumen amplifies because the indirect light reinforces it.",
            "Because these textures are generated from periodic noise, their average brightness is uniform across the tile. The energy that Lumen bounces around the room stays even, and a floor tiled 40 times reads as a single continuous surface.",
          ],
        },
        {
          h2: "Nanite, Lumen and texture density together",
          p: [
            "A common mistake is to treat high-resolution textures as automatically better. In UE5, texel density matters more than pixel count. A 2048px texture stretched across a 40-metre floor looks worse than a 1024px texture at the right density, because the viewer ends up close to a texture that was never meant to be seen that large.",
            "Set a texel density target for your project - around 5.12 pixels per centimetre is a common starting point - and let the engine's LOD system handle the rest.",
          ],
        },
      ]}
    />
  );
}
