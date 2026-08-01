import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BeforeAfter from "../components/BeforeAfter.jsx";
import CTASection from "../components/CTASection.jsx";
import PageHero from "../components/PageHero.jsx";
import { Link } from "react-router-dom";
import { projects } from "../data/siteData.js";
import "./work-parallax.css";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PER_ITEM = 600; // px of pinned scroll dedicated to each project

export default function Work() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pinSectionRef = useRef(null);   // section that gets pinned
  const leftListRef = useRef(null);     // track that translates upward
  const itemRefs = useRef([]);
  const total = projects.length;

  useEffect(() => {
    const pinSection = pinSectionRef.current;
    const leftList = leftListRef.current;
    if (!pinSection || !leftList) return;

    const mm = gsap.matchMedia();

    // Pin behavior only on tablet/desktop. Mobile falls back to a
    // normal stacked layout (left column hidden via CSS, right
    // panel shows the first project statically — see CSS media query).
    mm.add("(min-width: 769px)", () => {
      const totalScrollDistance = SCROLL_PER_ITEM * total;

      // Distance the left column needs to travel so the LAST item
      // ends up centered/visible once the section finishes pinning.
      const getTravelDistance = () => {
        const trackHeight = leftList.scrollHeight;
        const viewportHeight = leftList.parentElement.clientHeight;
        return Math.max(0, trackHeight - viewportHeight);
      };

      const tween = gsap.fromTo(
        leftList,
        { y: 0 },
        {
          y: () => -getTravelDistance(),
          ease: "none",
          scrollTrigger: {
            id: "pin-work-section",
            trigger: pinSection,
            start: "top top",
            end: () => `+=${totalScrollDistance}`,
            scrub: 1,                 // smooth, tied to scroll position
            pin: true,                // locks the entire section
            pinSpacing: true,         // page reserves the scroll distance, no jump on release
            anticipatePin: 1,         // removes flicker/snap when pin engages
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                total - 1,
                Math.floor(self.progress * total)
              );
              setActiveIndex((prev) => (prev !== idx ? idx : prev));
            },
          },
        }
      );

      return () => tween.kill();
    });

    return () => mm.revert();
  }, [total]);

  const activeProject = projects[activeIndex];
  const liveLink = activeProject.linkAfter || activeProject.link;

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Our Work">
        Websites shaped for clarity, premium perception, and better customer enquiries.
      </PageHero>

      {/* ── PINNED STORYTELLING SECTION ── */}
      <section ref={pinSectionRef} className="pin-section">
        <div className="pin-grid">

          {/* LEFT — scrolling list, position driven entirely by GSAP */}
          <div className="pin-left">
            <div ref={leftListRef} className="pin-left-track">
              {projects.map((project, i) => (
                <div
                  key={project.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className={`pin-item${i === activeIndex ? " pin-item--active" : ""}`}
                >
                  <span className="pin-item-num">{String(i + 1).padStart(2, "0")}</span>
                  <div className="pin-item-text">
                    <h3 className="pin-item-title">{project.title}</h3>
                    <p className="pin-item-cat">{project.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — fixed panel, content swaps based on activeIndex */}
          <div className="pin-right">
            <div className="pin-right-inner">
              <div className="pin-img-wrap">
                <img
                  key={activeProject.image}
                  src={activeProject.image}
                  alt={activeProject.visualAlt}
                  className="pin-img"
                />
              </div>

              <div className="pin-content">
                <div className="pin-toprow">
                  <span className="pin-eyebrow">{activeProject.category}</span>
                  <div className="pin-tags">
                    {activeProject.tags.map((t) => (
                      <span key={t} className="pin-tag">{t}</span>
                    ))}
                  </div>
                </div>

                <h2 className="pin-title">{activeProject.title}</h2>
                <p className="pin-desc">{activeProject.description}</p>

                <dl className="pin-psr">
                  {[
                    ["Problem", activeProject.problem],
                    ["Solution", activeProject.solution],
                    ["Result", activeProject.result],
                  ].map(([label, text]) => (
                    <div key={label} className="pin-psr-cell">
                      <dt className="pin-psr-label">{label}</dt>
                      <dd className="pin-psr-text">{text}</dd>
                    </div>
                  ))}
                </dl>

                <div className="pin-ctas">
                  <Link to={`/work/${activeProject.slug}`} className="premium-button-light">
                    Open Case Study
                  </Link>
                  {liveLink && (
                    <a href={liveLink} target="_blank" rel="noreferrer" className="pin-link">
                      Live Site ↗
                    </a>
                  )}
                  {activeProject.linkBefore && (
                    <a href={activeProject.linkBefore} target="_blank" rel="noreferrer" className="pin-link">
                      Before Site ↗
                    </a>
                  )}
                  {activeProject.github && (
                    <a href={activeProject.github} target="_blank" rel="noreferrer" className="pin-link">
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Comparison</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              Before and after clarity.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/58">
              Most websites lose customers before they even load properly. We rebuild them into
              fast, premium experiences that convert instantly.
            </p>
          </div>
          <div className="mt-12">
            <BeforeAfter compact />
          </div>
        </div>
      </section>

      <CTASection title="Want your business to be the next transformation?" />
    </>
  );
}