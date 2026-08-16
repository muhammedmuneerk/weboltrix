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