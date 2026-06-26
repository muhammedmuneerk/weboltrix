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
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-300 ${
        scrolled
          ? "border-white/[0.14] bg-ink/[0.78] shadow-premium backdrop-blur-2xl"
          : "border-white/[0.08] bg-ink/[0.36] backdrop-blur-2xl"
      }`}
    >
      <nav className="container-premium flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="MMK Websites home" onClick={() => setOpen(false)}>
          <img
            src={brandAssets.logoWide}
            alt="MMK Websites"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `relative py-2 text-sm font-semibold transition after:absolute after:bottom-0 after:left-1/2 after:h-px after:bg-white after:transition-all after:duration-300 after:-translate-x-1/2 hover:text-white ${
                  isActive
                    ? "text-white after:w-full"
                    : "text-white/58 after:w-0 hover:after:w-full"
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
            className="premium-button bg-white text-ink shadow-[0_0_42px_rgba(255,255,255,0.28)] hover:-translate-y-1 hover:bg-bone hover:shadow-[0_0_62px_rgba(255,255,255,0.38)]"
          >
            Get Your Website
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 md:hidden"
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
                className="rounded-2xl px-4 py-3 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
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
