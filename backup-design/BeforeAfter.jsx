import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { beforeAfterProjects } from "../data/siteData.js";

/**
 * Master/detail showcase.
 * A vertical selector list drives one large showcase panel — visitors pick a
 * project, then flip a Before/After switch to crossfade the image. Only one
 * transformation is ever on screen at full size, instead of every project
 * being shown at once in a grid.
 */
export default function BeforeAfter({ compact = false, limit }) {
  const projects = limit ? beforeAfterProjects.slice(0, limit) : beforeAfterProjects;
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState("before"); // "before" | "after"

  const [canHover, setCanHover] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia("(hover: hover)");

  const update = () => setCanHover(mediaQuery.matches);

  update();

  mediaQuery.addEventListener("change", update);

  return () => mediaQuery.removeEventListener("change", update);
}, []);

  const active = projects[Math.min(activeIndex, projects.length - 1)];

  const selectProject = (i) => {
    setActiveIndex(i);
    setMode("before");
  };

  return (
    <div className={`grid gap-8 lg:items-start ${compact ? "lg:grid-cols-[0.45fr_1fr]" : "lg:grid-cols-[0.5fr_1fr]"}`}>
      {/* Selector list */}
      <nav aria-label="Select a project" className="flex flex-col border-t border-white/10">
        {projects.map((project, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={project.slug}
              type="button"
              aria-current={isActive}
              onMouseEnter={canHover ? () => selectProject(i) : undefined}
              onClick={!canHover ? () => selectProject(i) : undefined}
              className={`group flex flex-col border-b border-white/10 py-4 text-left transition ${
                isActive ? "pl-4" : "pl-0 hover:pl-2"
              }`}
              style={{
                borderLeft: isActive ? "2px solid rgba(255,255,255,0.85)" : "2px solid transparent",
              }}
            >
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition ${
                  isActive ? "text-white/55" : "text-white/30 group-hover:text-white/45"
                }`}
              >
                {project.category}
              </span>
              <span
                className={`mt-1 text-lg font-black tracking-tight transition sm:text-xl ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {project.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Showcase panel */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
          <img
            src={active.before}
            alt={active.beforeAlt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
              mode === "before" ? "opacity-100" : "opacity-0"
            }`}
          />
          <img
            src={active.after}
            alt={active.afterAlt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
              mode === "after" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Before / After switch */}
          <div className="absolute left-3 top-3 flex rounded-full border border-white/15 bg-black/55 p-1 text-[10px] font-black uppercase tracking-[0.12em] backdrop-blur">
            <button
              type="button"
              onClick={() => setMode("before")}
              aria-pressed={mode === "before"}
              className={`rounded-full px-3 py-1.5 transition ${
                mode === "before" ? "bg-white text-black" : "text-white/65 hover:text-white"
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setMode("after")}
              aria-pressed={mode === "after"}
              className={`rounded-full px-3 py-1.5 transition ${
                mode === "after" ? "bg-white text-black" : "text-white/65 hover:text-white"
              }`}
            >
              After
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm leading-7 text-white/55">{active.description}</p>
          <p className="mt-4 border-l-2 border-white/20 pl-4 text-sm font-bold leading-6 text-white/65">
            {active.outcome}
          </p>
          <Link
            to={`/work/${active.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:translate-x-1"
          >
            View transformation <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}