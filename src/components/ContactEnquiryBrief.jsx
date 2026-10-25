import { useState } from "react";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGE_OPTIONS = [
  { value: "", label: "not sure yet" },
  ...services.map((service) => ({ value: service.name, label: `leaning towards ${service.name}` })),
];
const TIMELINE_OPTIONS = [
  { value: "", label: "whenever it's ready" },
  { value: "Within 2 weeks", label: "within 2 weeks" },
  { value: "This month", label: "this month" },
];

// Inputs size to their content where the browser supports field-sizing,
// and fall back to a character-width estimate where it does not.
const css = `
  .brief-blank { width: var(--w); }
  @supports (field-sizing: content) {
    .brief-blank { field-sizing: content; width: auto; min-width: 3ch; }
  }
`;

const lineClass = (filled) => (filled ? "border-bone/70" : "border-white/20");

function Blank({ label, value, onChange, placeholder, type = "text", autoComplete }) {
  return (
    <input
      type={type}
      aria-label={label}
      autoComplete={autoComplete}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ "--w": `${Math.max(value.length, placeholder.length) + 1}ch` }}
      className={`brief-blank inline-block max-w-full border-0 border-b-[3px] bg-transparent p-0 align-baseline text-bone outline-none transition-colors placeholder:text-white/20 focus:border-bone motion-reduce:transition-none ${lineClass(value)}`}
    />
  );
}

function Pick({ label, value, onChange, options }) {
  return (
    <span className="relative inline-block max-w-full align-baseline">
      <select
        aria-label={label}
        value={value}
        onChange={onChange}
        className={`max-w-full cursor-pointer appearance-none border-0 border-b-[3px] bg-transparent p-0 pr-[0.8em] text-bone outline-none transition-colors focus:border-bone motion-reduce:transition-none ${lineClass(value)}`}
      >
        {options.map((option) => (
          <option key={option.label} value={option.value} className="bg-ink text-base font-bold text-bone">
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[0.4em] text-white/55"
      >
        &#9660;
      </span>
    </span>
  );
}

export default function ContactEnquiryBrief() {
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));

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
      <style>{css}</style>

      <div className="container-premium">
        <div className="flex items-center gap-4">
          <p className="eyebrow">Enquiry</p>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          <p className="text-xs font-bold text-white/45">Fill in the blanks</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 lg:mt-16">
          <p className="max-w-6xl text-3xl font-black leading-[1.4] tracking-tight text-white/40 sm:text-5xl sm:leading-[1.3] lg:text-6xl lg:leading-[1.28]">
            Hi, I&rsquo;m{" "}
            <Blank label="Your name" value={v.name} onChange={set("name")} placeholder="your name" autoComplete="name" />{" "}
            from{" "}
            <Blank label="Business name" value={v.business} onChange={set("business")} placeholder="your business" autoComplete="organization" />
            . As for the package, I&rsquo;m{" "}
            <Pick label="Package" value={v.pack} onChange={set("pack")} options={PACKAGE_OPTIONS} />. I&rsquo;d like to
            launch{" "}
            <Pick label="Launch timing" value={v.timeline} onChange={set("timeline")} options={TIMELINE_OPTIONS} />. You
            can reach me on{" "}
            <Blank label="Phone number" value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" type="tel" autoComplete="tel" />
            .
          </p>

          <div className="mt-12 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-6 lg:mt-16">
            <label htmlFor="brief-extra" className="text-2xl font-black tracking-tight text-white/40 sm:text-3xl">
              P.S.
            </label>
            <textarea
              id="brief-extra"
              rows={2}
              value={v.message}
              onChange={set("message")}
              placeholder="Pages you need, websites you like, anything we should know"
              className={`w-full max-w-4xl resize-none border-0 border-b-[3px] bg-transparent px-0 pb-3 text-xl font-bold leading-8 text-bone outline-none transition-colors placeholder:text-white/20 focus:border-bone motion-reduce:transition-none sm:text-2xl sm:leading-9 ${lineClass(v.message)}`}
            />
          </div>

          <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:mt-20">
            <p className="max-w-md text-sm leading-7 text-white/50">
              Sending opens WhatsApp with this written out for you. Nothing is stored on this site.
            </p>
            <button type="submit" className="premium-button-light w-full px-9 py-4 text-base sm:w-auto">
              Send on WhatsApp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
