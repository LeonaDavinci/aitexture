# AI Texture (aitexture.app) — 需求分析文档

> 站点：www.aitexture.app · 技术栈：Next.js 16 (App Router, SSR) + TypeScript + Tailwind CSS 4
> 对标参考：https://www.poly.cam/tools/ai-texture-generator

---

## 1. 对标调研结论

### 1.1 Polycam 2D Texture Generator（主参考）

| 维度 | 观察结果 |
| --- | --- |
| 核心交互 | 输入一段材质描述 → 点击 Generate → 一次返回 **4 张**无缝 2D 纹理 → 选中后下载 |
| 第二输入 | 支持上传图片作为基底，配合 **Image Strength** 滑杆控制"贴合原图"与"自由发挥"的比例 |
| 负向提示词 | 独立 Negative Prompt 输入框，用于排除元素（如 "draped cloth, no wrinkles"） |
| 分辨率 | 512 / 768 / 1024 / 1536 / 2048 五档 |
| 输出 | PNG，**无水印**，明确允许商用（royalty-free, no attribution） |
| 生态绑定 | 深度绑定 Polycam 扫描生态；免费账号仅能预览，下载需 Pro/Business |
| 商业策略 | freemium，Pro 约 $12–30/月 |

**可借鉴**：一次出 4 变体、负向提示词、分辨率档位、无水印 + 商用许可的表述方式、材质预设入口。
**要规避**：把下载锁在付费墙后（本项目全部免费）；绑定自家扫描生态（本项目独立）。

### 1.2 同类竞品横向对比

| 产品 | 形态 | 强项 | 短板 |
| --- | --- | --- | --- |
| Polycam | 在线（订阅） | 4 变体、高清、与扫描联动 | 付费墙、预览受限 |
| normalmap.ai | 在线（免费额度） | **边缘镜像混合算法**、PBR 一键串联、3D 球体预览、全本地处理 | 偏"照片转无缝"，非文生图 |
| PicFixer | 在线（免费+水印） | 文生无缝、4K、矢量图案 | 免费版带水印 |
| Texturly / NormalMap AI / PLAYTEX | 在线 | 浏览器内本地处理 | 功能分散 |
| Material Maker | 桌面/浏览器 | 开源、节点式、200+ 节点、Godot/Unity/UE 导出 | 学习成本高，非 AI |
| Stable Diffusion（本地） | 本地 | 可控性最高、真无缝微调 | 需要显卡与部署门槛 |
| Meshy | 在线 | 网格级 PBR 贴图（UV 自动处理） | 产的是"模型贴图"不是"可平铺材质" |

**关键洞察**：市场上有"文生图"和"照片转无缝"两条路，但**没有把两者合并且免费无水印**的产品 —— 这是本项目的切入点。

### 1.3 SEO 现状（2026-11 实测）

- Polycam /tools/ai-texture-generator 为纯客户端渲染（CSR），抓取到的 HTML 中 **只有 title + meta description，H1/H2/H3 全部为空** → 对 SEO 不友好，是可超越的缺口。
- normalmap.ai 结构做得极好：功能区 → 对比表 → 规格表 → 引擎兼容矩阵 → 使用场景 → 技术指南内链 → FAQ → 技术规格。**这是本项目页面结构的模板。**
- 目标关键词生态（已验证有搜索量）：`ai texture generator`、`seamless texture generator`、`tileable texture`、`pbr texture generator`、`free texture generator`、`normal map generator`、`ai texture generator for game dev`。

---

## 2. 产品定位

**一句话**：浏览器里跑的、真正无缝的、免费无水印的 PBR 材质生成器。

### 2.1 三个差异点（对应竞品空白）

| 差异点 | 竞品现状 | 本项目做法 |
| --- | --- | --- |
| **无缝是数学保证，不是后期修补** | 多为 offset + clone stamp 修补，会糊结构、留下低频棋盘格 | 所有噪声格点索引对周期取模，边界天然闭合，结构零损伤 |
| **PBR 五通道同源** | 各通道独立生成，容易对不上 | 高度场 → 法线 / 粗糙度 / AO / 高度，全部同源，物理一致 |
| **完全本地 + 免费** | 免费版加水印 / 锁下载 | 纯前端生成，零上传、零算力成本 → 可以永久免费 |

### 2.2 目标用户

3D 美术 / 游戏开发者 / 独立工作室 / ArchViz 设计师 / 平面与包装设计师 —— 需要**可平铺表面**而非"好看的图"的人群。

