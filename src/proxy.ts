import { NextResponse, type NextRequest } from "next/server";

/**
 * 301 redirects from the old /tools/* paths to the root-level keyword paths.
 * The researched page architecture uses root-level paths such as /seamless-texture-generator/,
 * because a keyword at the root of the URL carries more SEO weight, so the old paths redirect permanently.
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
