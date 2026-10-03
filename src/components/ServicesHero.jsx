import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { services, whatsappLink } from "../data/siteData.js";

const AUTOPLAY_MS = 5200;
const MOBILE_AUTOPLAY_MS = 6000; // a touch longer than desktop: enough to read a package
const MOBILE_RESUME_MS = 2500; // calm period after the user touches / swipes / taps

export default function ServicesHero({
  eyebrow = "Services",
  title = "Packages built around trust, speed, and real enquiries.",
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

  // ---- Mobile / tablet carousel (independent of the desktop timer) ----
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

  // The progress bar's animation *is* the timer: when it ends, go to the next card.
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

  // Only run while the carousel is on screen.
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
      Premium website packages for businesses that need more than a basic online brochure. Pick
      a level, see what it includes, and start from there.
    </p>
  );

  return (
    <section className="hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <div className="fine-grid absolute inset-0 -z-10" />

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium pb-14 pt-28 sm:pt-32 lg:hidden">
        <style>{`@keyframes services-bar-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>

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
            Get Your Website
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

        {/* Reassurance row: right under the buttons, before the packages */}
        <dl className="mt-6 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:max-w-md">
          {[
            ["3 levels", "Starter to premium"],
            ["No lock-in", "Clear pricing"],
            ["Add-ons", "Grows with you"],
          ].map(([term, detail]) => (
            <div key={term} className="px-2 py-3.5 text-center">
              <dt className="text-sm font-black tracking-tight text-bone">{term}</dt>
              <dd className="mt-1 text-[0.7rem] leading-4 text-white/50">{detail}</dd>
            </div>
          ))}
        </dl>

        {/* "Pick a level" header + pause control */}
        <div className="mt-12 flex items-center justify-between gap-3">
          <p className="eyebrow">Pick a level</p>
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-white/50" aria-live="polite">
              {mStep + 1} of {total}
            </p>
            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setUserPaused((value) => !value)}
                aria-pressed={userPaused}
                aria-label={userPaused ? "Resume automatic switching" : "Pause automatic switching"}
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
          <ol className="relative mt-5 grid grid-cols-3">
            <span
              aria-hidden="true"
              className="absolute left-[16.6%] right-[16.6%] top-[1.125rem] h-px bg-white/12"
            >
              <span
                className="absolute inset-0 origin-left bg-bone/70 transition-transform duration-500"
                style={{ transform: `scaleX(${mStep / (total - 1)})` }}
              />
            </span>

            {services.map((service, index) => {
              const isActive = index === mStep;
              const isDone = index < mStep;
              return (
                <li key={service.name}>
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
                      className={`flex items-center gap-1 text-xs font-bold transition-colors duration-500 ${
                        isActive ? "text-bone" : "text-white/45"
                      }`}
                    >
                      {service.name}
                      {service.featured && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-bone"
                          title="Most popular"
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Swipeable package cards */}
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            role="region"
            aria-roledescription="carousel"
            aria-label="Website packages"
            className="relative -mx-5 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-5 px-5 pb-1 sm:-mx-6 sm:scroll-pl-6 sm:px-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {services.map((service, index) => {
              const isActive = index === mStep;
              return (
                <article
                  key={service.name}
                  aria-label={`Package ${index + 1} of ${total}: ${service.name}`}
                  className={`glass relative shrink-0 basis-[86%] select-none snap-start overflow-hidden rounded-[1.6rem] p-6 [-webkit-touch-callout:none] sm:basis-[60%] ${
                    reduceMotion ? "" : "pb-10"
                  }`}
                >
                  {service.featured && (
                    <span className="absolute right-5 top-6 rounded-full bg-bone px-3 py-1 text-[0.6rem] font-black uppercase tracking-[0.08em] text-ink">
                      Popular
                    </span>
                  )}

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
                    {service.price}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-bone">
                    {service.name}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/58">{service.audience}</p>

                  <ul className="mt-5 space-y-3">
                    {service.features.map((feature) => (
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

                  <Link to="/contact" className="premium-button-light mt-6 w-full">
                    Start with {service.name}
                  </Link>

                  {/* Countdown to the next card. Its animation drives the auto-advance. */}
                  {isActive && !reduceMotion && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-6 bottom-4 h-0.5 overflow-hidden rounded-full bg-white/10"
                    >
                      <span
                        className="block h-full w-full origin-left rounded-full bg-bone/70"
                        style={{
                          animation: `services-bar-fill ${MOBILE_AUTOPLAY_MS}ms linear forwards`,
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

      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden w-full gap-12 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12 lg:pb-8 lg:pt-24 xl:gap-16">
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
            {copy}
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