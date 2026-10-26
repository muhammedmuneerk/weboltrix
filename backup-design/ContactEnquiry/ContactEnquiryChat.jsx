import { useEffect, useRef, useState } from "react";
import { brandAssets, services, whatsappLink } from "../data/siteData.js";

const PACKAGES = services.map((service) => service.name);
const TIMELINES = ["Within 2 weeks", "This month", "No rush"];
const INITIAL = { name: "", business: "", phone: "", pack: "", timeline: "", message: "" };

const firstName = (a) => a.name.trim().split(/\s+/)[0] || "there";

// One question per step. Only name and phone are required.
const QUESTIONS = [
  { key: "name", kind: "text", required: true, label: "Your name", placeholder: "Full name", autoComplete: "name", ask: () => "Hi! What is your name?" },
  { key: "business", kind: "text", label: "Business or project", placeholder: "Business or project name", autoComplete: "organization", ask: (a) => `Nice to meet you, ${firstName(a)}. What is your business or project called?` },
  { key: "phone", kind: "tel", required: true, label: "Phone number", placeholder: "+91 00000 00000", autoComplete: "tel", ask: () => "What number can we reach you on?" },
  { key: "pack", kind: "choice", options: PACKAGES, ask: () => "Which package are you leaning towards?" },
  { key: "timeline", kind: "choice", options: TIMELINES, ask: () => "When would you like to launch?" },
  { key: "message", kind: "area", label: "Anything else", placeholder: "Pages you need, websites you like, questions", ask: () => "Anything else we should know?" },
];
const DONE = QUESTIONS.length;

const css = `
  @keyframes enq-typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
  .enq-dot { animation: enq-typing 1.2s ease-in-out infinite; }
  .enq-dot:nth-child(2) { animation-delay: 0.15s; }
  .enq-dot:nth-child(3) { animation-delay: 0.3s; }
  @media (prefers-reduced-motion: reduce) { .enq-dot { animation: none; opacity: 0.7; } }
`;

const fieldClass =
  "min-w-0 flex-1 border border-white/10 bg-black/35 px-5 text-base font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-white/35 motion-reduce:transition-none";
const chipClass =
  "rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white/75 transition hover:border-white/35 hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone motion-reduce:transition-none";

