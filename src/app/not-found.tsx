import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-sm font-bold text-sun-600">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-900">
        This texture does not exist
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-600">
        The page you were looking for moved or never existed. The generator is still right where you
        left it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="btn-secondary rounded-xl px-5 py-3 text-sm font-bold"
        >
          Back home
        </Link>
        <Link
          href="/tools/ai-texture-generator"
          className="btn-primary rounded-xl px-5 py-3 text-sm font-bold"
        >
          Open the generator
        </Link>
      </div>
    </section>
  );
}
