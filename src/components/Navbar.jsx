import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { brandAssets, navLinks } from "../data/siteData.js";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-color-scope="navbar"
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
        scrolled
          ? "border-line/[0.14] bg-canvas/[0.78] shadow-premium backdrop-blur-2xl"
          : "border-line/[0.08] bg-canvas/[0.36] backdrop-blur-2xl"
      }`}
    >
      <nav className="container-premium flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Weboltrix home" onClick={() => setOpen(false)}>
          <img data-color-asset="brand"
            src={brandAssets.logoSquare}
            alt="Weboltrix"
            className="h-20 w-auto lg:h-28"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `relative py-2 text-sm font-semibold transition after:absolute after:bottom-0 after:left-1/2 after:h-px after:bg-emphasis-panel after:transition-all after:duration-300 after:-translate-x-1/2 hover:text-content ${
                  isActive
                    ? "text-content after:w-full"
                    : "text-content/58 after:w-0 hover:after:w-full"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="premium-button bg-action-bright text-action-foreground shadow-[0_0_42px_var(--glow-a028)] hover:-translate-y-1 hover:bg-action hover:shadow-[0_0_62px_var(--glow-a038)]"
          >
            Get Your Website
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line/15 bg-layer/5 md:hidden"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-current transition ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-current transition ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-5 bg-current transition ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="container-premium pb-5 md:hidden">
          <div className="glass flex flex-col gap-2 rounded-3xl p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-content/75 transition hover:bg-layer/10 hover:text-content"
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/contact" className="premium-button-light mt-2" onClick={() => setOpen(false)}>
              Get Your Website
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
