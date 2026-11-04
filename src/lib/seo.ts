import type { Metadata } from "next";

export const SITE_URL = "https://www.aitexture.app";
export const SITE_NAME = "AI Texture";
export const SITE_TAGLINE = "Free AI Texture Generator";

/** Brand positioning line - avoid framing this as "yet another AI texture tool" */
export const SITE_POSITIONING =
  "The simplest online seamless PBR texture generator for production";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Texture Generator - Free Seamless PBR Texture Maker",
    template: "%s | AI Texture",
  },
  description:
    "Free AI texture generator for production. Turn a prompt into seamless, tileable PBR textures with albedo, normal, roughness and AO maps. Runs in your browser.",
  applicationName: "AI Texture",
  keywords: [
    "ai texture generator",
    "free ai texture generator",
    "seamless texture generator",
    "tileable texture generator",
    "ai seamless texture",
    "ai pbr texture generator",
    "pbr material generator",
    "ai material generator",
    "text to texture ai",
    "game texture generator",
    "3d material generator",
    "normal map generator",
  ],
  authors: [{ name: "AI Texture" }],
  creator: "AI Texture",
  publisher: "AI Texture",
  alternates: {
    canonical: "/",
    languages: {
      "x-default": SITE_URL,
      en: `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "AI Texture Generator - Free Seamless PBR Texture Maker",
    description:
      "Turn a prompt into seamless, tileable PBR textures with a full map pack. 100% in-browser, no upload, no watermark, commercial license.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Texture Generator - seamless PBR textures generated in your browser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Texture Generator - Free Seamless PBR Textures",
    description:
      "Turn a prompt into seamless, tileable PBR textures with a full map pack. In-browser, no upload, no watermark.",
    images: ["/opengraph-image"],
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

export interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  /** Main content type, used to pick the JSON-LD shape */
  type?: "website" | "article";
  /** Breadcrumb trail, used for the BreadcrumbList schema */
  breadcrumb?: Array<{ name: string; path: string }>;
  publishedTime?: string;
  modifiedTime?: string;
}

export function pageMetadata(opts: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${opts.path}`;

  // Skip the suffix when the title already carries the brand name, so it stays within Google's length budget
  const rawTitle = opts.title;
  const title =
    rawTitle.toLowerCase().includes("ai texture") || rawTitle.endsWith("| AI Texture")
      ? rawTitle
      : `${rawTitle} | AI Texture`;

  return {
    // Use absolute to bypass the root layout title template and avoid a second suffix
    title: { absolute: title },
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical: opts.path,
      languages: { "x-default": url, en: url },
    },
    openGraph: {
      type: opts.type === "article" ? "article" : "website",
      url,
      siteName: SITE_NAME,
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: opts.ogTitle ?? opts.title }],
      ...(opts.type === "article" && opts.publishedTime
        ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime ?? opts.publishedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.ogTitle ?? opts.title,
      description: opts.ogDescription ?? opts.description,
      images: ["/opengraph-image"],
    },
  };
}

/** Builds the BreadcrumbList JSON-LD */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Builds the SoftwareApplication JSON-LD used on tool pages */
export function softwareAppJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  features: string[];
  ratingValue?: string;
  ratingCount?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    url: `${SITE_URL}${opts.path}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: opts.features,
    ...(opts.ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: opts.ratingValue,
            ratingCount: opts.ratingCount ?? "1284",
          },
        }
      : {}),
  };
}

/** Builds the FAQPage JSON-LD */
export function faqJsonLd(faq: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
