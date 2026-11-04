import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

// Each step is taller than the last on desktop, so the row reads as a staircase.
const STEP_HEIGHTS = ["lg:min-h-[31rem]", "lg:min-h-[37rem]", "lg:min-h-[43rem]"];

// Mobile: the staircase becomes a vertical climb instead of a horizontal one —
// each step indents a little further right and reads a little bigger than
// the last, so the "building up" feeling survives on a narrow screen.
const MOBILE_INDENT = ["ml-0", "ml-5", "ml-10"];
const MOBILE_TITLE_SIZE = ["text-4xl", "text-[2.75rem]", "text-5xl"];

export default function DetailedBreakdown() {
  const total = services.length;

  return (
    <section data-color-scope="detailed-breakdown" className="section-padding overflow-hidden border-y border-line/10 bg-layer/[0.025]">
      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden lg:block">
        <SectionHeading
          layout="split"
          eyebrow="Detailed breakdown"

          title="Every package is shaped around trust, speed, and enquiries."
        //   title="Every level builds on the last."
        //   title="Three levels. Here's what's inside each."
        //   title="See exactly what each level includes."
        //   title="Pick a level. See what you get."

          text="The level changes, but the goal stays the same: a clean website that makes customers confident enough to contact you."
        />

        {/* Staircase */}
        <div className="mt-20 grid border-b border-line/15 lg:grid-cols-3 lg:items-end">
          {services.map((service, index) => {
            const f = Boolean(service.featured);

            return (
              <article
                key={service.name}
                className={`group relative flex flex-col overflow-hidden border-t-2 px-6 pb-10 pt-8 transition-colors duration-500 sm:px-9 sm:pb-12 sm:pt-10 lg:border-l ${
                  STEP_HEIGHTS[index] ?? ""
                } ${index === 0 ? "lg:border-l-line/15" : "border-l-line/15"} ${
                  f
                    ? "border-signal bg-emphasis text-on-emphasis"
                    : "border-line/25 bg-transparent text-heading hover:bg-layer/[0.035]"
                } ${index === total - 1 ? "lg:border-r lg:border-r-line/15" : ""}`}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: f
                      ? "1px var(--on-emphasis-a012)"
                      : "1px var(--line-a007)",
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
                              ? "bg-canvas"
                              : "bg-emphasis"
                            : f
                              ? "bg-recess/15"
                              : "bg-layer/15"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[0.65rem] font-black uppercase tracking-[0.22em] ${
                      f ? "text-on-emphasis-soft/45" : "text-content/38"
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
                    f ? "text-on-emphasis-soft/45" : "text-content/42"
                  }`}
                >
                  {service.price}
                </p>

                {/* Audience */}
                <p
                  className={`relative mt-7 text-base font-semibold leading-8 ${
                    f ? "text-on-emphasis-soft/72" : "text-content/70"
                  }`}
                >
                  {service.audience}
                </p>

                {/* Details */}
                <ul
                  className={`relative mt-7 border-t ${f ? "border-contrast-line/15" : "border-line/12"}`}
                >
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className={`flex gap-3 border-b py-3.5 text-sm leading-7 last:border-b-0 ${
                        f ? "border-contrast-line/10 text-on-emphasis-soft/65" : "border-line/[0.07] text-content/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex-none font-black ${f ? "text-on-emphasis" : "text-heading"}`}
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
                    f ? "text-on-emphasis" : "text-content"
                  }`}
                >
                  Start with {service.name} <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
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
          Every package is shaped around trust, speed, and enquiries.
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-content/58">
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
// Matches v1's actual desktop hierarchy: Business (center) is the tallest
// step, Premium (right) second, Starter (left) shortest — not a strict
// left-to-right ascent. Update this when v2's staircase order lands.
const BAR_HEIGHTS = ["h-20", "h-36", "h-28"]; // Starter, Business, Premium

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
        className="flex items-end gap-2.5 border-b border-line/15 pb-0 sm:gap-3"
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
                  ? "border-selection bg-selection text-on-selection shadow-glow"
                  : "border-line/15 bg-layer/[0.045] text-content/55 hover:border-line/30 hover:bg-layer/[0.07]"
              }`}
            >
              {f && (
                <span
                  aria-hidden="true"
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-[0.08em] ${
                    isActive ? "bg-inverse-action-alt text-inverse-heading" : "bg-selection text-on-selection"
                  }`}
                >
                  Popular
                </span>
              )}
              <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] opacity-[var(--secondary-label-opacity)]">
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
          isFeatured ? "border-signal bg-emphasis text-on-emphasis shadow-premium" : "border-line/15 bg-layer/[0.035] text-heading"
        }`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-5 -right-2 select-none text-[7rem] font-black leading-none tracking-tighter text-transparent"
          style={{
            WebkitTextStroke: isFeatured ? "1px var(--on-emphasis-a012)" : "1px var(--line-a008)",
          }}
        >
          {String(active + 1).padStart(2, "0")}
        </span>

        <p
          className={`relative text-[0.65rem] font-black uppercase tracking-[0.22em] ${
            isFeatured ? "text-on-emphasis-soft/45" : "text-content/42"
          }`}
        >
          {current.price}
        </p>
        <h3 className="relative mt-3 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
          {current.name}
        </h3>
        <p
          className={`relative mt-5 text-sm font-semibold leading-7 ${
            isFeatured ? "text-on-emphasis-soft/72" : "text-content/70"
          }`}
        >
          {current.audience}
        </p>

        <ul className={`relative mt-6 border-t ${isFeatured ? "border-contrast-line/15" : "border-line/12"}`}>
          {current.details.map((detail) => (
            <li
              key={detail}
              className={`flex gap-3 border-b py-3 text-sm leading-6 last:border-b-0 ${
                isFeatured ? "border-contrast-line/10 text-on-emphasis-soft/65" : "border-line/[0.07] text-content/60"
              }`}
            >
              <span aria-hidden="true" className={`flex-none font-black ${isFeatured ? "text-on-emphasis" : "text-heading"}`}>
                +
              </span>
              {detail}
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className={`relative mt-7 inline-flex items-center gap-2 text-sm font-bold transition active:translate-x-0.5 ${
            isFeatured ? "text-on-emphasis" : "text-content"
          }`}
        >
          Start with {current.name} <span aria-hidden="true">&rarr;</span>
        </Link>
      </article>

      <p className="mt-4 text-center text-xs font-bold text-content/35" aria-hidden="true">
        Tap a step to compare levels
      </p>
    </div>
  );
}