import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];

// How much of a site the sketch draws for each package (index matches services).
const SHAPES = [
  { nav: 2, cards: 1, glow: false }, // Starter
  { nav: 4, cards: 3, glow: false }, // Business
  { nav: 5, cards: 3, glow: true }, // Premium
];
const DEFAULT_SHAPE = { nav: 3, cards: 2, glow: false };

const pillInput =
  "h-14 w-full rounded-full border border-white/10 bg-black/35 px-6 text-base font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-white/35 motion-reduce:transition-none";

function Label({ htmlFor, optional, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 ml-2 block text-sm font-bold text-white/75">
      {children}
      {optional && <span className="ml-2 font-semibold text-white/35">Optional</span>}
    </label>
  );
}

function Pills({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? "" : option)}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none ${
              selected
                ? "border-bone bg-bone text-ink shadow-glow"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-bone"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function ContactEnquirySite() {
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));
  const choose = (key) => (next) => setV((s) => ({ ...s, [key]: next }));

  // Business is optional: start-ups and personal portfolios just use the person's own name.
  const displayName = v.business.trim() || v.name.trim();
  const slug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "yourname";
  const packIndex = PACKAGES.indexOf(v.pack);
  const shape = packIndex >= 0 ? SHAPES[packIndex] ?? DEFAULT_SHAPE : DEFAULT_SHAPE;

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = [
      `Hi, I want a website${v.business.trim() ? " for my business" : ""}.`,
      `Name: ${v.name.trim()}`,
      v.business.trim() && `Business: ${v.business.trim()}`,
      `Phone: ${v.phone.trim()}`,
      v.pack && `Package: ${v.pack}`,
      v.timeline && `Launch: ${v.timeline}`,
      v.message.trim() && `Message: ${v.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Enquiry"
          title="See your name on it."
          text="As you fill this in, a rough sketch of your website takes shape beside it. Then send everything to us on WhatsApp."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* ───────── The sketch (first on phones, sticky on desktop) ───────── */}
          <div className="order-first min-w-0 lg:order-last lg:sticky lg:top-28 lg:self-start" aria-hidden="true">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.05] shadow-premium">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-black/40 px-4 py-1.5 text-xs font-semibold text-white/55">
                  {slug}.com
                </span>
                {v.pack && (
                  <span className="rounded-full bg-bone px-3 py-1 text-[0.65rem] font-black text-ink">{v.pack}</span>
                )}
              </div>

              <div className="relative min-h-[20rem] overflow-hidden bg-ink p-6 sm:min-h-[24rem] sm:p-8">
                <span
                  className={`pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10 bg-white/[0.06] blur-sm transition-opacity duration-700 motion-reduce:transition-none ${
                    shape.glow ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <p className="min-w-0 max-w-[55%] truncate text-lg font-black tracking-tight text-bone">
                    {displayName || "Your name"}
                  </p>
                  <div className="flex gap-3">
                    {Array.from({ length: shape.nav }, (_, i) => (
                      <span key={i} className="h-1.5 w-7 rounded-full bg-white/25" />
                    ))}
                  </div>
                </div>

                <p
                  className={`relative mt-12 break-words text-4xl font-black leading-[0.98] tracking-tight text-balance transition-colors sm:text-5xl ${
                    displayName ? "text-bone" : "text-white/20"
                  }`}
                >
                  {displayName || "Your name here"}
                </p>
                <div className="relative mt-6 grid max-w-sm gap-2.5">
                  <span className="h-2 w-full rounded-full bg-white/15" />
                  <span className="h-2 w-3/4 rounded-full bg-white/15" />
                </div>
                <div className="relative mt-7 flex gap-3">
                  <span className="h-10 w-32 rounded-full bg-bone" />
                  <span className="h-10 w-24 rounded-full border border-white/20" />
                </div>

                <div className="relative mt-10 grid gap-3" style={{ gridTemplateColumns: `repeat(${shape.cards}, minmax(0, 1fr))` }}>
                  {Array.from({ length: shape.cards }, (_, i) => (
                    <div key={i} className="h-20 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                      <span className="block h-1.5 w-1/2 rounded-full bg-white/25" />
                      <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-white/12" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-white/40">
              A sketch, not a design. Your real site is shaped with you.
            </p>
          </div>

          {/* ───────── The form ───────── */}
          <form onSubmit={handleSubmit} className="min-w-0">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="site-name">Your name</Label>
                <input id="site-name" type="text" autoComplete="name" required value={v.name} onChange={set("name")} placeholder="Full name" className={pillInput} />
              </div>
              <div>
                <Label htmlFor="site-business" optional>Business or project</Label>
                <input id="site-business" type="text" autoComplete="organization" value={v.business} onChange={set("business")} placeholder="Business or project name" className={pillInput} />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="site-phone">Phone</Label>
              <input id="site-phone" type="tel" autoComplete="tel" required value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={pillInput} />
            </div>

            <div className="mt-7">
              <p className="mb-3 ml-2 text-sm font-bold text-white/75">
                Package <span className="ml-1 font-semibold text-white/35">Optional</span>
              </p>
              <Pills label="Package" options={PACKAGES} value={v.pack} onChange={choose("pack")} />
            </div>

            <div className="mt-7">
              <p className="mb-3 ml-2 text-sm font-bold text-white/75">
                Launch <span className="ml-1 font-semibold text-white/35">Optional</span>
              </p>
              <Pills label="Launch timeline" options={TIMELINES} value={v.timeline} onChange={choose("timeline")} />
            </div>

            <div className="mt-7">
              <Label htmlFor="site-message" optional>Message</Label>
              <textarea
                id="site-message"
                rows={4}
                value={v.message}
                onChange={set("message")}
                placeholder="Pages you need, websites you like, questions"
                className="min-h-32 w-full resize-none rounded-[1.75rem] border border-white/10 bg-black/35 px-6 py-4 text-base font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-white/35 motion-reduce:transition-none"
              />
            </div>

            <button type="submit" className="premium-button-light mt-8 w-full">
              Send on WhatsApp
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-white/45">
              Opens WhatsApp with your message ready. Nothing is stored on this site.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
