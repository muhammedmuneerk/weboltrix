import { useId, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading.jsx";
import { faqs, whatsappLink } from "../data/siteData.js";

const EYEBROW = "FAQ";
const TITLE = "Straight answers before we start.";
const TEXT =
  "The questions most business owners ask before kicking off a website. Anything not covered here, ask us directly.";

export default function FaqSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => setOpenIndex((current) => (current === index ? -1 : index));

  return (
    <section className="section-padding">
      {/* ───────── Desktop layout (lg and up) – unchanged ───────── */}
      <div className="container-premium hidden gap-12 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 xl:gap-24">
        {/* ───────── Left: heading + direct-contact panel (sticky on desktop) ───────── */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-bone p-7 text-ink shadow-premium sm:p-8">
            <h3 className="text-2xl font-black leading-tight tracking-tight">
              Still have a question?
            </h3>
            <p className="mt-3 text-sm leading-7 text-black/58">
              Send a quick message about your business and we will reply with a clear next step.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                Ask on WhatsApp
              </a>
              <Link
                to="/contact"
                className="premium-button border border-black/15 bg-transparent text-ink hover:-translate-y-0.5 hover:border-black/40"
              >
                Send an enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* ───────── Right: accordion ───────── */}
        <div className="border-t border-white/10">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-q-${index}`;
            const panelId = `${baseId}-a-${index}`;

            return (
              <div
                key={question}
                className={`border-b border-white/10 transition-colors duration-500 motion-reduce:transition-none ${
                  isOpen ? "bg-white/[0.035]" : "hover:bg-white/[0.02]"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="group flex w-full items-center justify-between gap-6 px-1 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone sm:px-4 sm:py-8"
                  >
                    <span
                      className={`text-xl font-black leading-snug tracking-tight transition-colors duration-300 motion-reduce:transition-none sm:text-2xl lg:text-[1.65rem] ${
                        isOpen ? "text-bone" : "text-white/60 group-hover:text-bone"
                      }`}
                    >
                      {question}
                    </span>

                    {/* Plus → minus indicator */}
                    <span
                      aria-hidden="true"
                      className={`relative flex h-11 w-11 flex-none items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
                        isOpen
                          ? "border-bone bg-bone text-ink shadow-glow"
                          : "border-white/15 bg-white/5 text-bone group-hover:border-white/35"
                      }`}
                    >
                      <span className="absolute h-px w-4 bg-current" />
                      <span
                        className={`absolute h-4 w-px bg-current transition-transform duration-500 motion-reduce:transition-none ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl px-1 pb-8 text-base leading-8 text-white/62 sm:px-4 sm:pb-10 sm:text-lg sm:leading-9">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────── Mobile / tablet layout (below lg) ───────── */}
      <div className="container-premium lg:hidden">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} align="center" />

        {/* Numbered accordion cards — ties into the same 01/02 numbering
            language used elsewhere on this page, instead of a plain
            divided list. */}
        <div className="stagger-grid mt-10 grid gap-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-m-q-${index}`;
            const panelId = `${baseId}-m-a-${index}`;

            return (
              <div
                key={question}
                className={`overflow-hidden rounded-[1.6rem] border transition-colors duration-500 motion-reduce:transition-none ${
                  isOpen ? "border-white/25 bg-white/[0.07]" : "border-white/10 bg-white/[0.045]"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full items-start gap-4 px-5 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-bone sm:px-6"
                  >
                    <span
                      className={`mt-0.5 text-xs font-black tracking-[0.1em] transition-colors duration-300 motion-reduce:transition-none ${
                        isOpen ? "text-bone" : "text-white/35"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`flex-1 text-lg font-black leading-snug tracking-tight transition-colors duration-300 motion-reduce:transition-none sm:text-xl ${
                        isOpen ? "text-bone" : "text-white/70"
                      }`}
                    >
                      {question}
                    </span>

                    {/* Plus → minus indicator */}
                    <span
                      aria-hidden="true"
                      className={`relative mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border transition duration-500 motion-reduce:transition-none ${
                        isOpen
                          ? "border-bone bg-bone text-ink"
                          : "border-white/15 bg-white/5 text-bone"
                      }`}
                    >
                      <span className="absolute h-px w-3 bg-current" />
                      <span
                        className={`absolute h-3 w-px bg-current transition-transform duration-500 motion-reduce:transition-none ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 pl-[2.75rem] text-sm leading-7 text-white/58 sm:px-6 sm:pl-[3.25rem] sm:text-base sm:leading-8">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact fallback — stacked after the questions rather than
            beside them, with full-width buttons for thumb reach. */}
        <div className="mt-8 rounded-[2rem] border border-white/10 bg-bone p-7 text-ink shadow-premium sm:p-8">
          <h3 className="text-2xl font-black leading-tight tracking-tight">
            Still have a question?
          </h3>
          <p className="mt-3 text-sm leading-7 text-black/58">
            Send a quick message about your business and we will reply with a clear next step.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button w-full bg-ink text-bone hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              Ask on WhatsApp
            </a>
            <Link
              to="/contact"
              className="premium-button w-full border border-black/15 bg-transparent text-ink hover:-translate-y-0.5 hover:border-black/40"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}