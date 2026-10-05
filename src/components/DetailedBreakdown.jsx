import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

// Top offset per step (desktop only). Columns share one bottom edge, so a
// bigger offset = a shorter step. The last step has 0 offset, so Premium is
// always the tallest regardless of how much text each column has.
// Steeper climb? Try ["lg:pt-40", "lg:pt-20", "lg:pt-0"].
const STEP_OFFSETS = ["lg:pt-28", "lg:pt-14", "lg:pt-0"];

export default function DetailedBreakdown() {
  const total = services.length;

  return (
    <section className="section-padding overflow-hidden border-y border-white/10 bg-white/[0.025]">
      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden lg:block">
        <SectionHeading
          layout="split"
          eyebrow="Detailed breakdown"

        //   title="Every package is shaped around trust, speed, and enquiries."
          title="Every level builds on the last."
        //   title="Three levels. Here's what's inside each."
        //   title="See exactly what each level includes."
        //   title="Pick a level. See what you get."

          text="The level changes, but the goal stays the same: a clean website that makes customers confident enough to contact you."
        />

        {/* Staircase */}
        <div className="mt-14 grid border-b border-white/15 lg:mt-20 lg:grid-cols-3">
          {services.map((service, index) => {
            const f = Boolean(service.featured);

            return (
              <div
                key={service.name}
                className={`flex flex-col ${STEP_OFFSETS[index] ?? ""}`}
              >
                <article
                  className={`group relative flex flex-1 flex-col overflow-hidden border-t-2 px-6 pb-10 pt-8 transition-colors duration-500 sm:px-9 sm:pb-12 sm:pt-10 lg:border-l lg:border-l-white/15 ${
                    index === total - 1 ? "lg:border-r lg:border-r-white/15" : ""
                  } ${
                    f
                      ? "border-t-bone bg-bone text-ink"
                      : "border-t-white/25 bg-transparent text-bone hover:bg-white/[0.035]"
                  }`}
                >
                  {/* Ghost numeral */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                    style={{
                      WebkitTextStroke: f
                        ? "1px rgba(5,5,5,0.12)"
                        : "1px rgba(255,255,255,0.07)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Level meter */}
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex gap-1.5" aria-hidden="true">
                      {services.map((_, step) => (
                        <span
                          key={step}
                          className={`h-1 w-8 rounded-full ${
                            step <= index
                              ? f
                                ? "bg-ink"
                                : "bg-bone"
                              : f
                                ? "bg-black/15"
                                : "bg-white/15"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[0.65rem] font-black uppercase tracking-[0.22em] ${
                        f ? "text-black/45" : "text-white/38"
                      }`}
                    >
                      Level {String(index + 1).padStart(2, "0")}
                      {f ? " · Popular" : ""}
                    </span>
                  </div>

                  {/* Name + price */}
                  <h3 className="relative mt-10 text-5xl font-black tracking-tight sm:text-6xl lg:text-5xl xl:text-6xl">
                    {service.name}
                  </h3>
                  <p
                    className={`relative mt-3 text-xs font-black uppercase tracking-[0.25em] ${
                      f ? "text-black/45" : "text-white/42"
                    }`}
                  >
                    {service.price}
                  </p>

                  {/* Audience */}
                  <p
                    className={`relative mt-7 text-base font-semibold leading-8 ${
                      f ? "text-black/72" : "text-white/70"
                    }`}
                  >
                    {service.audience}
                  </p>

                  {/* Details */}
                  <ul
                    className={`relative mt-7 border-t ${
                      f ? "border-black/15" : "border-white/12"
                    }`}
                  >
                    {service.details.map((detail) => (
                      <li
                        key={detail}
                        className={`flex gap-3 border-b py-3.5 text-sm leading-7 last:border-b-0 ${
                          f
                            ? "border-black/10 text-black/65"
                            : "border-white/[0.07] text-white/60"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex-none font-black ${f ? "text-ink" : "text-bone"}`}
                        >
                          +
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* CTA pinned to the bottom of the step */}
                  <Link
                    to="/contact"
                    className={`relative mt-auto inline-flex items-center gap-2 pt-9 text-sm font-bold transition hover:translate-x-1 ${
                      f ? "text-ink" : "text-white"
                    }`}
                  >
                    Start with {service.name} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <p className="eyebrow">Detailed breakdown</p>
        <h2
          className="mt-4 max-w-md font-black leading-[1.02] tracking-tight text-balance"
          style={{ fontSize: "clamp(2rem, 9vw, 3.25rem)" }}
        >
          Every level builds on the last.
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-white/58">
          The level changes, but the goal stays the same: a clean website that makes customers
          confident enough to contact you.
        </p>

        <MobileStaircase />
      </div>

      {/* ───────── /Mobile ───────── */}
    </section>
  );
}

// A rising bar-chart doubles as the level selector: each bar is literally
// the "Level 0N" meter from the desktop card, scaled up into the thing you
// tap. One detail panel below swaps content instead of repeating three
// full cards — the staircase itself becomes the interactive piece.
// Matches v2's desktop order: a strict ascending climb, Premium always the
// tallest step regardless of how much text each column has.
const BAR_HEIGHTS = ["h-20", "h-28", "h-36"]; // Starter, Business, Premium

function MobileStaircase() {
  const total = services.length;
  const [active, setActive] = useState(() => {
    const featuredIndex = services.findIndex((service) => service.featured);
    return featuredIndex === -1 ? 0 : featuredIndex;
  });
  const current = services[active];
  const isFeatured = Boolean(current.featured);

  return (
    <div className="mt-12">
      {/* Rising steps */}
      <div
        role="tablist"
        aria-label="Website packages"
        className="flex items-end gap-2.5 border-b border-white/15 pb-0 sm:gap-3"
      >
        {services.map((service, index) => {
          const isActive = index === active;
          const f = Boolean(service.featured);
          return (
            <button
              key={service.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(index)}
              className={`group relative flex flex-1 flex-col items-center justify-end gap-2.5 rounded-t-2xl border border-b-0 pb-4 pt-3 transition-all duration-500 ${
                BAR_HEIGHTS[index] ?? "h-20"
              } ${
                isActive
                  ? "border-bone bg-bone text-ink shadow-glow"
                  : "border-white/15 bg-white/[0.045] text-white/55 hover:border-white/30 hover:bg-white/[0.07]"
              }`}
            >
              {f && (
                <span
                  aria-hidden="true"
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-[0.08em] ${
                    isActive ? "bg-ink text-bone" : "bg-bone text-ink"
                  }`}
                >
                  Popular
                </span>
              )}
              <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-60">
                0{index + 1}
              </span>
              <span className="text-sm font-black tracking-tight sm:text-base">{service.name}</span>
            </button>
          );
        })}
      </div>

      {/* Expanding detail panel — crossfades when a step is tapped */}
      <article
        key={current.name}
        className={`relative animate-fade-up overflow-hidden rounded-b-[1.8rem] border border-t-0 px-6 pb-8 pt-8 transition-colors duration-500 motion-reduce:animate-none sm:px-8 ${
          isFeatured ? "border-bone bg-bone text-ink shadow-premium" : "border-white/15 bg-white/[0.035] text-bone"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 -right-2 select-none text-[7rem] font-black leading-none tracking-tighter text-transparent"
          style={{
            WebkitTextStroke: isFeatured ? "1px rgba(5,5,5,0.12)" : "1px rgba(255,255,255,0.08)",
          }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        <p
          className={`relative text-[0.65rem] font-black uppercase tracking-[0.22em] ${
            isFeatured ? "text-black/45" : "text-white/42"
          }`}
        >
          {current.price}
        </p>
        <h3 className="relative mt-3 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
          {current.name}
        </h3>
        <p
          className={`relative mt-5 text-sm font-semibold leading-7 ${
            isFeatured ? "text-black/72" : "text-white/70"
          }`}
        >
          {current.audience}
        </p>

        <ul className={`relative mt-6 border-t ${isFeatured ? "border-black/15" : "border-white/12"}`}>
          {current.details.map((detail) => (
            <li
              key={detail}
              className={`flex gap-3 border-b py-3 text-sm leading-6 last:border-b-0 ${
                isFeatured ? "border-black/10 text-black/65" : "border-white/[0.07] text-white/60"
              }`}
            >
              <span aria-hidden="true" className={`flex-none font-black ${isFeatured ? "text-ink" : "text-bone"}`}>
                +
              </span>
              {detail}
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className={`relative mt-7 inline-flex items-center gap-2 text-sm font-bold transition active:translate-x-0.5 ${
            isFeatured ? "text-ink" : "text-white"
          }`}
        >
          Start with {current.name} <span aria-hidden="true">&rarr;</span>
        </Link>
      </article>

      <p className="mt-4 text-center text-xs font-bold text-white/35" aria-hidden="true">
        Tap a step to compare levels
      </p>
    </div>
  );
}