import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services } from "../data/siteData.js";

const EYEBROW = "Who it's for";
const TITLE = "Made for local brands with ambition.";

const PEEK_REM = 3.5; // how much of each card behind the front one stays visible
const CARD_H = "h-[22rem]";

const pad = (n) => String(n + 1).padStart(2, "0");

// A deck of cards: each package is one card, and the audience it is built for
// is the statement on it. Click the front card (or use the arrows) to bring
// the next one forward; click a card peeking out behind to jump to it.
export default function WhoItsFor() {
  const total = services.length;
  const [active, setActive] = useState(0);

  const next = () => setActive((current) => (current + 1) % total);
  const prev = () => setActive((current) => (current - 1 + total) % total);

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-premium grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-16 lg:gap-y-10 xl:gap-x-24">
        {/* Heading */}
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <SectionHeading eyebrow={EYEBROW} title={TITLE} />
        </div>

        {/* Deck */}
        <div className="relative mx-auto h-[29rem] w-full max-w-2xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:ml-auto lg:self-center">
          {services.map((service, index) => {
            const pos = (index - active + total) % total;
            const isFront = pos === 0;
            const depth = Math.min(pos, 2);

            return (
              <article
                key={service.name}
                onClick={() => setActive(isFront ? (index + 1) % total : index)}
                style={{
                  transform: `translateY(-${depth * PEEK_REM}rem) scale(${1 - depth * 0.05})`,
                  zIndex: total - pos,
                }}
                className={`absolute inset-x-0 top-[7rem] ${CARD_H} origin-top cursor-pointer overflow-hidden rounded-[2rem] border transition-[transform,background-color,border-color,box-shadow,opacity] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                  isFront
                    ? "border-bone bg-bone text-ink shadow-glow"
                    : "border-white/15 bg-[#141414] text-bone hover:border-white/30"
                } ${pos > 2 ? "pointer-events-none opacity-0" : ""}`}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: isFront
                      ? "1px rgba(5,5,5,0.12)"
                      : "1px rgba(255,255,255,0.07)",
                  }}
                >
                  {pad(index)}
                </span>

                <div className="relative flex h-full flex-col p-7 pt-4 sm:p-9 sm:pt-5">
                  {/* Strip: stays visible when the card sits behind */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-2xl font-black tracking-tight">{service.name}</h3>
                    <span
                      className={`text-xs font-black tabular-nums tracking-[0.1em] ${
                        isFront ? "text-black/45" : "text-white/35"
                      }`}
                    >
                      {pad(index)}
                    </span>
                  </div>

                  <p
                    className={`mt-auto text-2xl font-black leading-[1.12] tracking-tight text-balance sm:text-3xl ${
                      isFront ? "text-ink" : "text-white/70"
                    }`}
                  >
                    {service.audience}
                  </p>

                  <p
                    aria-hidden="true"
                    className={`mt-7 text-xs font-black uppercase tracking-[0.25em] ${
                      isFront ? "text-black/45" : "text-white/30"
                    }`}
                  >
                    {isFront ? "Next \u2192" : "Bring forward"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous audience"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-bone transition hover:-translate-x-0.5 hover:border-white/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next audience"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-bone bg-bone text-ink shadow-glow transition hover:translate-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              {active + 1} of {total}
            </p>
            <div className="flex gap-2" aria-hidden="true">
              {services.map((service, index) => (
                <span
                  key={service.name}
                  className={`h-1 w-8 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                    index === active ? "bg-bone" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}