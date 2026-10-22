import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading.jsx";

gsap.registerPlugin(ScrollTrigger);

// Copy — word for word what the Story section already said.
const EYEBROW = "Story";
const TITLE = "We believe small businesses should not look small online.";
const LEAD =
  "Weboltrix was built for owners who care about quality but need a website that is practical, fast, and easy for customers to act on.";
const INTRO = "We combine high-end visual taste with the direct needs of local business:";
const POINTS = [
  "clear offers",
  "mobile-first layouts",
  "WhatsApp contact paths",
  "a polished brand feeling from the first scroll",
];

const pad = (n) => String(n + 1).padStart(2, "0");

// Scroll-scrubbed reveal (GSAP ScrollTrigger):
//  - the headline fills in word by word as it passes through the screen
//  - the four pillars switch on left to right: a line draws across the top of each,
//    its numeral fills in, and its phrase comes up to full strength
// Scrolling back up plays it in reverse. The markup is written in its finished state, so
// reduced-motion (or no JS) shows everything at full strength.
function useStoryMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray("[data-story-word]");
      const cols = gsap.utils.toArray("[data-story-col]");
      const strip = root.querySelector("[data-story-strip]");

      if (words.length) {
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            duration: 0.4,
            stagger: 0.1,
            scrollTrigger: {
              trigger: "[data-story-title]",
              start: "top 82%",
              end: "bottom 50%",
              scrub: 0.6,
            },
          }
        );
      }

      if (strip && cols.length) {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: strip,
            start: "top 88%",
            end: "bottom 58%",
            scrub: 0.6,
          },
        });

        cols.forEach((col, index) => {
          const at = index * 0.55;
          const fill = col.querySelector("[data-story-fill]");
          const numeral = col.querySelector("[data-story-numeral]");
          const text = col.querySelector("[data-story-text]");

          if (fill) {
            timeline.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, at);
          }
          if (numeral) {
            timeline.fromTo(
              numeral,
              { color: "rgba(245,243,239,0)" },
              { color: "rgba(245,243,239,1)", duration: 0.8 },
              at
            );
          }
          if (text) {
            timeline.fromTo(text, { opacity: 0.2, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, at);
          }
        });
      }
    }, root);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [rootRef]);
}

export default function AboutStory() {
  const rootRef = useRef(null);
  useStoryMotion(rootRef);

  const words = TITLE.split(" ");

  return (
    <section ref={rootRef} className="section-padding">
      <div className="container-premium">
        {/* Headline: the shared SectionHeading, with the words split out for the reveal */}
        <div data-story-title>
          <SectionHeading
            eyebrow={EYEBROW}
            className="!max-w-5xl"
            title={words.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span data-story-word>{word}</span>
                {index < words.length - 1 ? " " : ""}
              </span>
            ))}
          />
        </div>

        {/* Lead and intro share one line, so nothing is left hanging on either side */}
        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
          <p className="max-w-lg border-l-2 border-bone pl-6 text-lg leading-9 text-white/62 sm:text-xl sm:leading-10">
            {LEAD}
          </p>
          <p className="max-w-xl text-lg leading-9 text-white/62 sm:text-xl sm:leading-10 lg:justify-self-end">
            {INTRO}
          </p>
        </div>

        {/* The four pillars, side by side on desktop */}
        <ol
          data-story-strip
          className="mt-12 grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {POINTS.map((point, index) => (
            <li
              key={point}
              data-story-col
              className={`relative flex items-center gap-6 py-7 sm:flex-col sm:items-start sm:justify-between sm:gap-14 sm:py-9 lg:min-h-[19rem] lg:px-7 lg:py-9 ${
                index % 2 === 1 ? "sm:pl-8" : ""
              } ${index === 0 ? "lg:pl-0" : "lg:border-l lg:border-white/10"} lg:pr-7`}
            >
              {/* Line that draws across the top of the pillar */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-white/12 lg:left-0"
              >
                <span data-story-fill className="absolute inset-0 origin-left bg-bone" />
              </span>

              <span
                aria-hidden="true"
                data-story-numeral
                className="select-none text-6xl font-black leading-none tracking-tighter text-bone sm:text-7xl lg:text-8xl"
                style={{ WebkitTextStroke: "1.5px rgba(245,243,239,0.5)" }}
              >
                {pad(index)}
              </span>

              <span
                data-story-text
                className="block min-w-0 text-2xl font-black leading-[1.08] tracking-tight text-bone first-letter:uppercase sm:text-3xl lg:text-[1.9rem]"
              >
                {point}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}