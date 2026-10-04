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
      <div className="container-premium">
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
    </section>
  );
}