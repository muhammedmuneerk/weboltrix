import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WorkProjects.css";

export default function WorkProjects({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef(null);
  const sectionRefs = useRef([]);
  const isSyncingRef = useRef(false);
  const settleTimeoutRef = useRef(null);

  // ── Floating jump-to-project button (mobile only) ──
  // Positioned relative to the section itself (.sb-layout), not the
  // viewport, so it can never be dragged out of the section and
  // naturally scrolls away with it (nothing above/below the section
  // ever sees it).
  const FAB_SIZE = 56;
  const FAB_MARGIN = 8;
  const layoutRef = useRef(null);
  const fabRef = useRef(null);
  const fabDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0, moved: false, dragging: false });
  const [fabPos, setFabPos] = useState({ x: FAB_MARGIN, y: FAB_MARGIN });
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [fabPlacement, setFabPlacement] = useState({ v: "up", h: "left" });

  const getSectionSize = () => {
    const layout = layoutRef.current;
    return {
      width: layout ? layout.clientWidth : 0,
      height: layout ? layout.clientHeight : 0,
    };
  };

  const clampFabPos = (x, y) => {
    const { width, height } = getSectionSize();
    const maxX = Math.max(FAB_MARGIN, width - FAB_SIZE - FAB_MARGIN);
    const maxY = Math.max(FAB_MARGIN, height - FAB_SIZE - FAB_MARGIN);
    return {
      x: Math.min(Math.max(x, FAB_MARGIN), maxX),
      y: Math.min(Math.max(y, FAB_MARGIN), maxY),
    };
  };

  // Set the initial resting spot once the section has actually mounted
  // and has real dimensions — right side, well clear of the top bar.
  useEffect(() => {
    const { width, height } = getSectionSize();
    if (!width || !height) return;
    setFabPos(clampFabPos(width - FAB_SIZE - 16, height - FAB_SIZE - 96));
  }, []);

  useEffect(() => {
    const onResize = () => setFabPos((pos) => clampFabPos(pos.x, pos.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isFabOpen) return undefined;
    const handleOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) setIsFabOpen(false);
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isFabOpen]);

  const openFabNav = () => {
    const { width, height } = getSectionSize();
    const vertical = fabPos.y + FAB_SIZE / 2 > height / 2 ? "up" : "down";
    const horizontal = fabPos.x + FAB_SIZE / 2 > width / 2 ? "left" : "right";
    setFabPlacement({ v: vertical, h: horizontal });
    setIsFabOpen(true);
  };

  const handleFabPointerDown = (event) => {
    const state = fabDragRef.current;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.originX = fabPos.x;
    state.originY = fabPos.y;
    state.moved = false;
    state.dragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleFabPointerMove = (event) => {
    const state = fabDragRef.current;
    if (!state.dragging) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.moved = true;
    setFabPos(clampFabPos(state.originX + dx, state.originY + dy));
  };

  const handleFabPointerUp = (event) => {
    const state = fabDragRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!state.moved) {
      if (isFabOpen) setIsFabOpen(false);
      else openFabNav();
    }
  };

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
    <div className="sb-layout" id="project-index" ref={layoutRef}>
      <nav className="sb-sidebar" aria-label="Project index">
        <p className="sb-section-label">Projects</p>
        <ul className="sb-list" role="list">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <button
                type="button"
                className={`sb-item${
                  index === activeIndex ? " sb-item--active" : index < activeIndex ? " sb-item--done" : ""
                }`}
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

      <div
        className="sb-fab-wrap"
        ref={fabRef}
        style={{ transform: `translate(${fabPos.x}px, ${fabPos.y}px)` }}
      >
        <button
          type="button"
          className="sb-fab-btn"
          onPointerDown={handleFabPointerDown}
          onPointerMove={handleFabPointerMove}
          onPointerUp={handleFabPointerUp}
          onPointerCancel={handleFabPointerUp}
          aria-expanded={isFabOpen}
          aria-label="Jump to a project"
        >
          <span className="sb-fab-num">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="sb-fab-sub">
            /{String(total).padStart(2, "0")}
            <span className="sb-fab-grip" aria-hidden="true" />
          </span>
        </button>

        {isFabOpen && (
          <div
            className={`sb-fab-panel sb-fab-panel--${fabPlacement.v} sb-fab-panel--${fabPlacement.h}`}
            role="menu"
            aria-label="Jump to project"
          >
            {projects.map((project, index) => (
              <button
                key={project.slug}
                type="button"
                role="menuitem"
                className={`sb-fab-cell${
                  index === activeIndex ? " sb-fab-cell--active" : index < activeIndex ? " sb-fab-cell--done" : ""
                }`}
                onClick={() => {
                  scrollToProject(index);
                  setIsFabOpen(false);
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}