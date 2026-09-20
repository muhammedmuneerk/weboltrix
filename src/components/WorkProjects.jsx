import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WorkProjects.css";

export default function WorkProjects({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef(null);
  const sectionRefs = useRef([]);
  const isSyncingRef = useRef(false);
  const settleTimeoutRef = useRef(null);

  // ── Step / Flow mobile interaction mode ──
  // Step (default): the section pins and its inner panel scrolls one
  // project at a time — a finger scroll inside the section moves
  // between projects and only passes through to the rest of the page
  // once you're at the first/last project.
  // Flow: the section stops trapping scroll entirely. It drops into
  // normal page flow sized to whichever project is currently active,
  // so an ordinary flick carries straight past it to the next page
  // section. The active project stays visible and doesn't change from
  // finger-scrolling in this mode — only the FAB panel or the index
  // list can change which project is shown.
  const [isStepMode, setIsStepMode] = useState(true);
  const wasStepModeRef = useRef(true);

  // Whether there's a section before/after this one in the DOM, used
  // by the chevrons when they mean "jump to hero / jump to next
  // section" (Step mode) rather than "previous/next project" (Flow
  // mode). Computed once from the static page structure.
  const [sectionNav, setSectionNav] = useState({ hasPrev: false, hasNext: false });

  // ── Floating jump-to-project button (mobile only) ──
  // Positioned relative to the section itself (.sb-layout), not the
  // viewport, so it can never be dragged out of the section and
  // naturally scrolls away with it (nothing above/below the section
  // ever sees it). Always mounted — visible in both Step and Flow —
  // so drag state and position persist across a mode switch.
  const FAB_SIZE = 56;
  const FAB_MARGIN = 8;
  const layoutRef = useRef(null);
  const sidebarRef = useRef(null);
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

  // The cluster is now taller than it is wide (up chevron + main + down
  // chevron), so clamp/placement math measures its real rendered box
  // rather than assuming a fixed square.
  const getFabSize = () => {
    const el = fabRef.current;
    return {
      w: el ? el.offsetWidth : FAB_SIZE,
      h: el ? el.offsetHeight : FAB_SIZE,
    };
  };

  const clampFabPos = (x, y) => {
    const { width, height } = getSectionSize();
    const { w, h } = getFabSize();
    const maxX = Math.max(FAB_MARGIN, width - w - FAB_MARGIN);
    const maxY = Math.max(FAB_MARGIN, height - h - FAB_MARGIN);
    return {
      x: Math.min(Math.max(x, FAB_MARGIN), maxX),
      y: Math.min(Math.max(y, FAB_MARGIN), maxY),
    };
  };

  // Set the initial resting spot once the section has actually mounted
  // and has real dimensions. Right side, just below the top bar (not
  // near the bottom) — with 10 projects to scroll through in Step
  // mode, a button parked near the bottom risked never being seen
  // before someone was already several projects deep. Measured off
  // the real top-bar height rather than a guessed pixel value, so it
  // still clears it correctly if that bar's height ever changes.
  // Draggable range is untouched — still the full section, via
  // clampFabPos below.
  useEffect(() => {
    const { width, height } = getSectionSize();
    const { w, h } = getFabSize();
    if (!width || !height) return;
    const topBarHeight = sidebarRef.current?.offsetHeight || 0;
    setFabPos(clampFabPos(width - w - 16, topBarHeight + 14));
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

  // Which sibling sections exist, for the Step-mode chevrons. The page
  // structure around this component is static, so this only needs to
  // run once after mount.
  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;
    setSectionNav({
      hasPrev: !!layout.previousElementSibling,
      hasNext: !!layout.nextElementSibling,
    });
  }, []);

  const openFabNav = () => {
    const { width, height } = getSectionSize();
    const { w, h } = getFabSize();
    const vertical = fabPos.y + h / 2 > height / 2 ? "up" : "down";
    const horizontal = fabPos.x + w / 2 > width / 2 ? "left" : "right";
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

  // Jump to a project — used by the sidebar list, the progress bar,
  // and the FAB panel in both modes.
  // Step mode: the panel is the scroll container, so this scrolls it.
  // Flow mode: nothing internally scrolls — swapping which project is
  // active is enough, since CSS shows only the active one.
  const scrollToProject = (index) => {
    const element = sectionRefs.current[index];
    if (!element) return;

    setActiveIndex(index);

    if (!isStepMode) return;

    const main = mainRef.current;
    if (!main) return;

    isSyncingRef.current = true;
    main.scrollTo({ top: element.offsetTop, behavior: "smooth" });

    clearTimeout(settleTimeoutRef.current);
    settleTimeoutRef.current = setTimeout(() => {
      isSyncingRef.current = false;
    }, 700);
  };

  const total = projects.length;
  const progressPct = total > 1 ? (activeIndex / (total - 1)) * 100 : 100;

  // Project navigation — the chevrons' meaning in Flow mode (finger
  // scrolling between projects is off there, so this is the substitute).
  const goToPrevProject = () => {
    if (activeIndex <= 0) return;
    scrollToProject(activeIndex - 1);
  };
  const goToNextProject = () => {
    if (activeIndex >= total - 1) return;
    scrollToProject(activeIndex + 1);
  };

  // Section navigation — the chevrons' meaning in Step mode. Project
  // navigation is already covered by scrolling, the FAB panel, and the
  // progress bar there, so the chevrons take on a different job: jump
  // to whatever comes immediately before/after this component in the
  // page. Found via DOM traversal from the layout root rather than a
  // hardcoded id, so it works wherever this section is placed.
  const goToPrevSection = () => {
    const target = layoutRef.current?.previousElementSibling;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goToNextSection = () => {
    const target = layoutRef.current?.nextElementSibling;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChevronUp = isStepMode ? goToPrevSection : goToPrevProject;
  const handleChevronDown = isStepMode ? goToNextSection : goToNextProject;

  const chevronUpDisabled = isStepMode ? !sectionNav.hasPrev : activeIndex === 0;
  const chevronDownDisabled = isStepMode ? !sectionNav.hasNext : activeIndex === total - 1;

  const chevronUpLabel = isStepMode ? "Jump up to previous section" : "Previous project";
  const chevronDownLabel = isStepMode ? "Jump down to next section" : "Next project";

  // On switching back to Step mode, resync the pinned view to whichever
  // project was active while in Flow — avoids landing back at project 01.
  useEffect(() => {
    if (isStepMode && !wasStepModeRef.current) {
      requestAnimationFrame(() => scrollToProject(activeIndex));
    }
    wasStepModeRef.current = isStepMode;
  }, [isStepMode]);

  return (
    <div
      className={`sb-layout${isStepMode ? "" : " sb-layout--flow"}`}
      id="project-index"
      ref={layoutRef}
    >
      <nav className="sb-sidebar" aria-label="Project index" ref={sidebarRef}>
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
          <div
            className="sb-mode-toggle"
            role="tablist"
            aria-label="Section scroll mode"
          >
            <span
              className="sb-mode-thumb"
              aria-hidden="true"
              style={{ transform: `translateX(${isStepMode ? "0%" : "100%"})` }}
            />
            <button
              type="button"
              role="tab"
              aria-selected={isStepMode}
              className={`sb-mode-option${isStepMode ? " sb-mode-option--active" : ""}`}
              onClick={() => setIsStepMode(true)}
            >
              Step
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isStepMode}
              className={`sb-mode-option${isStepMode ? "" : " sb-mode-option--active"}`}
              onClick={() => setIsStepMode(false)}
            >
              Flow
            </button>
          </div>
          <div className="sb-progress">
            <div className="sb-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </nav>

      <div className="sb-main" ref={mainRef}>
        {projects.map((project, index) => {
          const liveLink = project.linkAfter || project.link;
          const isHiddenInFlow = !isStepMode && index !== activeIndex;
          return (
            <section
              key={project.slug}
              id={`project-${project.slug}`}
              className={`sb-project${index === activeIndex ? " sb-project--active" : ""}${
                isHiddenInFlow ? " sb-project--flow-hidden" : ""
              }`}
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
          className="sb-fab-mini sb-fab-mini--up"
          onClick={handleChevronUp}
          disabled={chevronUpDisabled}
          aria-label={chevronUpLabel}
          title={chevronUpLabel}
        >
          ↑
        </button>

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

        <button
          type="button"
          className="sb-fab-mini sb-fab-mini--down"
          onClick={handleChevronDown}
          disabled={chevronDownDisabled}
          aria-label={chevronDownLabel}
          title={chevronDownLabel}
        >
          ↓
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