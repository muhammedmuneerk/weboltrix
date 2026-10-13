import { useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import { whatsappLink } from "../data/siteData.js";

const EYEBROW = "Add-ons";
const TITLE = "Keep the website running cleanly after launch.";
const TEXT = "Add only what your business needs. The goal is a sharp site that stays reliable.";

const ADDONS = [
  ["Hosting", "Fast, stable hosting guidance so your website stays accessible and professional."],
  ["Maintenance", "Updates, small edits, performance checks, and yearly care for peace of mind."],
];

const pad = (n) => String(n + 1).padStart(2, "0");

// "Add only what you need", made literal: each add-on is a switch, and a
// summary card keeps track of the selection and turns it into a WhatsApp message.
export default function AddOns() {
  const [on, setOn] = useState({});

  const toggle = (name) => setOn((current) => ({ ...current, [name]: !current[name] }));

  const selected = ADDONS.filter(([name]) => on[name]).map(([name]) => name);

  const baseUrl = whatsappLink.split("?")[0];
  const message = [
    "Hi, I want a website for my business.",
    selected.length ? `Add-ons: ${selected.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const href = `${baseUrl}?text=${encodeURIComponent(message)}`;

  return (
    <section className="section-padding border-y border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.9fr] lg:gap-6">
          {/* ───────── Add-on switches ───────── */}
          {ADDONS.map(([name, text], index) => {
            const isOn = Boolean(on[name]);

            return (
              <article
                key={name}
                onClick={() => toggle(name)}
                className={`relative flex min-h-[20rem] cursor-pointer flex-col justify-between gap-10 overflow-hidden rounded-[2rem] border p-7 transition duration-500 hover:-translate-y-2 motion-reduce:transition-none sm:p-9 ${
                  isOn
                    ? "border-bone bg-bone text-ink shadow-glow"
                    : "border-white/10 bg-white/[0.045] text-bone hover:border-white/25"
                }`}
              >
                {/* Ghost numeral */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[11rem] font-black leading-none tracking-tighter text-transparent"
                  style={{
                    WebkitTextStroke: isOn ? "1px rgba(5,5,5,0.12)" : "1px rgba(255,255,255,0.07)",
                  }}
                >
                  {pad(index)}
                </span>

                <div className="relative flex items-center justify-between gap-4">
                  <span
                    className={`text-xs font-black tabular-nums tracking-[0.1em] transition-colors duration-500 ${
                      isOn ? "text-black/45" : "text-white/35"
                    }`}
                  >
                    {pad(index)}
                  </span>

                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
                        isOn ? "text-black/55" : "text-white/42"
                      }`}
                    >
                      {isOn ? "Added" : "Add"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isOn}
                      aria-label={`Add ${name}`}
                      className={`relative h-8 w-14 flex-none rounded-full border transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone motion-reduce:transition-none ${
                        isOn ? "border-ink bg-ink" : "border-white/20 bg-white/5"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-1 top-1 h-6 w-6 rounded-full transition-transform duration-500 motion-reduce:transition-none ${
                          isOn ? "translate-x-6 bg-bone" : "translate-x-0 bg-white/60"
                        }`}
                      />
                    </button>
                  </span>
                </div>

                <div className="relative">
                  <h3 className="text-4xl font-black tracking-tight sm:text-5xl">{name}</h3>
                  <p
                    className={`mt-4 max-w-sm text-base leading-8 transition-colors duration-500 ${
                      isOn ? "text-black/68" : "text-white/58"
                    }`}
                  >
                    {text}
                  </p>
                </div>
              </article>
            );
          })}

          {/* ───────── Selection summary ───────── */}
          <aside className="hero-mesh relative flex min-h-[20rem] flex-col justify-between gap-8 overflow-hidden rounded-[2rem] border border-white/10 p-7 shadow-premium sm:col-span-2 sm:p-9 lg:col-span-1">
            <div className="fine-grid absolute inset-0 opacity-45" />

            <div className="relative">
              <p className="eyebrow">Your selection</p>
              <p className="mt-4 flex items-baseline gap-3" aria-live="polite">
                <span className="text-7xl font-black leading-none tracking-tighter">
                  {selected.length}
                </span>
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                  {selected.length === 1 ? "add-on" : "add-ons"}
                </span>
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                <li className="rounded-full bg-bone px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-ink">
                  Website
                </li>
                {selected.map((name) => (
                  <li
                    key={name}
                    className="animate-fade-up rounded-full border border-white/20 bg-white/[0.08] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-bone motion-reduce:animate-none"
                  >
                    + {name}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button-light relative w-full"
            >
              Send on WhatsApp
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}