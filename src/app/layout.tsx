import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/data/site";
import AppProviders from "@/components/providers/app-providers";
import CustomCursor from "@/components/cursor/custom-cursor";
import SiteNav from "@/components/navigation/site-nav";
import CommandPalette from "@/components/command-palette/command-palette";
import EasterEggs from "@/components/effects/easter-eggs";
import Preloader from "@/components/loader/preloader";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Full Stack AI Engineer building intelligent systems — RAG chatbots, voice agents and AI builder tools. Based in Ahmedabad, India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.personal.name} — ${site.personal.role}`,
    template: `%s — ${site.personal.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    site.personal.name,
    site.personal.role,
    ...site.skills.map((s) => s.name),
    "Portfolio",
    "Ahmedabad",
    "India",
  ],
  authors: [{ name: site.personal.name, url: SITE_URL }],
  creator: site.personal.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.personal.name} — ${site.personal.role}`,
    description:
      "Intelligent systems that listen and think — RAG, voice AI and builder tools.",
    type: "website",
    url: "/",
    siteName: `${site.personal.name} — Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.personal.name} — ${site.personal.role}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/** Structured data: Person + WebSite (schema.org, rendered as JSON-LD). */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: site.personal.name,
      jobTitle: site.personal.role,
      description: DESCRIPTION,
      email: `mailto:${site.personal.email}`,
      telephone: site.personal.phone,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ahmedabad",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Government Engineering College, Modasa",
      },
      worksFor: {
        "@type": "Organization",
        name: "La Net Team Software Solutions",
      },
      sameAs: site.socials
        .filter((s) => s.href.startsWith("http"))
        .map((s) => s.href),
      knowsAbout: site.skills.map((s) => s.name),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: `${site.personal.name} — Portfolio`,
      url: SITE_URL,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${instrument.variable} ${jetbrains.variable}`}
    >
      <body>
        <script
          // Stamp the stored theme before first paint to avoid a flash, and
          // keep the browser-chrome theme-color meta in sync with data-theme
          // (initial paint + runtime toggles). Colors match --t-bg in globals.css.
          dangerouslySetInnerHTML={{
            __html: `var d=document.documentElement;try{if(localStorage.getItem("dp:theme")==="light")d.dataset.theme="light";}catch(e){}try{var m=document.querySelector('meta[name="theme-color"]'),s=function(){if(m)m.setAttribute("content",d.dataset.theme==="light"?"#f4f1ea":"#0a0a0a")};s();new MutationObserver(s).observe(d,{attributes:true,attributeFilter:["data-theme"]});}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="site-grid" aria-hidden />
        <div className="site-grain" aria-hidden />
        <AppProviders>
          <Preloader />
          <SiteNav />
          {children}
          <CommandPalette />
          <EasterEggs />
        </AppProviders>
        <CustomCursor />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M7JDZG81ZV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-M7JDZG81ZV');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
