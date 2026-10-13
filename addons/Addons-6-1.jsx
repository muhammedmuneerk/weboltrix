import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";

const EYEBROW = "Add-ons";
const TITLE = "Keep the website running cleanly after launch.";
const TEXT = "Add only what your business needs. The goal is a sharp site that stays reliable.";

const ADDONS = [
  {
    name: "Hosting",
    text: "Fast, stable hosting guidance so your website stays accessible and professional.",
  },
  {
    name: "Maintenance",
    text: "Updates, small edits, performance checks, and yearly care for peace of mind.",
  },
];

// Layers from the top of the stack down. `addon` points at ADDONS (null = the site itself).
const LAYERS = [
  { label: "Website", addon: null },
  { label: "Maintenance", addon: 1 },
  { label: "Hosting", addon: 0 },
];

const GAP_STACKED = 3.25; // rem between layers when stacked
const GAP_EXPLODED = 6.75; // rem between layers when pulled apart

// Set to false to drop the dashed guide lines (and their moving dots)
const SHOW_GUIDES = true;

// Horizontal position of the left / right plate corners (half of the plate diagonal)
const GUIDE_SIDES = [
  "left-[calc(50%-7.07rem)] sm:left-[calc(50%-9.19rem)]",
  "left-[calc(50%+7.07rem)] sm:left-[calc(50%+9.19rem)]",
];

// Plate thickness: extra copies of the plate pushed back along its normal (px)
const EDGE_DEPTHS = [3, 6, 9];

const pad = (n) => String(n + 1).padStart(2, "0");

const css = `
  @keyframes addon-rise { from { top: 100%; opacity: 0; } 15%, 85% { opacity: 1; } to { top: 0%; opacity: 0; } }
  .addon-rise { animation: addon-rise 2.6s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .addon-rise { animation: none; display: none; } }
`;

// An exploded-view diagram: the website sits on top of its add-ons.
// - It pulls apart once on its own when it scrolls into view (so touch screens see it too)
// - Hover the diagram or pick an add-on and it pulls apart again; the picked layer lights up
export default function AddOns() {
  const [active, setActive] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [intro, setIntro] = useState(false);
  const diagramRef = useRef(null);

  // One-time "assemble" demo when the diagram first scrolls into view
  useEffect(() => {
    const el = diagramRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let startTimer;
    let endTimer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        startTimer = window.setTimeout(() => setIntro(true), 300);
        endTimer = window.setTimeout(() => setIntro(false), 2800);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, []);

  const exploded = hovered || active !== -1 || intro;
  const gap = exploded ? GAP_EXPLODED : GAP_STACKED;

  return (
    <section className="section-padding overflow-hidden border-y border-white/10 bg-white/[0.025]">
      <style>{css}</style>

      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* ───────── Layer diagram ───────── */}
          <div
            ref={diagramRef}
            aria-hidden="true"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative mx-auto h-[26rem] w-full max-w-xl"
          >
            {/* Soft light on the "ground" under the stack */}
            <span
              className="absolute left-1/2 h-12 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-2xl transition-[top] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
              style={{ top: `calc(50% + ${gap + 4.9}rem)` }}
            />

            {/* Guide lines between the left and right corners of neighbouring plates */}
            {SHOW_GUIDES &&
              LAYERS.slice(0, -1).flatMap((layer, index) =>
                GUIDE_SIDES.map((side) => (
                  <span
                    key={`${layer.label}-${side}`}
                    className={`absolute w-0 border-l border-dashed border-white/25 transition-[opacity,top,height] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${side} ${
                      exploded ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ top: `calc(50% + ${(index - 1) * gap}rem)`, height: `${gap}rem` }}
                  >
                    <span className="addon-rise absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-bone" />
                  </span>
                ))
              )}

            {LAYERS.map((layer, index) => {
              const offset = (index - 1) * gap;
              const isSite = layer.addon === null;
              const isActive = layer.addon === active;

              return (
                <div key={layer.label}>
                  {/* Layer plate: a face plus a few edge copies behind it for thickness */}
                  <div
                    className="absolute left-1/2 top-1/2 h-40 w-40 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none sm:h-52 sm:w-52"
                    style={{
                      transform: `translate(-50%, calc(-50% + ${offset}rem)) rotateX(62deg) rotateZ(-45deg)`,
                      zIndex: LAYERS.length - index,
                    }}
                  >
                    {EDGE_DEPTHS.map((depth) => (
                      <span
                        key={depth}
                        className={`absolute inset-0 rounded-[1.6rem] border transition-colors duration-700 ${
                          isSite
                            ? "border-[#b9b5ab] bg-[#cfcbc1]"
                            : isActive
                              ? "border-white/20 bg-[#1d1d1d]"
                              : "border-white/10 bg-[#0d0d0d]"
                        }`}
                        style={{ transform: `translateZ(-${depth}px)` }}
                      />
                    ))}

                    <div
                      className={`absolute inset-0 overflow-hidden rounded-[1.6rem] border transition-[background-color,border-color,box-shadow] duration-700 motion-reduce:transition-none ${
                        isSite
                          ? "border-bone bg-bone shadow-glow"
                          : isActive
                            ? "border-bone/80 bg-[#303030] shadow-glow"
                            : "border-white/20 bg-[#181818]"
                      }`}
                    >
                      {/* Sheen */}
                      <span
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                          isSite
                            ? "from-white via-transparent to-black/[0.08]"
                            : "from-white/20 via-white/[0.03] to-transparent"
                        }`}
                      />

                      {isSite && (
                        <div className="relative flex h-full flex-col gap-3 p-6">
                          <span className="h-2 w-1/2 rounded-full bg-ink/25" />
                          <span className="h-2 w-3/4 rounded-full bg-ink/15" />
                          <span className="mt-auto h-10 w-full rounded-xl bg-ink/10" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Label tag */}
                  <div
                    className="absolute hidden -translate-y-1/2 items-center gap-2 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none sm:flex"
                    style={{
                      left: "calc(50% + 6.25rem)",
                      top: `calc(50% + ${offset}rem)`,
                      zIndex: 20,
                    }}
                  >
                    <span className="h-px w-8 bg-white/30" />
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] transition-colors duration-500 ${
                        isSite || isActive
                          ? "border-bone bg-bone text-ink"
                          : "border-white/20 bg-ink text-white/60"
                      }`}
                    >
                      {layer.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ───────── Add-on list ───────── */}
          <ul className="grid gap-4">
            {ADDONS.map((addon, index) => {
              const isActive = index === active;
              return (
                <li key={addon.name}>
                  <button
                    type="button"
                    onClick={() => setActive(isActive ? -1 : index)}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    aria-pressed={isActive}
                    className={`flex w-full items-start gap-5 rounded-[1.8rem] border p-6 text-left transition duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none sm:p-7 ${
                      isActive
                        ? "border-bone bg-bone text-ink shadow-glow"
                        : "border-white/10 bg-white/[0.045] text-bone hover:border-white/25"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border text-xs font-black transition duration-500 ${
                        isActive
                          ? "border-ink bg-ink text-bone"
                          : "border-white/15 bg-white/[0.04] text-white/45"
                      }`}
                    >
                      {pad(index)}
                    </span>
                    <span className="block min-w-0">
                      <span className="block text-2xl font-black tracking-tight">
                        {addon.name}
                      </span>
                      <span
                        className={`mt-2 block text-sm leading-7 transition-colors duration-500 ${
                          isActive ? "text-black/68" : "text-white/58"
                        }`}
                      >
                        {addon.text}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}