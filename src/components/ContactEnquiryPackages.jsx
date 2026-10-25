import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const TIMELINES = ["Within 2 weeks", "Within a month", "Flexible"];
const pad = (n) => String(n + 1).padStart(2, "0");

const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-white/35";

export default function ContactEnquiryPackages() {
  const [pack, setPack] = useState(-1);
  const [timeline, setTimeline] = useState(TIMELINES.length - 1);
  const [v, setV] = useState({ name: "", business: "", phone: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));

  const chosen = pack >= 0 ? services[pack] : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = [
      "Hi, I want a website for my business.",
      `Name: ${v.name.trim()}`,
      `Business: ${v.business.trim()}`,
      `Phone: ${v.phone.trim()}`,
      chosen && `Package: ${chosen.name}`,
      `Launch: ${TIMELINES[timeline]}`,
      v.message.trim() && `Message: ${v.message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Enquiry"
          title="Start with a package. Tell us the rest."
          text="Pick the level that fits, see exactly what it includes, then send your details. Not sure yet? Skip the package and just tell us about your business."
        />

        {/* ───────── Package tiles ───────── */}
        <div role="radiogroup" aria-label="Website package" className="mt-14 grid gap-4 sm:grid-cols-3 lg:mt-20">
          {services.map((service, index) => {
            const selected = index === pack;
            return (
              <button
                key={service.name}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPack(selected ? -1 : index)}
                className={`group relative overflow-hidden rounded-[1.8rem] border p-6 text-left transition duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none sm:min-h-[12.5rem] sm:p-7 ${
                  selected
                    ? "border-bone bg-bone text-ink shadow-glow"
                    : "border-white/10 bg-white/[0.045] text-bone hover:-translate-y-1 hover:border-white/25"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-5 -right-1 select-none text-[8rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: selected ? "1px rgba(5,5,5,0.12)" : "1px rgba(255,255,255,0.07)",
                  }}
                >
                  {pad(index)}
                </span>

                <span className="relative flex items-start justify-between gap-3">
                  <span className={`text-xs font-black uppercase tracking-[0.22em] ${selected ? "text-black/45" : "text-white/40"}`}>
                    {service.price}
                    {service.featured ? " · Popular" : ""}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
                      selected ? "border-ink bg-ink text-bone" : "border-white/25 text-transparent"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current" strokeWidth="3">
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>

                <span className="relative mt-8 block text-4xl font-black tracking-tight sm:mt-12">{service.name}</span>
              </button>
            );
          })}
        </div>

        {/* ───────── What is included + details form ───────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div
            key={chosen ? chosen.name : "none"}
            aria-live="polite"
            className="glass animate-fade-up rounded-[2rem] p-7 motion-reduce:animate-none sm:p-9"
          >
            {chosen ? (
              <>
                <p className="eyebrow">What is included</p>
                <h3 className="mt-4 text-4xl font-black tracking-tight">{chosen.name}</h3>
                <p className="mt-4 text-base font-semibold leading-8 text-white/65">{chosen.audience}</p>
                <ul className="mt-7 border-t border-white/12">
                  {chosen.details.map((detail) => (
                    <li key={detail} className="flex gap-3 border-b border-white/[0.07] py-3.5 text-sm leading-7 text-white/62 last:border-b-0">
                      <span aria-hidden="true" className="flex-none font-black text-bone">+</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="eyebrow">What is included</p>
                <h3 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Choose a package above.</h3>
                <p className="mt-4 text-base leading-8 text-white/58">
                  Each level shows exactly what you get. You can also skip it and describe what you need in your
                  message.
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6 sm:p-9">
            <p className="text-sm font-bold text-white/55">
              Starting with:{" "}
              <span className="font-black text-bone">{chosen ? chosen.name : "not chosen yet"}</span>
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-white/75">
                Name
                <input className={fieldClass} type="text" name="name" autoComplete="name" required value={v.name} onChange={set("name")} />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/75">
                Business name
                <input className={fieldClass} type="text" name="business" autoComplete="organization" required value={v.business} onChange={set("business")} />
              </label>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-bold text-white/75">
              Phone
              <input className={fieldClass} type="tel" name="phone" autoComplete="tel" required value={v.phone} onChange={set("phone")} />
            </label>

            <div className="mt-5">
              <p className="text-sm font-bold text-white/75">When do you want to launch?</p>
              <div
                role="radiogroup"
                aria-label="Launch timeline"
                className="relative mt-2 grid grid-cols-3 rounded-full border border-white/10 bg-white/[0.05] p-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-bone shadow-glow transition-transform duration-500 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(${timeline * 100}%)` }}
                />
                {TIMELINES.map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={index === timeline}
                    onClick={() => setTimeline(index)}
                    className={`relative z-10 rounded-full px-1 py-3 text-xs font-black transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none sm:text-sm ${
                      index === timeline ? "text-ink" : "text-white/60 hover:text-bone"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 grid gap-2 text-sm font-bold text-white/75">
              Message (optional)
              <textarea className={`${fieldClass} min-h-32 resize-none`} name="message" value={v.message} onChange={set("message")} placeholder="Pages you need, websites you like, questions" />
            </label>

            <button className="premium-button-light mt-6 w-full" type="submit">
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
