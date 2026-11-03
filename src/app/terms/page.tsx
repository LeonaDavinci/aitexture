import type { Metadata } from "next";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service - AI Texture",
  description:
    "Terms of service for the AI Texture browser-based seamless texture generator, including the commercial use license for generated textures.",
  path: "/terms",
  keywords: ["ai texture terms of service"],
});

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "TermsOfService",
  name: "Terms of Service - AI Texture",
  url: "https://www.aitexture.app/terms",
  inLanguage: "en",
};

export default function TermsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Terms of Service", path: "/terms" },
            ]),
          ),
        }}
      />
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-ink-900">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: 3 November 2026</p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-700">
        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">1. Use of the service</h2>
          <p className="mt-2">
            AI Texture provides a browser-based tool for generating seamless textures. You may use it
            for any lawful purpose. You may not use it to generate unlawful content, to infringe
            intellectual property rights, or to attempt to disrupt or overload the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">2. License for generated textures</h2>
          <p className="mt-2">
            All textures and maps you generate are licensed to you for commercial and non-commercial
            use, including games, film, advertising, architectural visualisation, print and physical
            products. No attribution is required. No watermark is applied.
          </p>
          <p className="mt-2">
            You may not resell, sublicense or redistribute the generator itself, nor use it to build
            a competing texture-generation service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">3. Your content</h2>
          <p className="mt-2">
            You retain all rights to the prompts you write and the images you supply. Because
            processing happens locally in your browser, we never receive, store or process this
            content.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">4. Acceptable use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Do not use the service for content that is unlawful or defamatory.</li>
            <li>Do not attempt to reverse engineer, scrape or rebrand the service.</li>
            <li>Do not present generated output in a way that misrepresents it as human-created.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">5. Availability</h2>
          <p className="mt-2">
            The service is provided on an as-is basis without warranty of uninterrupted availability.
            Features may change or be added at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">6. Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, liability arising from use of the service is
            limited to the amount you paid for it, which is zero.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">7. Changes</h2>
          <p className="mt-2">
            These terms may be updated as the service evolves. Continued use after an update
            constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">8. Contact</h2>
          <p className="mt-2">Questions about these terms can be sent to legal@aitexture.app.</p>
        </section>
      </div>
    </section>
    </>
  );
}
