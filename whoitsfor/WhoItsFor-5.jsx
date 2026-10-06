import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

const pad = (n) => String(n + 1).padStart(2, "0");

// One ticket-style strip with perforated dividers: three short stubs, one per
// audience. Side by side on desktop, stacked on mobile.
export default function WhoItsFor() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} />

        <ul className="relative mt-12 grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-premium sm:mt-14 lg:grid-cols-3">
          {services.map((service, index) => {
            const isFeatured = Boolean(service.featured);

            return (
              <li
                key={service.name}
                className={`group relative flex flex-col justify-between gap-8 p-7 sm:p-8 ${
                  index > 0
                    ? `border-t border-dashed lg:border-l lg:border-t-0 ${
                        isFeatured ? "border-black/25" : "border-white/20"
                      }`
                    : ""
                } ${isFeatured ? "bg-bone text-ink" : "text-bone"}`}
              >
                {/* Perforation notches on the divider */}
                {index > 0 && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-white/10 bg-ink"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-white/10 bg-ink lg:-bottom-3 lg:-left-3 lg:right-auto lg:top-auto"
                    />
                  </>
                )}

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-xs font-black tabular-nums tracking-[0.1em] ${
                        isFeatured ? "text-black/45" : "text-white/35"
                      }`}
                    >
                      {pad(index)}
                    </span>
                    {isFeatured && (
                      <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.08em] text-bone">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="mt-6 text-3xl font-black tracking-tight">{service.name}</h3>
                  <p
                    className={`mt-3 text-sm leading-7 ${
                      isFeatured ? "text-black/65" : "text-white/58"
                    }`}
                  >
                    {service.audience}
                  </p>
                </div>

                <div
                  className={`flex items-center justify-between gap-4 border-t pt-5 ${
                    isFeatured ? "border-black/15" : "border-white/10"
                  }`}
                >
                  <p
                    className={`text-[0.7rem] font-black uppercase tracking-[0.22em] ${
                      isFeatured ? "text-black/45" : "text-white/42"
                    }`}
                  >
                    {service.price}
                  </p>
                  <Link
                    to="/contact"
                    aria-label={`Start with ${service.name}`}
                    className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border text-sm font-bold transition duration-300 hover:translate-x-1 ${
                      isFeatured
                        ? "border-ink bg-ink text-bone"
                        : "border-white/20 bg-white/5 text-bone hover:border-white/40"
                    }`}
                  >
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}