import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];

const INITIAL = { name: "", business: "", phone: "", pack: "", timeline: "", message: "" };

const inputClass =
  "w-full border-0 border-b border-white/15 bg-transparent pb-3 pt-2 text-xl font-bold text-bone outline-none transition-colors placeholder:text-white/25 focus:border-bone sm:text-2xl";

function Field({ label, htmlFor, children }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="block text-sm font-bold text-white/55">
        {label}
      </label>
      {children}
    </div>
  );
}

// Optional single choice. Tapping the selected chip again clears it.
function Choice({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-bold text-white/55">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
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
    </div>
  );
}

export default function ContactEnquiry() {
  const [values, setValues] = useState(INITIAL);
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const choose = (key) => (next) => setValues((v) => ({ ...v, [key]: next }));

  // One message, used for both the live preview and the WhatsApp hand-off.
  const lines = [
    "Hi, I want a website for my business.",
    values.name && `Name: ${values.name}`,
    values.business && `Business: ${values.business}`,
    values.phone && `Phone: ${values.phone}`,
    values.pack && `Package: ${values.pack}`,
    values.timeline && `Launch: ${values.timeline}`,
    values.message && `Message: ${values.message}`,
  ].filter(Boolean);
  const message = lines.join("\n");

  const handleSubmit = (event) => {
    event.preventDefault();
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="enquiry-form"
      className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]"
    >
      <div className="container-premium">
        <SectionHeading
          layout="split"
          eyebrow="Enquiry"
          title="Tell us what you are building."
          text="Fill in what you can. Your message is written for you on the right, and sending it opens WhatsApp with everything ready."
        />

        <form
          onSubmit={handleSubmit}
          className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16 xl:gap-24"
        >
          {/* ───────── Left: the details ───────── */}
          <div className="grid gap-10">
            <div className="grid gap-10 sm:grid-cols-2">
              <Field label="Your name" htmlFor="enquiry-name">
                <input
                  id="enquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={set("name")}
                  placeholder="Full name"
                  className={inputClass}
                />
              </Field>
              <Field label="Business name" htmlFor="enquiry-business">
                <input
                  id="enquiry-business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  required
                  value={values.business}
                  onChange={set("business")}
                  placeholder="Business name"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Phone number" htmlFor="enquiry-phone">
              <input
                id="enquiry-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={values.phone}
                onChange={set("phone")}
                placeholder="+91 00000 00000"
                className={inputClass}
              />
            </Field>

            <Choice label="Package you are leaning towards (optional)" options={PACKAGES} value={values.pack} onChange={choose("pack")} />
            <Choice label="When do you want to launch? (optional)" options={TIMELINES} value={values.timeline} onChange={choose("timeline")} />

            <Field label="Anything else we should know?" htmlFor="enquiry-message">
              <textarea
                id="enquiry-message"
                name="message"
                rows={3}
                value={values.message}
                onChange={set("message")}
                placeholder="Pages you need, websites you like, questions"
                className={`${inputClass} min-h-28 resize-none`}
              />
            </Field>
          </div>

          {/* ───────── Right: the message, as it will be sent ───────── */}
          <div className="lg:sticky lg:top-28">
            <div className="glass overflow-hidden rounded-[2rem] p-2.5">
              <div className="rounded-[1.5rem] bg-black/60">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-sm font-black tracking-tight text-bone">Your message</p>
                  <p className="text-xs font-semibold text-white/50">Updates as you type</p>
                </div>

                <div className="px-5 py-6" aria-live="polite">
                  <p className="ml-auto max-w-[92%] whitespace-pre-line break-words rounded-2xl rounded-br-md bg-bone px-4 py-3 text-base font-semibold leading-7 text-ink">
                    {message}
                  </p>
                </div>

                <div className="grid gap-3 border-t border-white/10 p-5">
                  <button type="submit" className="premium-button-light w-full">
                    Send on WhatsApp
                  </button>
                  <p className="text-center text-xs leading-5 text-white/45">
                    Nothing is stored on this site. Your message goes straight to WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}