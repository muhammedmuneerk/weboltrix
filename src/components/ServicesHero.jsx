import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { services, whatsappLink } from "../data/siteData.js";

const EYEBROW = "Services";
const TITLE = "Website packages built to bring customers.";
const COPY =
  "Three clear levels, one goal: a premium website that makes your business easier to trust, contact, and choose.";

const STATS = [
  ["3 packages", "Lean to full"],
  ["From ₹5,000", "Setup"],
  ["WhatsApp", "Direct enquiries"],
];

// Business is the featured package in siteData, so start there.
const DEFAULT_INDEX = Math.max(
  0,
  services.findIndex((service) => service.featured)
);

export default function ServicesHero({ eyebrow = EYEBROW, title = TITLE, children }) {
  const [active, setActive] = useState(DEFAULT_INDEX);
  const tabRefs = useRef([]);
  const total = services.length;
  const current = services[active];

  const select = (index, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  // Arrow-key navigation for the tab group (roving tabindex).
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select((active + 1) % total, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      select((active - 1 + total) % total, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(total - 1, true);
    }
  };

  return (
    <section className="hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="fine-grid absolute inset-0 -z-10" />

      <div className="container-premium grid w-full gap-12 pb-14 pt-28 sm:pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12 lg:pb-8 lg:pt-24 xl:gap-16">
        {/* ───────── Left: message, actions, quick facts ───────── */}
        <div className="min-w-0">
          <p className="hero-kicker eyebrow">{eyebrow}</p>
          <h1 className="hero-title mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-balance sm:text-6xl sm:leading-[0.96] lg:text-[length:clamp(2.25rem,min(5.2vw,7.6vh),4.5rem)] lg:leading-[0.98]">
            {title}
          </h1>
          <div className="hero-copy mt-6 max-w-xl text-base leading-8 text-white/62 sm:text-lg lg:mt-5 lg:leading-7 [@media(min-height:900px)]:lg:text-lg [@media(min-height:900px)]:lg:leading-8">
            {children ?? <p>{COPY}</p>}
          </div>

          <div className="hero-actions mt-8 lg:mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="premium-button-light w-full sm:w-auto">
              Get Your Website
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button-dark w-full sm:w-auto"
            >
              Chat on WhatsApp
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 lg:mt-8 [@media(max-height:560px)]:lg:hidden divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            {STATS.map(([term, detail]) => (
              <div key={term} className="px-2 py-4 text-center sm:px-4 sm:text-left lg:py-3.5">
                <dt className="text-sm font-black tracking-tight text-bone sm:text-base">{term}</dt>
                <dd className="mt-1 text-[0.7rem] leading-4 text-white/50 sm:text-xs">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ───────── Right: interactive package finder ───────── */}
        <div className="glass min-w-0 rounded-[2rem] p-5 sm:p-7 lg:p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Find your fit</p>
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              Package {active + 1} of {total}
            </p>
          </div>

          {/* Segmented control with a sliding thumb */}
          <div
            role="tablist"
            aria-label="Website packages"
            onKeyDown={handleKeyDown}
            className="relative mt-5 lg:mt-4 grid grid-cols-3 rounded-full border border-white/10 bg-white/[0.05] p-1"
          >
            <span
              aria-hidden="true"
              className="absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-bone shadow-glow transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(${active * 100}%)` }}
            />
            {services.map((service, index) => {
              const isActive = index === active;
              return (
                <button
                  key={service.name}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`services-hero-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls="services-hero-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(index)}
                  className={`relative z-10 rounded-full px-2 py-3 text-sm font-black transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none lg:py-2.5 ${
                    isActive ? "text-ink" : "text-white/60 hover:text-bone"
                  }`}
                >
                  {service.name}
                </button>
              );
            })}
          </div>

          {/* Selected package */}
          <div
            key={current.name}
            role="tabpanel"
            id="services-hero-panel"
            aria-labelledby={`services-hero-tab-${active}`}
            className="mt-7 min-h-[19rem] animate-fade-up motion-reduce:animate-none lg:mt-5 lg:min-h-0"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/42">
              {current.price}
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:mt-2 lg:text-3xl">{current.name}</h2>
            <p className="mt-4 text-sm leading-7 text-white/58 sm:text-base lg:mt-2 lg:text-sm lg:leading-6">{current.audience}</p>

            <ul className="mt-6 space-y-3 lg:mt-3 lg:space-y-1.5">
              {current.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm font-semibold text-white/72 sm:text-base lg:text-sm"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full border border-white/50" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Scope meter: how far the package goes */}
            <div className="mt-7 flex items-center gap-4 lg:mt-4">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/40">
                Scope
              </p>
              <div className="grid flex-1 grid-cols-3 gap-2" aria-hidden="true">
                {services.map((service, index) => (
                  <span
                    key={service.name}
                    className={`h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                      index <= active ? "bg-bone" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-7 inline-flex items-center gap-2 lg:mt-4 text-sm font-bold text-white transition hover:translate-x-1"
            >
              Start with {current.name} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}