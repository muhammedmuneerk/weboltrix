import { useState } from "react";
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

const pad = (n) => String(n + 1).padStart(2, "0");

// An exploded-view diagram: the website sits on top of its add-ons. Hover the
// diagram or pick an add-on and the layers pull apart; the picked layer lights up.
export default function AddOns() {
  const [active, setActive] = useState(-1);
  const [hovered, setHovered] = useState(false);

  const exploded = hovered || active !== -1;
  const gap = exploded ? GAP_EXPLODED : GAP_STACKED;

  return (
    <section className="section-padding overflow-hidden border-y border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* ───────── Layer diagram ───────── */}
          <div
            aria-hidden="true"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative mx-auto h-[24rem] w-full max-w-xl"
          >
            {LAYERS.map((layer, index) => {
              const offset = (index - 1) * gap;
              const isSite = layer.addon === null;
              const isActive = layer.addon === active;

              return (
                <div key={layer.label}>
                  {/* Layer plate */}
                  <div
                    className={`absolute left-1/2 top-1/2 h-40 w-40 rounded-[1.6rem] border backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none sm:h-52 sm:w-52 ${
                      isSite
                        ? "border-bone bg-bone shadow-glow"
                        : isActive
                          ? "border-bone/80 bg-white/25 shadow-glow"
                          : "border-white/20 bg-white/[0.07]"
                    }`}
                    style={{
                      transform: `translate(-50%, calc(-50% + ${offset}rem)) rotateX(62deg) rotateZ(-45deg)`,
                      zIndex: LAYERS.length - index,
                    }}
                  >
                    {isSite && (
                      <div className="flex h-full flex-col gap-3 p-6">
                        <span className="h-2 w-1/2 rounded-full bg-ink/25" />
                        <span className="h-2 w-3/4 rounded-full bg-ink/15" />
                        <span className="mt-auto h-10 w-full rounded-xl bg-ink/10" />
                      </div>
                    )}
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