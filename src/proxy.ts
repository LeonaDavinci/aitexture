import { NextResponse, type NextRequest } from "next/server";

/**
 * 根级关键词路径 → /tools/* 旧路径 的 301 重定向。
 * 豆包调研建议的页面架构使用根级路径（/seamless-texture-generator/），
 * 关键词出现在 URL 根目录对 SEO 更有利，因此把旧路径永久重定向过去。
 */
const REDIRECTS: Record<string, string> = {
  "/tools/ai-texture-generator": "/ai-texture-generator",
  "/tools/seamless-texture-generator": "/seamless-texture-generator",
  "/tools/pbr-texture-generator": "/pbr-texture-generator",
  "/tools/photo-to-texture": "/photo-to-texture",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const target = REDIRECTS[pathname];
  if (!target) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    "/tools/ai-texture-generator",
    "/tools/seamless-texture-generator",
    "/tools/pbr-texture-generator",
    "/tools/photo-to-texture",
  ],
};
