import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];

const STEPS = [
  { label: "About you", title: "Who are we talking to?", hint: "Your name and your business." },
  { label: "Contact", title: "What number can we reach you on?", hint: "We will use it to get back to you." },
  { label: "Your site", title: "What are you looking for?", hint: "Both are optional. Pick what fits, or continue." },
  { label: "Details", title: "Anything else we should know?", hint: "Pages you need, websites you like, or questions. Optional." },
  { label: "Review", title: "Ready to send?", hint: "Check your details. Sending opens WhatsApp with this message ready." },
];
const LAST = STEPS.length - 1;

const inputClass =
  "w-full border-0 border-b-2 border-black/15 bg-transparent pb-3 pt-2 text-2xl font-bold text-ink outline-none transition-colors placeholder:text-black/25 focus:border-ink";

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-bold text-black/55">
        {label}
      </label>
      {children}
    </div>
  );
}

function Choice({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-bold text-black/55">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : option)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${
                selected
                  ? "border-ink bg-ink text-bone"
                  : "border-black/15 bg-black/[0.04] text-black/70 hover:border-black/40 hover:text-ink"
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

export default function ContactEnquiryFlow() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState({ name: "", business: "", phone: "", pack: "", timeline: "", message: "" });
  const set = (key) => (event) => setV((s) => ({ ...s, [key]: event.target.value }));
  const choose = (key) => (next) => setV((s) => ({ ...s, [key]: next }));

  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const moved = useRef(false); // only manage focus after the visitor has used the controls

  const isValid = (index) => {
    if (index === 0) return Boolean(v.name.trim() && v.business.trim());
    if (index === 1) return v.phone.replace(/\D/g, "").length >= 7;
    return true;
  };

  const go = (next) => {
    moved.current = true;
    setStep(Math.min(LAST, Math.max(0, next)));
  };

  useEffect(() => {
    if (!moved.current) return;
    const target = panelRef.current?.querySelector("input, textarea") || headingRef.current;
    target?.focus({ preventScroll: true });
  }, [step]);

  const message = [
    "Hi, I want a website for my business.",
    v.name && `Name: ${v.name.trim()}`,
    v.business && `Business: ${v.business.trim()}`,
    v.phone && `Phone: ${v.phone.trim()}`,
    v.pack && `Package: ${v.pack}`,
    v.timeline && `Launch: ${v.timeline}`,
    v.message.trim() && `Message: ${v.message.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step < LAST) {
      if (isValid(step)) go(step + 1);
      return;
    }
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const reviewRows = [
    ["Name and business", [v.name.trim(), v.business.trim()].filter(Boolean).join(", "), 0],
    ["Phone", v.phone.trim(), 1],
    ["Package and launch", [v.pack, v.timeline].filter(Boolean).join(", ") || "Not added", 2],
    ["Message", v.message.trim() || "Not added", 3],
  ];

  const current = STEPS[step];

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <SectionHeading
          align="center"
          eyebrow="Enquiry"
          title="Start your enquiry."
          text="Five short steps, one question at a time. At the end, WhatsApp opens with your message ready to send."
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto mt-14 grid max-w-6xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-bone text-ink shadow-premium lg:mt-20 lg:grid-cols-[0.78fr_1.22fr]"
        >
          {/* ───────── Step rail ───────── */}
          <div className="flex flex-col justify-between gap-8 bg-ink p-6 text-bone sm:p-8 lg:p-10">
            <div>
              <p className="text-xl font-black tracking-tight">Your enquiry</p>

              {/* Phones and tablets: segmented progress */}
              <div className="mt-5 lg:hidden">
                <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.label}
                      className={`h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none ${
                        i <= step ? "bg-bone" : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs font-bold text-white/55" aria-live="polite">
                  Step {step + 1} of {STEPS.length}: {current.label}
                </p>
              </div>

              {/* Desktop: vertical rail */}
              <ol className="mt-10 hidden lg:block">
                {STEPS.map((s, i) => {
                  const isActive = i === step;
                  const isDone = i < step;
                  return (
                    <li key={s.label} className={`relative ${i === LAST ? "" : "pb-7"}`}>
                      {i !== LAST && (
                        <span aria-hidden="true" className="absolute bottom-0 left-[1.125rem] top-10 w-px bg-white/12">
                          <span
                            className={`absolute inset-0 origin-top bg-bone/70 transition-transform duration-700 motion-reduce:transition-none ${
                              isDone ? "scale-y-100" : "scale-y-0"
                            }`}
                          />
                        </span>
                      )}
                      <div className="flex items-center gap-4" aria-current={isActive ? "step" : undefined}>
                        <span
                          className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xs font-black transition duration-500 motion-reduce:transition-none ${
                            isActive
                              ? "border-bone bg-bone text-ink shadow-glow"
                              : isDone
                                ? "border-white/40 bg-ink text-bone"
                                : "border-white/15 bg-ink text-white/45"
                          }`}
                        >
                          {isDone ? (
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="3" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        <span
                          className={`text-base font-black tracking-tight transition-colors duration-500 motion-reduce:transition-none ${
                            isActive ? "text-bone" : isDone ? "text-white/70" : "text-white/40"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <p className="hidden text-sm leading-7 text-white/50 lg:block">
              Takes about a minute. Nothing is stored on this site; your message goes straight to WhatsApp.
            </p>
          </div>

          {/* ───────── Current question ───────── */}
          <div className="flex min-h-[30rem] flex-col p-6 sm:p-10 lg:p-14">
            <div key={step} ref={panelRef} className="flex-1 animate-fade-up motion-reduce:animate-none">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="text-3xl font-black leading-[1.05] tracking-tight text-balance outline-none sm:text-5xl"
              >
                {current.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-7 text-black/55">{current.hint}</p>

              <div className="mt-10 grid gap-9">
                {step === 0 && (
                  <>
                    <Field label="Your name" htmlFor="flow-name">
                      <input id="flow-name" type="text" autoComplete="name" value={v.name} onChange={set("name")} placeholder="Full name" className={inputClass} />
                    </Field>
                    <Field label="Business name" htmlFor="flow-business">
                      <input id="flow-business" type="text" autoComplete="organization" value={v.business} onChange={set("business")} placeholder="Business name" className={inputClass} />
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <Field label="Phone number" htmlFor="flow-phone">
                    <input id="flow-phone" type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} placeholder="+91 00000 00000" className={inputClass} />
                  </Field>
                )}

                {step === 2 && (
                  <>
                    <Choice label="Package you are leaning towards" options={PACKAGES} value={v.pack} onChange={choose("pack")} />
                    <Choice label="When do you want to launch?" options={TIMELINES} value={v.timeline} onChange={choose("timeline")} />
                  </>
                )}

                {step === 3 && (
                  <Field label="Your message" htmlFor="flow-message">
                    <textarea id="flow-message" rows={4} value={v.message} onChange={set("message")} placeholder="Tell us a little more" className={`${inputClass} min-h-32 resize-none`} />
                  </Field>
                )}

                {step === LAST && (
                  <dl className="divide-y divide-black/10 border-y border-black/10">
                    {reviewRows.map(([label, value, target]) => (
                      <div key={label} className="flex items-start justify-between gap-4 py-4">
                        <div className="min-w-0">
                          <dt className="text-sm font-bold text-black/50">{label}</dt>
                          <dd className="mt-1 whitespace-pre-line break-words text-lg font-bold">{value}</dd>
                        </div>
                        <button
                          type="button"
                          onClick={() => go(target)}
                          className="flex-none pt-0.5 text-sm font-bold text-black/55 underline underline-offset-4 transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="rounded-full px-2 py-3 text-sm font-bold text-black/55 transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="submit"
                disabled={!isValid(step)}
                className="premium-button bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-35"
              >
                {step === LAST ? "Send on WhatsApp" : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