---

## 3. 功能需求

### 3.1 MVP（已实现）

| ID | 功能 | 说明 | 验收标准 |
| --- | --- | --- | --- |
| F1 | 提示词生成 | 输入自然语言材质描述 → 解析为材质配方 | 支持 19 类材质：wood / brick / concrete / stone / fabric / leather / marble / metal / rust / tile / asphalt / sand / snow / grass / mud / glass / carbon / paper / water |
| F2 | 一次 4 变体 | 单次生成 4 张不同 seed 的候选 | 每张图下方显示 seed，可复现 |
| F3 | 严格无缝 | 周期性噪声，边界严格闭合 | 2x2 / 3x3 / 4x4 平铺预览无接缝、无棋盘格 |
| F4 | PBR 贴图包 | Albedo / Normal / Roughness / AO / Height | 五张图同分辨率、像素对齐；法线为切线空间 |
| F5 | 平铺预览 | 1x–4x 实时切换平铺密度 | 切换无需重新生成 |
| F6 | 通道预览 | 一键切换查看任一通道 | albedo / normal / roughness / AO / height |
| F7 | 分辨率档位 | 512 / 1024 / 2048 | 导出 PNG 无损 |
| F8 | 材质预设 | 12 个一键预设 chip | brick / wood / concrete / metal / stone / fabric / marble / rust / tile / grass / leather / sand |
| F9 | 语义修饰词 | 颜色词 + 工艺词解析 | 颜色：red/blue/oak…；工艺：glossy/matte/weathered/cracked/fine/coarse |
| F10 | 零门槛 | 无注册、无登录、无水印 | 直接下载 |

### 3.2 迭代计划

| 阶段 | 功能 | 优先级 |
| --- | --- | --- |
| P1 | 照片转无缝纹理（边缘镜像 + 低频光照消除） | 高 — 已占位 `tools/photo-to-texture` |
| P1 | 负向提示词（排除元素） | 中 — Polycam 已有，属跟进项 |
| P2 | 3D 球体实时预览（UV 贴图） | 中 — normalmap.ai 有 |
| P2 | 材质变体批量导出 ZIP | 中 |
| P2 | 公开图库（社区分享 + 可 fork seed） | 中 — SEO 长尾利器 |
| P3 | WebGL / WebGPU 加速（大尺寸 4K+） | 低 |
| P3 | 商用授权证书生成（带 seed 的 PDF） | 低 |

---

## 4. SEO 架构

### 4.1 页面结构（参考 normalmap.ai 的成熟模板）

```
/                              落地页：Hero → 工具 → 特性 → 流程 → 场景 → FAQ → CTA
/tools/ai-texture-generator    主工具页（主关键词）
/tools/seamless-texture-generator   长尾：seamless / tileable
/tools/pbr-texture-generator   长尾：PBR / normal / roughness
/tools/photo-to-texture        长尾：photo to texture（开发中）
/guides                        指南索引
/guides/what-is-a-tileable-texture
/guides/pbr-texture-workflow
/guides/texture-for-unity-unreal-blender
/guides/texture-repetition-and-tiling-artifacts
/pricing  /about  /privacy  /terms
```

### 4.2 SEO 基线

- **SSR**：Next.js App Router 服务端渲染，首屏 HTML 直接含完整正文（对标 Polycam 的 CSR 空标题劣势）
- **标题模板**：`%s | AI Texture`，主页单独定制
- **Meta**：每页独立 title / description / canonical / OG / Twitter card
- **结构化数据**：WebSite + SoftwareApplication（含 Offer / AggregateRating）+ FAQPage（首页与工具页各一组）
- **H 层级**：每页严格单一 H1，H2 分区，H3 分条目
- **sitemap.xml / robots.txt**：由 App Router 动态生成
- **canonical**：绝对 URL，指向 https://www.aitexture.app
- **内链矩阵**：首页 ↔ 三个工具页 ↔ 4 篇指南 ↔ pricing/about，guides 页回链工具页

### 4.3 关键词布局

