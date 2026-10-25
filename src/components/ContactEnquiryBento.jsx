import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];

const inputClass =
  "mt-8 w-full border-0 bg-transparent p-0 text-2xl font-black tracking-tight text-bone outline-none placeholder:text-white/20 sm:text-3xl";

function Check({ done }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
        done ? "border-bone bg-bone text-ink" : "border-white/20 text-transparent"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// One piece of the form. Lights up once it has something in it.
function Tile({ label, htmlFor, optional = false, filled, className = "", children }) {
  return (
    <div
      className={`flex flex-col rounded-[2rem] border p-6 transition-colors duration-500 focus-within:border-bone/70 motion-reduce:transition-none sm:p-7 ${
        filled ? "border-bone/40 bg-white/[0.08]" : "border-white/10 bg-white/[0.045]"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-black uppercase tracking-[0.2em] text-white/45">
          {label}
          {optional && <span className="ml-2 font-bold normal-case tracking-normal text-white/30">Optional</span>}
        </label>
        <Check done={filled} />
      </div>
      {children}
    </div>
  );
}

function Pills({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="mt-8 flex flex-wrap gap-2.5">
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

export default function ContactEnquiryBento() {
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));
  const choose = (key) => (next) => setV((s) => ({ ...s, [key]: next }));

  const required = [v.name.trim(), v.business.trim(), v.phone.trim()];
  const done = required.filter(Boolean).length;

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = [
      "Hi, I want a website for my business.",
      `Name: ${v.name.trim()}`,
      `Business: ${v.business.trim()}`,
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
          layout="split"
          eyebrow="Enquiry"
          title="Build your enquiry, piece by piece."
          text="Six small pieces, and only three are required. Each one lights up as you fill it in, then everything goes to WhatsApp in one tap."
        />

        <form onSubmit={handleSubmit} className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <Tile label="Your name" htmlFor="bento-name" filled={Boolean(v.name.trim())} className="lg:col-span-5">
            <input id="bento-name" type="text" autoComplete="name" required value={v.name} onChange={set("name")} placeholder="Full name" className={inputClass} />
          </Tile>

          <Tile label="Business name" htmlFor="bento-business" filled={Boolean(v.business.trim())} className="lg:col-span-7">
            <input id="bento-business" type="text" autoComplete="organization" required value={v.business} onChange={set("business")} placeholder="Business name" className={inputClass} />
          </Tile>

          <Tile label="Phone" htmlFor="bento-phone" filled={Boolean(v.phone.trim())} className="lg:col-span-5">
            <input id="bento-phone" type="tel" autoComplete="tel" required value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={inputClass} />
          </Tile>

          <Tile label="Package" optional filled={Boolean(v.pack)} className="lg:col-span-7">
            <Pills label="Package" options={PACKAGES} value={v.pack} onChange={choose("pack")} />
          </Tile>

          <Tile label="Anything else" htmlFor="bento-message" optional filled={Boolean(v.message.trim())} className="lg:col-span-7 lg:row-span-2">
            <textarea
              id="bento-message"
              value={v.message}
              onChange={set("message")}
              placeholder="Pages you need, websites you like, questions"
              className="mt-8 min-h-[12rem] w-full flex-1 resize-none border-0 bg-transparent p-0 text-xl font-bold leading-9 text-bone outline-none placeholder:text-white/20 sm:text-2xl sm:leading-10"
            />
          </Tile>

          <Tile label="Launch" optional filled={Boolean(v.timeline)} className="lg:col-span-5">
            <Pills label="Launch timeline" options={TIMELINES} value={v.timeline} onChange={choose("timeline")} />
          </Tile>

          {/* Send tile */}
          <div className="flex flex-col justify-between gap-8 rounded-[2rem] border border-bone bg-bone p-6 text-ink shadow-glow sm:p-7 lg:col-span-5">
            <div>
              <div className="grid grid-cols-3 gap-2" aria-hidden="true">
                {required.map((value, index) => (
                  <span
                    key={index}
                    className={`h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                      value ? "bg-ink" : "bg-black/15"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-5 text-3xl font-black leading-[1.05] tracking-tight">
                {done === 3 ? "All set. Send it over." : "Ready when you are."}
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-black/55" aria-live="polite">
                {done} of 3 required details added. Nothing is stored on this site.
              </p>
            </div>
            <button type="submit" className="premium-button bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800 w-full">
              Send on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
