import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

export default function WhoItsFor() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} />

        {/* Editorial list: one row per package, audience as the headline statement */}
        <ol className="mt-14 border-t border-white/10 sm:mt-16">
          {services.map((service, index) => {
            const isFeatured = Boolean(service.featured);

            return (
              <li key={service.name} className="border-b border-white/10">
                <article
                  className={`group grid gap-6 px-1 py-8 transition-colors duration-500 motion-reduce:transition-none sm:px-4 sm:py-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)_auto] lg:items-center lg:gap-12 lg:py-12 ${
                    isFeatured ? "bg-white/[0.035]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Package */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black tabular-nums tracking-[0.1em] text-white/35">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex gap-1.5" aria-hidden="true">
                        {services.map((item, step) => (
                          <span
                            key={item.name}
                            className={`h-1 w-6 rounded-full ${
                              step <= index ? "bg-bone" : "bg-white/15"
                            }`}
                          />
                        ))}
                      </div>
                      {isFeatured && (
                        <span className="rounded-full bg-bone px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.08em] text-ink">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.25em] text-white/42">
                      {service.price}
                    </p>
                  </div>

                  {/* Audience + what they get */}
                  <div>
                    <p className="text-xl font-black leading-snug tracking-tight text-white/80 transition-colors duration-300 group-hover:text-bone motion-reduce:transition-none sm:text-2xl lg:text-[1.65rem]">
                      {service.audience}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white/52"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-white transition hover:translate-x-1 lg:justify-self-end"
                  >
                    Start with {service.name} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
