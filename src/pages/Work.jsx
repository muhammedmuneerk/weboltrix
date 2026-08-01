import { useEffect, useRef, useState } from "react";
import BeforeAfter from "../components/BeforeAfter.jsx";
import CTASection from "../components/CTASection.jsx";
import PageHero from "../components/PageHero.jsx";
import { Link } from "react-router-dom";
import { projects } from "../data/siteData.js";
import "./work-parallax.css";

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef(null);
  const sectionRefs = useRef([]);

  /* ── Scroll spy on the inner scroll container ── */
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const onScroll = () => {
      const scrollTop = main.scrollTop;
      const viewH = main.clientHeight;
      let best = 0;
      let bestScore = Infinity;

      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const mid = el.offsetTop + el.offsetHeight / 2;
        const score = Math.abs(mid - scrollTop - viewH / 2);
        if (score < bestScore) { bestScore = score; best = i; }
      });

      setActiveIndex(best);
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToProject = (idx) => {
    const el = sectionRefs.current[idx];
    const main = mainRef.current;
    if (el && main) main.scrollTo({ top: el.offsetTop, behavior: "smooth" });
  };

  const total = projects.length;
  const progressPct = total > 1 ? (activeIndex / (total - 1)) * 100 : 100;

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Our Work">
        Websites shaped for clarity, premium perception, and better customer enquiries.
      </PageHero>

      {/* KEY: fixed-height wrapper, right panel scrolls internally */}
      <div className="sb-layout">

        {/* LEFT — static sidebar, doesn't scroll */}
        <nav className="sb-sidebar" aria-label="Project index">
          <p className="sb-section-label">Projects</p>

          <ul className="sb-list" role="list">
            {projects.map((project, i) => (
              <li key={project.title}>
                <button
                  className={`sb-item${i === activeIndex ? " sb-item--active" : ""}`}
                  onMouseEnter={() => scrollToProject(i)}
                  aria-current={i === activeIndex ? "true" : undefined}
                >
                  <span className="sb-indicator" aria-hidden="true" />
                  <span className="sb-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sb-info">
                    <span className="sb-name">{project.title}</span>
                    <span className="sb-cat">{project.category}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="sb-footer">
            <span className="sb-count">{activeIndex + 1} of {total}</span>
            <div className="sb-progress">
              <div className="sb-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </nav>

        {/* RIGHT — scrolls independently inside the layout */}
        <div className="sb-main" ref={mainRef}>
          {projects.map((project, i) => {
            const liveLink = project.linkAfter || project.link;
            return (
              <section
                key={project.title}
                id={`project-${project.slug}`}
                className={`sb-project${i === activeIndex ? " sb-project--active" : ""}`}
                ref={(el) => (sectionRefs.current[i] = el)}
              >
                <span className="sb-ghost" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="sb-project-inner">
                  <div className="sb-proj-top">
                    <span className="sb-proj-eyebrow">{project.category}</span>
                    <div className="sb-proj-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="sb-proj-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="sb-proj-img-wrap" data-image-reveal>
                    <img
                      src={project.image}
                      alt={project.visualAlt}
                      className="sb-proj-img"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  <h2 className="sb-proj-title">{project.title}</h2>
                  <p className="sb-proj-desc">{project.description}</p>

                  <dl className="sb-psr">
                    {[
                      ["Problem", project.problem],
                      ["Solution", project.solution],
                      ["Result", project.result],
                    ].map(([label, text]) => (
                      <div key={label} className="sb-psr-cell">
                        <dt className="sb-psr-label">{label}</dt>
                        <dd className="sb-psr-text">{text}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="sb-proj-ctas">
                    <Link to={`/work/${project.slug}`} className="premium-button-light">
                      Open Case Study
                    </Link>
                    {liveLink && (
                      <a href={liveLink} target="_blank" rel="noreferrer" className="sb-ghost-link">
                        Live Site ↗
                      </a>
                    )}
                    {project.linkBefore && (
                      <a href={project.linkBefore} target="_blank" rel="noreferrer" className="sb-ghost-link">
                        Before Site ↗
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="sb-ghost-link">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

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