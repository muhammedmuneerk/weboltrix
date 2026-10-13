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

// rem between layers: [stacked, exploded]. Phones get tighter spacing (smaller plates).
const GAPS = { desktop: [3.25, 6.75], compact: [2.75, 5.5] };

// How far the picked layer lifts out of the stack (rem)
const LIFT = 0.7;

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
  @keyframes addon-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  .addon-rise { animation: addon-rise 2.6s linear infinite; }
  .addon-blink { animation: addon-blink 2s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    .addon-rise { animation: none; display: none; }
    .addon-blink { animation: none; }
  }
`;

// Small marks printed on the add-on plates so each one is recognisable without a label
function Decal({ label, isActive }) {
  if (label === "Hosting") {
    return (
      <div className="relative flex h-full flex-col justify-end gap-2.5 p-5 sm:p-6">
        {[0, 1, 2].map((slot) => (
          <span
            key={slot}
            className={`relative h-3 rounded-full border transition-colors duration-700 ${
              isActive ? "border-white/30 bg-white/20" : "border-white/10 bg-white/[0.06]"
            }`}
          >
            <span
              className={`absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-bone ${
                slot === 0 ? "addon-blink" : "opacity-60"
              }`}
            />
          </span>
        ))}
      </div>
    );
  }

  // Maintenance: three sliders at different settings
  return (
    <div className="relative flex h-full flex-col justify-end gap-3.5 p-5 sm:p-6">
      {["22%", "64%", "42%"].map((knob) => (
        <span
          key={knob}
          className={`relative h-1.5 rounded-full transition-colors duration-700 ${
            isActive ? "bg-white/30" : "bg-white/12"
          }`}
        >
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone/85"
            style={{ left: knob }}
          />
        </span>
      ))}
    </div>
  );
}

// An exploded-view diagram: the website sits on top of its add-ons.
// - It pulls apart once on its own when it scrolls into view (so touch screens see it too)
// - Hover the diagram or pick an add-on (list, plate or legend) and it pulls apart again;
//   the picked layer lights up and lifts out of the stack
export default function AddOns() {
  const [active, setActive] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [intro, setIntro] = useState(false);
  const [compact, setCompact] = useState(false);
  const diagramRef = useRef(null);

  // Phones use tighter spacing
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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
  const [gapStacked, gapExploded] = compact ? GAPS.compact : GAPS.desktop;
  const gap = exploded ? gapExploded : gapStacked;

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
            className="relative mx-auto h-[23rem] w-full max-w-xl sm:h-[26rem]"
          >
            {/* Soft light on the "ground" under the stack */}
            <span
              className="absolute left-1/2 h-12 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-2xl transition-[top] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
              style={{ top: `calc(50% + ${gap + (compact ? 3.9 : 4.9)}rem)` }}
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
              const isSite = layer.addon === null;
              const isActive = layer.addon === active;
              const offset = (index - 1) * gap - (isActive ? LIFT : 0);

              return (
                <div key={layer.label}>
                  {/* Layer plate: a face plus a few edge copies behind it for thickness */}
                  <div
                    onClick={isSite ? undefined : () => setActive(layer.addon)}
                    onMouseEnter={isSite ? undefined : () => setActive(layer.addon)}
                    className={`absolute left-1/2 top-1/2 h-40 w-40 transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none sm:h-52 sm:w-52 ${
                      isSite ? "" : "cursor-pointer"
                    }`}
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

                      {isSite ? (
                        <div className="relative flex h-full flex-col gap-3 p-5 sm:p-6">
                          <span className="h-2 w-1/2 rounded-full bg-ink/25" />
                          <span className="h-2 w-3/4 rounded-full bg-ink/15" />
                          <span className="mt-auto h-10 w-full rounded-xl bg-ink/10" />
                        </div>
                      ) : (
                        <Decal label={layer.label} isActive={isActive} />
                      )}
                    </div>
                  </div>

                  {/* Label tag (sm and up) */}
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

            {/* Legend (phones): the same names, as small tappable pills */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 sm:hidden">
              {LAYERS.map((layer) => {
                const isSite = layer.addon === null;
                const isActive = layer.addon === active;
                return (
                  <span
                    key={layer.label}
                    onClick={isSite ? undefined : () => setActive(layer.addon)}
                    className={`rounded-full border px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] transition-colors duration-500 ${
                      isSite || isActive
                        ? "border-bone bg-bone text-ink"
                        : "border-white/20 bg-ink text-white/60"
                    }`}
                  >
                    {layer.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ───────── Add-on list ───────── */}
          <ul className="grid gap-4">
            {ADDONS.map((addon, index) => {
              const isActive = index === active;
              return (
                <li key={addon.name}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
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