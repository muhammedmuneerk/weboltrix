import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return undefined;

    let frame = 0;

    const moveGlow = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        glow.style.setProperty("--cursor-x", `${event.clientX}px`);
        glow.style.setProperty("--cursor-y", `${event.clientY}px`);
      });
    };

    const setActive = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      glow.classList.toggle(
        "is-active",
        Boolean(
          target.closest(
            "a, button, input, textarea, .card-hover, .project-card-hover, .interactive-card, [data-cursor-glow]"
          )
        )
      );
    };

    window.addEventListener("pointermove", moveGlow, { passive: true });
    window.addEventListener("pointerover", setActive, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", moveGlow);
      window.removeEventListener("pointerover", setActive);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
