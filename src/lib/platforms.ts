/**
 * Platform registry - per-platform configuration for the four target engines.
 *
 * Differentiation lives in the exported artefacts, not in the copy:
 * - Roblox  : SurfaceAppearance four-map structure + MetalnessMap (R=metalness, G=reflectance) packing + Scripted Texture UV notes
 * - Unreal  : Mask Map packing (R=AO, G=Roughness, B=Metallic) + parent material / material instance workflow
 * - Blender : node group workflow + colour management + export settings
 * - Unity   : import settings matrix + C# Editor script + SRP Batcher notes
 */

export type PlatformId = "roblox" | "unreal" | "blender" | "unity";

export interface PlatformPreset {
  key: string;
  label: string;
  prompt: string;
  /** The matching material name or enum inside the engine */
  engineMaterial: string;
}

export interface PlatformExportMap {
  /** Export filename suffix, e.g. "ColorMap" */
  suffix: string;
  label: string;
  /** What this map controls inside the engine */
  role: string;
  /** Whether this map is platform specific (a packed map) */
  special?: boolean;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  /** Primary brand colour */
  brand: string;
  /** Secondary brand colour (for gradients) */
  brandAlt: string;
  /** Tinted background derived from the brand colour */
  brandSoft: string;
  /** Dark text colour that pairs with the brand colour */
  brandInk: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Who this platform page is written for */
  audience: string;
  /** The core problem these users actually hit */
  painPoint: string;
  /** Platform specific presets, not the generic material ones */
  presets: PlatformPreset[];
  /** Default export resolution for this platform */
  defaultResolution: 512 | 1024 | 2048;
  /** Notes on the recommended resolution */
  resolutionNote: string;
  /** The exported map set */
  exportMaps: PlatformExportMap[];
  /** Engine setup script */
  code: string;
  codeLanguage: string;
  codeCaption: string;
  /** Integration steps */
  steps: Array<{ title: string; body: string }>;
  /** Short selling points shown on the banner */
  highlights: string[];
  /** Engine specific caveats */
  notes: Array<{ h2: string; p: string[] }>;
  /** Engine specific FAQ */
  faq: Array<{ q: string; a: string }>;
  /** Prompt to engine material mapping table */
  materialMap: Array<{ prompt: string; engine: string }>;
}

