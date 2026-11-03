import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    // Next 16 默认把 TypeScript 检查放进 jest-worker 子进程，
    // 在部分 Windows 环境下 worker 通信会挂起（CPU 空闲但构建不返回）。
    // 改为进程内直接调用 tsc CLI，行为等价且不会卡死。
    useTypeScriptCli: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
