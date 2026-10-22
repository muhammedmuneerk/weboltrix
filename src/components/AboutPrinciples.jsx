import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Copy — word for word what the three cards already said.
const PRINCIPLES = [
  ["Mission", "Help ambitious businesses earn trust online before the first conversation."],
  [
    "Approach",
    "Design with restraint, build with speed, and keep every page focused on business action.",
  ],
  ["Mindset", "Fast, modern, premium thinking without clutter or unnecessary complexity."],
];

const pad = (n) => String(n + 1).padStart(2, "0");

// Tune the scroll feel here:
//   STAGE_TOP     - where the stage pins (below the fixed navbar)
//   SCROLL_RUNWAY - scroll distance used, as a multiple of the screen height
const STAGE_TOP = "top 110px";
const SCROLL_RUNWAY = 1.5;

const NODE_DIM = {
  backgroundColor: "#050505",
  borderColor: "rgba(255,255,255,0.2)",
  color: "rgba(255,255,255,0.5)",
  boxShadow: "0 0 0 rgba(255,255,255,0)",
};
const NODE_LIT = {
  backgroundColor: "#f5f3ef",
  borderColor: "#f5f3ef",
  color: "#050505",
  boxShadow: "0 0 70px rgba(255,255,255,0.15)",
};

// Pinned scroll story (GSAP ScrollTrigger). While the stage is pinned, the three
// principles take turns: the index lights up the current one, the statement swaps, and the
// big outlined word behind it changes. Scrolling back up plays it in reverse. The markup is
// the finished state (all lit); with reduced motion there is no pin and the three are listed.
function usePrinciplesMotion(stageRef) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray("[data-slide]");
      const ghosts = gsap.utils.toArray("[data-ghost]");
      const nodes = gsap.utils.toArray("[data-node]");
      const labels = gsap.utils.toArray("[data-label]");
      const fills = gsap.utils.toArray("[data-fill]");
      const total = slides.length;
      if (total < 2) return;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: STAGE_TOP,
          end: () => `+=${window.innerHeight * SCROLL_RUNWAY}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < total; i += 1) {
        const at = i - 1;

        // Statement + ghost word: the old one leaves upward, the new one rises in
        timeline.to(slides[i - 1], { opacity: 0, y: -32, duration: 0.4 }, at + 0.1);
        timeline.fromTo(slides[i], { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.5 }, at + 0.5);

        if (ghosts[i - 1]) timeline.to(ghosts[i - 1], { opacity: 0, y: -40, duration: 0.4 }, at + 0.1);
        if (ghosts[i]) {
          timeline.fromTo(ghosts[i], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 }, at + 0.5);
        }

        // Index: hand the spotlight over
        if (nodes[i - 1]) timeline.to(nodes[i - 1], { ...NODE_DIM, duration: 0.3 }, at + 0.2);
        if (labels[i - 1]) timeline.to(labels[i - 1], { opacity: 0.35, duration: 0.3 }, at + 0.2);
        if (nodes[i]) timeline.fromTo(nodes[i], NODE_DIM, { ...NODE_LIT, duration: 0.4 }, at + 0.5);
        if (labels[i]) timeline.fromTo(labels[i], { opacity: 0.35 }, { opacity: 1, duration: 0.4 }, at + 0.5);

        // Rail between the two nodes (desktop)
        if (fills[i - 1]) {
          timeline.fromTo(
            fills[i - 1],
            { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 0.6 },
            at + 0.2
          );
        }
      }

      // Hold the last one for a beat before the pin releases
      timeline.to({}, { duration: 0.4 }, total - 1);
    }, stage);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, [stageRef]);
}

export default function AboutPrinciples() {
  const stageRef = useRef(null);
  usePrinciplesMotion(stageRef);

  // With reduced motion there is no pin, so the three are simply listed
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  if (reduce) {
    return (
      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {PRINCIPLES.map(([label, text], index) => (
              <li key={label} className="grid gap-4 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
                <p className="eyebrow">
                  {pad(index)} · {label}
                </p>
                <p className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding border-y border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <div
          ref={stageRef}
          className="relative grid h-[min(34rem,calc(100svh-9rem))] min-h-[26rem] gap-8 overflow-hidden lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14"
        >
          {/* Index: horizontal on mobile, a rail down the left on desktop */}
          <ol className="relative z-10 grid grid-cols-3 gap-2 lg:flex lg:flex-col lg:justify-center lg:gap-0">
            {PRINCIPLES.map(([label], index) => {
              const isLast = index === PRINCIPLES.length - 1;
              return (
                <li key={label} className="relative">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-10 left-5 top-12 hidden w-px bg-white/12 lg:block"
                    >
                      <span data-fill className="absolute inset-0 origin-top bg-bone/70" />
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:gap-5 lg:pb-10 lg:text-left">
                    <span
                      aria-hidden="true"
                      data-node
                      className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-bone bg-bone text-xs font-black tabular-nums text-ink shadow-glow"
                    >
                      {pad(index)}
                    </span>
                    <span
                      data-label
                      className="text-xs font-black uppercase tracking-[0.18em] text-bone sm:text-sm lg:text-base lg:tracking-[0.22em]"
                    >
                      {label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Statement + the big outlined word behind it */}
          <div className="relative min-w-0">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid">
              {PRINCIPLES.map(([label]) => (
                <span
                  key={label}
                  data-ghost
                  className="select-none self-end justify-self-end text-[clamp(4rem,12vw,10.5rem)] font-black leading-[0.8] tracking-tighter text-transparent [grid-area:1/1]"
                  style={{ WebkitTextStroke: "1.5px rgba(245,243,239,0.14)" }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="relative grid h-full items-center">
              {PRINCIPLES.map(([label, text]) => (
                <p
                  key={label}
                  data-slide
                  className="max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-balance [grid-area:1/1] sm:text-5xl lg:text-6xl"
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}