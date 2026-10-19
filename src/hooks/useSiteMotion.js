import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.86,
      touchMultiplier: 1.25,
    });

    const tick = (time) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

export function usePageMotion(pathname, hash = "") {
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
}

export function useWhyChooseMotion(sectionRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    const mm = gsap.matchMedia();
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    // Shared timeline builder — only the pin-end runway and the
    // starting card size differ between mobile and desktop.
    const buildTimeline = (isMobile) => () => {
      const viewport = section.querySelector("[data-why-viewport]");
      const track = section.querySelector("[data-why-track]");
      const progress = section.querySelector("[data-why-progress]");
      const cards = gsap.utils.toArray(section.querySelectorAll(".why-scroll-card"));
      if (!viewport || !track || !progress || !cards.length) return undefined;

      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (getDistance() <= 0) return undefined;

      // Native overflow-x-auto + scroll-snap is the no-JS/reduced-motion
      // fallback (see the JSX). Once GSAP takes over it drives the track
      // itself, so hand scroll control over to it here and restore it on
      // cleanup (breakpoint crossing, unmount).
      const prevOverflow = viewport.style.overflowX;
      const prevSnap = viewport.style.scrollSnapType;
      viewport.style.overflowX = "hidden";
      viewport.style.scrollSnapType = "none";
      viewport.scrollLeft = 0;

      gsap.set(progress, { scaleX: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: viewport,
          start: "center 67%",
          end: () => `+=${getDistance() + window.innerHeight * (isMobile ? 0.85 : 0.55)}`,
          scrub: 0.85,
          pin: section,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(track, { x: () => -getDistance(), ease: "none" }, 0)
        .to(progress, { scaleX: 1, ease: "none" }, 0)
        .fromTo(
          cards,
          {
            y: (index) => (index % 2 === 0 ? 18 : -10),
            rotateZ: (index) => (index % 2 === 0 ? -0.7 : 0.7),
          },
          {
            y: (index) => (index % 2 === 0 ? -12 : 16),
            rotateZ: (index) => (index % 2 === 0 ? 0.6 : -0.6),
            ease: "none",
          },
          0
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        viewport.style.overflowX = prevOverflow;
        viewport.style.scrollSnapType = prevSnap;
      };
    };

    const ctx = gsap.context(() => {
      mm.add("(max-width: 767px)", buildTimeline(true));
      mm.add("(min-width: 768px)", buildTimeline(false));
    }, section);

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      mm.revert();
      ctx.revert();
    };
  }, [sectionRef]);
}

// Add-ons exploded diagram.
// Opens the stack once the diagram has scrolled well into the viewport (after a short
// pause) and closes it again as soon as it starts leaving, in either scroll direction.
// Tune these to taste:
//   OPEN_START  - diagram top reaches this line of the viewport  -> layers separate
//   CLOSE_END   - diagram bottom reaches this line of the viewport -> layers close
//   OPEN_DELAY  - ms to wait after entering before separating
//   ("top 40%" = later open; a larger "bottom" % = earlier close when scrolling down)
const ADDONS_OPEN_START = "top 40%";
const ADDONS_CLOSE_END = "bottom 62%";
const ADDONS_OPEN_DELAY = 500;

export function useAddOnsMotion(targetRef, { onOpen, onClose }) {
  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) return undefined;

    let openTimer;

    const trigger = ScrollTrigger.create({
      trigger: target,
      start: ADDONS_OPEN_START,
      end: ADDONS_CLOSE_END,
      onToggle: (self) => {
        window.clearTimeout(openTimer);
        if (self.isActive) {
          openTimer = window.setTimeout(onOpen, ADDONS_OPEN_DELAY);
        } else {
          onClose();
        }
      },
    });

    return () => {
      window.clearTimeout(openTimer);
      trigger.kill();
    };
  }, [targetRef, onOpen, onClose]);
}

// Add-ons — mobile "layer sheets" (below lg).
// The stage pins to the screen while you scroll through it. Each add-on is a sheet that
// rises from the bottom and lays itself over the one before, leaving that sheet's title
// strip peeking out above — the website, then hosting on top of it, then maintenance on
// top of that. A three-part meter above the stage fills as each layer arrives.
// Scrolling back up lifts the sheets off again. The markup is written in its finished
// (fully stacked) state, so reduced-motion still shows everything.
// Tune these to taste:
//   ADDONS_STAGE_TOP     - where the stage pins (below the fixed navbar)
//   ADDONS_SCROLL_RUNWAY - scroll distance used, as a multiple of the screen height
const ADDONS_SHEETS_TOP = "top 100px";
const ADDONS_SHEETS_RUNWAY = 1.4;

export function useAddOnsMobileMotion(stageRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const root = stageRef.current;
    if (!root) return undefined;

    const mm = gsap.matchMedia();
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    mm.add("(max-width: 1023px)", () => {
      const stage = root.querySelector("[data-sheet-stage]");
      const sheets = gsap.utils.toArray(root.querySelectorAll("[data-sheet]"));
      const shades = gsap.utils.toArray(root.querySelectorAll("[data-sheet-shade]"));
      const bars = gsap.utils.toArray(root.querySelectorAll("[data-meter-bar]"));
      const labels = gsap.utils.toArray(root.querySelectorAll("[data-meter-label]"));
      if (!stage || sheets.length < 2) return undefined;

      const total = sheets.length;
      const labelLit = { color: "rgba(245,243,239,1)" };
      const labelDim = { color: "rgba(245,243,239,0.35)" };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: ADDONS_SHEETS_TOP,
          end: () => `+=${window.innerHeight * ADDONS_SHEETS_RUNWAY}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Sheets are laid out stacked (their final spot), so tween *from* below the stage.
      for (let i = 1; i < total; i += 1) {
        const at = i - 1;

        timeline.fromTo(
          sheets[i],
          { y: () => stage.offsetHeight },
          { y: 0, duration: 1 },
          at
        );

        // The sheet being covered dims, so the new one reads as the top layer
        if (shades[i - 1]) {
          timeline.fromTo(shades[i - 1], { opacity: 0 }, { opacity: 0.5, duration: 1 }, at);
        }

        // Meter: this layer's bar fills, its label lights, the previous one dims
        if (bars[i]) timeline.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 1 }, at);
        if (labels[i]) {
          timeline.fromTo(labels[i], labelDim, { ...labelLit, duration: 0.4 }, at + 0.6);
        }
        if (labels[i - 1]) timeline.to(labels[i - 1], { ...labelDim, duration: 0.4 }, at + 0.6);
      }

      // Hold the finished stack for a beat before the pin releases
      timeline.to({}, { duration: 0.4 }, total - 1);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      mm.revert();
    };
  }, [stageRef]);
}