const fromThem = "max-w-[85%] animate-fade-up rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3 text-base font-semibold leading-7 text-bone motion-reduce:animate-none";
const fromYou = "ml-auto max-w-[85%] animate-fade-up whitespace-pre-line break-words rounded-2xl rounded-br-md bg-bone px-4 py-3 text-base font-semibold leading-7 text-ink motion-reduce:animate-none";

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactEnquiryChat() {
  const [answers, setAnswers] = useState(INITIAL);
  const [skipped, setSkipped] = useState({});
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const logRef = useRef(null);
  const inputRef = useRef(null);
  const timer = useRef(0);
  const moved = useRef(false); // only manage focus once the visitor has answered something

  const q = QUESTIONS[step];
  const answered = typing ? step + 1 : step; // the answer stays visible while the next question "types"

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
    if (moved.current && !typing) inputRef.current?.focus({ preventScroll: true });
  }, [step, typing]);

  const valid =
    !q || !q.required
      ? true
      : q.kind === "tel"
        ? draft.replace(/\D/g, "").length >= 7
        : Boolean(draft.trim());

  const advance = (value, wasSkipped = false) => {
    moved.current = true;
    setAnswers((a) => ({ ...a, [q.key]: value }));
    setSkipped((s) => ({ ...s, [q.key]: wasSkipped }));
    setDraft("");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep((s) => s + 1);
      return;
    }
    setTyping(true);
    timer.current = window.setTimeout(() => {
      setStep((s) => s + 1);
      setTyping(false);
    }, 600);
  };

  const submitDraft = (event) => {
    event?.preventDefault();
    if (valid) advance(draft.trim());
  };

  const restart = () => {
    window.clearTimeout(timer.current);
    setAnswers(INITIAL);
    setSkipped({});
    setStep(0);
    setTyping(false);
    setDraft("");
  };

  const sendToWhatsApp = () => {
    const message = [
      `Hi, I want a website${answers.business ? " for my business" : ""}.`,
      answers.name && `Name: ${answers.name}`,
      answers.business && `Business: ${answers.business}`,
      answers.phone && `Phone: ${answers.phone}`,
      answers.pack && `Package: ${answers.pack}`,
      answers.timeline && `Launch: ${answers.timeline}`,
      answers.message && `Message: ${answers.message}`,
    ]
      .filter(Boolean)
      .join("\n");
    const baseUrl = whatsappLink.split("?")[0];
    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const skipButton = (
    <button type="button" onClick={() => advance("", true)} className={chipClass}>
      Skip
    </button>
  );

  return (
    <section id="enquiry-form" className="section-padding scroll-mt-20 border-t border-white/10 bg-white/[0.025]">
      <style>{css}</style>

      <div className="container-premium grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16 xl:gap-24">
        {/* ───────── Intro ───────── */}
        <div>
          <p className="eyebrow">Enquiry</p>
          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-balance sm:text-6xl sm:leading-[0.98] lg:text-7xl">
            Start the conversation.
          </h2>
          <p className="mt-7 max-w-md text-lg leading-9 text-white/58">
            Answer a few quick questions, one at a time. At the end, WhatsApp opens with your message ready to send.
          </p>
          <ul className="mt-8 max-w-sm border-t border-white/12">
            {["Only your name and number are required", "Skip anything you are not sure about", "Nothing is stored on this site"].map((item) => (
              <li key={item} className="flex gap-3 border-b border-white/[0.07] py-3.5 text-sm font-semibold text-white/65">
                <span aria-hidden="true" className="font-black text-bone">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ───────── Chat window ───────── */}
        <div className="glass mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] p-2.5 lg:mr-0">
          <div className="rounded-[1.5rem] bg-black/60">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-ink p-2">
                  <img src={brandAssets.logoSquare} alt="" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="text-sm font-black tracking-tight text-bone">Weboltrix</p>
                  <p className="text-xs font-semibold text-white/50">Your enquiry, one question at a time</p>
                </div>
              </div>
              {step > 0 && step < DONE + 1 && (
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-full px-3 py-2 text-xs font-bold text-white/50 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone"
                >
                  Start over
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="flex h-[24rem] flex-col gap-3 overflow-y-auto overscroll-contain px-5 py-6 sm:h-[27rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {QUESTIONS.slice(0, answered).map((item, i) => (
                <div key={item.key} className="grid gap-3">
                  <p className={fromThem}>{item.ask(answers)}</p>
                  {skipped[item.key] ? (
                    <p className="ml-auto rounded-2xl rounded-br-md border border-white/10 px-4 py-3 text-sm font-semibold text-white/45">
                      Skipped
                    </p>
                  ) : (
                    <p className={fromYou}>{answers[item.key]}</p>
                  )}
                </div>
              ))}

              {typing ? (
                <div aria-hidden="true" className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3.5">
                  <span className="enq-dot h-1.5 w-1.5 rounded-full bg-bone" />
                  <span className="enq-dot h-1.5 w-1.5 rounded-full bg-bone" />
                  <span className="enq-dot h-1.5 w-1.5 rounded-full bg-bone" />
                </div>
              ) : q ? (
                <p key={q.key} className={fromThem}>{q.ask(answers)}</p>
              ) : (
                <p className={fromThem}>That is everything. Ready to send it over?</p>
              )}
            </div>

            {/* Reply area */}
            <div className="border-t border-white/10 p-4 sm:p-5">
              {typing ? (
                <p className="py-3 text-center text-xs font-semibold text-white/40">One moment...</p>
              ) : !q ? (
                <div className="grid gap-3">
                  <button type="button" onClick={sendToWhatsApp} className="premium-button-light w-full">
                    Send on WhatsApp
                  </button>
                  <button type="button" onClick={restart} className="py-2 text-sm font-bold text-white/55 transition hover:text-white">
                    Start over
                  </button>
                </div>
              ) : q.kind === "choice" ? (
                <div className="flex flex-wrap gap-2.5">
                  {q.options.map((option) => (
                    <button key={option} type="button" onClick={() => advance(option)} className={chipClass}>
                      {option}
                    </button>
                  ))}
                  {skipButton}
                </div>
              ) : (
                <form onSubmit={submitDraft} className="grid gap-3">
                  <div className="flex items-end gap-2">
                    {q.kind === "area" ? (
                      <textarea
                        ref={inputRef}
                        aria-label={q.label}
                        rows={2}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) submitDraft(event);
                        }}
                        placeholder={q.placeholder}
                        className={`${fieldClass} min-h-[4.25rem] resize-none rounded-3xl py-3.5`}
                      />
                    ) : (
                      <input
                        ref={inputRef}
                        aria-label={q.label}
                        type={q.kind}
                        autoComplete={q.autoComplete}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder={q.placeholder}
                        className={`${fieldClass} h-12 rounded-full`}
                      />
                    )}
                    <button
                      type="submit"
                      disabled={!valid || (q.kind === "area" && !draft.trim())}
                      aria-label="Send answer"
                      className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-bone text-ink shadow-glow transition hover:scale-105 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none"
                    >
                      <SendIcon />
                    </button>
                  </div>
                  {!q.required && <div className="flex">{skipButton}</div>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
