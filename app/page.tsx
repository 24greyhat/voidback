import AliveBorder from "./components/AliveBorder";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: SITE_DESCRIPTION,
      foundingDate: "2026",
      subOrganization: { "@id": "https://antplatform.ai/#product" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://antplatform.ai/#product",
      name: "ANTP",
      url: "https://antplatform.ai",
      applicationCategory: "ProductivityApplication",
      description:
        "An AI manager for people with no natural structure. It learns your personality, tracks your body and work, and keeps you on track.",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AliveBorder />
      <main className="flex flex-1 flex-col items-center text-center">
        <section className="flex min-h-svh w-full flex-col items-center justify-center gap-16 px-8 pt-24 pb-8">
        <header className="flex max-w-3xl flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-[0.18em] text-[clamp(3.5rem,14vw,9rem)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Voidback logo"
              width={465}
              height={525}
              className="h-[0.95em] w-auto"
            />
            <h1 className="font-light leading-none tracking-[-0.04em]">
              Voidback
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--cream-dim)] sm:text-xl">
            We build things that optimize human quality of life, output and
            creativity.
          </p>
        </header>

        <section className="max-w-xl space-y-5 text-base leading-relaxed text-[var(--cream-dim)] flex flex-col gap-0">
            <p>
              <strong>What things?</strong> software for now, hardware later.
            </p>

            <p>
              <strong>Everyone is doing that, what makes you different?</strong> We're not trying to be different, we find a problem, we build a solution, if we don't use it everyday and find it has improved our quality of life, output or creativity we don't publish it!
            </p>

            <p>
              <strong>Where's the moat in this?</strong> You are the moat, if we improve your ability to get things done, become less anxious, think clearer and express your creative side then we have ourselves a moat; one person's life was enhanced by something we created.
            </p>
  
            <p>
              <strong>Sounds like AI slop!</strong> You're reading, you're engaged, you gave some of your irredeemable time to this; might as well try and come to a real conclusion on your own.
            </p>
        </section>

          <a
            href="#antp"
            aria-label="Scroll to ANTP"
            className="mt-4 text-[var(--cream-dim)] transition-colors hover:text-[var(--cream)]"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4v16M5 13l7 7 7-7" />
            </svg>
          </a>
        </section>

        <section id="antp" className="flex min-h-[80svh] w-full scroll-mt-0 flex-col items-center justify-center gap-6 px-8 py-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/antp-mark.png" alt="ANTP logo" width={269} height={352} className="h-24 w-auto" />
          <h2 className="text-4xl font-light tracking-[-0.02em] sm:text-5xl">ANTP</h2>
          <a
            href="https://antplatform.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-wide underline decoration-[var(--cream-dim)] underline-offset-4 transition-colors hover:decoration-[var(--cream)]"
          >
            antplatform.ai
          </a>
          <p className="max-w-md text-base leading-relaxed text-[var(--cream-dim)]">
            An AI that manages you the way a great manager would, learns your
            personality, tracks your body and work, and keeps you on track.
          </p>
        </section>
      </main>

      <footer className="px-8 pb-10 text-center text-xs tracking-wide text-[var(--cream-dim)]">
        © 2026 Voidback, Inc.
      </footer>
    </>
  );
}
