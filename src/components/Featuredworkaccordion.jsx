import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FeaturedWorkAccordion({ projects }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [canHover, setCanHover] = useState(true);
  const contentRefs = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const handleChange = (e) => setCanHover(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  function toggle(i) {
    setOpenIndex((prev) => (prev === i ? -1 : i));
    // Re-trigger the fade-up animation on the content
    const el = contentRefs.current[i];
    if (el && openIndex !== i) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    }
  }

  return (
    <div className="mt-16 border-t border-white/[0.08]">
      {projects.map((project, i) => {
        const isOpen = openIndex === i;
        const liveLink = project.linkAfter || project.link;

        return (
          <div key={project.title} className="border-b border-white/[0.08]">
            {/* ── Title trigger row ── */}
            <button
              onMouseEnter={canHover ? () => toggle(i) : undefined}
              onClick={!canHover ? () => toggle(i) : undefined}
              aria-expanded={isOpen}
              className={`group flex w-full items-center gap-3 px-0 py-4 text-left transition-colors duration-300 sm:gap-5 sm:py-5 sm:py-6 ${
                isOpen ? "bg-white/[0.025]" : "hover:bg-white/[0.018]"
              }`}
            >
              {/* Index number */}
              <span
                className={`w-6 flex-shrink-0 text-[10px] font-black tabular-nums transition-colors duration-300 sm:w-7 ${
                  isOpen
                    ? "text-white/50"
                    : "text-white/18 group-hover:text-white/35"
                }`}
              >
                0{i + 1}
              </span>

              {/* Project title — the hero element */}
              <span
                className={`flex-1 font-black leading-none tracking-tight transition-colors duration-300 ${
                  isOpen
                    ? "text-white"
                    : "text-white/32 group-hover:text-white"
                }`}
                style={{ fontSize: "clamp(1.5rem, 3.8vw, 3rem)" }}
              >
                {project.title}
              </span>

              {/* Category label */}
              <span
                className={`hidden flex-shrink-0 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 sm:block ${
                  isOpen ? "text-white/36" : "text-white/18"
                }`}
              >
                {project.category}
              </span>

              {/* Rotating arrow */}
              <span
                aria-hidden="true"
                className={`flex-shrink-0 text-sm transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen
                    ? "rotate-90 text-white/55"
                    : "text-white/22 group-hover:text-white/42"
                }`}
                style={{ display: "inline-block" }}
              >
                →
              </span>
            </button>

            {/* ── Expanding panel ── */}
            <div
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {/* Content — indented to align under the title on sm+, flush on mobile */}
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  className="flex flex-col gap-6 pb-8 pr-0 sm:flex-row sm:gap-8 sm:pb-12 sm:pl-12 lg:gap-10"
                  style={{ animation: "featuredFadeUp 0.44s ease 0.08s both" }}
                >
                  {/* Image */}
                  <div className="relative w-full flex-shrink-0 overflow-hidden rounded-2xl sm:w-[46%]">
                    <div className="aspect-[4/3]">
                      <img
                        src={project.image}
                        alt={project.visualAlt}
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                      {project.metrics.slice(0, 2).map((metric) => (
                        <span
                          key={metric}
                          className="w-fit rounded-full border border-white/[0.14] bg-black/52 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.11em] text-white/70 backdrop-blur-sm"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col justify-between gap-5 py-1">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
                        {project.category}
                      </p>
                      <p className="text-[13.5px] leading-[1.85] text-white/46">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[9.5px] font-black uppercase tracking-[0.11em] text-white/34"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Before → After */}
                    <div
                      className="border-l-2 border-white/[0.1] pl-4"
                      style={{ borderRadius: 0 }}
                    >
                      <p className="mb-1.5 text-[9.5px] font-black uppercase tracking-[0.22em] text-white/26">
                        Before → After
                      </p>
                      <p className="text-[12.5px] font-black leading-[1.55] text-white/82">
                        {project.transformation}
                      </p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/36">
                        Result: {project.impact}
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-5">
                      <Link
                        to={`/work/${project.slug}`}
                        className="inline-flex items-center gap-2 text-[12.5px] font-bold text-white transition-transform duration-300 hover:translate-x-1"
                      >
                        View Case Study →
                      </Link>
                      {liveLink && (
                        <a
                          href={liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[12.5px] font-bold text-white/32 transition-colors duration-300 hover:text-white/70"
                        >
                          Live Site ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Keyframe — inject once into the document head */}
      <style>{`
        @keyframes featuredFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}