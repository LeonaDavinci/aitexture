import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy - AI Texture",
  description:
    "AI Texture runs entirely in your browser. We do not collect prompts, images, generated textures or personal data.",
  path: "/privacy",
  keywords: ["ai texture privacy policy"],
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-ink-900">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: 3 November 2026</p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink-700">
        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">The short version</h2>
          <p className="mt-2">
            We do not collect your prompts, your images, your generated textures, or any personal
            information. Generation happens entirely inside your own browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">What we do not do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>No accounts, no sign-up, no email collection.</li>
            <li>No analytics on prompts, images or outputs.</li>
            <li>No cookies used for tracking or advertising.</li>
            <li>No server-side processing of your material at any point.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">What is stored locally</h2>
          <p className="mt-2">
            Settings such as your last prompt and the tiling preview mode are kept in your browser's
            local storage so the page remembers them. Clearing site data removes them. They never
            leave your device.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">Third parties</h2>
          <p className="mt-2">
            The site may load fonts and scripts from third-party CDNs, which will see your IP address
            and the request URL as part of normal web delivery. We do not combine that with
            generation data because there is no generation data to combine.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">Your generated content</h2>
          <p className="mt-2">
            Textures you create are yours to use commercially, without attribution or watermark. We
            claim no rights over them because we never receive them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink-900">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to privacy@aitexture.app.
          </p>
        </section>
      </div>
    </section>
  );
}