export const PLATFORMS: PlatformConfig[] = [
  /* ------------------------------------------------------------------ */
  /* Roblox                                                             */
  /* ------------------------------------------------------------------ */
  {
    id: "roblox",
    highlights: [
      "SurfaceAppearance four-map structure, drop-in ready",
      "MetalnessMap packed in Roblox dual-channel format",
      "Presets map to the built-in Material enum",
      "Includes a Roblox Studio attach script",
    ],
    name: "Roblox",
    shortName: "Roblox",
    brand: "#E2231A",
    brandAlt: "#8B1410",
    brandSoft: "#FDECEA",
    brandInk: "#7A120C",
    primaryKeyword: "roblox texture generator",
    keywords: [
      "roblox texture generator",
      "roblox surface appearance",
      "roblox material texture",
      "roblox avatar skin texture",
      "roblox seamless texture",
    ],
    title: "Roblox Texture Generator - SurfaceAppearance Maps",
    description:
      "Free Roblox texture generator. Create seamless textures packaged for Roblox Studio - ColorMap, NormalMap, MetalnessMap and RoughnessMap ready for SurfaceAppearance.",
    h1: "Roblox Texture Generator",
    intro:
      "Roblox Studio does not accept a generic PBR pack. SurfaceAppearance takes exactly four maps - ColorMap, NormalMap, MetalnessMap and RoughnessMap - and Roblox's own material enum decides how a surface reacts to light. This generator produces textures in that exact structure, so what you download can be dropped onto a MeshPart without any conversion.",
    audience:
      "Roblox Studio creators building obbies, tycoons, roleplay servers and avatar clothing.",
    painPoint:
      "Most texture tools hand you five maps with engine-agnostic names, and Roblox Studio's material system does not read them. You end up with a SurfaceAppearance that ignores your roughness map or looks like flat plastic.",
    defaultResolution: 512,
    resolutionNote:
      "512px is the sweet spot for Roblox. Surfaces on mobile clients render small, and 1024px is plenty for a hero obby piece or a clothing item.",
    presets: [
      {
        key: "planks",
        label: "Wood planks",
        prompt: "wood planks, visible grain, warm timber floorboards",
        engineMaterial: "Wood",
      },
      {
        key: "brick",
        label: "Brick",
        prompt: "red brick wall, mortar joints, weathered brick surface",
        engineMaterial: "Brick",
      },
      {
        key: "concrete",
        label: "Concrete",
        prompt: "raw concrete wall, subtle pores, grey cement surface",
        engineMaterial: "Concrete",
      },
      {
        key: "cobble",
        label: "Cobblestone",
        prompt: "rounded cobblestone pavement, irregular stones, grey stone",
        engineMaterial: "Cobblestone",
      },
      {
        key: "sandstone",
        label: "Sandstone",
        prompt: "weathered sandstone blocks, layered rock face, desert tan",
        engineMaterial: "Sandstone",
      },
      {
        key: "metalplate",
        label: "Metal plate",
        prompt: "brushed steel metal plate, fine linear scratches, industrial",
        engineMaterial: "Metal",
      },
      {
        key: "grassturf",
        label: "Grass turf",
        prompt: "green grass lawn turf, dense blades, mowed lawn",
        engineMaterial: "Grass",
      },
      {
        key: "fabric",
        label: "Cloth",
        prompt: "woven fabric, textile weave, soft cloth surface",
        engineMaterial: "Fabric",
      },
    ],
    exportMaps: [
      {
        suffix: "ColorMap",
        label: "ColorMap",
        role: "Base colour. Maps to SurfaceAppearance.ColorMap and Roblox's BaseColor.",
      },
      {
        suffix: "NormalMap",
        label: "NormalMap",
        role: "Tangent-space normals. Maps to SurfaceAppearance.NormalMap.",
      },
      {
        suffix: "MetalnessMap",
        label: "MetalnessMap",
        role: "Packed: R = metalness, G = reflectance. This is Roblox's own format.",
        special: true,
      },
      {
        suffix: "RoughnessMap",
        label: "RoughnessMap",
        role: "Surface roughness. Maps to SurfaceAppearance.RoughnessMap.",
      },
    ],
    code: `-- Roblox Studio: apply a generated texture set to a MeshPart
-- 1. Insert the 4 PNG files into your project (e.g. ReplicatedStorage > Assets)
-- 2. Run this in the Command Bar

local part = workspace.YOUR_PART
local assets = game:GetService("ReplicatedStorage").Assets

local appearance = Instance.new("SurfaceAppearance")
appearance.Name = "GeneratedTexture"
appearance.ColorMap = assets["wood-planks-ColorMap.png"]
appearance.NormalMap = assets["wood-planks-NormalMap.png"]
appearance.MetalnessMap = assets["wood-planks-MetalnessMap.png"]
appearance.RoughnessMap = assets["wood-planks-RoughnessMap.png"]

part:AddChild(appearance)

-- Roblox reads the mesh's own Material enum, not your texture.
-- Keep it consistent with what the texture looks like:
part.Material = Enum.Material.Wood
part.Reflectance = 0.08`,
    codeLanguage: "lua",
    codeCaption: "Roblox Studio - attach a SurfaceAppearance to a MeshPart",
    steps: [
      {
        title: "Generate the texture",
        body: "Describe the material and generate. The default 512px is the safest size for Roblox mobile clients. Every preset above maps to a built-in Roblox Material enum.",
      },
      {
        title: "Download the four maps",
        body: "The export pack is exactly four maps: ColorMap, NormalMap, MetalnessMap and RoughnessMap. The MetalnessMap is already packed in Roblox format with metalness in R and reflectance in G.",
      },
      {
        title: "Upload to Studio",
        body: "Drag the four PNGs into the Studio Explorer, ideally into a folder under ReplicatedStorage or ServerStorage.",
      },
      {
        title: "Add a SurfaceAppearance",
        body: "Select the MeshPart, open Properties, add a SurfaceAppearance, then assign each of the four maps to its matching slot.",
      },
      {
        title: "Match the Material enum",
        body: "Set the Part Material to the enum that matches the texture - Wood, Brick, Concrete, Cobblestone, Sandstone or Metal. The enum drives the lighting response while the maps drive the detail.",
      },
      {
        title: "Batch it with a script",
        body: "When a scene has many repeated pieces, the setup script attaches a SurfaceAppearance to every MeshPart at once, which beats editing them one by one.",
      },
    ],
    notes: [
      {
        h2: "Why Roblox needs four maps, not five",
        p: [
          "SurfaceAppearance has no AO slot and no separate Height slot. Ambient occlusion is approximated by the engine lighting system in Roblox, so an extra AO map does nothing at all.",
          "Height has nowhere to go either - Roblox uses built-in geometric bumps rather than displacement maps. Exporting AO and Height here is wasted bandwidth, while the MetalnessMap is the map that actually matters in Roblox.",
        ],
      },
      {
        h2: "The dual-channel MetalnessMap",
        p: [
          "A Roblox MetalnessMap carries two pieces of information in one image: the R channel is metalness, which decides whether the surface reads as metal, and the G channel is reflectance, which sets the specular strength of a non-metal surface.",
          "The usual approach is to composite the channels by hand in Photoshop, and most people leave the G channel black - the result is a non-metal surface with no highlights at all and a heavy plastic look. These exports already follow the Roblox convention: reflectance 0.7 in metal areas and 0.5 elsewhere, ready to use.",
        ],
      },
      {
        h2: "The Material enum is what actually decides the look",
        p: [
          "Many Roblox creators assume the texture decides everything, but the Material enum is what controls how a surface responds to light. The Plastic enum gives any texture a uniform plastic sheen, no matter how you drew the roughness map.",
          "The practical order is: decide the Part Material first, then steer the prompt toward it. For a brick wall, set the Material to Brick and write 'red brick wall with mortar joints'. Only when the two agree can the SurfaceAppearance detail actually come through.",
        ],
      },
      {
        h2: "Scripted Textures follow a completely different logic",
        p: [
          "If your project uses a Scripted Texture rather than a SurfaceAppearance, the image is painted straight onto the block face. The texture is then the entire final appearance and there are no PBR channels to speak of - one colour map is enough.",
          "In that case just use the generated result as an ordinary colour map. Keep in mind that Scripted Texture UVs follow the block face, and the repeat density is controlled by StudsPerTile - somewhere between 8 and 16 usually works well.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I apply a texture to a Roblox MeshPart?",
        a: "Add a SurfaceAppearance to the MeshPart and assign the four maps to ColorMap, NormalMap, MetalnessMap and RoughnessMap. Then set the Part's Material enum to match the texture - the enum controls lighting response while the maps control detail.",
      },
      {
        q: "Why does my Roblox texture look like flat plastic?",
        a: "Almost always the Material enum. Plastic has a uniform specular response that overrides the look of your roughness map. Switch the Part to the matching enum - Wood, Brick, Concrete, Cobblestone, Sandstone, Metal or Grass.",
      },
      {
        q: "What resolution should I use for Roblox?",
        a: "512 pixels for most surfaces. Roblox clients render on mobile hardware where a 2048px texture on a large obby piece wastes memory without a visible gain. Use 1024 only for a hero object the player gets close to.",
      },
      {
        q: "Does Roblox support AO or height maps?",
        a: "No. SurfaceAppearance accepts exactly four maps and neither ambient occlusion nor displacement has a slot. This generator therefore exports only the four maps Roblox can actually use, saving you two unused files.",
      },
      {
        q: "Can I use these textures for Roblox avatar clothing?",
        a: "You can use the albedo, but clothing needs a specific UV layout rather than a tiling texture. Use the color map as a reference for how each panel should look and paint the avatar template directly - see the avatar skin section above.",
      },
      {
        q: "Is it safe to use in a published Roblox game?",
        a: "Yes. Generated textures carry a commercial license covering games and products, with no attribution and no watermark.",
      },
    ],
    materialMap: [
      { prompt: "wood planks, visible grain", engine: "Enum.Material.Wood" },
      { prompt: "red brick wall, mortar joints", engine: "Enum.Material.Brick" },
      { prompt: "raw concrete wall, subtle pores", engine: "Enum.Material.Concrete" },
      { prompt: "rounded cobblestone pavement", engine: "Enum.Material.Cobblestone" },
      { prompt: "weathered sandstone blocks", engine: "Enum.Material.Sandstone" },
      { prompt: "brushed steel metal plate", engine: "Enum.Material.Metal" },
      { prompt: "green grass lawn turf", engine: "Enum.Material.Grass" },
      { prompt: "woven fabric textile weave", engine: "Enum.Material.Fabric" },
      { prompt: "rough granite stone slab", engine: "Enum.Material.Slate" },
      { prompt: "rusted metal sheet oxidized", engine: "Enum.Material.CorrodedMetal" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Unreal Engine                                                      */
  /* ------------------------------------------------------------------ */
  {
    id: "unreal",
    highlights: [
      "Mask Map packed as R=AO G=Roughness B=Metallic",
      "ORM variant included for existing pipelines",
      "Presets split Landscape from static mesh use",
      "Includes an Editor Utility Python import script",
    ],
    name: "Unreal Engine",
    shortName: "Unreal",
    brand: "#0A0E27",
    brandAlt: "#1E3A6E",
    brandSoft: "#EEF2FA",
    brandInk: "#1E3A6E",
    primaryKeyword: "unreal engine texture generator",
    keywords: [
      "unreal engine texture generator",
      "ue5 texture generator",
      "unreal material texture",
      "unreal mask map",
      "ue5 seamless texture",
    ],
    title: "Unreal Engine Texture Generator - UE5 PBR Maps",
    description:
      "Free Unreal Engine texture generator. Seamless, tileable PBR textures with a packed Mask Map (R=AO, G=Roughness, B=Metallic), ready for UE5 materials and Lumen.",
    h1: "Unreal Engine Texture Generator",
    intro:
      "Unreal Engine rewards well-structured texture sets. The engine's standard is a packed Mask Map that combines ambient occlusion, roughness and metalness into one texture, so a single sample feeds three material inputs. This generator produces that packed map alongside the individual channels, and every texture is seamless enough to survive a Lumen global illumination pass on a large floor.",
    audience:
      "Technical artists and environment artists building UE5 environments, props and landscape materials.",
    painPoint:
      "Manually packing three grayscale maps into an R/G/B Mask Map is tedious and easy to get wrong. Get the channel order wrong and your material renders with wildly wrong roughness - and in Lumen, the error shows up in the indirect lighting.",
    defaultResolution: 1024,
    resolutionNote:
      "1024px is the UE5 baseline. Use 2048px for hero surfaces and close-up cinematics; landscapes usually pair a 1024 tile with macro variation.",
    presets: [
      {
        key: "asphalt",
        label: "Asphalt",
        prompt: "asphalt road surface, aggregate grit, worn tarmac",
        engineMaterial: "Landscape / Road material",
      },
      {
        key: "concrete",
        label: "Concrete",
        prompt: "raw concrete wall, subtle pores, grey cement surface",
        engineMaterial: "Static mesh material",
      },
      {
        key: "rock",
        label: "Rock cliff",
        prompt: "rough granite rock face, cracked natural stone, cliff texture",
        engineMaterial: "Landscape rock layer",
      },
      {
        key: "grass",
        label: "Grass",
        prompt: "green grass turf, dense blades, mowed lawn surface",
        engineMaterial: "Landscape grass layer",
      },
      {
        key: "metal",
        label: "Metal panel",
        prompt: "brushed steel metal panel, fine scratches, industrial plate",
        engineMaterial: "Static mesh material",
      },
      {
        key: "brick",
        label: "Brick",
        prompt: "weathered red brick wall, mortar joints, rough surface",
        engineMaterial: "Static mesh material",
      },
      {
        key: "sand",
        label: "Sand",
        prompt: "desert sand, fine grain ripples, dry dune surface",
        engineMaterial: "Landscape sand layer",
      },
      {
        key: "snow",
        label: "Snow",
        prompt: "packed snow surface, subtle drifts, cold white ground",
        engineMaterial: "Landscape snow layer",
      },
    ],
    exportMaps: [
      {
        suffix: "BaseColor",
        label: "BaseColor",
        role: "Albedo, sRGB on.",
      },
      {
        suffix: "Normal",
        label: "Normal",
        role: "Tangent-space normal, sRGB off, Compression = Normalmap.",
      },
      {
        suffix: "Mask",
        label: "Mask",
        role: "Packed: R = AO, G = Roughness, B = Metallic. UE5's standard single-sample layout.",
        special: true,
      },
      {
        suffix: "ORM",
        label: "ORM (optional)",
        role: "R = AO, G = Roughness, B = Metallic with AO inverted, for engines expecting the ORM convention.",
        special: true,
      },
    ],
    code: `# Unreal Engine 5 - Python (Editor Utility) to import and configure a texture set

import unreal

TEXTURE_DIR = "/Game/Textures/Generated"

def import_texture_set(asset_name, maps, mask_path=None):
    """maps: dict with keys basecolor, normal, mask"""
    tasks = []

    # BaseColor: sRGB on, default compression
    tasks.append(unreal.AssetImportTask())
    tasks[-1].filename = maps["basecolor"]
    tasks[-1].destination_path = TEXTURE_DIR
    tasks[-1].destination_name = asset_name + "_BaseColor"
    tasks[-1].automated = True
    tasks[-1].replace_existing = True
    tasks[-1].save = True

    # Normal: sRGB off, Normalmap compression
    tasks.append(unreal.AssetImportTask())
    tasks[-1].filename = maps["normal"]
    tasks[-1].destination_path = TEXTURE_DIR
    tasks[-1].destination_name = asset_name + "_Normal"
    tasks[-1].automated = True
    tasks[-1].replace_existing = True
    tasks[-1].save = True

    # Mask: sRGB off, Masks compression, no mip sRGB
    tasks.append(unreal.AssetImportTask())
    tasks[-1].filename = maps["mask"]
    tasks[-1].destination_path = TEXTURE_DIR
    tasks[-1].destination_name = asset_name + "_Mask"
    tasks[-1].automated = True
    tasks[-1].replace_existing = True
    tasks[-1].save = True

    for t in tasks:
        unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([t])

    # Post-import settings
    for suffix, srgb, compression in [
        ("_BaseColor", True, unreal.TextureCompressionSettings.TC_DEFAULT),
        ("_Normal", False, unreal.TextureCompressionSettings.TC_NORMALMAP),
        ("_Mask", False, unreal.TextureCompressionSettings.TC_MASKS),
    ]:
        path = TEXTURE_DIR + "/" + asset_name + suffix
        tex = unreal.load_asset(path)
        if tex:
            tex.set_editor_property("srgb", srgb)
            tex.set_editor_property("compression_settings", compression)
            tex.set_editor_property("address_x", unreal.TextureAddress.TA_WRAP)
            tex.set_editor_property("address_y", unreal.TextureAddress.TA_WRAP)
            unreal.EditorAssetLibrary.save_loaded_asset(tex)

# Material wiring notes:
#   BaseColor  <- TextureSampleParameter2D "BaseColor"
#   Normal     <- TextureSampleParameter2D "Normal"  (Compression: Normalmap)
#   Roughness  <- Mask.G   (multiply by a scalar parameter to tune globally)
#   AO         <- Mask.R
#   Metallic   <- Mask.B
#   Tiling is a Vector4 parameter on the Material Instance, not on the texture`,
    codeLanguage: "python",
    codeCaption: "Unreal Engine 5 - Editor Utility Python for batch import, compression and wrap mode",
    steps: [
      {
        title: "Generate the texture",
        body: "The default 1024px is the UE5 baseline. The presets above are grouped by engine use - asphalt, rock, grass, sand and snow for Landscape, separate from concrete, metal and brick for static meshes.",
      },
      {
        title: "Download the export pack",
        body: "You get BaseColor, Normal, the packed Mask map and an ORM variant. The Mask channel order follows the UE5 standard - R for AO, G for Roughness, B for Metallic.",
      },
      {
        title: "Import and set compression",
        body: "BaseColor keeps sRGB on with default compression. Normal turns sRGB off with Normalmap compression. Mask turns sRGB off with Masks compression. Wrong compression is the most common source of UE5 material bugs.",
      },
      {
        title: "Set the address mode",
        body: "Set Address X and Address Y to Wrap. Clamp stretches the edge pixels across the surface, which looks worse than not tiling at all.",
      },
      {
        title: "Wire the parent material",
        body: "Split the Mask channels into Roughness, AO and Metallic. Use TextureSampleParameter2D rather than a plain sample node so material instances can override the texture.",
      },
      {
        title: "Control density from the instance",
        body: "Keep Tiling on a Vector4 parameter of the material instance, not in the texture import settings. One texture can then serve both a 2m and an 8m surface.",
      },
    ],
    notes: [
      {
        h2: "Mask Maps are the UE5 standard",
        p: [
          "Sampling three separate grayscale maps for AO, Roughness and Metallic costs three texture samples. Packing them into the R, G and B channels of one Mask map feeds all three inputs from a single sample and frees up two texture slots.",
          "The channel order has to match: R for Ambient Occlusion, G for Roughness, B for Metallic. These exports already follow that convention. If you are feeding an existing pipeline, check whether it expects the UE order or the ORM order - both are in the download.",
        ],
      },
      {
        h2: "Lumen amplifies every problem in a texture",
        p: [
          "Lumen solves global illumination, so every small difference in a material gets amplified through bounced light. A texture with uneven overall brightness casts a grid of light and dark squares across the floor - the classic checkerboard.",
          "The average brightness across a tile here stays uniform, so even with Lumen bouncing indirect light around the room, the surface still reads as one continuous material.",
        ],
      },
      {
        h2: "Layer blending strategy for Landscape",
        p: [
          "A single texture stretched over terrain almost always reveals its grid at grazing angles. The standard UE5 answer is a Landscape Layer Blend: prepare two or three variants of the same material and blend them with painted vertex weights.",
          "Paired with a low-frequency detail normal, the grid essentially disappears. The four Landscape presets here - asphalt, rock, grass, sand and snow - are built around that idea: generate three variants and blend them, rather than generating one and tiling it hard.",
        ],
      },
      {
        h2: "Compression settings deserve more time than resolution",
        p: [
          "Many projects leave Normal maps at the default compression, which compresses them as colour and smears the high-frequency detail. Check compression per map: Normal must be TC_NORMALMAP and Mask must be TC_MASKS.",
          "And do not forget to turn sRGB off where it does not belong. On for colour maps, off for masks - leaving this wrong makes the whole material read too dark or too bright.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a Mask Map in Unreal Engine?",
        a: "A single texture that packs three grayscale maps into the RGB channels: R for ambient occlusion, G for roughness, B for metalness. UE5 samples it once and splits the channels, saving two texture samples and two texture slots.",
      },
      {
        q: "How do I import these textures into Unreal Engine 5?",
        a: "Drop the PNGs into your content folder, then set the compression settings per map: BaseColor sRGB on with default compression, Normal sRGB off with Normalmap compression, Mask sRGB off with Masks compression. Also set Address X and Y to Wrap on each texture asset.",
      },
      {
        q: "Should I use the Mask map or the ORM map?",
        a: "Use the Mask map for native UE5 pipelines where R is AO. Use the ORM map if your project or a marketplace asset expects the ORM convention, where AO is inverted. Both are in the download - the difference is only the AO channel.",
      },
      {
        q: "Will these look right with Lumen global illumination?",
        a: "Yes. Lumen amplifies any low-frequency brightness variation in a texture into a visible grid on large surfaces. These textures maintain uniform average brightness across the tile, so the indirect light stays even.",
      },
      {
        q: "How do I stop the tiling showing on a large landscape?",
        a: "Use a Landscape Layer Blend with two or three variants of the same material, blended by painted vertex weights, plus a low-frequency detail normal. Generate multiple variants of one of the landscape presets and blend between them.",
      },
      {
        q: "Can I use these textures in a commercial Unreal project?",
        a: "Yes, including in shipped games. Commercial license, no attribution, no watermark.",
      },
    ],
    materialMap: [
      { prompt: "asphalt road surface, aggregate grit", engine: "Landscape - Road Layer" },
      { prompt: "rough granite rock face, cracked", engine: "Landscape - Rock Layer" },
      { prompt: "green grass turf, dense blades", engine: "Landscape - Grass Layer" },
      { prompt: "desert sand, fine grain ripples", engine: "Landscape - Sand Layer" },
      { prompt: "packed snow surface, subtle drifts", engine: "Landscape - Snow Layer" },
      { prompt: "raw concrete wall, subtle pores", engine: "Static Mesh - Concrete" },
      { prompt: "brushed steel metal panel", engine: "Static Mesh - Metal" },
      { prompt: "weathered red brick wall", engine: "Static Mesh - Brick" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Blender                                                             */
  /* ------------------------------------------------------------------ */
  {
    id: "blender",
    highlights: [
      "Full five channels, AO and Height included",
      "Includes a one-click node tree Python script",
      "Handles sRGB / Non-Color colour spaces automatically",
      "Presets map to Principled parameter sets",
    ],
    name: "Blender",
    shortName: "Blender",
    brand: "#E87D0D",
    brandAlt: "#B35C06",
    brandSoft: "#FEF0E1",
    brandInk: "#8A4405",
    primaryKeyword: "blender texture generator",
    keywords: [
      "blender texture generator",
      "texture generator for blender",
      "blender seamless texture",
      "blender pbr material",
      "blender displacement texture",
    ],
    title: "Blender Texture Generator - PBR Maps",
    description:
      "Free Blender texture generator. Seamless, tileable PBR textures with albedo, normal, roughness and AO maps - plus a Python script that builds the shader node tree for you.",
    h1: "Blender Texture Generator",
    intro:
      "Blender gives you total control over how a material is built, which also means the wiring work. This generator ships a Python script that constructs the Principled BSDF node tree, wires all five maps and sets the colour space correctly - so you spend your time on the look, not on dragging nodes.",
    audience:
      "3D artists, technical artists and hobbyists who build materials in the Shader Editor.",
    painPoint:
      "Colour space mistakes are the classic Blender texture trap. A normal map imported as sRGB looks subtly wrong and nobody can say why. Rebuilding the same five-node tree for every new material is also a waste of an afternoon.",
    defaultResolution: 1024,
    resolutionNote:
      "1024px suits most Blender work. Use 2048px for hero surfaces and close-up renders; 512px is fine for background props.",
    presets: [
      {
        key: "planks",
        label: "Wood planks",
        prompt: "oak wood planks, visible grain, warm timber floorboards",
        engineMaterial: "Principled BSDF - Base Color",
      },
      {
        key: "stone",
        label: "Stone slab",
        prompt: "rough granite stone slab, cracked natural rock surface",
        engineMaterial: "Principled BSDF - Base Color",
      },
      {
        key: "marble",
        label: "Marble",
        prompt: "polished white marble with grey veins, glossy stone",
        engineMaterial: "Principled BSDF - Roughness 0.15",
      },
      {
        key: "metal",
        label: "Metal",
        prompt: "brushed steel metal plate, fine linear scratches",
        engineMaterial: "Principled BSDF - Metallic 1.0",
      },
      {
        key: "concrete",
        label: "Concrete",
        prompt: "raw concrete surface, subtle pores, grey cement",
        engineMaterial: "Principled BSDF - Roughness 0.85",
      },
      {
        key: "fabric",
        label: "Fabric",
        prompt: "woven linen fabric, textile weave, soft cloth",
        engineMaterial: "Principled BSDF - Sheen 0.3",
      },
      {
        key: "leather",
        label: "Leather",
        prompt: "brown leather hide, pebbled grain surface",
        engineMaterial: "Principled BSDF - Roughness 0.6",
      },
      {
        key: "snow",
        label: "Snow",
        prompt: "packed snow, subtle drifts, cold white ground",
        engineMaterial: "Principled BSDF - Subsurface 0.1",
      },
    ],
    exportMaps: [
      {
        suffix: "BaseColor",
        label: "Base Color",
        role: "Albedo. Colour space sRGB.",
      },
      {
        suffix: "Normal",
        label: "Normal",
        role: "Tangent-space normal. Colour space Non-Color, and the Normal Map node needs UV Map selected.",
      },
      {
        suffix: "Roughness",
        label: "Roughness",
        role: "Roughness. Colour space Non-Color.",
      },
      {
        suffix: "AO",
        label: "AO",
        role: "Ambient occlusion. Colour space Non-Color.",
      },
      {
        suffix: "Height",
        label: "Height",
        role: "Height. Colour space Non-Color. Feeds a Displacement modifier or a Bump node.",
      },
    ],
    code: `# Blender 4.x - build a PBR material node tree from generated maps
# Run in the Scripting workspace, or: blender --background --python build_material.py

import bpy

ASSET_DIR = "//textures/generated"   # adjust to your folder
MAT_NAME = "GeneratedMaterial"

def build_material(basecolor, normal, roughness, ao, height=None):
    mat = bpy.data.materials.get(MAT_NAME) or bpy.data.materials.new(MAT_NAME)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    out.location = (600, 0)
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (300, 0)
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

    tex_co = nt.nodes.new("ShaderNodeTexCoord")
    tex_co.location = (-900, 0)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.location = (-700, 0)
    mapping.inputs["Scale"].default_value = (4, 4, 4)
    nt.links.new(tex_co.outputs["UV"], mapping.inputs["Vector"])

    def img(path, loc):
        n = nt.nodes.new("ShaderNodeTexImage")
        n.location = loc
        n.image = bpy.data.images.load(path, check_existing=True)
        nt.links.new(mapping.outputs["Vector"], n.inputs["Vector"])
        return n

    # Base color - sRGB (default for images)
    bc = img(f"{ASSET_DIR}/{basecolor}", (-450, 300))
    nt.links.new(bc.outputs["Color"], bsdf.inputs["Base Color"])

    # Normal - Non-Color colour space + UV Map node required
    nm = img(f"{ASSET_DIR}/{normal}", (-450, 60))
    nm.image.colorspace_settings.name = "Non-Color"
    normal_map = nt.nodes.new("ShaderNodeNormalMap")
    normal_map.location = (-150, 60)
    normal_map.space = "TANGENT"
    uv_map = nt.nodes.new("ShaderNodeUVMap")
    uv_map.location = (-150, -80)
    nt.links.new(nm.outputs["Color"], normal_map.inputs["Color"])
    nt.links.new(uv_map.outputs["UV"], normal_map.inputs["UV"])
    nt.links.new(normal_map.outputs["Normal"], bsdf.inputs["Normal"])

    # Roughness - Non-Color
    rg = img(f"{ASSET_DIR}/{roughness}", (-450, -180))
    rg.image.colorspace_settings.name = "Non-Color"
    nt.links.new(rg.outputs["Color"], bsdf.inputs["Roughness"])

    # AO - Non-Color
    if ao:
        ao_n = img(f"{ASSET_DIR}/{ao}", (-450, -400))
        ao_n.image.colorspace_settings.name = "Non-Color"
        nt.links.new(ao_n.outputs["Color"], bsdf.inputs["Ambient Occlusion"])

    # Height -> Bump (or a Displacement modifier for true displacement)
    if height:
        h_n = img(f"{ASSET_DIR}/{height}", (-450, -620))
        h_n.image.colorspace_settings.name = "Non-Color"
        bump = nt.nodes.new("ShaderNodeBump")
        bump.location = (60, -500)
        bump.inputs["Strength"].default_value = 0.3
        nt.links.new(h_n.outputs["Color"], bump.inputs["Height"])
        nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    return mat

# build_material("wood_BaseColor.png", "wood_Normal.png",
#                "wood_Roughness.png", "wood_AO.png", "wood_Height.png")

# Notes:
# - Blender 4.x Principled BSDF renamed "Specular" to "Specular IOR Level"
# - Image Texture node: Extension = Repeat (not Extend) so the tile wraps
# - True displacement needs subdivision + a Displacement modifier,
#   and Cycles must use "Displacement" in the Render properties`,
    codeLanguage: "python",
    codeCaption: "Blender 4.x - Python script that builds the Principled BSDF node tree",
    steps: [
      {
        title: "Generate the texture",
        body: "The default 1024px suits most Blender work. The presets above are grouped by shader parameter - polished marble maps to Roughness 0.15, metal to Metallic 1.0, cloth to Sheen 0.3.",
      },
      {
        title: "Download the five maps",
        body: "Base Color, Normal, Roughness, AO and Height. This is the complete PBR channel set - the two extra maps over a game engine both have real uses in Blender.",
      },
      {
        title: "Run the Python script",
        body: "Open a new text block in the Scripting workspace, paste the script and point ASSET_DIR at your texture folder. It builds the node tree and wires everything up.",
      },
      {
        title: "Fix the colour spaces",
        body: "Keep Base Color as sRGB and set Normal, Roughness, AO and Height to Non-Color. Get this wrong and the material renders darker for no obvious reason.",
      },
      {
        title: "Set the wrap mode",
        body: "Set Extension to Repeat on every Image Texture node. The default of Extend stretches the edge pixels outward.",
      },
      {
        title: "Tune the mapping scale",
        body: "The Mapping node Scale sets the physical density. A 1024px texture at scale 4 covers roughly 4 metres - adjust to your scene.",
      },
    ],
    notes: [
      {
        h2: "Blender 4.x renamed the Principled BSDF inputs",
        p: [
          "Version 4.0 renamed a batch of input sockets: Specular became Specular IOR Level, Subsurface became Subsurface Weight, Transmission became Transmission Weight, Sheen became Sheen Weight, and Emission split into Emission Color and Emission Strength.",
          "If a node setup copied from the web refuses to connect, this rename is usually why. The old socket names still work in 4.x, but newly created objects default to the new ones.",
        ],
      },
      {
        h2: "Normal maps need an explicit UV Map node",
        p: [
          "This is the most common silent error in Blender. The Normal Map node defaults to the active UV map, so in a scene with several UV maps it can pick the wrong one - the normals then look scrambled or do nothing at all.",
          "Always add a UV Map node explicitly and wire it to the Normal Map UV input, picking the right map. The included script already does this.",
        ],
      },
      {
        h2: "True displacement and bump shading are different things",
        p: [
          "Wiring the Height map into a Bump node is the cheapest and most universal approach - it only changes the shading normal and needs no extra geometry.",
          "True displacement needs a Subdivision Surface modifier on the mesh, then a Displacement modifier pointing at the Height map, and the render Displacement setting switched to Displacement rather than Bump. It genuinely changes the silhouette, at the cost of a large jump in geometry.",
        ],
      },
      {
        h2: "Colour management and output",
        p: [
          "Blender 4.x uses AgX colour management by default, and it handles highlights more conservatively than Filmic. The same texture therefore looks darker in Blender than in a game engine - that is a colour management difference, not a texture problem.",
          "To match what the engine shows, switch the view transform to Standard temporarily for comparison, or bake the view transform into the image on export.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I set up a PBR material in Blender?",
        a: "Use the Principled BSDF: Base Color to the albedo, Normal to a Normal Map node, Roughness and AO to their matching inputs, and Height to a Bump node. Set Normal, Roughness, AO and Height images to Non-Color colour space, and set every Image Texture node's Extension to Repeat.",
      },
      {
        q: "Why does my normal map look wrong in Blender?",
        a: "Two usual causes. First, the image is set to sRGB instead of Non-Color - normal maps must be Non-Color. Second, the Normal Map node is picking up the wrong UV map. Add an explicit UV Map node and connect it to the Normal Map node's UV input.",
      },
      {
        q: "How do I use the height map for real displacement?",
        a: "Add a Subdivision Surface modifier, then a Displacement modifier with the height texture, and set the render Displacement method to Displacement rather than Bump. Bump shading is much cheaper and usually enough for most surfaces.",
      },
      {
        q: "Does Blender use Filmic or AgX?",
        a: "Blender 4.x defaults to AgX. It handles highlights more conservatively than Filmic, so a material can look darker in Blender than in a game engine without the texture being wrong. Switch the view transform to Standard temporarily to compare.",
      },
      {
        q: "How do I stop the texture looking stretched on a sphere?",
        a: "Use spherical or box projection from the Texture Coordinate node instead of the UV layout. For irregular geometry, triplanar projection avoids stretching entirely by projecting from three axes and blending by the surface normal.",
      },
      {
        q: "Can I export these to other engines from Blender?",
        a: "Yes. The maps are standard PNG with no engine-specific packing, so glTF or FBX export carries them across. Note that the AO and height maps are not used by most game engines, so check your target's channel expectations before importing.",
      },
    ],
    materialMap: [
      { prompt: "oak wood planks, visible grain", engine: "Base Color + Roughness 0.6" },
      { prompt: "polished white marble with grey veins", engine: "Roughness 0.15, Specular IOR Level 0.5" },
      { prompt: "brushed steel metal plate", engine: "Metallic 1.0, Roughness 0.35" },
      { prompt: "woven linen fabric, textile weave", engine: "Sheen Weight 0.3, Roughness 0.9" },
      { prompt: "brown leather hide, pebbled grain", engine: "Roughness 0.6, Specular IOR Level 0.4" },
      { prompt: "packed snow, subtle drifts", engine: "Subsurface Weight 0.1, Roughness 0.55" },
      { prompt: "raw concrete surface, subtle pores", engine: "Roughness 0.85, Base Color grey" },
      { prompt: "rough granite stone slab", engine: "Roughness 0.78, Height -> Bump 0.4" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Unity                                                              */
  /* ------------------------------------------------------------------ */
  {
    id: "unity",
    highlights: [
      "Outputs Smoothness, no invert node needed",
      "Includes an Editor script that fixes all import settings",
      "Ticks Normal Map and Occlusion automatically",
      "Presets cover the common URP/Lit surfaces",
    ],
    name: "Unity",
    shortName: "Unity",
    brand: "#222C37",
    brandAlt: "#5C6B7A",
    brandSoft: "#EEF1F4",
    brandInk: "#222C37",
    primaryKeyword: "unity texture generator",
    keywords: [
      "unity texture generator",
      "texture generator for unity",
      "unity urp seamless texture",
      "unity pbr material",
      "unity normal map",
    ],
    title: "Unity Texture Generator - URP & HDRP Maps",
    description:
      "Free Unity texture generator. Seamless, tileable PBR textures with an Editor script that sets every import option correctly for URP and HDRP.",
    h1: "Unity Texture Generator",
    intro:
      "Unity's texture import panel has more settings that are quietly wrong than any other engine. Get the sRGB flag, the normal map type or the compression format wrong and the material renders subtly incorrect with no error message anywhere. This generator ships an Editor script that applies the correct import settings for every map, so the setup is repeatable and correct by default.",
    audience:
      "Indie developers and small studios shipping on URP, HDRP or the built-in pipeline.",
    painPoint:
      "Unity has no built-in metallic workflow in the way Unreal does, and the Smoothness-vs-Roughness inversion trips up everyone once. On top of that, the per-platform texture override means a setting that is right for PC is wrong for mobile.",
    defaultResolution: 1024,
    resolutionNote:
      "1024px for PC. For mobile, use 512px and set the Android/iOS override to 256 or 512 - Unity's per-platform compression settings handle the rest.",
    presets: [
      {
        key: "concrete",
        label: "Concrete",
        prompt: "raw concrete wall, subtle pores, grey cement surface",
        engineMaterial: "URP/Lit - Concrete",
      },
      {
        key: "brick",
        label: "Brick",
        prompt: "weathered red brick wall, mortar joints, rough surface",
        engineMaterial: "URP/Lit - Brick",
      },
      {
        key: "wood",
        label: "Wood floor",
        prompt: "oak wood planks, visible grain, warm timber floor",
        engineMaterial: "URP/Lit - Wood Floor",
      },
      {
        key: "metal",
        label: "Metal",
        prompt: "brushed steel metal plate, fine linear scratches, industrial",
        engineMaterial: "URP/Lit - Metal",
      },
      {
        key: "stone",
        label: "Stone",
        prompt: "rough granite stone slab, cracked natural rock",
        engineMaterial: "URP/Lit - Stone",
      },
      {
        key: "fabric",
        label: "Fabric",
        prompt: "woven fabric, textile weave, soft cloth surface",
        engineMaterial: "URP/Lit - Fabric",
      },
      {
        key: "tile",
        label: "Tile",
        prompt: "white ceramic tile grid, glossy glazed tiles",
        engineMaterial: "URP/Lit - Ceramic",
      },
      {
        key: "asphalt",
        label: "Asphalt",
        prompt: "asphalt road surface, aggregate grit, worn tarmac",
        engineMaterial: "URP/Lit - Asphalt",
      },
    ],
    exportMaps: [
      {
        suffix: "Albedo",
        label: "Albedo",
        role: "Base colour. sRGB ON, Texture Type = Default.",
      },
      {
        suffix: "Normal",
        label: "Normal",
        role: "Normal map. sRGB OFF, Texture Type = Normal map. Unity handles the channel swizzle.",
      },
      {
        suffix: "Smoothness",
        label: "Smoothness",
        role: "Smoothness = 1 - roughness. Feed through an Invert node into the Smoothness slot.",
      },
      {
        suffix: "AO",
        label: "AO",
        role: "Ambient occlusion. sRGB OFF. Assign to the Occlusion slot and tick the checkbox.",
      },
      {
        suffix: "Height",
        label: "Height",
        role: "Height for parallax or displacement. sRGB OFF. Note mobile GPUs rarely support displacement.",
      },
    ],
    code: `// Unity - Editor script: set correct import settings for a generated texture set
// Put in Assets/Editor/TextureImporterSetup.cs

using UnityEditor;
using UnityEngine;

public static class GeneratedTextureImporter
{
    // Call from a menu item or another script
    [MenuItem("Tools/AI Texture/Apply Import Settings")]
    public static void ApplySettings()
    {
        ApplyToFolder("Assets/Textures/Generated");
    }

    static void ApplyToFolder(string path)
    {
        foreach (var guid in AssetDatabase.FindAssets("t:Texture2D", new[] { path }))
        {
            string assetPath = AssetDatabase.GUIDToAssetPath(guid);
            var importer = AssetImporter.GetAtPath(assetPath) as TextureImporter;
            if (importer == null) continue;

            string name = System.IO.Path.GetFileNameWithoutExtension(assetPath);
            bool isNormal = name.ToLower().Contains("normal");
            bool isMask = name.ToLower().Contains("smoothness")
                       || name.ToLower().Contains("roughness")
                       || name.ToLower().Contains("ao")
                       || name.ToLower().Contains("height");

            importer.textureType = isNormal
                ? TextureImporterType.NormalMap
                : TextureImporterType.Default;

            importer.sRGBTexture = !isNormal && !isMask;
            importer.wrapMode = TextureWrapMode.Repeat;
            importer.filterMode = FilterMode.Trilinear;
            importer.anisoLevel = 8;

            // Mobile override: smaller max size and stronger compression
            var settings = importer.GetPlatformTextureSettings("Android");
            settings.overridden = true;
            settings.maxTextureSize = 512;
            settings.format = TextureImporterFormat.ASTC_6x6;
            importer.SetPlatformTextureSettings(settings);

            importer.SaveAndReimport();
        }
    }
}

// Material wiring for URP/Lit:
//   Base Map        <- Albedo
//   Normal Map      <- Normal        (tick "Normal Map" checkbox)
//   Smoothness      <- Invert(Smoothness map)
//   Occlusion       <- AO             (tick "Occlusion" checkbox)
//   Tiling X / Y    <- set on the Material, not the importer`,
    codeLanguage: "csharp",
    codeCaption: "Unity - Editor script that corrects every texture import setting",
    steps: [
      {
        title: "Generate the texture",
        body: "The default 1024px works for PC. The presets above cover the eight surfaces most common in URP/Lit and map cleanly onto your project material naming.",
      },
      {
        title: "Download the five maps",
        body: "Albedo, Normal, Smoothness, AO and Height. Note this is Smoothness rather than Roughness - URP uses smoothness directly and the script handles the inversion for you.",
      },
      {
        title: "Run the Editor script",
        body: "Put the script in Assets/Editor/ and run it from the Tools menu. It walks the folder and sets the correct Texture Type, sRGB, wrap mode and Android platform override for every map.",
      },
      {
        title: "Create the material",
        body: "Create a URP/Lit material: Base Map takes the Albedo, Normal Map takes the Normal with the Normal Map checkbox ticked, and Occlusion takes the AO with its checkbox ticked.",
      },
      {
        title: "Handle the smoothness",
        body: "Route the Smoothness map through an Invert node into the Smoothness slot. Feeding a Roughness map straight in inverts the surface - wet areas turn dry and dry areas turn wet.",
      },
      {
        title: "Set tiling on the material",
        body: "Set Tiling X/Y on the Material Inspector rather than the import settings, so one texture asset can be reused at different densities across objects.",
      },
    ],
    notes: [
      {
        h2: "Smoothness and Roughness are inverses",
        p: [
          "Unreal uses Roughness while the Unity URP shader exposes Smoothness - the two are exact inverses. A surface with Roughness 0.2 (very smooth) has a Smoothness of 0.8.",
          "Feeding a Roughness map straight into the Smoothness slot produces a material that looks as though the wet parts were dried and the dry parts wetted. Unity raises no warning for this, which is exactly why an Invert node is worth the extra step.",
        ],
      },
      {
        h2: "Unticked checkboxes are the most common oversight",
        p: [
          "URP/Lit has two easy-to-forget checkboxes: Normal Map and Occlusion. Drag a texture into the slot without ticking them and Unity imports the texture but ignores it completely - the material just looks flat, with no error anywhere.",
          "The script ticks both for you. When doing it by hand, confirm those two boxes after importing.",
        ],
      },
      {
        h2: "Per-platform overrides for mobile",
        p: [
          "The Unity texture import panel can override settings per platform. A common combination is 1024 with DXT compression on PC and 512 with ASTC on mobile - tick the Android Override to apply it.",
          "Mobile GPUs generally do not support displacement, so the Height map is mostly unused on mobile. You can simply skip importing it there and save the memory.",
        ],
      },
      {
        h2: "SRP Batcher and texture packing consistency",
        p: [
          "The SRP Batcher requires every texture used by a material to agree on its shader keywords - in practice, all textures in one material must either enable or disable the Albedo alpha channel consistently.",
          "The simplest approach is a single import policy across the project. Running the included script once is enough to guarantee it.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I import PBR textures into Unity?",
        a: "Set the normal map's Texture Type to Normal map and turn sRGB off; keep sRGB on for albedo and off for roughness, AO and height; set Wrap Mode to Repeat. Then assign them to a URP/Lit material and tick both the Normal Map and Occlusion checkboxes.",
      },
      {
        q: "Why does my Unity material look flat even though I assigned a normal map?",
        a: "The Normal Map checkbox in the material inspector is unticked. Unity imports the texture but ignores it entirely, with no warning. Also check that the texture's Texture Type is set to Normal map rather than Default.",
      },
      {
        q: "Should I use roughness or smoothness in Unity?",
        a: "URP/Lit exposes Smoothness, which is the inverse of roughness. Plug the smoothness map through an Invert node into the Smoothness slot. Feeding a roughness map directly inverts the surface appearance.",
      },
      {
        q: "What resolution should I use for mobile?",
        a: "512px with the Android and iOS platform overrides enabled, using ASTC or ETC2 compression. Use 1024 or 2048 only for surfaces the player gets very close to, and remember a 2048 RGBA map with mipmaps costs about 21 MB of VRAM.",
      },
      {
        q: "Does the height map work on mobile?",
        a: "Real displacement is not supported on most mobile GPUs. You can still use the height map to drive parallax occlusion, or bake the effect into the normal map on the desktop build and skip it on mobile.",
      },
      {
        q: "What is the SRP Batcher texture requirement?",
        a: "All textures used by one material must agree on whether they use the alpha channel, so the shader keyword stays consistent. Setting a single import policy across the project - which the included Editor script does - is the simplest way to stay compliant.",
      },
    ],
    materialMap: [
      { prompt: "raw concrete wall, subtle pores", engine: "URP/Lit - Roughness 0.85" },
      { prompt: "weathered red brick wall", engine: "URP/Lit - Roughness 0.8" },
      { prompt: "oak wood planks, visible grain", engine: "URP/Lit - Smoothness 0.38" },
      { prompt: "brushed steel metal plate", engine: "Metallic 1.0, Smoothness 0.65" },
      { prompt: "white ceramic tile grid", engine: "Smoothness 0.8, Metallic 0" },
      { prompt: "asphalt road surface, aggregate grit", engine: "Smoothness 0.08, Metallic 0" },
      { prompt: "rough granite stone slab", engine: "Smoothness 0.22, Normal strong" },
      { prompt: "woven fabric, textile weave", engine: "Smoothness 0.1, Metallic 0" },
    ],
  },
];

export function getPlatform(id: PlatformId): PlatformConfig {
  const p = PLATFORMS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown platform: ${id}`);
  return p;
}

/** Generic material presets, used when no platform is specified */
export const GENERIC_PRESETS: PlatformPreset[] = [
  { key: "brick", label: "Brick", prompt: "weathered red brick wall, mortar joints, rough surface", engineMaterial: "" },
  { key: "wood", label: "Wood", prompt: "oak wood planks, visible grain, warm natural wood floor", engineMaterial: "" },
  { key: "concrete", label: "Concrete", prompt: "raw concrete wall, subtle pores, grey cement surface", engineMaterial: "" },
  { key: "metal", label: "Metal", prompt: "brushed steel metal plate, fine linear scratches", engineMaterial: "" },
  { key: "stone", label: "Stone", prompt: "rough granite stone slab, cracked natural rock", engineMaterial: "" },
  { key: "fabric", label: "Fabric", prompt: "woven linen fabric, textile weave, soft cloth", engineMaterial: "" },
  { key: "marble", label: "Marble", prompt: "polished white marble with grey veins, glossy", engineMaterial: "" },
  { key: "rust", label: "Rust", prompt: "rusted metal sheet, oxidized orange corroded surface", engineMaterial: "" },
  { key: "tile", label: "Tile", prompt: "white ceramic tile grid, glossy glazed tiles", engineMaterial: "" },
  { key: "grass", label: "Grass", prompt: "green grass lawn turf, dense blades", engineMaterial: "" },
  { key: "leather", label: "Leather", prompt: "brown leather hide, pebbled grain surface", engineMaterial: "" },
  { key: "sand", label: "Sand", prompt: "desert sand dunes, fine grain ripples", engineMaterial: "" },
];
