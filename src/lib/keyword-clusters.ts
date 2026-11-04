/**
 * Keyword cluster to landing page mapping, based on the five researched clusters.
 * Cluster 1 core tool / 2 seamless / 3 PBR / 4 software workflow / 5 material categories
 */
export interface KeywordCluster {
  id: string;
  name: string;
  description: string;
  /** Keywords used for the page meta and woven naturally into the body copy */
  keywords: string[];
}

export const CLUSTERS: KeywordCluster[] = [
  {
    id: "main",
    name: "Main tool",
    description: "Core generator pages targeting the highest-volume keyword cluster.",
    keywords: ["ai texture generator", "free ai texture generator", "text to texture ai"],
  },
  {
    id: "seamless",
    name: "Seamless textures",
    description: "Tileable and repeatable surface keywords - the highest intent cluster.",
    keywords: [
      "seamless texture generator",
      "ai seamless texture",
      "tileable texture generator",
      "seamless pbr texture generator",
      "repeatable texture generator",
    ],
  },
  {
    id: "pbr",
    name: "PBR materials",
    description: "Physically based material and map-set keywords for technical buyers.",
    keywords: [
      "ai pbr texture generator",
      "pbr material generator",
      "ai 3d texture generator",
      "ai material generator",
    ],
  },
  {
    id: "software",
    name: "3D software workflow",
    description: "Engine-specific workflow pages - Blender, Unreal Engine and Unity.",
    keywords: [
      "blender texture generator",
      "unreal engine texture generator",
      "unity texture generator",
      "game texture generator",
      "3d material generator",
    ],
  },
  {
    id: "material",
    name: "Material categories",
    description: "Per-material pages covering specific surface types.",
    keywords: [
      "ai wood texture generator",
      "ai concrete texture generator",
      "ai fabric texture generator",
      "ai stone texture generator",
    ],
  },
];

/** Engine workflow page configuration */
export interface EngineWorkflow {
  slug: string;
  name: string;
  shortName: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  h1: string;
  intro: string;
  accent: string;
}

export const ENGINE_WORKFLOWS: EngineWorkflow[] = [
  {
    slug: "blender-texture-generator",
    name: "Blender",
    shortName: "Blender",
    primaryKeyword: "blender texture generator",
    keywords: [
      "blender texture generator",
      "texture generator for blender",
      "blender seamless texture",
      "blender pbr material",
    ],
    title: "Blender Texture Generator - Seamless PBR Maps",
    description:
      "Free Blender texture generator. Seamless, tileable PBR textures with albedo, normal, roughness and AO maps. Clean repeat wrapping for Cycles and EEVEE - no watermark.",
    h1: "Blender Texture Generator",
    intro:
      "Generate seamless PBR texture packs that drop straight into Blender. Every map is exported at identical resolution so the normal map lines up with the base colour, and the UV repeat wrapping is clean by construction - so a floor tiled 20 times still reads as one continuous surface.",
    accent: "orange",
  },
  {
    slug: "unreal-engine-texture-generator",
    name: "Unreal Engine",
    shortName: "Unreal",
    primaryKeyword: "unreal engine texture generator",
    keywords: [
      "unreal engine texture generator",
      "unreal texture generator",
      "ue5 seamless texture",
      "unreal pbr material",
    ],
    title: "Unreal Engine Texture Generator - Seamless PBR",
    description:
      "Free Unreal Engine texture generator. Seamless, tileable PBR texture sets with albedo, normal, roughness and AO maps for UE5 materials, Lumen and Nanite.",
    h1: "Unreal Engine Texture Generator",
    intro:
      "Generate seamless PBR texture packs ready for Unreal Engine 5. Every map exports at the same resolution and stays pixel-aligned, and the tiling is mathematically exact - which means large floors and walls survive a Lumen GI pass without the repeat revealing itself.",
    accent: "blue",
  },
  {
    slug: "unity-texture-generator",
    name: "Unity",
    shortName: "Unity",
    primaryKeyword: "unity texture generator",
    keywords: [
      "unity texture generator",
      "texture generator for unity",
      "unity urp seamless texture",
      "unity pbr material",
    ],
    title: "Unity Texture Generator - Seamless PBR Textures",
    description:
      "Free Unity texture generator. Seamless, tileable PBR textures with albedo, normal, roughness and AO maps - plug straight into URP or HDRP materials.",
    h1: "Unity Texture Generator",
    intro:
      "Generate seamless PBR texture sets that import cleanly into Unity URP and HDRP. All five maps export at matching resolution so texture compression and mipmapping behave, and the tiling is exact rather than approximated - useful when a material tiles across a whole environment.",
    accent: "mint",
  },
];

