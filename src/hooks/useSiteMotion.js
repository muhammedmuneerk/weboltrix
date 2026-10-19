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

// Add-ons — mobile pinned "exploded stack" (below lg).
// The stage pins to the screen while you scroll through it. One scrubbed timeline:
//   0 -> 1   the plates pull apart (stack opens)
//   1 -> 2   Hosting lights up and lifts out, caption + legend follow
//   2 -> 3   Hosting settles back, Maintenance lights up and lifts out
// Scrolling back up plays it in reverse. The markup is written in its finished,
// pulled-apart state, so reduced-motion still shows everything.
// Tune these to taste:
//   ADDONS_STAGE_TOP     - where the stage pins (below the fixed navbar)
//   ADDONS_SCROLL_RUNWAY - scroll distance used, as a multiple of the screen height
//   ADDONS_LIFT          - how far (px) the picked plate lifts out of the stack
const ADDONS_STAGE_TOP = "top 100px";
const ADDONS_SCROLL_RUNWAY = 1.6;
const ADDONS_LIFT = 12;

export function useAddOnsMobileMotion(stageRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const stage = stageRef.current;
    if (!stage) return undefined;

    const mm = gsap.matchMedia();
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    mm.add("(max-width: 1023px)", () => {
      const plates = gsap.utils.toArray(stage.querySelectorAll("[data-plate]"));
      const legends = gsap.utils.toArray(stage.querySelectorAll("[data-legend]"));
      const captions = gsap.utils.toArray(stage.querySelectorAll("[data-caption]"));
      if (plates.length < 2) return undefined;

      const faces = plates.map((plate) => plate.querySelector("[data-plate-face]"));
      const total = plates.length;

      const faceDim = {
        backgroundColor: "#181818",
        borderColor: "rgba(255,255,255,0.2)",
        boxShadow: "0 0 0 rgba(255,255,255,0)",
      };
      const faceLit = {
        backgroundColor: "#303030",
        borderColor: "rgba(245,243,239,0.8)",
        boxShadow: "0 0 70px rgba(255,255,255,0.15)",
      };
      const pillDim = {
        backgroundColor: "#050505",
        borderColor: "rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.6)",
      };
      const pillLit = {
        backgroundColor: "#f5f3ef",
        borderColor: "#f5f3ef",
        color: "#050505",
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: ADDONS_STAGE_TOP,
          end: () => `+=${window.innerHeight * ADDONS_SCROLL_RUNWAY}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // 0 -> 1: the stack opens. Plates are laid out pulled apart, so tween *from* closed.
      timeline.fromTo(
        plates,
        { y: (_, el) => Number(el.dataset.closedOffset || 0) },
        { y: 0, duration: 1 },
        0
      );

      // Each add-on takes a turn: lit + lifted for one beat, then settles back
      for (let i = 1; i < total; i += 1) {
        timeline.fromTo(faces[i], faceDim, { ...faceLit, duration: 0.5 }, i);
        timeline.to(plates[i], { y: -ADDONS_LIFT, duration: 0.5 }, i);
        if (legends[i]) {
          timeline.fromTo(legends[i], pillDim, { ...pillLit, duration: 0.5 }, i);
        }

        // Caption swap
        if (captions[i - 1]) {
          timeline.to(captions[i - 1], { opacity: 0, y: -12, duration: 0.4 }, i - 0.05);
        }
        if (captions[i]) {
          timeline.fromTo(captions[i], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, i + 0.1);
        }

        // Hand the spotlight to the next one (the last one stays lit)
        if (i < total - 1) {
          timeline.to(faces[i], { ...faceDim, duration: 0.5 }, i + 1);
          timeline.to(plates[i], { y: 0, duration: 0.5 }, i + 1);
          if (legends[i]) timeline.to(legends[i], { ...pillDim, duration: 0.5 }, i + 1);
        }
      }

      // Hold the finished state for a beat before the pin releases
      timeline.to({}, { duration: 0.5 }, total - 0.5);

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