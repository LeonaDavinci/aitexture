export interface GuideMeta {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: "what-is-a-tileable-texture",
    title: "What is a Tileable Texture? A Deep Dive",
    excerpt:
      "Seamless and tileable mean the same property. Here is how UV repeat wrapping works, why boundaries betray most photos, and what actually makes a texture safe to repeat.",
    readTime: "9 min read",
    category: "Fundamentals",
  },
  {
    slug: "pbr-texture-workflow",
    title: "The PBR Texture Workflow: Prompt to Production",
    excerpt:
      "Albedo, normal, roughness, AO and height - what each channel does, how to keep them consistent, and how to avoid the classic mistakes that make a material look fake.",
    readTime: "11 min read",
    category: "PBR",
  },
  {
    slug: "texture-for-unity-unreal-blender",
    title: "Seamless Textures in Unity, Unreal and Blender",
    excerpt:
      "Step-by-step setup for each engine: texture wrap modes, tiling values, material graph wiring, and how to break up visible repetition on large surfaces.",
    readTime: "13 min read",
    category: "Engines",
  },
  {
    slug: "texture-repetition-and-tiling-artifacts",
    title: "Killing Texture Repetition on Large Surfaces",
    excerpt:
      "Even a perfectly seamless tile looks fake when it repeats. Macro variation, detail normals, triplanar projection and vertex blending - the practical toolkit.",
    readTime: "8 min read",
    category: "Techniques",
  },
];
