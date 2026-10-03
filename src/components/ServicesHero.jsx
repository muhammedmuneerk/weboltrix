import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { services, whatsappLink } from "../data/siteData.js";

const AUTOPLAY_MS = 5200;

export default function ServicesHero({
  eyebrow = "Services",
  title = "Premium packages built around trust, speed, and real enquiries.",
  children,
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % services.length),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const total = services.length;
  const activeService = services[active];

  return (
    <section className="hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="fine-grid absolute inset-0 -z-10" />

      <div className="container-premium grid w-full gap-12 pb-16 pt-32 sm:pt-36 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12 lg:pb-8 lg:pt-24 xl:gap-16">
        {/* Left: message + actions */}
        <div className="min-w-0">
          {eyebrow && <p className="hero-kicker eyebrow">{eyebrow}</p>}

          <h1
            className="hero-title mt-4 max-w-2xl font-black leading-[1] tracking-tight text-balance"
            style={{ fontSize: "clamp(2.25rem, min(6vw, 9vh), 4.75rem)" }}
          >
            {title}
          </h1>

          <div className="hero-copy mt-5 max-w-xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8 lg:text-base">
            {children ?? (
              <p>
                Premium website packages for businesses that need more than a basic online
                brochure. Pick a level, see what it includes, and start from there.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-6">
            <Link to="/contact" className="premium-button-light">
              Get Your Website
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button-dark"
            >
              Chat on WhatsApp
            </a>
          </div>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-5 sm:gap-6 lg:mt-6 lg:pt-4 [@media(max-height:500px)]:hidden">
            {[
              ["3 levels", "Starter to premium"],
              ["No lock-in", "Clear, upfront pricing"],
              ["Add-ons", "Grows with your brand"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-sm font-black tracking-tight text-bone sm:text-base">{term}</dt>
                <dd className="mt-0.5 text-xs leading-5 text-white/50">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: interactive tier switcher (top-aligned so it never jumps) */}
        <div
          className="glass min-w-0 rounded-[1.75rem] p-5 sm:p-7 lg:mt-2 xl:p-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Pick a level</p>
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              {active + 1} of {total}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {services.map((service, index) => {
              const isActive = index === active;
              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className={`relative rounded-full border px-3 py-2.5 text-xs font-black uppercase tracking-[0.1em] transition duration-500 ${
                    isActive
                      ? "border-bone bg-bone text-ink shadow-glow"
                      : "border-white/15 bg-white/[0.04] text-white/55 hover:border-white/30 hover:text-bone"
                  }`}
                >
                  {service.name}
                  {service.featured && (
                    <span
                      aria-hidden="true"
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-[0.08em] ${
                        isActive ? "bg-ink text-bone" : "bg-bone text-ink"
                      }`}
                    >
                      Popular
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active tier detail */}
          <div className="mt-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
              {activeService.price}
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {activeService.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/58">{activeService.audience}</p>

            <ul className="mt-6 space-y-3">
              {activeService.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-white/75">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-bone" strokeWidth="3">
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="premium-button-light mt-7 w-full"
            >
              Start with {activeService.name}
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
            {services.map((service, index) => (
              <span
                key={service.name}
                className={`h-1 rounded-full transition-colors duration-500 ${
                  index === active ? "bg-bone" : "bg-white/12"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}