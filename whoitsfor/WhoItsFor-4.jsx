import { useId, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

// Start on the featured package (Business).
const DEFAULT_INDEX = Math.max(
  0,
  services.findIndex((service) => service.featured)
);

const pad = (n) => String(n + 1).padStart(2, "0");

// Expanding panels: three tall panels side by side (xl and up). Hover, focus
// or tap one and it widens to reveal what that package includes. Below xl the
// same idea becomes a stacked accordion.
export default function WhoItsFor() {
  const baseId = useId();
  const [active, setActive] = useState(DEFAULT_INDEX);

  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} />

        {/* ───────── Desktop: expanding panels (xl and up) ───────── */}
        <div className="mt-16 hidden gap-4 xl:flex xl:h-[34rem]">
          {services.map((service, index) => {
            const isActive = index === active;
            const isFeatured = Boolean(service.featured);

            return (
              <article
                key={service.name}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                style={{ flex: isActive ? "2.4 1 0%" : "1 1 0%" }}
                className={`relative min-w-0 cursor-pointer overflow-hidden rounded-[2rem] border transition-[flex-grow,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                  isActive
                    ? "border-bone bg-bone text-ink shadow-glow"
                    : "border-white/10 bg-white/[0.045] text-bone hover:border-white/25"
                }`}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: isActive
                      ? "1px rgba(5,5,5,0.12)"
                      : "1px rgba(255,255,255,0.07)",
                  }}
                >
                  {pad(index)}
                </span>

                <div className="relative flex h-full flex-col justify-between p-9">
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`text-xs font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                        isActive ? "text-black/45" : "text-white/42"
                      }`}
                    >
                      {pad(index)} / {service.name}
                    </p>
                    {isFeatured && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.08em] transition-colors duration-500 ${
                          isActive ? "bg-ink text-bone" : "bg-bone text-ink"
                        }`}
                      >
                        Popular
                      </span>
                    )}
                  </div>

                  <h3
                    className={`max-w-xl text-2xl font-black leading-snug tracking-tight transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-white/70"
                    }`}
                  >
                    {service.audience}
                  </h3>

                  <div>
                    <p
                      className={`text-xs font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                        isActive ? "text-black/45" : "text-white/42"
                      }`}
                    >
                      {service.price}
                    </p>
                    <div
                      className={`transition-all duration-500 motion-reduce:transition-none ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                    >
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="rounded-full border border-black/10 bg-black/[0.05] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-black/60"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        tabIndex={isActive ? 0 : -1}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink transition hover:translate-x-1"
                      >
                        Start with {service.name} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ───────── Below xl: stacked accordion ───────── */}
        <div className="mt-12 grid gap-4 sm:mt-14 xl:hidden">
          {services.map((service, index) => {
            const isActive = index === active;
            const buttonId = `${baseId}-b-${index}`;
            const panelId = `${baseId}-p-${index}`;

            return (
              <article
                key={service.name}
                className={`overflow-hidden rounded-[1.8rem] border transition-colors duration-500 motion-reduce:transition-none ${
                  isActive
                    ? "border-bone bg-bone text-ink shadow-glow"
                    : "border-white/10 bg-white/[0.045] text-bone"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => setActive(isActive ? -1 : index)}
                    className="flex w-full items-start gap-4 p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone sm:p-8"
                  >
                    <span className="block min-w-0 flex-1">
                      <span
                        className={`block text-[0.7rem] font-black uppercase tracking-[0.22em] ${
                          isActive ? "text-black/45" : "text-white/42"
                        }`}
                      >
                        {pad(index)} / {service.name} &middot; {service.price}
                      </span>
                      <span
                        className={`mt-4 block text-xl font-black leading-snug tracking-tight sm:text-2xl ${
                          isActive ? "text-ink" : "text-white/75"
                        }`}
                      >
                        {service.audience}
                      </span>
                    </span>

                    {/* Plus → minus indicator */}
                    <span
                      aria-hidden="true"
                      className={`relative mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
                        isActive
                          ? "border-ink bg-ink text-bone"
                          : "border-white/15 bg-white/5 text-bone"
                      }`}
                    >
                      <span className="absolute h-px w-3.5 bg-current" />
                      <span
                        className={`absolute h-3.5 w-px bg-current transition-transform duration-500 motion-reduce:transition-none ${
                          isActive ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                      <ul className="flex flex-wrap gap-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="rounded-full border border-black/10 bg-black/[0.05] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-black/60"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/contact"
                        tabIndex={isActive ? 0 : -1}
                        className="mt-5 inline-flex items-center gap-2 border-t border-black/15 pt-4 text-sm font-bold text-ink transition active:translate-x-0.5"
                      >
                        Start with {service.name} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}