import BeforeAfter from "../components/BeforeAfter.jsx";
import CTASection from "../components/CTASection.jsx";
import PageHero from "../components/PageHero.jsx";
import { Link } from "react-router-dom";
import { projects } from "../data/siteData.js";

export default function Work() {
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Our Work">
        Websites shaped for clarity, premium perception, and better customer enquiries.
      </PageHero>

      <section className="section-padding">
        <div className="container-premium stagger-grid space-y-20">
          {projects.map((project, index) => {
            const liveLink = project.linkAfter || project.link;

            return (
            <article key={project.title} className="grid gap-8 border-b border-white/10 pb-20 last:border-b-0 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
              <div>
                <p className="eyebrow">Project 0{index + 1}</p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{project.title}</h2>
                <p className="mt-4 text-white/55">{project.category}</p>
                <p className="mt-6 max-w-md text-base leading-8 text-white/58">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white/52"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={`/work/${project.slug}`} className="premium-button-light">
                    Open Case Study
                  </Link>
                  {liveLink && (
                    <a href={liveLink} target="_blank" rel="noreferrer" className="premium-button-dark">
                      Live Site
                    </a>
                  )}
                  {project.linkBefore && (
                    <a href={project.linkBefore} target="_blank" rel="noreferrer" className="premium-button-dark">
                      Before Site
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="premium-button-dark">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
              <div className="grid gap-5">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-3 shadow-premium" data-image-reveal>
                  <img
                    src={project.image}
                    alt={project.visualAlt}
                    className="aspect-[16/10] w-full rounded-[1.5rem] object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    ["Problem", project.problem],
                    ["Solution", project.solution],
                    ["Result", project.result],
                  ].map(([label, text]) => (
                    <div key={label} className="glass card-hover rounded-[1.7rem] p-6">
                      <h3 className="text-lg font-black">{label}</h3>
                      <p className="mt-4 text-sm leading-7 text-white/58">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
          })}
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Comparison</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Before and after clarity.</h2>
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
