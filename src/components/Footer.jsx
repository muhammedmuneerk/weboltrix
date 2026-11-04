import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { brandAssets, contactDetails, navLinks, whatsappLink } from "../data/siteData.js";

const pad = (n) => String(n + 1).padStart(2, "0");

const CHANNELS = [
  { label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
  { label: "Phone", value: contactDetails.phoneDisplay, href: `tel:${contactDetails.phone}` },
  { label: "WhatsApp", value: contactDetails.phoneDisplay, href: whatsappLink },
  { label: "Instagram", value: "@weboltrix", href: contactDetails.instagram, external: true },
];

// The giant wordmark fills in (outline -> solid) once the footer scrolls into view and
// empties again when it leaves. Reduced motion: it simply shows solid.
function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.45,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

export default function Footer() {
  const wordmarkRef = useRef(null);
  const filled = useInView(wordmarkRef);

  return (
    <footer data-color-scope="footer" className="relative overflow-hidden border-t border-line/10 bg-[color:var(--footer-surface)]">
      <div className="container-premium pb-8 pt-14 sm:pt-16 lg:pt-20">
        {/* Top: brand on the left, the site map as big links on the right */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="Weboltrix home">
              <img data-color-asset="brand"
                src={brandAssets.logoSquare}
                alt="Weboltrix"
                className="h-16 w-auto lg:h-24"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-content/55">
              Premium websites for local businesses that want to look trusted, modern, and ready
              for more customers.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Explore</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      `group flex items-baseline gap-3 transition-colors duration-300 ${
                        isActive ? "text-heading" : "text-content/45 hover:text-heading"
                      }`
                    }
                  >
                    <span className="text-[0.6rem] font-black tabular-nums tracking-[0.2em] text-content/30 transition-colors duration-300 group-hover:text-content/60">
                      {pad(index)}
                    </span>
                    <span className="text-2xl font-black tracking-tight sm:text-3xl">
                      {link.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact: one strip, same rhythm as the Contact page hero */}
        <div className="mt-14 lg:mt-20">
          <p className="eyebrow">Contact</p>
          <dl className="mt-5 grid border-t border-line/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line/10">
            {CHANNELS.map((channel, index) => (
              <div
                key={channel.label}
                className={`border-b border-line/10 py-5 lg:border-b-0 lg:py-6 ${
                  index === 0 ? "lg:pr-6" : "lg:px-6"
                }`}
              >
                <dt className="text-xs font-bold text-content/45">{channel.label}</dt>
                <dd className="mt-1.5">
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="block break-words text-base font-bold text-heading transition hover:text-content/70 sm:text-lg"
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Wordmark: sized by the SVG itself, so it always spans the full width */}
        <div ref={wordmarkRef} aria-hidden="true" className="mt-10 select-none lg:mt-14">
          <svg viewBox="0 0 1000 165" className="block h-auto w-full" role="presentation">
            <text
              x="0"
              y="154"
              fontSize="205"
              fontWeight="900"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="var(--footer-wordmark-fill)"
              stroke="var(--footer-wordmark-stroke)"
              strokeWidth="1.5"
              style={{
                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                fillOpacity: filled ? 1 : 0,
                transition: "fill-opacity 1.1s ease",
              }}
            >
              Weboltrix
            </text>
          </svg>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line/10 pt-6 text-xs text-content/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Weboltrix. All rights reserved.</p>
          <p>Built with clarity, speed, and premium intent.</p>
        </div>
      </div>
    </footer>
  );
}