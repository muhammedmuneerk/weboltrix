import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { useAddOnsMotion } from "../hooks/useSiteMotion.js";

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

const pad = (n) => String(n + 1).padStart(2, "0");

// Layers from the top of the stack down. `addon` points at ADDONS (null = the site itself).
const LAYERS = [
  { label: "Website", addon: null },
  { label: "Hosting", addon: 0 },
  { label: "Maintenance", addon: 1 },
];

// Tag / legend text: add-ons carry the same number as their card
const layerText = (layer) =>
  layer.addon === null ? layer.label : `${pad(layer.addon)} ${layer.label}`;

// rem between layers: [stacked, exploded]. Phones get tighter spacing (smaller plates).
const GAPS = { desktop: [3.25, 6.75], compact: [2.75, 5.5] };

// How far the picked layer lifts out of the stack (rem)
const LIFT = 0.7;

// Set to false to drop the dashed guide lines (and their moving dots)
const SHOW_GUIDES = true;

// Horizontal position of the left / right plate tips: half the plate diagonal
// (7.07rem phones, 9.19rem sm+) minus 0.66rem because the rounded corners sit inside it
const GUIDE_SIDES = [
  "left-[calc(50%-6.41rem)] sm:left-[calc(50%-8.53rem)]",
  "left-[calc(50%+6.41rem)] sm:left-[calc(50%+8.53rem)]",
];

// Plate thickness: extra copies of the plate pushed back along its normal (px)
const EDGE_DEPTHS = [3, 6, 9];

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
              isActive ? "border-white/40 bg-white/25" : "border-white/20 bg-white/[0.12]"
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
            isActive ? "bg-white/45" : "bg-white/25"
          }`}
        >
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40 bg-bone"
            style={{ left: knob }}
          />
        </span>
      ))}
    </div>
  );
}

// An exploded-view diagram: the website sits on top of its add-ons.
// - Scroll-driven (GSAP ScrollTrigger): the layers pull apart every time the diagram scrolls
//   well into view, and close back into the stack (and the picked add-on resets) as it leaves
// - While it is in view, hovering or picking an add-on lights that layer up and lifts it
//   out of the stack
export default function AddOns() {
  const [active, setActive] = useState(-1);
  const [exploded, setExploded] = useState(false);
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

  // Scroll trigger (GSAP ScrollTrigger, see useSiteMotion.js): open after the diagram has
  // scrolled well into view, close as soon as it starts leaving. Re-arms on every pass.
  const open = useCallback(() => setExploded(true), []);
  const close = useCallback(() => {
    setExploded(false);
    setActive(-1);
  }, []);
  useAddOnsMotion(diagramRef, { onOpen: open, onClose: close });

  const [gapStacked, gapExploded] = compact ? GAPS.compact : GAPS.desktop;
  const gap = exploded ? gapExploded : gapStacked;

  return (
    <section className="section-padding overflow-hidden border-y border-white/10 bg-white/[0.025]">
      <style>{css}</style>

      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden lg:block">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          {/* ───────── Stage: the layer diagram ───────── */}
          <div
            ref={diagramRef}
            aria-hidden="true"
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-4 py-8 shadow-premium sm:px-8 lg:min-h-[30rem]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
              <div className="fine-grid h-full w-full" />
            </div>

            <div className="relative h-[23rem] w-full max-w-xl sm:h-[26rem]">
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
                      {layerText(layer)}
                    </span>
                  </div>
                </div>
              );
            })}

            </div>

            {/* Legend (phones): the same names, as small tappable pills */}
            <div className="relative mt-2 flex flex-wrap justify-center gap-2 sm:hidden">
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
                    {layerText(layer)}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ───────── Add-on list ───────── */}
          <ul className="grid content-center gap-4">
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

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />
        <MobileStack />
      </div>
    </section>
  );
}

// Mobile: the exploded diagram becomes a layer ledger. Website is the base;
// tapping an add-on switches its layer on, the rail fills down to it, and the
// summary below shows the stack you've put together.
function MobileStack() {
  const [on, setOn] = useState(() => ADDONS.map(() => false));

  const layers = [
    { key: "website", name: "Website", base: true },
    ...ADDONS.map((addon, i) => ({
      key: addon.name,
      name: addon.name,
      text: addon.text,
      addonIndex: i,
    })),
  ];

  const isOn = (layer) => layer.base || on[layer.addonIndex];
  const picked = layers.filter(isOn);
  const total = layers.length;

  const toggle = (addonIndex) =>
    setOn((current) => current.map((value, k) => (k === addonIndex ? !value : value)));

  return (
    <div className="mt-12">
      <ol>
        {layers.map((layer, index) => {
          const active = isOn(layer);
          const isLast = index === total - 1;
          const nextActive = !isLast && isOn(layers[index + 1]);

          const node = (
            <span
              aria-hidden="true"
              className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
                active
                  ? "border-bone bg-bone text-ink shadow-glow"
                  : "border-white/20 bg-ink text-white/50"
              }`}
            >
              {active ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="3">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                </span>
              )}
            </span>
          );

          const body = (
            <span className="block min-w-0">
              <span className="flex items-center justify-between gap-4">
                <span
                  className={`text-2xl font-black tracking-tight transition-colors duration-500 motion-reduce:transition-none ${
                    active ? "text-bone" : "text-white/60"
                  }`}
                >
                  {layer.name}
                </span>
                <span
                  className={`text-[0.65rem] font-black uppercase tracking-[0.2em] transition-colors duration-500 motion-reduce:transition-none ${
                    active ? "text-white/70" : "text-white/35"
                  }`}
                >
                  {layer.base ? "Included" : active ? "Added" : "Tap to add"}
                </span>
              </span>
              {layer.text && (
                <span
                  className={`mt-2 block text-sm leading-7 transition-colors duration-500 motion-reduce:transition-none ${
                    active ? "text-white/68" : "text-white/45"
                  }`}
                >
                  {layer.text}
                </span>
              )}
            </span>
          );

          return (
            <li key={layer.key} className="relative border-b border-white/10 first:border-t">
              {/* Rail down to the next layer — fills once that layer is on */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-6 left-[1.375rem] top-[4.25rem] w-px bg-white/12"
                >
                  <span
                    className={`absolute inset-0 origin-top bg-bone/70 transition-transform duration-500 motion-reduce:transition-none ${
                      nextActive ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                </span>
              )}

              {layer.base ? (
                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 py-6">
                  {node}
                  {body}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(layer.addonIndex)}
                  aria-pressed={active}
                  className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)] gap-4 py-6 text-left transition active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none"
                >
                  {node}
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      {/* Summary of the stack */}
      <div className="mt-8 rounded-[2rem] border border-white/10 bg-bone p-7 text-ink shadow-premium">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">Your stack</p>
          <p className="text-xs font-black tabular-nums text-black/45">
            {picked.length}/{total}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
          {layers.map((layer) => (
            <span
              key={layer.key}
              className={`h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                isOn(layer) ? "bg-ink" : "bg-black/15"
              }`}
            />
          ))}
        </div>

        <p
          className="mt-5 text-3xl font-black leading-tight tracking-tight text-balance"
          aria-live="polite"
        >
          {picked.map((layer) => layer.name).join(" + ")}
        </p>

        <Link
          to="/contact"
          className="premium-button mt-6 w-full bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800"
        >
          Ask about this setup
        </Link>
      </div>

      <p className="mt-4 text-center text-xs font-bold text-white/35" aria-hidden="true">
        Tap a layer to add it to your stack
      </p>
    </div>
  );
}