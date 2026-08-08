import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/case-study";
import { site, getProject, getNextProject } from "@/data/site";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description = project.oneLiner;
  return {
    title: `${project.title} — Case Study`,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.title} — ${site.personal.name}`,
      description,
      type: "article",
      url: `/work/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.personal.name}`,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.oneLiner,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: site.personal.name,
      url: siteUrl,
    },
    keywords: project.stack.join(", "),
    url: `${siteUrl}/work/${slug}`,
  };

  return (
    <main id="main" className="relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CaseStudy project={project} next={getNextProject(slug)!} />
    </main>
  );
}
