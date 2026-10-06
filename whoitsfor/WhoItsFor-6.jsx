import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

// Beveled "price tag" shape: clipped top corners, rounded bottom
const TAG_SHAPE =
  "[clip-path:polygon(14%_0,86%_0,100%_7%,100%_100%,0_100%,0_7%)] rounded-b-[1.75rem]";

// Three package tags hanging from a rail. Hover or focus one and it swings
// gently on its string. On mobile each tag hangs from its own peg.
export default function WhoItsFor() {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} />

        <ul className="relative mt-16 grid gap-14 sm:mt-20 lg:grid-cols-3 lg:gap-8">
          {/* Rail the tags hang from (desktop) */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 hidden h-px bg-white/25 lg:block"
          />

          {services.map((service, index) => {
            const isFeatured = Boolean(service.featured);
            const swing =
              index % 2 === 0
                ? "hover:-rotate-[1.5deg] focus-within:-rotate-[1.5deg]"
                : "hover:rotate-[1.5deg] focus-within:rotate-[1.5deg]";

            return (
              <li key={service.name} className="relative flex justify-center">
                {/* Peg */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
                />

                {/* Swinging unit: string + tag, pivoting from the peg */}
                <div
                  className={`origin-top w-full max-w-sm transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none motion-reduce:hover:rotate-0 ${swing}`}
                >
                  {/* String */}
                  <span
                    aria-hidden="true"
                    className="relative z-10 mx-auto block h-16 w-px bg-white/35"
                  />

                  <div
                    className={`relative -mt-6 px-7 pb-8 pt-14 ${TAG_SHAPE} ${
                      isFeatured ? "bg-bone text-ink" : "bg-white/[0.08] text-bone"
                    }`}
                  >
                    {/* Punched hole */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full ${
                        isFeatured ? "bg-ink" : "bg-ink ring-1 ring-white/25"
                      }`}
                    />

                    <div className="flex items-center justify-between gap-3">
                      <p
                        className={`text-xs font-black uppercase tracking-[0.25em] ${
                          isFeatured ? "text-black/45" : "text-white/42"
                        }`}
                      >
                        {service.price}
                      </p>
                      {isFeatured && (
                        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[0.6rem] font-black uppercase tracking-[0.08em] text-bone">
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-4xl font-black tracking-tight">{service.name}</h3>
                    <p
                      className={`mt-3 text-sm leading-7 ${
                        isFeatured ? "text-black/65" : "text-white/58"
                      }`}
                    >
                      {service.audience}
                    </p>

                    <ul
                      className={`mt-6 space-y-2.5 border-t pt-5 ${
                        isFeatured ? "border-black/15" : "border-white/12"
                      }`}
                    >
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className={`flex items-center gap-3 text-sm font-semibold ${
                            isFeatured ? "text-black/72" : "text-white/72"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full border ${
                              isFeatured ? "border-black/50" : "border-white/50"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className={`mt-7 inline-flex items-center gap-2 text-sm font-bold transition hover:translate-x-1 ${
                        isFeatured ? "text-ink" : "text-white"
                      }`}
                    >
                      Start with {service.name} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}