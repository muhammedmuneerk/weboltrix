import BeforeAfter from "../components/BeforeAfter.jsx";
import CTASection from "../components/CTASection.jsx";
import WorkHero from "../components/WorkHero.jsx";
import WorkProjects from "../components/WorkProjects.jsx";
import { projects } from "../data/siteData.js";

export default function Work() {
  return (
    <>
      <WorkHero projects={projects} />
      <WorkProjects projects={projects} />

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Comparison</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              Before and after clarity.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/58">
              Most websites lose customers before they even load properly. We rebuild them into
              fast, premium experiences that convert instantly.
            </p>
          </div>
          <div className="mt-12">
            <BeforeAfter compact />
          </div>
        </div>
      </section>

      <CTASection title="Want your business to be the next transformation?" />
    </>
  );
}
