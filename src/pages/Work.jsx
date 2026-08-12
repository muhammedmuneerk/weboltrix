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

  /* ── Guards a click-triggered scroll so the spy below doesn't fight it
     mid-animation (this was the cause of the sidebar highlight lagging
     one project behind the section actually on screen). ── */
  const isSyncingRef = useRef(false);
  const settleTimeoutRef = useRef(null);

  /* ── Scroll spy on the inner scroll container.
     Uses IntersectionObserver (geometry-based) instead of manual
     scrollTop math, so it stays correct through smooth-scroll
     animation and CSS scroll-snap settling instead of racing them. ── */
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isSyncingRef.current) return; // a click just set the index; don't fight it

        const mainRect = main.getBoundingClientRect();
        const centerY = mainRect.top + mainRect.height / 2;

        let best = null;
        let bestDist = Infinity;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = sectionRefs.current.indexOf(entry.target);
          if (idx === -1) return;
          const rect = entry.target.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - centerY);
          if (dist < bestDist) { bestDist = dist; best = idx; }
        });

        if (best !== null) setActiveIndex(best);
      },
      { root: main, threshold: 0, rootMargin: "-40% 0px -40% 0px" }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));

    const onScrollEnd = () => { isSyncingRef.current = false; };
    main.addEventListener("scrollend", onScrollEnd);

    return () => {
      observer.disconnect();
      main.removeEventListener("scrollend", onScrollEnd);
      clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  const scrollToProject = (idx) => {
    const el = sectionRefs.current[idx];
    const main = mainRef.current;
    if (!el || !main) return;

    // Update the highlight the instant it's clicked — don't wait for the
    // scroll animation to finish, that gap is what made the sidebar look
    // out of sync with the panel.
    isSyncingRef.current = true;
    setActiveIndex(idx);
    main.scrollTo({ top: el.offsetTop, behavior: "smooth" });

    // Fallback release in case the browser doesn't fire 'scrollend'.
    clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = false;
    }, 700);
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
              <li key={project.slug}>
                <button
                  type="button"
                  className={`sb-item${i === activeIndex ? " sb-item--active" : ""}`}
                  onClick={() => scrollToProject(i)}
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
                key={project.slug}
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