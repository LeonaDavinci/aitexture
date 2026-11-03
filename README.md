# AI Texture — www.aitexture.app

Free, browser-based AI texture generator. Turns a text prompt into **seamless, tileable PBR
texture packs** — albedo, normal, roughness, AO and height — with no upload, no watermark and no
sign-up.

> 需求分析与竞品调研见 [REQUIREMENTS.md](./REQUIREMENTS.md)

---

## 为什么不一样

大多数 AI 纹理工具生成的是"一张好看的图"，而不是"能铺的材质"。本项目的核心差异：

| | 常见做法 | 本项目 |
| --- | --- | --- |
| 无缝 | 后期 offset + clone stamp 修补，糊结构、留低频棋盘格 | 噪声格点索引对周期取模，边界**由构造保证闭合** |
| PBR | 各通道独立生成，互相对不上 | 全部从**同一高度场**派生，物理一致 |
| 成本 | 免费版加水印 / 锁下载 | 纯前端生成，零算力成本 → 永久免费 |

---

## 技术栈

- **Next.js 16**（App Router，SSR）· React 19 · TypeScript 5.7 · Tailwind CSS 4
- 纹理引擎为自研纯 Canvas 2D 程序化实现，**零第三方运行时依赖**

---

## 快速开始

```bash
npm install
npm run dev        # 开发服务器
npm run build      # 生产构建（webpack 管线，见下方说明）
npm start          # 生产启动
```

### 验证脚本

```bash
node scripts/verify-engine.mjs     # 引擎自检：20 种材质的严格无缝性 + PBR 通道派生
node scripts/render-preview.mjs     # 渲染材质预览图到 .preview/out/
node scripts/e2e-browser.mjs       # 真实无头 Chrome E2E（需先 npm start）
```

`verify-engine.mjs` 的检验标准是**连续函数在 u=0 与 u=1 处严格相等**（误差 < 1e-9），
而不是比较像素列 —— 后者会因采样点偏移产生假阳性。

---

## 目录结构

```
src/
├── app/
│   ├── page.tsx                      落地页（Hero / 工具 / 特性 / 流程 / 场景 / FAQ / CTA）
│   ├── layout.tsx                    根布局 + 全局 metadata
│   ├── globals.css                   设计令牌（@theme）+ 组件类
│   ├── sitemap.ts / robots.ts        动态生成
│   ├── tools/
│   │   ├── ai-texture-generator/     主工具页（主关键词）
│   │   ├── seamless-texture-generator/   长尾：seamless / tileable
│   │   ├── pbr-texture-generator/    长尾：PBR / normal / roughness
│   │   └── photo-to-texture/          长尾：photo to texture（开发中）
│   ├── guides/[slug]/                4 篇技术指南（SSG）
│   └── pricing / about / privacy / terms
├── components/
│   ├── texture-generator.tsx         客户端交互岛（生成 / 预览 / 下载）
│   ├── site-header.tsx / site-footer.tsx
├── lib/
│   ├── noise.ts                      可平铺噪声库（周期性 value/fbm/ridged/worley/stripes）
│   ├── texture-engine.ts             提示词解析 + 19 种材质高度函数 + PBR 派生
│   ├── seo.ts                        metadata 工厂
│   └── guides-data.ts                指南数据
└── scripts/                          验证与预览脚本
```

---

## 核心算法

**无缝的本质** —— 让噪声函数的格点在周期边界闭合：

```ts
valueNoiseTiled(x, y, periodX, periodY, seed) {
  const xa = ((x0 % periodX) + periodX) % periodX;  // 格点索引回绕
  const xb = (xa + 1) % periodX;
  // → f(0) ≡ f(1) by construction
}
```

**关键约束**（改动引擎时必须遵守）：

1. 高度函数只接受**归一化瓦片坐标** `[0,1)`；
2. 各向异性用**频率分离**（`freqX` / `freqY`）表达，**绝不能**对坐标做非整数缩放 —— 那会破坏周期性；
3. 任何取模运算要用正模 `((x % 1) + 1) % 1`（JS 的 `%` 对负数返回负值）；
4. Worley 必须用**环形距离**，否则跨边界的特征点会跳变。

**PBR 派生链路**

```
高度场 height[]
  ├─ heightToNormal()      → Sobel 梯度 → 切线空间法线
  ├─ heightToRoughness()   → 高度↑ ⇒ 粗糙度↓（凸起更光滑）
  ├─ heightToAO()          → 与邻域均值比较 → 遮蔽估计
  └─ 灰度图                → Height / Displacement
```

---

## 已知构建说明

Next.js 16 默认把 TypeScript 检查放进 jest-worker 子进程，在部分 Windows 环境下 worker 通信会
挂起（CPU 空闲但构建不返回）。已在 `next.config.ts` 中启用 `experimental.useTypeScriptCli`
改为进程内检查；构建脚本固定使用 `next build --webpack`（Turbopack 的类型检查 worker 同样有
此问题）。

---

## 待办

- [ ] 照片转无缝纹理（边缘镜像 + 低频光照消除）
- [ ] 负向提示词
- [ ] 3D 球体 UV 实时预览
- [ ] 材质变体批量 ZIP 导出
- [ ] 公开图库（可 fork seed）
- [ ] Web Worker + OffscreenCanvas 加速大尺寸导出
