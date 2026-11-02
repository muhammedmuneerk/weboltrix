import { Link } from "react-router-dom";
import { brandAssets, whatsappLink } from "../data/siteData.js";

// Same props as before, so every page keeps passing its own title / text.
export default function CTASection({
  title = "Ready to turn your website into a customer-generating machine?",
  text = "Let us shape a site that makes your business easier to trust, contact, and choose.",
}) {
  return (
    <section className="hero-mesh relative isolate overflow-hidden border-y border-white/10 py-20 sm:py-24 lg:py-32">
      <div className="fine-grid absolute inset-0 -z-10 opacity-45" />

      <div className="container-premium grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-20">
        {/* Left: the ask */}
        <div className="min-w-0">
          <img
            src={brandAssets.logoSquare}
            alt=""
            className="mb-8 h-16 w-auto object-contain opacity-90 sm:h-20"
          />
          <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-balance sm:text-6xl sm:leading-[0.98] lg:text-7xl">
            {title}
          </h2>
          {text && (
            <p className="mt-6 max-w-xl border-l-2 border-white/20 pl-5 text-lg leading-8 text-white/62 sm:text-xl sm:leading-9">
              {text}
            </p>
          )}
        </div>

        {/* Right: the two ways in, as big action bars */}
        <div className="min-w-0">
          <div className="grid gap-3">
            <Link
              to="/contact"
              className="group flex items-center justify-between gap-6 rounded-[1.6rem] bg-bone px-6 py-6 text-ink shadow-glow transition duration-500 hover:-translate-y-1 hover:bg-white motion-reduce:transition-none sm:px-8 sm:py-7"
            >
              <span className="text-2xl font-black tracking-tight sm:text-3xl">
                Get Your Website
              </span>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink text-bone transition duration-500 group-hover:translate-x-1 motion-reduce:transition-none"
              >
                &rarr;
              </span>
            </Link>

            <a
              href={whatsappLink}
              className="group flex items-center justify-between gap-6 rounded-[1.6rem] border border-white/15 bg-white/[0.04] px-6 py-6 text-bone transition duration-500 hover:-translate-y-1 hover:border-white/35 hover:bg-white/[0.08] motion-reduce:transition-none sm:px-8 sm:py-7"
            >
              <span className="text-2xl font-black tracking-tight sm:text-3xl">WhatsApp Chat</span>
              <span
                aria-hidden="true"
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-white/20 transition duration-500 group-hover:translate-x-1 motion-reduce:transition-none"
              >
                &rarr;
              </span>
            </a>
          </div>

          <p className="mt-7 flex items-center gap-3 text-xs font-black uppercase tracking-[0.24em] text-white/46">
            <span aria-hidden="true" className="relative flex h-2 w-2 flex-none">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-bone" />
            </span>
            Limited slots available for new projects
          </p>
        </div>
      </div>
    </section>
  );
}