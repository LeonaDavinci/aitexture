/**
 * 平台注册表 —— 四个目标平台的差异化配置。
 *
 * 差异化不在文案，而在**导出的产物形态**：
 * - Roblox  : SurfaceAppearance 四图结构 + MetalnessMap(R=金属度,G=反射率) 打包 + 脚本贴图 UV 规范
 * - Unreal  : Mask Map(R=AO, G=Roughness, B=Metallic) 打包 + 母材质/材质实例工作流
 * - Blender : 节点组工作流 + 色彩管理 + 导出设置
 * - Unity   : 导入设置矩阵 + C# Editor 脚本 + SRP Batcher 注意事项
 */

export type PlatformId = "roblox" | "unreal" | "blender" | "unity";

export interface PlatformPreset {
  key: string;
  label: string;
  prompt: string;
  /** 该预设对应的引擎内材质名/枚举 */
  engineMaterial: string;
}

export interface PlatformExportMap {
  /** 导出文件名后缀，如 "ColorMap" */
  suffix: string;
  label: string;
  /** 该图在引擎里的作用说明 */
  role: string;
  /** 是否为平台特有（打包图） */
  special?: boolean;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  /** 品牌主色 */
  brand: string;
  /** 品牌辅色（渐变用） */
  brandAlt: string;
  /** 品牌色的浅色底（文字/徽标用） */
  brandSoft: string;
  /** 深色文字色 */
  brandInk: string;
  primaryKeyword: string;
  keywords: string[];
  title: string;
  description: string;
  h1: string;
  intro: string;
  /** 目标用户画像 */
  audience: string;
  /** 目标用户最核心的诉求 */
  painPoint: string;
  /** 该平台专属的预设（不是通用材质预设） */
  presets: PlatformPreset[];
  /** 平台默认分辨率 */
  defaultResolution: 512 | 1024 | 2048;
  /** 推荐分辨率说明 */
  resolutionNote: string;
  /** 导出贴图集 */
  exportMaps: PlatformExportMap[];
  /** 引擎接入代码 */
  code: string;
  codeLanguage: string;
  codeCaption: string;
  /** 接入步骤 */
  steps: Array<{ title: string; body: string }>;
  /** Banner 上的一句话卖点（3-4 条） */
  highlights: string[];
  /** 该平台特有的注意事项 */
  notes: Array<{ h2: string; p: string[] }>;
  /** 该平台特有的 FAQ */
  faq: Array<{ q: string; a: string }>;
  /** 常用材质对应表 */
  materialMap: Array<{ prompt: string; engine: string }>;
}

