import { useState } from "react";
import { Link } from "react-router-dom";

export default function FeaturedWorkReveal({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mt-16">
      <div className="flex flex-col lg:flex-row lg:items-stretch">

        {/* ── Left: numbered index list ── */}
        <nav
          aria-label="Projects"
          className="w-full border-t border-line/[0.08] lg:w-[38%] lg:border-r lg:border-line/[0.08]"
        >
          {projects.map((project, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={project.title}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                aria-pressed={isActive}
                className={`group relative flex w-full flex-col gap-2.5 border-b border-line/[0.07] px-6 py-9 text-left transition-colors duration-300 last:border-b-0 lg:px-8 lg:py-12 ${
                  isActive ? "bg-layer/[0.025]" : "hover:bg-layer/[0.015]"
                }`}
              >
                {/* Left accent bar */}
                <span
                  className={`absolute left-0 top-0 bottom-0 w-[2px] bg-layer/[0.42] transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />

                <span
                  className={`text-[9.5px] font-black uppercase tracking-[0.22em] transition-colors duration-300 ${
                    isActive ? "text-content/44" : "text-content/20"
                  }`}
                >
                  0{i + 1} — {project.category}
                </span>

                <span
                  className={`text-[1.25rem] font-black leading-tight tracking-tight transition-colors duration-300 lg:text-[1.4rem] ${
                    isActive ? "text-content" : "text-content/30 group-hover:text-content/72"
                  }`}
                >
                  {project.title}
                </span>

                {/* Tags — expand on active */}
                <div
                  className={`flex flex-wrap gap-1.5 overflow-hidden transition-all duration-350 ${
                    isActive ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line/[0.08] bg-layer/[0.04] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-content/32"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </nav>

        {/* ── Right: sticky crossfade reveal (desktop) ── */}
        <div className="hidden lg:block lg:w-[62%]">
          <div className="sticky top-24 h-[calc(100vh-7rem)] max-h-[700px] overflow-hidden rounded-2xl">
            {projects.map((project, i) => {
              const isActive = activeIndex === i;
              const liveLink = project.linkAfter || project.link;
              return (
                <div
                  key={project.title}
                  className="absolute inset-0 transition-opacity duration-[560ms] ease-in-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    zIndex: isActive ? 10 : 0,
                  }}
                >
                  {/* Image */}
                  <img
                    src={project.image}
                    alt={project.visualAlt}
                    className="h-full w-full object-cover object-top transition-transform duration-[800ms] ease-out"
                    style={{ transform: isActive ? "scale(1)" : "scale(1.05)" }}
                    loading="lazy"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/88 via-scrim/12 to-scrim/[0.03]" />

                  {/* Metrics — top right */}
                  <div className="absolute right-6 top-6 flex flex-col items-end gap-2">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-line/[0.14] bg-recess/52 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.11em] text-content/72 backdrop-blur-sm"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                    <p className="mb-2 text-[9.5px] font-black uppercase tracking-[0.24em] text-content/35">
                      {project.category}
                    </p>
                    <h3 className="mb-5 text-2xl font-black tracking-tight lg:text-[1.6rem]">
                      {project.title}
                    </h3>
                    <div
                      className="mb-5 border-l-2 border-line/[0.14] pl-4"
                      style={{ borderRadius: 0 }}
                    >
                      <p className="text-sm font-black leading-relaxed text-content/80">
                        {project.transformation}
                      </p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-content/38">
                        Result: {project.impact}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <Link
                        to={`/work/${project.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-content transition-transform duration-300 hover:translate-x-1"
                      >
                        View Case Study →
                      </Link>
                      {liveLink && (
                        <a
                          href={liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-bold text-content/35 transition-colors duration-300 hover:text-content/72"
                        >
                          Live Site ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: full card below the active title ── */}
        <div className="lg:hidden">
          {projects.map((project, i) => {
            if (activeIndex !== i) return null;
            const liveLink = project.linkAfter || project.link;
            return (
              <div key={project.title} className="overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <img
                    src={project.image}
                    alt={project.visualAlt}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <span
                        key={metric}
                        className="rounded-full border border-line/[0.14] bg-recess/52 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.11em] text-content/70 backdrop-blur-sm"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div
                    className="mb-4 border-l-2 border-line/[0.14] pl-4"
                    style={{ borderRadius: 0 }}
                  >
                    <p className="text-sm font-black leading-relaxed text-content/80">
                      {project.transformation}
                    </p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-content/38">
                      Result: {project.impact}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <Link
                      to={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-content transition hover:translate-x-1"
                    >
                      View Case Study →
                    </Link>
                    {liveLink && (
                      <a
                        href={liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-bold text-content/35 transition hover:text-content/72"
                      >
                        Live Site ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}