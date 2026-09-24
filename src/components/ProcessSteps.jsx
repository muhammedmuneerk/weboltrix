import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { processDetails } from "../data/siteData.js";

const EYEBROW = "Build rhythm";
const TITLE = "Four moves from idea to launch.";
const TEXT =
  "The process stays lean, but the details stay premium: strategy, layout, content, animation, contact flow, and final polish.";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ProcessSteps() {
  const total = processDetails.length;

  // ---- Mobile / tablet timeline state ----
  const [active, setActive] = useState(-1); // step currently crossing the reading line
  const [reduceMotion, setReduceMotion] = useState(false);
  const listRef = useRef(null);
  const nodeRefs = useRef([]);
  const segRefs = useRef([]);
  const activeRef = useRef(-1);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    // Reduced motion: show the finished timeline, no scroll-driven changes.
    if (reduceMotion) {
      segRefs.current.forEach((seg) => {
        if (seg) seg.style.transform = "scaleY(1)";
      });
      return undefined;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const list = listRef.current;
      // The mobile layout is display:none on desktop, so there is nothing to measure.
      if (!list || !list.offsetHeight) return;

      // Reading line: a little below the middle of the screen.
      const line = window.innerHeight * 0.6;
      const centers = nodeRefs.current.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      // The connector between two steps fills as the reading line travels between them.
      segRefs.current.forEach((seg, i) => {
        if (!seg || centers[i + 1] === undefined) return;
        const progress = clamp((line - centers[i]) / (centers[i + 1] - centers[i]), 0, 1);
        seg.style.transform = `scaleY(${progress})`;
      });

      let next = -1;
      centers.forEach((center, i) => {
        if (center <= line) next = i;
      });
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return (
    <section className="section-padding">
      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden lg:block">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />
        <div className="stagger-grid mt-14 grid gap-5 lg:grid-cols-4">
          {processDetails.map((step) => (
            <article key={step.title} className="glass card-hover rounded-[1.8rem] p-7">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                {step.eyebrow}
              </p>
              <h2 className="mt-8 text-3xl font-black tracking-tight">{step.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/58">{step.text}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <p className="eyebrow">{EYEBROW}</p>
        <h2
          className="mt-4 max-w-2xl font-black leading-[1.02] tracking-tight text-balance"
          style={{ fontSize: "clamp(2rem, 9vw, 3.25rem)" }}
        >
          {TITLE}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/58">{TEXT}</p>

        {/* Vertical timeline: the line fills as you scroll, the current step lights up */}
        <ol ref={listRef} className="mt-10 max-w-2xl">
          {processDetails.map((step, index) => {
            const isActive = reduceMotion || index === active;
            const isDone = reduceMotion || index < active;
            const isLast = index === total - 1;
            const next = processDetails[index + 1];

            return (
              <li
                key={step.title}
                className={`relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 ${
                  isLast ? "" : "pb-5"
                }`}
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-5 top-[2.875rem] w-px bg-white/12"
                  >
                    <span
                      ref={(el) => {
                        segRefs.current[index] = el;
                      }}
                      className="absolute inset-0 origin-top bg-bone/70"
                      style={{ transform: "scaleY(0)" }}
                    />
                  </span>
                )}

                <span
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  className={`relative z-10 mt-1.5 flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black transition duration-500 motion-reduce:transition-none ${
                    isActive && !reduceMotion
                      ? "border-bone bg-bone text-ink shadow-glow"
                      : isDone
                        ? "border-white/40 bg-ink text-bone"
                        : "border-white/15 bg-ink text-white/45"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <article
                  className={`glass rounded-[1.6rem] p-5 transition duration-500 active:scale-[0.99] motion-reduce:transition-none sm:p-6 ${
                    isActive
                      ? "border-white/25 bg-white/[0.08] opacity-100"
                      : "opacity-60"
                  }`}
                >
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/40">
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-bone">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{step.text}</p>

                  {next && (
                    <p className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-bold text-white/45">
                      <span className="uppercase tracking-[0.18em]">Next</span>
                      <span aria-hidden="true">→</span>
                      <span className="text-white/70">{next.title}</span>
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