export const PLATFORMS: PlatformConfig[] = [
  /* ------------------------------------------------------------------ */
  /* Roblox                                                             */
  /* ------------------------------------------------------------------ */
  {
    id: "roblox",
    highlights: [
      "SurfaceAppearance 四图结构，直接挂载",
      "MetalnessMap 已按 Roblox 双通道打包",
      "预设对应内置 Material 枚举",
      "附 Roblox Studio 挂载脚本",
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
    codeCaption: "Roblox Studio — 挂载到 MeshPart 的 SurfaceAppearance 脚本",
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
        h2: "为什么 Roblox 只需要四张图，而不是五张",
        p: [
          "SurfaceAppearance 没有 AO 槽位，也没有独立的 Height 槽位。环境光遮蔽在 Roblox 里由引擎的光照系统近似处理，你额外塞一张 AO 图进去不会有任何效果。",
          "Height 图同样没有位置放 —— Roblox 用的是内置的几何凹凸，不是位移贴图。所以在这里导出 AO 和 Height 是浪费带宽，MetalnessMap 才是 Roblox 特有的关键图。",
        ],
      },
      {
        h2: "MetalnessMap 的双通道打包",
        p: [
          "Roblox 的 MetalnessMap 是一张图里装两个信息：R 通道是金属度，决定这个表面像不像金属；G 通道是反射率，决定非金属表面的镜面反射强度。",
          "常见的做法是手动在 Photoshop 里拼通道，但多数人把 G 通道留成了黑色，结果非金属表面完全没有高光，塑料感极重。这里的导出已经按 Roblox 的约定填好了：金属区反射率 0.7，非金属区 0.5，直接可用。",
        ],
      },
      {
        h2: "Material 枚举才是真正决定观感的开关",
        p: [
          "很多 Roblox 创作者以为贴图能决定一切，但 Material 枚举才决定表面如何响应光照。Plastic 枚举会让任何贴图都带上塑料般的均匀高光，无论你的 roughness 图怎么画。",
          "实践顺序是：先确定 Part 的 Material，再让提示词往那个材质靠。比如你要做砖墙，就把 Material 设为 Brick，然后提示词写 'red brick wall with mortar joints'。两者匹配时，SurfaceAppearance 的细节才能真正发挥出来。",
        ],
      },
      {
        h2: "脚本贴图（Scripted Texture）完全另一套逻辑",
        p: [
          "如果你的项目用的是 Scripted Texture 而不是 SurfaceAppearance，那贴图会被直接铺在砖块表面，此时贴图本身就是最终外观，没有 PBR 通道可言 —— 一张颜色图就够了。",
          "这类场景下把生成结果当作普通颜色图使用即可，但要注意 Scripted Texture 的 UV 是基于砖块面片的，重复密度由 StudsPerTile 控制，通常 8 到 16 比较合适。",
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
      "Mask Map 已打包 R=AO G=Roughness B=Metallic",
      "同时提供 ORM 变体应对既有管线",
      "预设区分 Landscape 与静态网格用途",
      "附 Editor Utility Python 导入脚本",
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
    codeCaption: "Unreal Engine 5 — Editor Utility Python 批量导入并配置压缩与环绕模式",
    steps: [
      {
        title: "Generate the texture",
        body: "默认 1024px，这是 UE5 的基准尺寸。上方预设按引擎用途组织：Landscape 用的沥青、岩石、草、沙、雪，与静态网格用的混凝土、金属、砖墙分开。",
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
        h2: "Mask Map 是 UE5 材质的标准做法",
        p: [
          "UE5 的材质里同时采样 AO、Roughness、Metallic 三张灰度图会占三次纹理采样。把它们打包进一张 Mask 图的 R/G/B 三个通道，一次采样就能喂三个输入，同时省下两个纹理槽。",
          "通道顺序必须一致：R 是 Ambient Occlusion，G 是 Roughness，B 是 Metallic。这里的导出已经按这个约定打包好。如果你要接入已有管线，先确认对方用的是 UE 约定还是 ORM 约定 —— 导出包里两种都给了。",
        ],
      },
      {
        h2: "Lumen 会放大贴图上的每一个问题",
        p: [
          "Lumen 求解全局光照，材质上的每一点差异都会通过反弹光被放大。一个整体亮度不均的贴图，会在地面上照出一格一格的明暗方块 —— 这就是所谓的棋盘格。",
          "这里的贴图在瓦片周期内平均亮度是一致的，所以即使 Lumen 把间接光来回反射，表面依然读作一个连续的材质。",
        ],
      },
      {
        h2: "Landscape 的图层混合策略",
        p: [
          "单一贴图铺满地形，在低角度视角下几乎一定会露出网格。UE5 的标准解法是 Landscape Layer Blend：准备两到三个同材质的变体，用绘制好的顶点权重混合。",
          "配合一张低频的 detail normal，网格感会基本消失。这里的四个 Landscape 预设（沥青、岩石、草、沙、雪）就是按这个思路准备的 —— 生成三个变体做混合，比生成一张然后硬铺效果好得多。",
        ],
      },
      {
        h2: "压缩设置比分辨率更值得花时间",
        p: [
          "很多项目把 Normal 贴图留成默认压缩，结果法线被当成颜色压缩，高频细节直接糊掉。压缩设置应该逐张检查：Normal 必须 TC_NORMALMAP，Mask 必须 TC_MASKS。",
          "另外别忘了关掉不需要的 sRGB。颜色图开、遮罩类关 —— 这个开关留错会让整个材质偏暗或偏亮。",
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
      "完整五通道，AO 与 Height 都可用",
      "附一键构建节点树的 Python 脚本",
      "自动处理 sRGB / Non-Color 色彩空间",
      "预设对应 Principled 参数组合",
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
    codeCaption: "Blender 4.x — 一键构建 Principled BSDF 节点树的 Python 脚本",
    steps: [
      {
        title: "Generate the texture",
        body: "默认 1024px。上方预设按 Blender 的着色器参数分组：抛光大理石对应 Roughness 0.15，金属对应 Metallic 1.0，织物对应 Sheen 0.3。",
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
        h2: "Blender 4.x 的 Principled BSDF 改名了",
        p: [
          "4.0 版本重命名了一批输入插槽：Specular 变成 Specular IOR Level，Subsurface 变成 Subsurface Weight，Transmission 变成 Transmission Weight，Sheen 变成 Sheen Weight，Emission 变成 Emission Color 和 Emission Strength。",
          "如果网上抄来的节点教程连不上，很可能就是撞上了这个改名。老版本的节点名在 4.x 里仍然可用，但新建物体默认是新的插槽名。",
        ],
      },
      {
        h2: "法线贴图必须配 UV Map 节点",
        p: [
          "这是 Blender 里最常见的静默错误。Normal Map 节点默认使用活动 UV 地图，如果场景里有多个 UV 地图，它可能取到错误的那一个，结果就是法线看起来方向错乱或者完全没效果。",
          "永远显式添加一个 UV Map 节点接到 Normal Map 的 UV 输入上，选对 UV 地图。这个脚本已经这么做了。",
        ],
      },
      {
        h2: "真位移与凹凸不是一回事",
        p: [
          "把 Height 图接到 Bump 节点是最省事也最通用的做法，它只改变着色法线，不需要额外几何体。",
          "真位移需要给网格加 Subdivision Surface 修改器，再挂 Displacement 修改器并指定 Height 贴图，同时在渲染属性里把 Displacement 设为 Displacement（默认是 Bump）。真位移会真正改变轮廓线，代价是几何量暴增。",
        ],
      },
      {
        h2: "色彩管理与输出",
        p: [
          "Blender 4.x 默认使用 AgX 色彩管理，它对高光的处理比 Filmic 更克制。这会让同样的贴图在 Blender 里看起来比在游戏引擎里暗一些 —— 这不是贴图的问题，是色彩管理的问题。",
          "如果要和引擎里的结果对齐，可以把视图变换临时切到 Standard 做对比，或者在导出时把视图变换烘焙进图像。",
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
      "输出 Smoothness，省掉反向节点",
      "附修正全部导入设置的 Editor 脚本",
      "自动勾选 Normal Map 与 Occlusion",
      "预设覆盖 URP/Lit 常用表面",
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
    codeCaption: "Unity — Editor 脚本，一键修正所有贴图的导入设置",
    steps: [
      {
        title: "Generate the texture",
        body: "默认 1024px。上方预设覆盖 URP/Lit 常用的八种表面，可以直接对应到项目里的材质命名。",
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
        h2: "Smoothness 与 Roughness 是反的",
        p: [
          "Unreal 用 Roughness，Unity 的 URP 着色器暴露的是 Smoothness —— 两者互为相反数。Roughness 0.2（很光滑）的表面，对应的 Smoothness 是 0.8。",
          "直接把 Roughness 图连到 Smoothness 槽，得到的材质看起来像把湿的地方弄干、把干的地方弄湿。这类错误不会报任何警告，所以值得专门用一个 Invert 节点来处理。",
        ],
      },
      {
        h2: "勾选框没勾是最常见的疏漏",
        p: [
          "URP/Lit 有两个容易被忘掉的复选框：Normal Map 和 Occlusion。你把贴图拖进槽位但不勾选，Unity 会导入这张图但完全不生效 —— 材质看起来就是平的，不报任何错。",
          "脚本会直接勾上这两个。手动设置时，导入后请再确认一遍这两个框。",
        ],
      },
      {
        h2: "移动端的平台覆盖设置",
        p: [
          "Unity 的纹理导入面板可以对每个平台单独覆盖设置。PC 用 1024、DXT 压缩，移动端用 512、ASTC 压缩，这是常见组合 —— 勾上 Android 平台的 Override 就能生效。",
          "移动端 GPU 通常不支持位移贴图，Height 图在移动端基本用不上，导入时可以考虑直接不导入它，省一份内存。",
        ],
      },
      {
        h2: "SRP Batcher 与贴图的打包方式",
        p: [
          "SRP Batcher 要求材质使用的所有贴图具有一致的着色器关键字 —— 也就是说，同一个材质里的所有贴图必须都勾或都不勾 Albedo 的 Alpha 通道。",
          "最省事的做法是给项目里的所有贴图统一一套导入设置，跑一次上面的脚本就能保证一致。",
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

/** 通用材质预设（未指定平台时使用） */
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
