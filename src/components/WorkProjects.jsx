import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WorkProjects.css";

export default function WorkProjects({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef(null);
  const sectionRefs = useRef([]);
  const isSyncingRef = useRef(false);
  const settleTimeoutRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isSyncingRef.current) return;

        const mainRect = main.getBoundingClientRect();
        const centerY = mainRect.top + mainRect.height / 2;
        let best = null;
        let bestDist = Infinity;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sectionRefs.current.indexOf(entry.target);
          if (index === -1) return;
          const rect = entry.target.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - centerY);
          if (distance < bestDist) {
            bestDist = distance;
            best = index;
          }
        });

        if (best !== null) setActiveIndex(best);
      },
      { root: main, threshold: 0, rootMargin: "-40% 0px -40% 0px" }
    );

    sectionRefs.current.forEach((element) => element && observer.observe(element));

    const onScrollEnd = () => { isSyncingRef.current = false; };
    main.addEventListener("scrollend", onScrollEnd);

    return () => {
      observer.disconnect();
      main.removeEventListener("scrollend", onScrollEnd);
      clearTimeout(settleTimeoutRef.current);
    };
  }, []);

  const scrollToProject = (index) => {
    const element = sectionRefs.current[index];
    const main = mainRef.current;
    if (!element || !main) return;

    isSyncingRef.current = true;
    setActiveIndex(index);
    main.scrollTo({ top: element.offsetTop, behavior: "smooth" });

    clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = false;
    }, 700);
  };

  const total = projects.length;
  const progressPct = total > 1 ? (activeIndex / (total - 1)) * 100 : 100;

  return (
    <div className="sb-layout" id="project-index">
      <nav className="sb-sidebar" aria-label="Project index">
        <p className="sb-section-label">Projects</p>
        <ul className="sb-list" role="list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <button
                type="button"
                className={`sb-item${index === activeIndex ? " sb-item--active" : ""}`}
                onClick={() => scrollToProject(index)}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <span className="sb-indicator" aria-hidden="true" />
                <span className="sb-num">{String(index + 1).padStart(2, "0")}</span>
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

      <div className="sb-main" ref={mainRef}>
        {projects.map((project, index) => {
          const liveLink = project.linkAfter || project.link;
          return (
            <section
              key={project.slug}
              id={`project-${project.slug}`}
              className={`sb-project${index === activeIndex ? " sb-project--active" : ""}`}
              ref={(element) => (sectionRefs.current[index] = element)}
            >
              <span className="sb-ghost" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="sb-project-inner">
                <div className="sb-proj-top">
                  <span className="sb-proj-eyebrow">{project.category}</span>
                  <div className="sb-proj-tags">
                    {project.tags.map((tag) => <span key={tag} className="sb-proj-tag">{tag}</span>)}
                  </div>
                </div>

                <div className="sb-proj-img-wrap" data-image-reveal>
                  <img
                    src={project.image}
                    alt={project.visualAlt}
                    className="sb-proj-img"
                    loading={index === 0 ? "eager" : "lazy"}
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
                  <Link to={`/work/${project.slug}`} className="premium-button-light">Open Case Study</Link>
                  {liveLink && <a href={liveLink} target="_blank" rel="noreferrer" className="sb-ghost-link">Live Site ↗</a>}
                  {project.linkBefore && <a href={project.linkBefore} target="_blank" rel="noreferrer" className="sb-ghost-link">Before Site ↗</a>}
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="sb-ghost-link">GitHub ↗</a>}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