/** Material category page configuration */
export interface MaterialPage {
  slug: string;
  name: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** Example prompt for this material */
  prompt: string;
  /** Material trait descriptions, used in the body copy */
  traits: string[];
  accent: string;
}

export const MATERIAL_PAGES: MaterialPage[] = [
  {
    slug: "wood-texture-generator",
    name: "Wood",
    primaryKeyword: "ai wood texture generator",
    keywords: ["ai wood texture generator", "wood texture generator", "seamless wood texture", "wood pbr material"],
    title: "AI Wood Texture Generator - Seamless Timber PBR",
    description:
      "Free AI wood texture generator. Seamless, tileable wood textures with growth rings, grain and plank detail, plus normal, roughness and AO maps for game engines.",
    h1: "AI Wood Texture Generator",
    intro:
      "Generate seamless wood textures with believable growth rings and directional grain. Each texture exports as a full PBR set, and because the grain runs along a fixed axis you can rotate the material in-engine without the rings looking wrong.",
    prompt: "oak wood planks with visible grain, warm natural timber",
    traits: [
      "Growth rings warp along the board instead of running perfectly straight",
      "Grain stretches along the length of the board, the way real timber does",
      "Roughness rises in the softer early-wood bands",
    ],
    accent: "orange",
  },
  {
    slug: "concrete-texture-generator",
    name: "Concrete",
    primaryKeyword: "ai concrete texture generator",
    keywords: ["ai concrete texture generator", "concrete texture generator", "seamless concrete texture", "brutalist texture"],
    title: "AI Concrete Texture Generator - Seamless Cement PBR",
    description:
      "Free AI concrete texture generator. Seamless, tileable concrete and cement textures with pores, stains and subtle form marks - full PBR map sets.",
    h1: "AI Concrete Texture Generator",
    intro:
      "Generate seamless concrete textures that read as cast cement rather than grey noise: fine air bubbles, broad pour stains and subtle blotching, all evenly lit so no checkerboard appears when the surface tiles across a facade.",
    prompt: "raw concrete wall, subtle air pores, grey cement surface",
    traits: [
      "Air bubbles cluster unevenly, the way they form during a pour",
      "Broad low-frequency staining breaks up the flat grey",
      "Uniform lighting keeps large facades free of the repeating checkerboard",
    ],
    accent: "ink",
  },
  {
    slug: "fabric-texture-generator",
    name: "Fabric",
    primaryKeyword: "ai fabric texture generator",
    keywords: ["ai fabric texture generator", "fabric texture generator", "seamless fabric texture", "cloth texture pbr"],
    title: "AI Fabric Texture Generator - Seamless Woven Cloth",
    description:
      "Free AI fabric texture generator. Seamless, tileable fabric and textile textures with visible weave, plus normal, roughness and AO maps for game engines.",
    h1: "AI Fabric Texture Generator",
    intro:
      "Generate seamless woven fabric textures. The weave structure is genuinely geometric rather than a noise pattern, so the normal map reacts correctly to light at grazing angles - the detail that separates cloth from painted cardboard.",
    prompt: "woven linen fabric, textile weave, soft natural cloth",
    traits: [
      "Warp and weft threads interlock in a real weave pattern",
      "Slub irregularities break up the mechanical regularity",
      "Thread-level normals make the cloth catch light correctly",
    ],
    accent: "mint",
  },
  {
    slug: "stone-texture-generator",
    name: "Stone",
    primaryKeyword: "ai stone texture generator",
    keywords: ["ai stone texture generator", "stone texture generator", "seamless stone texture", "granite texture pbr"],
    title: "AI Stone Texture Generator - Seamless Rock PBR",
    description:
      "Free AI stone texture generator. Seamless, tileable stone, granite and rock textures with natural cracking - albedo, normal, roughness and AO maps.",
    h1: "AI Stone Texture Generator",
    intro:
      "Generate seamless stone textures built from fractured cell structure rather than smooth gradients, so the crack network reads as mineral rather than as a texture map. Each set exports as a complete PBR pack.",
    prompt: "rough granite stone slab, cracked natural rock",
    traits: [
      "Cell-based fracture structure gives natural crack networks",
      "Fracture edges catch light correctly in the normal map",
      "Roughness varies between the polished faces and the broken interior",
    ],
    accent: "blue",
  },
];