| 页面 | 主关键词 | 次关键词 |
| --- | --- | --- |
| / | ai texture generator | free texture generator, pbr texture online |
| /tools/ai-texture-generator | ai texture generator | text to texture, tileable texture maker |
| /tools/seamless-texture-generator | seamless texture generator | tileable texture, seamless tile maker |
| /tools/pbr-texture-generator | pbr texture generator | normal map generator, roughness map generator |
| /tools/photo-to-texture | photo to texture | image to seamless texture |
| /guides/* | tileable texture guide | pbr workflow, unity texture setup |

---

## 5. 技术方案

### 5.1 技术栈

| 层 | 选型 | 理由 |
| --- | --- | --- |
| 框架 | Next.js 16 App Router | SSR + 静态导出双可选，SEO 友好 |
| 语言 | TypeScript 5.7 | 材质配方类型安全 |
| 样式 | Tailwind CSS 4 | `@theme` 定义设计令牌，视觉规范可集中管控 |
| 渲染 | 服务端渲染 + 客户端交互岛 | 正文 SSR，生成器为 client component |
| 生成 | 自研 Canvas 2D 程序化引擎 | 零依赖、零成本、离线可用 |

### 5.2 核心算法

**无缝的本质** —— 让噪声函数的格点在周期边界闭合：

```
valueNoiseTiled(x, y, period, seed):
  xa = ((x0 % period) + period) % period   // 格点索引回绕
  xb = (xa + 1) % period
  ...  // 插值得到 [0,1) 噪声
```

因为 `f(0) ≡ f(1)` 由构造保证，所以不需要任何 offset/clone 后期处理。

**模块划分**

| 文件 | 职责 |
| --- | --- |
| `src/lib/noise.ts` | hash、valueNoiseTiled、fbmTiled、ridgedTiled、worleyTiled、stripesTiled、颜色工具 |
| `src/lib/texture-engine.ts` | 提示词 → 材质配方解析、19 种材质高度函数、PBR 通道派生 |
| `src/components/texture-generator.tsx` | 客户端交互岛：生成、预览、下载 |
| `src/lib/seo.ts` | metadata 工厂、SITE_URL 常量 |

**PBR 派生链路**

```
高度场 height[]
  ├─ heightToNormal()      → Sobel 梯度 → 切线空间法线
  ├─ heightToRoughness()   → 高度↑ ⇒ 粗糙度↓（凸起更光滑）
  ├─ heightToAO()          → 与邻域均值比较 → 遮蔽估计
  └─ 灰度图                → Height / Displacement
```

### 5.3 性能

- 2048² × 4 变体 = 6700 万像素，逐像素计算 → 纯 JS 约 2–4 秒
- 生成过程用 `setTimeout(16)` 分帧让出主线程，UI 不冻结，进度条可见
- 后续可迁移到 Web Worker + OffscreenCanvas 彻底避免阻塞

---

## 6. 视觉设计规范

遵循既定规范：**明亮鲜艳、高对比度、晴天的感觉**。

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| ink-900 | `#0d1424` | 主文字、暗色区块 |
| ink-50/200 | `#f5f7fb` / `#cdd6e6` | 分区背景、描边 |
| sun-500 | `#f97316` | 主 CTA、强调 |
| azure-600 | `#2563eb` | 链接、次强调、激活态 chip |
| mint-500 | `#10b981` | 成功、正向标识 |

硬性约束：
- 激活态 chip / 按钮必须**实色背景**（azure-600 / sun-500 + 白字），避免文字与背景重叠
- 焦点环 3px azure-500，键盘可达
- 尊重 `prefers-reduced-motion`
- 移动端单列，桌面双列（控制面板 sticky）

---

## 7. 部署与后续

- **域名**：www.aitexture.app（DNS + Cloudflare / Vercel / 自托管均可）
- **构建**：`npm run build` → `.next/`，`npm start` 生产启动
- **仓库**：建议 `LeonaDavinci/aitexture`，main 分支，CI 用 Node 21+ 自动构建
- **下一步优先级**：照片转无缝（P1）→ 负向提示词（P1）→ 3D 球预览（P2）→ 公开图库（P2，SEO 复利）

---

## 8. 风险与对策

| 风险 | 影响 | 对策 |
| --- | --- | --- |
| 大分辨率纯 JS 偏慢 | 用户等待 3–5 秒 | 分帧 + 进度条；下一步上 Web Worker |
| 程序化材质被误认为"不够 AI" | 品牌认知 | 文档讲清数学优势；后续叠加真实扩散模型作为可选后端 |
| 无后端则无账号/无云端图库 | 增长受限 | V2 引入可选云同步，用户自选 |
| 同质化竞品跟进 | 排名下降 | 靠 SEO 内容矩阵 + 免费策略 + 指南深度建立护城河 |
