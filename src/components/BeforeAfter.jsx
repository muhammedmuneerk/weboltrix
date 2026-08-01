import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { beforeAfterProjects } from "../data/siteData.js";

/**
 * Draggable scrub-reveal comparison.
 * Replaces the old "two static thumbnails side by side" pattern with a single
 * frame you wipe across — the interaction itself enacts "before / after"
 * instead of just labeling it.
 */
function ScrubReveal({ before, beforeAlt, after, afterAlt }) {
  const [pos, setPos] = useState(50);
  const frameRef = useRef(null);
  const dragging = useRef(false);

  const moveTo = useCallback((clientX) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    moveTo(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={frameRef}
      role="slider"
      aria-label="Drag to compare before and after"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative aspect-[16/10] w-full cursor-ew-resize select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-black outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {/* After (base layer, fully visible) */}
      <img
        src={after}
        alt={afterAlt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Before (clipped by drag position) */}
      <img
        src={before}
        alt={beforeAlt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Static corner labels — identify sides, don't track the drag */}
      <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70 backdrop-blur">
        Before
      </span>
      <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/70 backdrop-blur">
        After
      </span>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-black shadow-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 5l-7 7 7 7M10 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter({ compact = false, limit }) {
  const projects = limit ? beforeAfterProjects.slice(0, limit) : beforeAfterProjects;

  return (
    <div className="stagger-grid divide-y divide-white/10 border-t border-white/10">
      {projects.map((project, i) => (
        <article
          key={project.slug}
          className={`grid gap-8 py-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12 ${
            compact ? "" : i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/38">
              {project.category}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/55">{project.description}</p>

            <p className="mt-5 border-l-2 border-white/20 pl-4 text-sm font-bold leading-6 text-white/65">
              {project.outcome}
            </p>

            <Link
              to={`/work/${project.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:translate-x-1"
            >
              View transformation <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ScrubReveal
            before={project.before}
            beforeAlt={project.beforeAlt}
            after={project.after}
            afterAlt={project.afterAlt}
          />
        </article>
      ))}
    </div>
  );
}