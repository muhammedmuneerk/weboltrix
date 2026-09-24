import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { processDetails, whatsappLink } from "../data/siteData.js";

const AUTOPLAY_MS = 4800;
const MOBILE_AUTOPLAY_MS = 6000; // a touch longer than desktop: enough to read a step
const MOBILE_RESUME_MS = 2500; // calm period after the user touches / swipes / taps

const MOBILE_STATS = [
  ["4 steps", "Idea to launch"],
  ["Mobile first", "Built for phones"],
  ["Handover", "Ready for edits"],
];

export default function ProcessHero({
  eyebrow = "Process",
  title = "How we turn a local business into a premium website.",
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
      () => setActive((current) => (current + 1) % processDetails.length),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const total = processDetails.length;

  // ---- Mobile / tablet carousel (independent of the desktop timeline) ----
  const [mStep, setMStep] = useState(0);
  const [holding, setHolding] = useState(false); // finger / pointer is down (tap, hold, drag)
  const [cooling, setCooling] = useState(false); // user just interacted, wait before resuming
  const [inView, setInView] = useState(false); // carousel is actually on screen
  const [tabHidden, setTabHidden] = useState(false);
  const [keyFocus, setKeyFocus] = useState(false); // keyboard focus inside the carousel
  const [userPaused, setUserPaused] = useState(false); // explicit pause button

  const trackRef = useRef(null);
  const rafRef = useRef(0);
  const programmaticRef = useRef(false);
  const progTimerRef = useRef(0);
  const coolTimerRef = useRef(0);

  const mobilePaused =
    reduceMotion || userPaused || holding || cooling || !inView || tabHidden || keyFocus;

  const padOf = (track) => parseFloat(window.getComputedStyle(track).paddingLeft) || 0;

  const startCooldown = useCallback(() => {
    setCooling(true);
    window.clearTimeout(coolTimerRef.current);
    coolTimerRef.current = window.setTimeout(() => setCooling(false), MOBILE_RESUME_MS);
  }, []);

  // Work out which card is currently snapped into view.
  const syncIndex = () => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 2) {
      setMStep(cards.length - 1);
      return;
    }
    const pad = padOf(track);
    let best = Infinity;
    let index = 0;
    cards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - pad - track.scrollLeft);
      if (distance < best) {
        best = distance;
        index = i;
      }
    });
    setMStep(index);
  };

  const handleTrackScroll = () => {
    // Our own smooth scroll (auto-advance / node tap): ignore until it settles.
    if (programmaticRef.current) {
      window.clearTimeout(progTimerRef.current);
      progTimerRef.current = window.setTimeout(() => {
        programmaticRef.current = false;
        syncIndex();
      }, 150);
      return;
    }
    // The user is swiping (or momentum is still running): stay calm.
    startCooldown();
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      syncIndex();
    });
  };

  const goToStep = (index, fromUser = false) => {
    const track = trackRef.current;
    const card = track?.children[index];
    setMStep(index);
    if (fromUser) startCooldown();
    if (!track || !card) return;
    programmaticRef.current = true;
    window.clearTimeout(progTimerRef.current);
    progTimerRef.current = window.setTimeout(() => {
      programmaticRef.current = false;
    }, 800);
    track.scrollTo({
      left: card.offsetLeft - padOf(track),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  // The progress bar's animation *is* the timer: when it ends, go to the next step.
  // Pausing the animation therefore pauses the timer, and it resumes where it stopped.
  const advance = () => goToStep((mStep + 1) % total);

  // While a finger / pointer is down, hold. After release, wait before resuming.
  useEffect(() => {
    if (!holding) return undefined;
    const release = () => {
      setHolding(false);
      startCooldown();
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [holding, startCooldown]);

  // Only run while the carousel is on screen (also true "off" on desktop, where it is hidden).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Don't advance in a background tab.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(coolTimerRef.current);
      window.clearTimeout(progTimerRef.current);
      window.cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const copy = children ?? (
    <p>
      A focused build rhythm: clarity first, design second, conversion always. Every step
      is shaped to get your website launched cleanly and ready for real customer action.
    </p>
  );

  return (
    // On desktop the hero fills the screen height and centres its content,
    // so it fits short laptop viewports as well as tall monitors.
    <section className="hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="fine-grid absolute inset-0 -z-10" />

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium pb-14 pt-28 sm:pt-32 lg:hidden">
        <style>{`@keyframes process-bar-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

        {eyebrow && <p className="hero-kicker eyebrow">{eyebrow}</p>}

        <h1
          className="hero-title mt-4 max-w-2xl font-black leading-[1] tracking-tight text-balance"
          style={{ fontSize: "clamp(2.25rem, 10vw, 3.75rem)" }}
        >
          {title}
        </h1>

        <div className="hero-copy mt-5 max-w-xl text-base leading-7 text-white/62">{copy}</div>

        <div className="mt-7 grid gap-3 sm:max-w-md sm:grid-cols-2">
          <Link to="/contact" className="premium-button-light w-full">
            Start your project
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button-dark w-full"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Reassurance row: right under the buttons, before the detail */}
        <dl className="mt-6 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:max-w-md">
          {MOBILE_STATS.map(([term, detail]) => (
            <div key={term} className="px-2 py-3.5 text-center">
              <dt className="text-sm font-black tracking-tight text-bone">{term}</dt>
              <dd className="mt-1 text-[0.7rem] leading-4 text-white/50">{detail}</dd>
            </div>
          ))}
        </dl>

        {/* Build rhythm header + pause control */}
        <div className="mt-12 flex items-center justify-between gap-3">
          <p className="eyebrow">Build rhythm</p>
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              Step {mStep + 1} of {total}
            </p>
            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-pressed={userPaused}
                aria-label={userPaused ? "Resume automatic steps" : "Pause automatic steps"}
                className="-my-2 -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition active:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
              >
                {userPaused ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <rect x="5" y="4" width="4.5" height="16" rx="1.2" />
                    <rect x="14.5" y="4" width="4.5" height="16" rx="1.2" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Touch zone: any press / hold / swipe here pauses the auto-advance */}
        <div
          onPointerDown={() => {
            programmaticRef.current = false;
            setHolding(true);
          }}
          onFocus={(event) => {
            if (event.target.matches?.(":focus-visible")) setKeyFocus(true);
          }}
          onBlur={() => setKeyFocus(false)}
        >
          {/* Stepper rail */}
          <ol className="relative mt-5 grid grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-[1.125rem] h-px bg-white/12"
            >
              <span
                className="absolute inset-0 origin-left bg-bone/70 transition-transform duration-500"
                style={{ transform: `scaleX(${mStep / (total - 1)})` }}
              />
            </span>

            {processDetails.map((step, index) => {
              const isActive = index === mStep;
              const isDone = index < mStep;
              return (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => goToStep(index, true)}
                    aria-current={isActive ? "step" : undefined}
                    className="flex w-full flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
                  >
                    <span
                      className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-black transition duration-500 ${
                        isActive
                          ? "border-bone bg-bone text-ink shadow-glow"
                          : isDone
                            ? "border-white/40 bg-ink text-bone"
                            : "border-white/15 bg-ink text-white/45"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors duration-500 ${
                        isActive ? "text-bone" : "text-white/45"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Swipeable step cards */}
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            role="region"
            aria-roledescription="carousel"
            aria-label="Process steps"
            className="relative -mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-1 sm:-mx-6 sm:scroll-pl-6 sm:px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {processDetails.map((step, index) => {
              const isActive = index === mStep;
              return (
                <article
                  key={step.title}
                  aria-label={`Step ${index + 1} of ${total}`}
                  className={`glass relative shrink-0 basis-[86%] select-none snap-start overflow-hidden rounded-[1.6rem] p-6 [-webkit-touch-callout:none] sm:basis-[48%] ${
                    reduceMotion ? "" : "pb-10"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-1 -top-3 select-none text-[6.5rem] font-black leading-none tracking-tighter text-white/[0.06]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/40">
                    {step.eyebrow}
                  </p>
                  <h2 className="mt-10 text-3xl font-black tracking-tight text-bone">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">{step.text}</p>

                  {/* Countdown to the next step. Its animation drives the auto-advance. */}
                  {isActive && !reduceMotion && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-6 bottom-4 h-0.5 overflow-hidden rounded-full bg-white/10"
                    >
                      <span
                        className="block h-full w-full origin-left rounded-full bg-bone/70"
                        style={{
                          animation: `process-bar-fill ${MOBILE_AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: mobilePaused ? "paused" : "running",
                        }}
                        onAnimationEnd={advance}
                      />
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container-premium hidden w-full gap-12 lg:grid pb-16 pt-32 sm:pt-36 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12 lg:pb-8 lg:pt-24 xl:gap-16">
        {/* Left: message + actions */}
        <div className="min-w-0">
          {eyebrow && <p className="hero-kicker eyebrow">{eyebrow}</p>}

          {/* Fluid size: limited by both viewport width AND height */}
          <h1
            className="hero-title mt-4 max-w-3xl font-black leading-[0.98] tracking-tight text-balance"
            style={{ fontSize: "clamp(2.25rem, min(6vw, 9vh), 4.75rem)" }}
          >
            {title}
          </h1>

          <div className="hero-copy mt-5 max-w-xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8 lg:text-base">
            {copy}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-6">
            <Link to="/contact" className="premium-button-light">
              Start your project
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

          {/* Compact strip: always visible, hidden only on extremely short windows */}
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-5 sm:gap-6 lg:mt-6 lg:pt-4 [@media(max-height:500px)]:hidden">
            {[
              ["4 steps", "Idea to launch"],
              ["Mobile first", "Built for phones"],
              ["Handover", "Ready for edits"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-sm font-black tracking-tight text-bone sm:text-base">{term}</dt>
                <dd className="mt-0.5 text-xs leading-5 text-white/50">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: interactive build-rhythm timeline (top-aligned so it never jumps) */}
        <div
          className="glass min-w-0 rounded-[1.75rem] p-5 sm:p-7 lg:mt-2 xl:p-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Build rhythm</p>
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              Step {active + 1} of {total}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
            {processDetails.map((step, index) => (
              <span
                key={step.title}
                className={`h-1 rounded-full transition-colors duration-500 ${
                  index <= active ? "bg-bone" : "bg-white/12"
                }`}
              />
            ))}
          </div>

          <ol className="mt-6">
            {processDetails.map((step, index) => {
              const isActive = index === active;
              const isDone = index < active;
              const isLast = index === total - 1;

              return (
                <li key={step.title} className={`relative ${isLast ? "" : "pb-5"}`}>
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-5 top-10 w-px bg-white/12"
                    >
                      <span
                        className={`absolute inset-0 origin-top bg-bone/70 transition-transform duration-700 ${
                          isDone ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-expanded={isActive}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-4 rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-black transition duration-500 ${
                        isActive
                          ? "border-bone bg-bone text-ink shadow-glow"
                          : isDone
                            ? "border-white/40 bg-white/10 text-bone"
                            : "border-white/15 bg-white/[0.04] text-white/45"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="block min-w-0 pt-1.5">
                      <span
                        className={`block text-xl font-black leading-none tracking-tight transition-colors duration-500 sm:text-2xl ${
                          isActive ? "text-bone" : "text-white/55"
                        }`}
                      >
                        {step.title}
                      </span>

                      <span
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-3 block text-[0.7rem] font-black uppercase tracking-[0.22em] text-white/40">
                            {step.eyebrow}
                          </span>
                          <span className="mt-2 block text-sm leading-6 text-white/60">
                            {step.text}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}