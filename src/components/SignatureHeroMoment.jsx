import { useEffect, useRef } from "react";

export default function SignatureHeroMoment() {
  const momentRef = useRef(null);

  useEffect(() => {
    const element = momentRef.current;
    if (!element) return undefined;

    const updatePointer = (event) => {
      const rect = element.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }

      element.style.setProperty("--hero-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--hero-y", `${event.clientY - rect.top}px`);
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  return (
    <div ref={momentRef} className="signature-moment absolute inset-0 z-0 overflow-hidden">
      <div className="signature-spotlight" />
      <div className="signature-orbit signature-orbit-one" />
      <div className="signature-orbit signature-orbit-two" />
      <div className="signature-scanline" />
      <div className="signature-nodes">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <span key={item} />
        ))}
      </div>
    </div>
  );
}
