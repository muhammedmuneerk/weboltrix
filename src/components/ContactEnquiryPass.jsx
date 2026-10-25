import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const CLASSES = services.map((service) => service.name);
const BOARDING = ["Within 2 weeks", "This month", "No rush"];

const cellLabel = "block text-[0.65rem] font-black uppercase tracking-[0.22em] text-white/40";
const cellInput =
  "mt-3 w-full min-w-0 border-0 bg-transparent p-0 text-xl font-black tracking-tight text-bone outline-none placeholder:text-white/20 sm:text-2xl";

// A decorative barcode that is redrawn from whatever has been typed.
function makeBars(seed) {
  const text = seed || "weboltrix";
  let h = 2166136261;
  return Array.from({ length: 34 }, (_, i) => {
    h = Math.imul(h ^ (text.charCodeAt(i % text.length) + i), 16777619) >>> 0;
    return { w: 1 + (h % 3), g: 1 + ((h >> 4) % 3) };
  });
}

function Cell({ label, htmlFor, className = "", children }) {
  return (
    <div className={`border-t border-white/10 px-6 py-5 transition-colors focus-within:bg-white/[0.03] motion-reduce:transition-none sm:px-8 ${className}`}>
      <label htmlFor={htmlFor} className={cellLabel}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Pills({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="mt-3 flex flex-wrap gap-2">
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

export default function ContactEnquiryPass() {
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (key) => (event) => {
    setSent(false);
    setV((s) => ({ ...s, [key]: event.target.value }));
  };
  const choose = (key) => (next) => {
    setSent(false);
    setV((s) => ({ ...s, [key]: next }));
  };

  const bars = useMemo(
    () => makeBars([v.name, v.business, v.phone, v.pack, v.timeline, v.message].join("|").trim()),
    [v]
  );

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
    setSent(true);
  };

  const notch = "absolute z-10 h-7 w-7 rounded-full border border-white/15 bg-ink";

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Enquiry"
          title="Your launch pass."
          text="Fill in your details and the pass fills in with you. Tear off the stub to send it to us on WhatsApp."
        />

        <form onSubmit={handleSubmit} className="relative mt-14 grid max-w-6xl lg:mt-20 lg:grid-cols-[minmax(0,1fr)_17rem]">
          {/* ───────── Main pass ───────── */}
          <div className="relative rounded-t-[2rem] border border-b-0 border-white/15 bg-white/[0.045] lg:rounded-l-[2rem] lg:rounded-tr-none lg:border-b lg:border-r-0">
            {sent && (
              <p
                role="status"
                className="absolute right-6 top-24 z-10 -rotate-12 animate-fade-up rounded-md border-2 border-bone px-4 py-1 text-lg font-black uppercase tracking-[0.2em] text-bone motion-reduce:animate-none sm:right-10"
              >
                Sent
              </p>
            )}

            <div className="flex items-center justify-between gap-4 px-6 py-6 sm:px-8">
              <div>
                <p className="text-2xl font-black tracking-tight">Launch pass</p>
                <p className="mt-1 text-xs font-bold text-white/45">Weboltrix</p>
              </div>
              <p className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-white/55">
                Idea <span aria-hidden="true">&rarr;</span> Live
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              <Cell label="Passenger" htmlFor="pass-name">
                <input id="pass-name" type="text" autoComplete="name" required value={v.name} onChange={set("name")} placeholder="Full name" className={cellInput} />
              </Cell>
              <Cell label="Business" htmlFor="pass-business" className="sm:border-l">
                <input id="pass-business" type="text" autoComplete="organization" required value={v.business} onChange={set("business")} placeholder="Business name" className={cellInput} />
              </Cell>
              <Cell label="Contact" htmlFor="pass-phone">
                <input id="pass-phone" type="tel" autoComplete="tel" required value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={cellInput} />
              </Cell>
              <Cell label="Class" className="sm:border-l">
                <Pills label="Package" options={CLASSES} value={v.pack} onChange={choose("pack")} />
              </Cell>
              <Cell label="Boarding" className="sm:col-span-2">
                <Pills label="Launch timeline" options={BOARDING} value={v.timeline} onChange={choose("timeline")} />
              </Cell>
              <Cell label="Notes" htmlFor="pass-notes" className="sm:col-span-2">
                <textarea
                  id="pass-notes"
                  rows={3}
                  value={v.message}
                  onChange={set("message")}
                  placeholder="Pages you need, websites you like, questions"
                  className={`${cellInput} resize-none text-lg font-bold leading-8 sm:text-xl`}
                />
              </Cell>
            </div>
          </div>

          {/* ───────── Tear-off stub ───────── */}
          <div className="relative flex flex-col justify-between gap-8 rounded-b-[2rem] border-t border-dashed border-black/30 bg-bone p-6 text-ink lg:rounded-b-none lg:rounded-r-[2rem] lg:border-l lg:border-t-0 lg:p-7">
            <span aria-hidden="true" className={`${notch} left-0 top-0 -translate-x-1/2 -translate-y-1/2`} />
            <span
              aria-hidden="true"
              className={`${notch} right-0 top-0 translate-x-1/2 -translate-y-1/2 lg:bottom-0 lg:left-0 lg:right-auto lg:top-auto lg:-translate-x-1/2 lg:translate-y-1/2`}
            />

            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-black/45">Boarding stub</p>
              <p className="mt-4 text-4xl font-black leading-none tracking-tight">
                Idea <span aria-hidden="true">&rarr;</span>
                <br />
                Live
              </p>

              <dl className="mt-7 grid gap-3 text-sm font-bold">
                {[
                  ["Passenger", v.name.trim() || "Your name"],
                  ["Class", v.pack || "Not chosen"],
                  ["Boarding", v.timeline || "Flexible"],
                ].map(([term, detail]) => (
                  <div key={term} className="border-t border-black/15 pt-3">
                    <dt className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-black/45">{term}</dt>
                    <dd className="mt-1 break-words">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <div aria-hidden="true" className="flex h-12 items-stretch overflow-hidden">
                {bars.map((bar, index) => (
                  <span key={index} className="bg-ink" style={{ width: bar.w, marginRight: bar.g }} />
                ))}
              </div>
              <button type="submit" className="premium-button mt-5 w-full bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800">
                Send on WhatsApp
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-black/50">
                Nothing is stored on this site.
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
