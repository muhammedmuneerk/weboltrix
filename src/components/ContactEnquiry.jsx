import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];

const INITIAL = { name: "", business: "", phone: "", pack: "", timeline: "", message: "" };

const inputClass =
  "w-full border-0 border-b border-white/15 bg-transparent pb-3 pt-2 text-xl font-bold text-bone outline-none transition-colors placeholder:text-white/25 focus:border-bone sm:text-2xl";

// Only one layout is mounted at a time, so each field exists once and the
// browser's required-field validation never meets a hidden input.
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

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

// ───────── Mobile / tablet pieces ─────────

const mobileInput =
  "mt-1 w-full border-0 bg-transparent p-0 text-lg font-bold text-bone outline-none placeholder:text-white/25";

// A row in a grouped card: small label on top, the value underneath.
function MobileRow({ label, htmlFor, optional = false, children }) {
  return (
    <div className="px-5 py-4 transition-colors focus-within:bg-white/[0.04] motion-reduce:transition-none">
      <label htmlFor={htmlFor} className="block text-xs font-bold text-white/45">
        {label}
        {optional && <span className="ml-2 font-semibold text-white/30">Optional</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactEnquiry() {
  const [values, setValues] = useState(INITIAL);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const choose = (key) => (next) => setValues((v) => ({ ...v, [key]: next }));

  // One message, used for both the live preview and the WhatsApp hand-off.
  const lines = [
    `Hi, I want a website${values.business.trim() ? " for my business" : ""}.`,
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

  const timelineIndex = TIMELINES.indexOf(values.timeline);

  return (
    <section
      id="enquiry-form"
      className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]"
    >
      <div className="container-premium">
        {isDesktop ? (
          <>
            {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
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
                  <Field label="Business or project (optional)" htmlFor="enquiry-business">
                    <input
                      id="enquiry-business"
                      name="business"
                      type="text"
                      autoComplete="organization"
                      value={values.business}
                      onChange={set("business")}
                      placeholder="Business or project name"
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
          </>
        ) : (
          /* ───────── Mobile / tablet layout (below lg) ───────── */
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Enquiry"
              title="Tell us what you are building."
              text="Fill in what you can. Sending opens WhatsApp with your message ready."
            />

            <div className="mt-10 grid gap-8">
              {/* About you: one grouped card, hairlines between rows */}
              <div>
                <p className="eyebrow mb-3 ml-1">About you</p>
                <div className="divide-y divide-white/10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]">
                  <MobileRow label="Your name" htmlFor="m-enquiry-name">
                    <input
                      id="m-enquiry-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={values.name}
                      onChange={set("name")}
                      placeholder="Full name"
                      className={mobileInput}
                    />
                  </MobileRow>
                  <MobileRow label="Business or project" htmlFor="m-enquiry-business" optional>
                    <input
                      id="m-enquiry-business"
                      name="business"
                      type="text"
                      autoComplete="organization"
                      value={values.business}
                      onChange={set("business")}
                      placeholder="Business or project name"
                      className={mobileInput}
                    />
                  </MobileRow>
                  <MobileRow label="Phone number" htmlFor="m-enquiry-phone">
                    <input
                      id="m-enquiry-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={values.phone}
                      onChange={set("phone")}
                      placeholder="+91 00000 00000"
                      className={mobileInput}
                    />
                  </MobileRow>
                </div>
              </div>

              {/* Your site: package tiles + launch segmented control */}
              <div>
                <p className="eyebrow mb-3 ml-1">Your site</p>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
                  <div role="group" aria-label="Package you are leaning towards">
                    <p className="text-xs font-bold text-white/45">
                      Package <span className="ml-2 font-semibold text-white/30">Optional</span>
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {services.map((service) => {
                        const selected = values.pack === service.name;
                        return (
                          <button
                            key={service.name}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => choose("pack")(selected ? "" : service.name)}
                            className={`flex min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-2xl border px-1.5 py-3 text-center transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none ${
                              selected
                                ? "border-bone bg-bone text-ink shadow-glow"
                                : "border-white/15 bg-white/5 text-bone"
                            }`}
                          >
                            <span className="text-sm font-black tracking-tight">{service.name}</span>
                            <span className={`text-[0.6rem] font-bold leading-tight ${selected ? "text-black/55" : "text-white/40"}`}>
                              {service.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div role="group" aria-label="When do you want to launch?" className="mt-6">
                    <p className="text-xs font-bold text-white/45">
                      Launch <span className="ml-2 font-semibold text-white/30">Optional</span>
                    </p>
                    <div className="relative mt-3 grid grid-cols-3 rounded-full border border-white/10 bg-white/[0.05] p-1">
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-bone shadow-glow transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none ${
                          timelineIndex < 0 ? "opacity-0" : "opacity-100"
                        }`}
                        style={{ transform: `translateX(${Math.max(timelineIndex, 0) * 100}%)` }}
                      />
                      {TIMELINES.map((option) => {
                        const selected = values.timeline === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => choose("timeline")(selected ? "" : option)}
                            className={`relative z-10 rounded-full px-1 py-3 text-xs font-black leading-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none ${
                              selected ? "text-ink" : "text-white/60"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="eyebrow mb-3 ml-1">Anything else</p>
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]">
                  <MobileRow label="Anything else we should know?" htmlFor="m-enquiry-message" optional>
                    <textarea
                      id="m-enquiry-message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={set("message")}
                      placeholder="Pages you need, websites you like, questions"
                      className={`${mobileInput} min-h-28 resize-none leading-7`}
                    />
                  </MobileRow>
                </div>
              </div>

              {/* Preview, folded away until wanted */}
              <details className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-sm font-black tracking-tight text-bone">Preview your message</span>
                    <span className="block text-xs font-semibold text-white/45">Updates as you type</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-bone transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 py-5" aria-live="polite">
                  <p className="ml-auto max-w-[92%] whitespace-pre-line break-words rounded-2xl rounded-br-md bg-bone px-4 py-3 text-base font-semibold leading-7 text-ink">
                    {message}
                  </p>
                </div>
              </details>

              <div>
                <button type="submit" className="premium-button-light w-full">
                  Send on WhatsApp
                </button>
                <p className="mt-4 text-center text-xs leading-5 text-white/45">
                  Nothing is stored on this site. Your message goes straight to WhatsApp.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}