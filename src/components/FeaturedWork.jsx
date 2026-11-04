"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// ─── How many px of scroll each project "owns" ───────────────────────────────
const PX_PER_PROJECT = 600; // tune this: lower = faster switching

// ─── Single fullscreen panel ─────────────────────────────────────────────────
function ProjectPanel({ project, index, active, total }) {
  const num   = String(index + 1).padStart(2, "0");
  const liveLink = project.linkAfter || project.link;

  const enter = (axis, amount, delay) => ({
    transform: active
      ? "translate(0,0)"
      : axis === "x"
      ? `translateX(${amount})`
      : `translateY(${amount})`,
    opacity: active ? 1 : 0,
    transition: `transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s,
                 opacity   0.6s  linear                            ${delay}s`,
  });

  return (
    <div style={{
      position: "absolute", inset: 0,
      opacity: active ? 1 : 0,
      pointerEvents: active ? "all" : "none",
      transition: "opacity 0.25s ease",
    }}>

      {/* ── Full-bleed image ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <img
          src={project.image}
          alt={project.visualAlt}
          loading={index === 0 ? "eager" : "lazy"}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            transform: active ? "scale(1)" : "scale(1.06)",
            filter: "grayscale(8%) brightness(0.9)",
            transition: "transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            willChange: "transform",
          }}
        />
      </div>

      {/* ── Left-heavy gradient scrim ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "linear-gradient(to right, var(--surface-editorial-a096) 0%, var(--surface-editorial-a07) 45%, var(--surface-editorial-a008) 100%)",
          "linear-gradient(to top,   var(--surface-editorial-a055) 0%, transparent 40%)",
        ].join(", "),
      }} />

      {/* ── Corner brackets ── */}
      {[
        { top: "2rem",    left:  "2rem",  borderTop:    "1px solid var(--editorial-accent)", borderLeft:  "1px solid var(--editorial-accent)" },
        { bottom: "2rem", right: "2rem",  borderBottom: "1px solid var(--editorial-accent)", borderRight: "1px solid var(--editorial-accent)" },
      ].map((s, k) => (
        <div key={k} style={{
          position: "absolute", width: "2rem", height: "2rem",
          opacity: active ? 1 : 0,
          transition: `opacity 0.5s ${k === 0 ? "0.25" : "0.35"}s`,
          pointerEvents: "none", zIndex: 5, ...s,
        }} />
      ))}

      {/* ── Left content column ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "clamp(2rem, 5vw, 5rem)",
        maxWidth: "min(620px, 58vw)",
      }}>

        {/* Ghost number */}
        <div aria-hidden="true" style={{
          fontFamily: "'Syne', system-ui, sans-serif",
          fontSize: "clamp(4.5rem, 10vw, 8rem)",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px var(--editorial-accent-a02)",
          lineHeight: 1,
          marginBottom: "-1rem",
          userSelect: "none",
          ...enter("x", "-2.5rem", 0.05),
        }}>
          {num}
        </div>

        {/* Category */}
        <p style={{
          fontSize: "9px", fontWeight: 800,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "var(--editorial-accent)", marginBottom: "0.85rem",
          ...enter("y", "1rem", 0.18),
        }}>
          {project.category}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Syne', system-ui, sans-serif",
          fontSize: "clamp(1.6rem, 3.5vw, 3rem)",
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: "-0.025em", color: "var(--editorial-content)",
          marginBottom: "0.9rem",
          ...enter("y", "1.25rem", 0.28),
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: "0.8125rem", lineHeight: 1.85,
          color: "var(--editorial-content-a05)",
          maxWidth: "380px", marginBottom: "1.25rem",
          ...enter("y", "1.25rem", 0.36),
        }}>
          {project.description}
        </p>

        {/* Before → After */}
        <div style={{
          borderLeft: "2px solid var(--editorial-accent-a045)",
          paddingLeft: "0.9rem",
          marginBottom: "1.25rem",
          ...enter("y", "1rem", 0.43),
        }}>
          <p style={{
            fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--editorial-accent-a055)",
            marginBottom: "0.3rem",
          }}>
            Before → After
          </p>
          <p style={{
            fontSize: "0.8rem", fontWeight: 600,
            color: "var(--editorial-content)", lineHeight: 1.5,
          }}>
            {project.transformation}
          </p>
        </div>

        {/* Metric chips */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.35rem",
          marginBottom: "1rem",
          ...enter("y", "1rem", 0.5),
        }}>
          {project.metrics.map((m) => (
            <span key={m} style={{
              fontSize: "8px", fontWeight: 800, letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "var(--editorial-content-a04)",
              border: "1px solid var(--editorial-content-a01)",
              padding: "0.28rem 0.7rem",
            }}>
              {m}
            </span>
          ))}
        </div>

        {/* Tech tags */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.3rem",
          marginBottom: "1.75rem",
          ...enter("y", "1rem", 0.56),
        }}>
          {project.tags.slice(0, 5).map((tag) => (
            <span key={tag} style={{
              fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--editorial-accent-a065)",
              border: "1px solid var(--editorial-accent-a022)",
              padding: "0.25rem 0.6rem",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "1.5rem",
          flexWrap: "wrap",
          ...enter("y", "0.75rem", 0.63),
        }}>
          <Link
            to={`/work/${project.slug}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "var(--editorial-accent)", color: "var(--surface-editorial)",
              fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "0.8rem 1.6rem",
              textDecoration: "none", flexShrink: 0,
            }}
          >
            Case Study →
          </Link>
          {liveLink && (
            <a href={liveLink} target="_blank" rel="noreferrer" style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: "var(--editorial-content-a038)",
              textDecoration: "none", letterSpacing: "0.05em",
            }}>
              Live Site ↗
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" style={{
              fontSize: "0.75rem", fontWeight: 700,
              color: "var(--editorial-content-a025)",
              textDecoration: "none", letterSpacing: "0.05em",
            }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Bottom-right: impact callout ── */}
      <div style={{
        position: "absolute", bottom: "3rem", right: "3rem",
        textAlign: "right", zIndex: 3, maxWidth: "260px",
        opacity: active ? 1 : 0,
        transition: "opacity 0.6s 0.75s",
      }}>
        <p style={{
          fontFamily: "'Syne', system-ui, sans-serif",
          fontSize: "clamp(0.85rem, 1.4vw, 1.2rem)",
          fontWeight: 800, color: "var(--editorial-content)",
          lineHeight: 1.3, marginBottom: "0.35rem",
        }}>
          {project.impact}
        </p>
        <p style={{
          fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "var(--editorial-accent-a05)",
        }}>
          Project outcome
        </p>
      </div>

      {/* ── Project counter — top right ── */}
      <div style={{
        position: "absolute", top: "2rem", right: "4rem",
        zIndex: 5,
        fontFamily: "'Syne', system-ui, sans-serif",
        fontSize: "9px", fontWeight: 800,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: "var(--editorial-accent-a04)",
        opacity: active ? 1 : 0,
        transition: "opacity 0.5s 0.3s",
      }}>
        {num}&nbsp;/&nbsp;{String(total).padStart(2, "0")}
      </div>

      {/* ── Gold scan line — bottom ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "2px", background: "var(--editorial-accent)",
        transformOrigin: "left",
        transform: active ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s",
        zIndex: 5,
      }} />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function FeaturedWork({ projects = [] }) {
  const stageRef    = useRef(null);
  const [active, setActive]       = useState(0);
  const [scrollPct, setScrollPct] = useState(0);

  const totalScrollHeight = projects.length * PX_PER_PROJECT;

  const onScroll = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Distance from top of stage to current scroll position
    const stageOffsetTop  = stage.offsetTop;
    const scrollY         = window.scrollY;
    const stageScrollable = totalScrollHeight - window.innerHeight;

    // Overall page progress for the top bar
    const totalDoc = document.body.scrollHeight - window.innerHeight;
    setScrollPct(Math.max(0, Math.min(1, scrollY / totalDoc)));

    const intoStage = scrollY - stageOffsetTop;
    if (intoStage < 0) { setActive(0); return; }

    const progress = Math.max(0, Math.min(0.9999, intoStage / stageScrollable));
    setActive(Math.min(projects.length - 1, Math.floor(progress * projects.length)));
  }, [projects.length, totalScrollHeight]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount to handle pre-scrolled position
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollToPanel = useCallback((i) => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageScrollable = totalScrollHeight - window.innerHeight;
    window.scrollTo({
      top: stage.offsetTop + (i / projects.length) * stageScrollable + 4,
      behavior: "smooth",
    });
  }, [projects.length, totalScrollHeight]);

  if (!projects.length) return null;

  return (
    <div style={{ position: "relative" }}>

      {/* ── Global scroll-progress bar (fixed) ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, zIndex: 9999,
        height: "2px", width: `${scrollPct * 100}%`,
        background: "var(--editorial-accent)",
        transition: "width 0.08s linear",
        pointerEvents: "none",
      }} />

      {/* ── Section heading — normal document flow above the stage ── */}
      <div style={{
        background: "var(--surface-editorial)",
        padding: "5rem clamp(1.5rem, 5vw, 4.5rem) 3rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, var(--editorial-accent-a0055) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        {/* Ghost word */}
        <div aria-hidden="true" style={{
          position: "absolute", right: "-1rem", top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Syne', system-ui, sans-serif",
          fontSize: "clamp(5rem, 20vw, 18rem)",
          fontWeight: 900, lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px var(--editorial-accent-a005)",
          userSelect: "none", pointerEvents: "none",
        }}>
          WORK
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <p style={{
            fontSize: "9px", fontWeight: 800, letterSpacing: "0.28em",
            textTransform: "uppercase", color: "var(--editorial-accent)",
            marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}>
            <span style={{ display: "block", width: "2.5rem", height: "1px", background: "var(--editorial-accent)" }} />
            Featured Work
          </p>

          <h2 style={{
            fontFamily: "'Syne', system-ui, sans-serif",
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em",
            color: "var(--editorial-content)", maxWidth: "640px", marginBottom: "1.25rem",
          }}>
            Websites designed to look expensive and work hard.
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <p style={{
              fontSize: "0.875rem", lineHeight: 1.75,
              color: "var(--editorial-content-a042)", maxWidth: "380px",
            }}>
              Every project starts with business clarity, then becomes a polished
              website that builds confidence fast.
            </p>
            <span style={{
              fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "var(--editorial-content-a022)",
            }}>
              {projects.length} Projects · Scroll to explore ↓
            </span>
          </div>
        </div>
      </div>

      {/* ── Scroll stage ── */}
      <div
        ref={stageRef}
        style={{ position: "relative", height: `${totalScrollHeight}px` }}
      >
        {/* Sticky viewport */}
        <div style={{
          position: "sticky", top: 0,
          height: "100vh", overflow: "hidden",
          background: "var(--surface-editorial)",
        }}>

          {/* ── Diamond dot navigator (right rail) ── */}
          <nav
            aria-label="Project navigator"
            style={{
              position: "absolute", right: "1.5rem", top: "50%",
              transform: "translateY(-50%)", zIndex: 100,
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "0.75rem",
            }}
          >
            <span style={{
              fontFamily: "'Syne', system-ui, sans-serif",
              fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
              color: "var(--editorial-accent-a045)",
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              marginBottom: "0.5rem",
            }}>
              {String(active + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(projects.length).padStart(2, "0")}
            </span>

            {projects.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => scrollToPanel(i)}
                title={p.title}
                aria-label={`Jump to ${p.title}`}
                style={{
                  width: 7, height: 7,
                  transform: "rotate(45deg)",
                  cursor: "pointer",
                  background: active === i ? "var(--editorial-accent)" : "transparent",
                  border: `1px solid ${active === i ? "var(--editorial-accent)" : "var(--editorial-accent-a03)"}`,
                  padding: 0, flexShrink: 0,
                  transition: "background 0.3s, border-color 0.3s",
                }}
              />
            ))}
          </nav>

          {/* ── Project panels (all stacked, only active is visible) ── */}
          {projects.map((project, i) => (
            <ProjectPanel
              key={project.slug}
              project={project}
              index={i}
              active={active === i}
              total={projects.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}