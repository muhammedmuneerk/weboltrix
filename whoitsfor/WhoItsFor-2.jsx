import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

// Bento layout: the featured package becomes one tall tile on the left,
// the other packages stack beside it. On mobile everything stacks in order.
export default function WhoItsFor() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} />

        <div className="stagger-grid mt-14 grid gap-5 sm:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          {services.map((service, index) => {
            const f = Boolean(service.featured);

            return (
              <article
                key={service.name}
                className={`group relative flex min-h-[22rem] flex-col justify-between gap-10 overflow-hidden rounded-[2rem] border p-7 transition duration-500 hover:-translate-y-2 motion-reduce:transition-none sm:p-9 ${
                  f
                    ? "border-bone bg-bone text-ink shadow-glow lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[40rem] lg:p-12"
                    : "glass lg:col-start-2"
                }`}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: f ? "1px rgba(5,5,5,0.12)" : "1px rgba(255,255,255,0.07)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Top: package label + audience as the headline */}
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`text-xs font-black uppercase tracking-[0.25em] ${
                        f ? "text-black/45" : "text-white/42"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")} / {service.name}
                    </p>
                    {f && (
                      <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.08em] text-bone">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3
                    className={`mt-8 font-black tracking-tight text-balance ${
                      f
                        ? "text-3xl leading-[1.05] sm:text-4xl lg:text-5xl"
                        : "text-2xl leading-snug sm:text-3xl"
                    }`}
                  >
                    {service.audience}
                  </h3>
                </div>

                {/* Bottom: what they get + action */}
                <div className="relative">
                  <p
                    className={`text-xs font-black uppercase tracking-[0.25em] ${
                      f ? "text-black/45" : "text-white/42"
                    }`}
                  >
                    {service.price}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] ${
                          f
                            ? "border-black/10 bg-black/[0.05] text-black/60"
                            : "border-white/10 bg-white/[0.055] text-white/52"
                        }`}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-bold transition hover:translate-x-1 ${
                      f ? "text-ink" : "text-white"
                    }`}
                  >
                    Start with {service.name} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}