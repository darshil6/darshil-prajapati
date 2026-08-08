import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 text-center"
    >
      <p className="text-meta text-muted">ERROR / 404</p>
      <h1 className="font-sans text-[clamp(3rem,9vw,7rem)] font-extrabold leading-none tracking-tight">
        LOST IN
        <br />
        <span className="font-serif italic font-normal text-accent">
          the void.
        </span>
      </h1>
      <p className="max-w-sm text-muted">
        This page doesn&apos;t exist — or it was quietly removed because it
        didn&apos;t matter.
      </p>
      <Link
        href="/"
        className="link-underline text-meta text-ink"
        data-cursor="link"
      >
        ← Back to the surface
      </Link>
    </main>
  );
}
