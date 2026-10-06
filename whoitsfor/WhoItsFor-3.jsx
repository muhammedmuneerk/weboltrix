import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

// Scroll-spy layout: as you scroll through the audience statements on the
// right, the sticky "match" card on the left switches to the package built
// for that audience. On mobile each statement carries its own package card.
export default function WhoItsFor() {
  const total = services.length;
  const [active, setActive] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = itemRefs.current.indexOf(entry.target);
          if (index !== -1) setActive(index);
        });
      },
      // Only the band across the middle of the screen counts as "current"
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = services[active];

  return (
    <section className="section-padding">
      <div className="container-premium grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">
        {/* ───────── Left: heading + sticky match card (desktop) ───────── */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={EYEBROW} title={TITLE} />

          <div
            key={current.name}
            className="glass mt-10 hidden animate-fade-up rounded-[2rem] p-8 motion-reduce:animate-none lg:block"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">Your match</p>
              <p className="text-xs font-bold text-white/50" aria-live="polite">
                {active + 1} of {total}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
              {services.map((service, index) => (
                <span
                  key={service.name}
                  className={`h-1 rounded-full ${index <= active ? "bg-bone" : "bg-white/12"}`}
                />
              ))}
            </div>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.25em] text-white/42">
              {current.price}
            </p>
            <h3 className="mt-2 text-5xl font-black tracking-tight">{current.name}</h3>

            <ul className="mt-6 space-y-2.5">
              {current.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-base font-semibold text-white/72"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full border border-white/50" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:translate-x-1"
            >
              Start with {current.name} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* ───────── Right: audience statements ───────── */}
        <ol className="grid gap-5 lg:block lg:gap-0">
          {services.map((service, index) => {
            const isActive = index === active;

            return (
              <li
                key={service.name}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`border-white/10 transition-colors duration-500 motion-reduce:transition-none lg:flex lg:min-h-[26rem] lg:items-center lg:border-l lg:pl-12 ${
                  isActive ? "lg:border-l-bone" : ""
                }`}
              >
                <article className="w-full">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/38">
                    For / {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={`mt-5 text-3xl font-black leading-[1.08] tracking-tight text-balance transition-colors duration-500 motion-reduce:transition-none sm:text-4xl lg:text-5xl ${
                      isActive ? "text-bone" : "lg:text-white/30"
                    }`}
                  >
                    {service.audience}
                  </h3>

                  {/* Mobile / tablet: the matching package, right under its statement */}
                  <div className="glass mt-7 rounded-[1.6rem] p-6 lg:hidden">
                    <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/40">
                      {service.price}
                    </p>
                    <h4 className="mt-2 text-3xl font-black tracking-tight text-bone">
                      {service.name}
                    </h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white/52"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className="mt-5 inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-bold text-white transition active:translate-x-0.5"
                    >
                      Start with {service.name} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}