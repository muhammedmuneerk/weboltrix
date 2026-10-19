import { useCallback, useEffect, useRef, useState } from "react";
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

// Flat, full-width slabs stacked with a small horizontal strip of its own
// Decal — the mobile translation of the desktop plate, since a square tile
// with a side-mounted decal doesn't have room to breathe at this width.
function MobileSlabDecal({ label, isActive }) {
  if (label === "Hosting") {
    return (
      <div className="relative flex flex-1 flex-col justify-center gap-2">
        {[0, 1, 2].map((slot) => (
          <span
            key={slot}
            className={`relative h-2.5 rounded-full border transition-colors duration-700 ${
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

  return (
    <div className="relative flex flex-1 flex-col justify-center gap-3">
      {["22%", "64%", "42%"].map((knob) => (
        <span
          key={knob}
          className={`relative h-1 rounded-full transition-colors duration-700 ${
            isActive ? "bg-white/45" : "bg-white/25"
          }`}
        >
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40 bg-bone"
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

  // ---- Mobile / tablet: a draggable stack instead of the 3D isometric one.
  // `progress` (0–1) is how far apart the layers are. It still opens on its
  // own when the diagram scrolls into view (parity with desktop), but a
  // finger can also drag it open or shut directly — something a mouse
  // hover can't really do, so this is the one thing mobile gets that
  // desktop doesn't.
  const MOBILE_MAX_GAP_REM = 1.6; // how far apart two layers sit at progress = 1
  const DRAG_RANGE_PX = 130; // finger travel (px) to go from 0 to 1

  const [mActive, setMActive] = useState(-1);
  const [mExploded, setMExploded] = useState(false);
  const [mProgress, setMProgress] = useState(0); // 0 closed .. 1 open
  const [mDragging, setMDragging] = useState(false);
  const mobileDiagramRef = useRef(null);
  const dragRef = useRef({ startY: 0, startProgress: 0, moved: false });

  const animateMobileTo = useCallback((target, openState) => {
    setMDragging(false); // make sure the transition is enabled for this move
    setMProgress(target);
    setMExploded(openState);
    if (!openState) setMActive(-1);
  }, []);

  const openMobile = useCallback(() => animateMobileTo(1, true), [animateMobileTo]);
  const closeMobile = useCallback(() => animateMobileTo(0, false), [animateMobileTo]);
  useAddOnsMotion(mobileDiagramRef, { onOpen: openMobile, onClose: closeMobile });

  const handleGripPointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { startY: event.clientY, startProgress: mProgress, moved: false };
    setMDragging(true);
  };

  const handleGripPointerMove = (event) => {
    if (!dragRef.current) return;
    const state = dragRef.current;
    const deltaY = event.clientY - state.startY;
    if (Math.abs(deltaY) > 3) state.moved = true;
    const next = state.startProgress + deltaY / DRAG_RANGE_PX;
    setMProgress(Math.min(1, Math.max(0, next)));
  };

  const endGripDrag = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setMProgress((current) => {
      const target = current >= 0.4 ? 1 : 0;
      animateMobileTo(target, target === 1);
      return target;
    });
  };

  const toggleMobileStack = () => {
    // A plain tap on the grip (not a drag) just flips it open/closed.
    if (dragRef.current?.moved) return;
    animateMobileTo(mExploded ? 0 : 1, !mExploded);
  };

  return (
    <section className="section-padding overflow-hidden border-y border-white/10 bg-white/[0.025]">
      <style>{css}</style>

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <p className="eyebrow">{EYEBROW}</p>
        <h2
          className="mt-4 max-w-md font-black leading-[1.02] tracking-tight text-balance"
          style={{ fontSize: "clamp(2rem, 9vw, 3.25rem)" }}
        >
          {TITLE}
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-white/58">{TEXT}</p>

        {/* Draggable stack: pulls apart on its own once scrolled into view,
            and a finger can also drag it open or push it shut directly. */}
        <div
          ref={mobileDiagramRef}
          className="relative mt-10 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] px-4 pb-16 pt-8 shadow-premium"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
            <div className="fine-grid h-full w-full" />
          </div>

          <div className="relative" style={{ height: `${7 + MOBILE_MAX_GAP_REM * 2 * mProgress}rem` }}>
            {LAYERS.map((layer, index) => {
              const isSite = layer.addon === null;
              const isActive = layer.addon === mActive;
              const offset = index * MOBILE_MAX_GAP_REM * mProgress;
              const tilt = (index - 1) * 1.4 * mProgress;

              return (
                <div
                  key={layer.label}
                  onClick={isSite ? undefined : () => setMActive(layer.addon)}
                  className={`absolute inset-x-0 top-0 flex h-20 items-center gap-4 overflow-hidden rounded-[1.4rem] border px-5 ${
                    mDragging ? "" : "transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
                  } ${
                    isSite
                      ? "border-bone bg-bone shadow-glow"
                      : isActive
                        ? "border-bone/80 bg-[#242424] shadow-glow"
                        : "border-white/15 bg-[#141414]"
                  } ${isSite ? "" : "cursor-pointer active:scale-[0.99]"}`}
                  style={{
                    transform: `translateY(${offset}rem) rotate(${tilt}deg)`,
                    zIndex: LAYERS.length - index,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                      isSite
                        ? "from-white via-transparent to-black/[0.08]"
                        : "from-white/[0.08] via-transparent to-transparent"
                    }`}
                  />

                  <span
                    className={`relative flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xs font-black transition-colors duration-500 ${
                      isSite
                        ? "border-ink/15 bg-ink/10 text-ink"
                        : isActive
                          ? "border-bone bg-bone text-ink"
                          : "border-white/15 bg-white/[0.04] text-white/50"
                    }`}
                  >
                    {isSite ? "" : pad(layer.addon)}
                  </span>

                  <span
                    className={`relative shrink-0 text-lg font-black tracking-tight ${
                      isSite ? "text-ink" : "text-bone"
                    }`}
                  >
                    {layer.label}
                  </span>

                  {isSite ? (
                    <div className="relative ml-auto flex flex-1 items-center justify-end gap-2">
                      <span className="h-2 w-10 rounded-full bg-ink/15" />
                      <span className="h-2 w-16 rounded-full bg-ink/10" />
                    </div>
                  ) : (
                    <MobileSlabDecal label={layer.label} isActive={isActive} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Drag handle: the actual grab target, kept separate from the
              stack itself so a normal page-scroll swipe is never hijacked */}
          <button
            type="button"
            onClick={toggleMobileStack}
            onPointerDown={handleGripPointerDown}
            onPointerMove={handleGripPointerMove}
            onPointerUp={endGripDrag}
            onPointerCancel={endGripDrag}
            aria-expanded={mExploded}
            aria-label={mExploded ? "Close the layer stack" : "Open the layer stack"}
            style={{ touchAction: "none" }}
            className="absolute inset-x-0 bottom-5 mx-auto flex w-fit cursor-grab flex-col items-center gap-1.5 rounded-full px-4 py-2 text-white/55 transition active:cursor-grabbing"
          >
            <span className="h-1 w-9 rounded-full bg-white/25" />
            <span className="text-[0.6rem] font-black uppercase tracking-[0.16em]">
              {mExploded ? "Drag to close" : "Drag to open"}
            </span>
          </button>
        </div>

        {/* Add-on list */}
        <ul className="mt-6 grid gap-3">
          {ADDONS.map((addon, index) => {
            const isActive = index === mActive;
            return (
              <li key={addon.name}>
                <button
                  type="button"
                  onClick={() => {
                    setMActive(index);
                    if (mProgress < 1) animateMobileTo(1, true);
                  }}
                  aria-pressed={isActive}
                  className={`flex w-full items-start gap-4 rounded-[1.6rem] border p-5 text-left transition duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none ${
                    isActive
                      ? "border-bone bg-bone text-ink shadow-glow"
                      : "border-white/10 bg-white/[0.045] text-bone"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xs font-black transition duration-500 ${
                      isActive
                        ? "border-ink bg-ink text-bone"
                        : "border-white/15 bg-white/[0.04] text-white/45"
                    }`}
                  >
                    {pad(index)}
                  </span>
                  <span className="block min-w-0">
                    <span className="block text-xl font-black tracking-tight">{addon.name}</span>
                    <span
                      className={`mt-1.5 block text-sm leading-6 transition-colors duration-500 ${
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
    </section>
  );
}