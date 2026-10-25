import { useRef, useState } from "react";
import { contactDetails, services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];
const INCLUDE = ["Your business type", "The pages you need", "Websites you like", "When you want to launch"];

const rowInput =
  "w-full min-w-0 border-0 bg-transparent p-0 text-base font-semibold text-bone outline-none placeholder:text-white/25 sm:text-lg";

function Row({ label, htmlFor, children }) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 px-5 py-4 transition-colors focus-within:bg-white/[0.035] motion-reduce:transition-none sm:grid-cols-[7rem_minmax(0,1fr)] sm:px-7">
      <label htmlFor={htmlFor} className="text-sm font-bold text-white/45">
        {label}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Pills({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? "" : option)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none sm:text-sm ${
              selected
                ? "border-bone bg-bone text-ink"
                : "border-white/15 bg-white/5 text-white/65 hover:border-white/35 hover:text-bone"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function ContactEnquiryCompose() {
  const formRef = useRef(null);
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));
  const choose = (key) => (next) => setV((s) => ({ ...s, [key]: next }));

  const buildMessage = () =>
    [
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

  // Primary action: the form's own submit, so the browser validates the required fields.
  const sendWhatsApp = (event) => {
    event.preventDefault();
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(buildMessage())}`, "_blank", "noopener,noreferrer");
  };

  const sendEmail = () => {
    if (!formRef.current?.reportValidity()) return;
    const subject = encodeURIComponent(`Website enquiry: ${v.business.trim()}`);
    const body = encodeURIComponent(buildMessage().replace(/\n/g, "\r\n"));
    window.location.href = `mailto:${contactDetails.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]">
      <div className="container-premium grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 xl:gap-24">
        {/* ───────── Left: the brief ───────── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Enquiry</p>
          <h2 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Write to us.
          </h2>
          <p className="mt-7 max-w-md text-lg leading-9 text-white/58">
            Think of it as a short note. Fill in the details, say what you need, and send it the way you prefer.
            The same message goes either way.
          </p>

          <p className="mt-10 text-sm font-bold text-white/45">Worth mentioning</p>
          <ul className="mt-3 max-w-sm border-t border-white/12">
            {INCLUDE.map((item) => (
              <li key={item} className="flex gap-3 border-b border-white/[0.07] py-3.5 text-sm font-semibold text-white/65">
                <span aria-hidden="true" className="font-black text-bone">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ───────── Right: the compose window ───────── */}
        <form
          ref={formRef}
          onSubmit={sendWhatsApp}
          className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/12 bg-black/55 shadow-premium backdrop-blur-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </span>
            <p className="text-xs font-black tracking-tight text-white/60">New enquiry</p>
            <span className="w-10 text-right text-xs font-bold text-white/30">Draft</span>
          </div>

          {/* Header rows */}
          <div className="divide-y divide-white/10 border-b border-white/10">
            <Row label="To">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-sm font-bold text-bone">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bone" />
                Weboltrix
              </span>
            </Row>
            <Row label="Name" htmlFor="compose-name">
              <input id="compose-name" type="text" autoComplete="name" required value={v.name} onChange={set("name")} placeholder="Your full name" className={rowInput} />
            </Row>
            <Row label="Business" htmlFor="compose-business">
              <input id="compose-business" type="text" autoComplete="organization" required value={v.business} onChange={set("business")} placeholder="Your business name" className={rowInput} />
            </Row>
            <Row label="Phone" htmlFor="compose-phone">
              <input id="compose-phone" type="tel" autoComplete="tel" required value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={rowInput} />
            </Row>
            <Row label="Package">
              <Pills label="Package" options={PACKAGES} value={v.pack} onChange={choose("pack")} />
            </Row>
            <Row label="Launch">
              <Pills label="Launch timeline" options={TIMELINES} value={v.timeline} onChange={choose("timeline")} />
            </Row>
          </div>

          {/* Body */}
          <label htmlFor="compose-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="compose-message"
            value={v.message}
            onChange={set("message")}
            placeholder="Tell us about your business and the website you have in mind..."
            className="block min-h-[13rem] w-full resize-none border-0 bg-transparent px-5 py-6 text-base leading-8 text-bone outline-none transition-colors placeholder:text-white/25 focus:bg-white/[0.025] motion-reduce:transition-none sm:min-h-[15rem] sm:px-7 sm:text-lg sm:leading-9"
          />

          {/* Send bar */}
          <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="text-xs leading-5 text-white/40 sm:max-w-[13rem]">
              Nothing is stored on this site. Your message goes straight to WhatsApp or your email app.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={sendEmail} className="premium-button-dark">
                Send by email
              </button>
              <button type="submit" className="premium-button-light">
                Send on WhatsApp
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
