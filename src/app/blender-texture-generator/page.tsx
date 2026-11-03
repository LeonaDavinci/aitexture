import type { Metadata } from "next";
import { EngineWorkflowPage } from "@/components/engine-workflow-page";
import { ENGINE_WORKFLOWS } from "@/lib/keyword-clusters";
import { pageMetadata } from "@/lib/seo";

const CFG = ENGINE_WORKFLOWS.find((c) => c.slug === "blender-texture-generator")!;

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
    q: "How do I make a Blender texture tile seamlessly?",
    a: "Set the Image Texture node's Extension property to Repeat instead of Extend. The textures generated here are already periodic, so Repeat wrapping produces a continuous surface with no visible boundary - the generator guarantees f(0) equals f(1) by construction rather than by patching the seam afterwards.",
  },
  {
    q: "Can I use these textures in Cycles and EEVEE?",
    a: "Yes. The five maps - albedo, normal, roughness, AO and height - map directly onto the Principled BSDF in both renderers. Connect the roughness map to Roughness, the normal map to Normal, and the AO map to Ambient Occlusion.",
  },
  {
    q: "What Blender version does this work with?",
    a: "Blender 4.x and 3.x. The workflow depends on the Principled BSDF socket names, which have been stable since Blender 3.0.",
  },
  {
    q: "How do I stop the texture looking obviously repeated on a large floor?",
    a: "Three techniques work well in Blender: add a macro variation noise that modulates colour and roughness at a much larger scale, apply a detail normal map at 8 to 16 times the base tiling, or use triplanar projection on irregular geometry to avoid stretching on slopes.",
  },
  {
    q: "Can I export these to an image texture for the Asset Browser?",
    a: "Yes. Download the PNG maps and load them into an Image Texture node, or pack them into a .blend file. All maps export at identical resolution, so they stay pixel-aligned when packed.",
  },
  {
    q: "Is a commercial license included?",
    a: "Yes. Every texture you generate can be used in commercial projects, client renders and products with no attribution and no watermark.",
  },
];

export default function BlenderTextureGeneratorPage() {
  return (
    <EngineWorkflowPage
      config={CFG}
      faq={FAQ}
      steps={[
        {
          title: "Generate the material",
          body: "Describe the surface - for example 'weathered red brick wall with mortar joints'. You get four seamless variants, each with a matching set of five maps.",
        },
        {
          title: "Download the map pack",
          body: "Save albedo, normal, roughness, AO and height as PNG files. All five share the same resolution, so they stay aligned through import.",
        },
        {
          title: "Load the maps into Blender",
          body: "Add five Image Texture nodes. Wire albedo to Base Color, normal to Normal, roughness to Roughness and AO to Ambient Occlusion on the Principled BSDF.",
        },
        {
          title: "Set the repeat mode",
          body: "On every Image Texture node set Extension to Repeat. Add a Mapping node between Texture Coordinate and the textures so one scale value drives the whole set.",
        },
        {
          title: "Tune the tiling density",
          body: "Adjust the Mapping scale until the surface reads at the right physical size. A 1024px tile at scale 4 covers roughly 4 metres - adjust to your scene.",
        },
      ]}
      code={[
        "Blender - Principled BSDF wiring",
        "",
        "  Texture Coordinate -> Mapping (Scale 4, 4, 4)",
        "                            |-> Image Texture (albedo)    -> Base Color",
        "                            |-> Image Texture (normal)    -> Normal",
        "                            |-> Image Texture (roughness) -> Roughness",
        "                            |-> Image Texture (AO)        -> Ambient Occlusion",
        "                            |-> Image Texture (height)    -> (optional) Displacement",
        "",
        "  Every Image Texture node: Extension = Repeat",
        "  Color Space: albedo = sRGB, normal / roughness / AO = Non-Color",
      ].join("\n")}
      tips={[
        "Put the Mapping node before the texture nodes, not after - one scale value then controls every map.",
        "Set colour space to Non-Color for normal, roughness and AO maps, or Blender will convert them and the lighting will be wrong.",
        "Add a Bump node driven by the height map when you need finer relief than the normal map provides.",
        "Use a separate high-frequency noise texture as a detail normal at 8-16x the base scale to break up repetition.",
      ]}
      notes={[
        {
          h2: "Why seamless matters more in Blender than anywhere else",
          p: [
            "Cycles and EEVEE both use repeat wrapping by default on image textures, so any texture - generated, painted or photographed - will tile across a floor. The difference is that Blender artists usually have to build a seamless image by hand with the offset filter and clone stamping, which is slow and softens fine detail.",
            "Here the periodicity is structural. Every noise layer wraps at the tile boundary, so the edge of the image is the same as the middle of the image. There is nothing to patch and no quality to lose.",
          ],
        },
        {
          h2: "Working with UVs in Blender",
          p: [
            "For a simple flat surface, the default UV unwrap is enough - add a Mapping node and scale it. For anything cylindrical or spherical, use a Box or Sphere projection from the Texture Coordinate node instead of relying on the UV layout.",
            "If you are texturing a curved prop, triplanar projection is usually the fastest route to a result without stretching: it projects the texture from three axes and blends by the surface normal.",
          ],
        },
      ]}
    />
  );
}
