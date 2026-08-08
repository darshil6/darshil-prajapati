import Hero from "@/components/hero/hero";
import AboutSection from "@/components/about/about-section";
import WorkExhibition from "@/components/work/work-exhibition";
import LabArchive from "@/components/lab/lab-archive";
import DigitalDesk from "@/components/desk/digital-desk";
import SkillsFlow from "@/components/skills/skills-flow";
import ExperienceTimeline from "@/components/experience/experience-timeline";
import Manifesto from "@/components/manifesto/manifesto";
import ContactSection from "@/components/contact/contact-section";
import SiteFooter from "@/components/footer/site-footer";

export default function HomePage() {
  return (
    <>
      <main id="main" className="relative z-10">
        <Hero />
        <AboutSection />
        <WorkExhibition />
        <LabArchive />
        <DigitalDesk />
        <SkillsFlow />
        <ExperienceTimeline />
        <Manifesto />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
