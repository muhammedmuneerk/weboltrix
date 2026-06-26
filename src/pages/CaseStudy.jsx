import { Link, Navigate, useParams } from "react-router-dom";
import CTASection from "../components/CTASection.jsx";
import { projects } from "../data/siteData.js";

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) return <Navigate to="/work" replace />;

  const nextProject = projects[(projects.findIndex((item) => item.slug === slug) + 1) % projects.length];
  const liveLink = project.linkAfter || project.link;

  return (
    <>
      <section className="hero-mesh relative isolate overflow-hidden pt-36">
        <div className="fine-grid absolute inset-0 -z-10" />
        <div className="container-premium grid gap-12 pb-20 pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="hero-kicker eyebrow">{project.category}</p>
            <h1 className="hero-title mt-5 text-4xl font-black leading-[0.98] tracking-tight text-balance sm:text-7xl sm:leading-[0.92]">
              {project.title}
            </h1>
            <p className="hero-copy mt-7 max-w-2xl text-lg leading-8 text-white/62">
              {project.description}
            </p>
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
            <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="premium-button-light w-full sm:w-auto">
                Start Similar Project
              </Link>
              {liveLink && (
                <a href={liveLink} target="_blank" rel="noreferrer" className="premium-button-dark w-full sm:w-auto">
                  Live Project
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noreferrer" className="premium-button-dark w-full sm:w-auto">
                  GitHub
                </a>
              )}
              <Link to="/work" className="premium-button-dark w-full sm:w-auto">
                Back to Work
              </Link>
            </div>
          </div>
          <div className="hero-showcase relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.055] p-3 shadow-premium">
            <img
              src={project.image}
              alt={project.visualAlt}
              className="aspect-[16/11] w-full scale-110 rounded-[1.65rem] object-cover object-top"
              data-parallax-media
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-3">
          {[
            ["Problem", project.problem],
            ["Solution", project.solution],
            ["Result", project.result],
          ].map(([label, text]) => (
            <article key={label} className="glass card-hover rounded-[1.8rem] p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/38">{label}</p>
              <p className="mt-6 text-xl font-bold leading-9 text-white/78">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">Conversion details</p>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Built around the moments where visitors decide to trust.
            </h2>
          </div>
          <div className="stagger-grid grid gap-5">
            {project.caseNotes.map((note, index) => (
              <div key={note} className="glass rounded-[1.7rem] p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bone text-sm font-black text-ink">
                  0{index + 1}
                </span>
                <p className="mt-5 text-base leading-8 text-white/62">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <div className="rounded-[2rem] border border-white/10 bg-bone p-8 text-ink sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">Next project</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <h2 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                Keep exploring the kind of website your business could become.
              </h2>
              <Link to={`/work/${nextProject.slug}`} className="premium-button bg-ink text-bone hover:-translate-y-1">
                View {nextProject.title}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Ready for a case study your customers can feel?" />
    </>
  );
}
