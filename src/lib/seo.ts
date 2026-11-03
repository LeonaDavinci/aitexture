import type { Metadata } from "next";

export const SITE_URL = "https://www.aitexture.app";
export const SITE_NAME = "AI Texture";
export const SITE_TAGLINE = "Free AI Texture Generator";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Texture Generator - Free Seamless PBR Textures Online",
    template: "%s | AI Texture",
  },
  description:
    "Free AI texture generator. Turn text prompts or photos into seamless, tileable PBR textures for games, 3D and ArchViz. Runs in your browser - no upload, no signup.",
  applicationName: "AI Texture",
  keywords: [
    "ai texture generator",
    "seamless texture generator",
    "tileable texture",
    "pbr texture generator",
    "free texture generator",
    "ai material generator",
    "texture generator for games",
    "seamless tile generator",
    "normal map generator",
    "roughness map generator",
  ],
  authors: [{ name: "AI Texture" }],
  creator: "AI Texture",
  publisher: "AI Texture",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "AI Texture Generator - Free Seamless PBR Textures Online",
    description:
      "Turn a prompt or a photo into seamless, tileable PBR textures. 100% in-browser, no upload, no watermark, free to use commercially.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Texture Generator - Free Seamless PBR Textures",
    description:
      "Turn a prompt or a photo into seamless, tileable PBR textures. 100% in-browser, no upload, no watermark.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "design",
};

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
    },
  };
}
