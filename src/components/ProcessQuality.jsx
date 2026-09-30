import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";

const EYEBROW = "Quality checks";
const TITLE = "Launch polish is treated like part of the design.";
const TEXT =
  "Before handoff, the site is checked for mobile fit, CTA clarity, section rhythm, asset loading, and a clean first impression.";
const ITEMS = [
  "Mobile flow",
  "Animation timing",
  "Contact path",
  "Image polish",
  "Content clarity",
  "Speed basics",
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const close = (a, b, tolerance = 0.5) => Math.abs(a - b) < tolerance;

// A right-angle elbow (down, across, down) with the two corners rounded
// off by a small curve, instead of a sharp 90° turn.
const CORNER_RADIUS = 10;
const elbowPath = (x1, y1, x2, y2, radius = CORNER_RADIUS) => {
  const midY = (y1 + y2) / 2;
  const dirX = x2 >= x1 ? 1 : -1;
  const dirY1 = midY >= y1 ? 1 : -1;
  const dirY2 = y2 >= midY ? 1 : -1;

  // Never round away more than a segment actually has to give — avoids
  // overshoot on very short hops (e.g. two nodes almost level with each other).
  const r = Math.max(
    0,
    Math.min(radius, Math.abs(midY - y1), Math.abs(x2 - x1) / 2, Math.abs(y2 - midY))
  );

  if (r < 1) {
    // Too tight for a visible curve — fall back to a plain sharp elbow.
    return `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
  }

  const beforeCorner1Y = midY - dirY1 * r;
  const afterCorner1X = x1 + dirX * r;
  const beforeCorner2X = x2 - dirX * r;
  const afterCorner2Y = midY + dirY2 * r;

  return [
    `M${x1},${y1}`,
    `L${x1},${beforeCorner1Y}`,
    `Q${x1},${midY} ${afterCorner1X},${midY}`,
    `L${beforeCorner2X},${midY}`,
    `Q${x2},${midY} ${x2},${afterCorner2Y}`,
    `L${x2},${y2}`,
  ].join(" ");
};

export default function ProcessQuality() {
  const total = ITEMS.length;

  // ---- Mobile / tablet elbow-path state ----
  // Nodes settle into a center / left / right column pattern, joined by
  // right-angle "circuit trace" connectors instead of a straight rail —
  // still driven by live scroll position (ticks going down, un-ticks
  // going back up).
  const [active, setActive] = useState(-1);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [segments, setSegments] = useState([]); // {x1,y1,x2,y2,progress}
  const [reduceMotion, setReduceMotion] = useState(false);

  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const activeRef = useRef(-1);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      // Lay the finished path out once, no scroll-driven changes.
      const container = containerRef.current;
      if (!container) return undefined;
      const cRect = container.getBoundingClientRect();
      const points = nodeRefs.current.map((node) => {
        const r = node.getBoundingClientRect();
        return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
      });
      setDims({ width: cRect.width, height: cRect.height });
      setSegments(
        points.slice(0, -1).map((p, i) => {
          const next = points[i + 1];
          return { d: elbowPath(p.x, p.y, next.x, next.y), progress: 1 };
        })
      );
      setActive(total - 1);
      return undefined;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const container = containerRef.current;
      if (!container) return; // unmounted, or hidden on desktop

      const cRect = container.getBoundingClientRect();
      const points = nodeRefs.current.map((node) => {
        const r = node.getBoundingClientRect();
        return { x: r.left - cRect.left + r.width / 2, y: r.top - cRect.top + r.height / 2 };
      });

      // Reading line: the middle of the screen's bottom half, so a node is
      // well inside view — and has had a moment to be seen unticked — before
      // it ticks.
      const line = window.innerHeight * 0.75;
      const centersY = nodeRefs.current.map((node) => node.getBoundingClientRect().y + node.getBoundingClientRect().height / 2);

      setSegments(
        points.slice(0, -1).map((p, i) => {
          const next = points[i + 1];
          const y1 = centersY[i];
          const y2 = centersY[i + 1];
          const progress = clamp((line - y1) / (y2 - y1), 0, 1);
          const d = elbowPath(p.x, p.y, next.x, next.y);
          return { d, progress };
        })
      );

      setDims((prev) =>
        close(prev.width, cRect.width) && close(prev.height, cRect.height)
          ? prev
          : { width: cRect.width, height: cRect.height }
      );

      let next = -1;
      centersY.forEach((y, i) => {
        if (y <= line) next = i;
      });
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    // Layout can still shift after this first pass (web fonts swapping in,
    // the page settling), so re-measure a couple more times shortly after
    // mount rather than only reacting to scroll/resize.
    const settleTimers = [window.setTimeout(schedule, 150), window.setTimeout(schedule, 500)];

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    let resizeObserver;
    if (containerRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
      settleTimers.forEach(window.clearTimeout);
      resizeObserver?.disconnect();
    };
  }, [reduceMotion, total]);

  const count = reduceMotion ? total : active + 1;
  const complete = count === total;

  // Column pattern: first and last nodes anchor near the center like
  // bookends; the interior nodes settle into just two fixed columns
  // (alternating left / right) instead of swinging to the hard edges —
  // a calmer, more repeatable zigzag.
  const EDGE_INSET = "15%";
  const getColumn = (index) => {
    if (index === 0 || index === total - 1) return "center";
    return index % 2 === 1 ? "left" : "right";
  };
  const getLabelSide = (index) => {
    if (index === 0) return "left";
    if (index === total - 1) return "right";
    return getColumn(index) === "left" ? "right" : "left";
  };

  return (
    <section className="section-padding border-y border-white/10 bg-white/[0.025]">
      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden gap-12 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />
        <div className="stagger-grid grid gap-4 sm:grid-cols-2">
          {ITEMS.map((item) => (
            <div
              key={item}
              className="interactive-card rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-5 text-lg font-black"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{EYEBROW}</p>
            <h2
              className="mt-4 max-w-md font-black leading-[1.02] tracking-tight text-balance"
              style={{ fontSize: "clamp(2rem, 9vw, 3.25rem)" }}
            >
              {TITLE}
            </h2>
          </div>
          <p
            className={`shrink-0 pt-1 text-right text-xs font-bold transition-colors duration-500 ${
              complete ? "text-bone" : "text-white/50"
            }`}
            aria-live="polite"
          >
            {Math.max(count, 0)}/{total}
            <span className="mt-0.5 block font-normal text-white/40">checked</span>
          </p>
        </div>
        <p className="mt-5 max-w-md text-base leading-7 text-white/58">{TEXT}</p>

        {/* Bolt path: nodes alternate hard left / hard right, joined by
            diagonal connectors instead of one straight rail. */}
        <div ref={containerRef} className="relative mx-auto mt-10 max-w-xl">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            width={dims.width || undefined}
            height={dims.height || undefined}
            viewBox={`0 0 ${dims.width || 0} ${dims.height || 0}`}
            preserveAspectRatio="none"
          >
            {segments.map((seg, i) => (
              <g key={i}>
                <path d={seg.d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.4" />
                <path
                  d={seg.d}
                  fill="none"
                  stroke="#f5f3ef"
                  strokeOpacity="0.7"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  strokeDashoffset={1 - seg.progress}
                  className="transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
                />
              </g>
            ))}
          </svg>

          <ol className="relative z-10 px-2">
            {ITEMS.map((item, index) => {
              const isDone = index <= active;
              const isCurrent = index === active;
              const isLast = index === total - 1;
              const column = getColumn(index);
              const labelOnLeft = getLabelSide(index) === "left";

              const outerClass =
                column === "center"
                  ? "justify-center"
                  : column === "left"
                    ? "justify-start"
                    : "justify-end";
              const outerStyle =
                column === "left"
                  ? { paddingLeft: EDGE_INSET }
                  : column === "right"
                    ? { paddingRight: EDGE_INSET }
                    : undefined;

              return (
                <li
                  key={item}
                  className={`flex ${isLast ? "" : "pb-12"} ${outerClass}`}
                  style={outerStyle}
                >
                  <div
                    className={`flex max-w-[62%] items-center gap-3 ${
                      labelOnLeft ? "flex-row-reverse text-right" : "text-left"
                    }`}
                  >
                    <span
                      ref={(el) => {
                        nodeRefs.current[index] = el;
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center"
                    >
                      <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current" strokeWidth="2.2">
                        <circle
                          cx="12"
                          cy="12"
                          r="9.5"
                          className={`transition-colors duration-500 motion-reduce:transition-none ${
                            isDone ? "text-bone" : "text-white/20"
                          }`}
                        />
                        <path
                          d="M7.5 12.5l3 3L16.5 9"
                          pathLength="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-bone transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none"
                          style={{ strokeDasharray: 1, strokeDashoffset: isDone ? 0 : 1 }}
                        />
                      </svg>
                    </span>

                    <span
                      className={`text-base font-black leading-tight tracking-tight transition-colors duration-500 sm:text-lg ${
                        isCurrent ? "text-bone" : isDone ? "text-white/70" : "text-white/40"
                      }`}
                    >
                      {item}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}