import { brandAssets, contactDetails, whatsappLink } from "../data/siteData.js";

// The first message is the same text the WhatsApp button pre-fills (see whatsappLink),
// so the preview shows exactly what the visitor will send.
const FIRST_MESSAGE = "Hi, I want a website for my business";

const CHANNELS = [
  { label: "Call us", value: contactDetails.phoneDisplay, href: `tel:${contactDetails.phone}` },
  { label: "Email", value: contactDetails.email, href: `mailto:${contactDetails.email}` },
  { label: "Instagram", value: "@weboltrix", href: contactDetails.instagram, external: true },
];

// The one moving part of the hero: the reply bubble "types" while the message waits.
const css = `
  @keyframes contact-typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
  .contact-dot { animation: contact-typing 1.2s ease-in-out infinite; }
  .contact-dot:nth-child(2) { animation-delay: 0.15s; }
  .contact-dot:nth-child(3) { animation-delay: 0.3s; }
  @media (prefers-reduced-motion: reduce) {
    .contact-dot { animation: none; opacity: 0.7; }
  }
`;

// Same props as PageHero, so Contact.jsx keeps its copy exactly as written.
export default function ContactHero({ eyebrow, title, children }) {
  return (
    <section className="hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <style>{css}</style>
      <div className="fine-grid absolute inset-0 -z-10" />

      <div className="container-premium w-full pb-14 pt-28 sm:pt-32 lg:pb-10 lg:pt-28">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16 xl:gap-24">
          {/* ───────── Left: the ask ───────── */}
          <div className="min-w-0">
            {eyebrow && (
              <p className="hero-kicker eyebrow flex animate-fade-up items-center gap-4 motion-reduce:animate-none">
                <span aria-hidden="true" className="h-px w-10 bg-white/40" />
                {eyebrow}
              </p>
            )}

            <h1
              className="hero-title mt-5 max-w-3xl sm:mt-6 animate-fade-up font-black leading-[0.95] tracking-tight text-balance text-[2.75rem] motion-reduce:animate-none sm:text-7xl lg:text-[clamp(3.5rem,min(7vw,12vh),6.5rem)]"
              style={{ animationDelay: "80ms" }}
            >
              {title}
            </h1>

            {children && (
              <div
                className="hero-copy mt-5 max-w-xl animate-fade-up text-lg sm:mt-8 leading-8 text-white/62 motion-reduce:animate-none sm:text-xl sm:leading-9"
                style={{ animationDelay: "180ms" }}
              >
                {children}
              </div>
            )}

            <p
              className="mt-8 hidden max-w-md animate-fade-up border-l-2 border-white/20 pl-5 text-sm font-semibold leading-7 text-white/62 motion-reduce:animate-none sm:block"
              style={{ animationDelay: "260ms" }}
            >
              Mention your business type, the pages you need, a few websites you like and when you
              want to launch. That is enough to get started.
            </p>
          </div>

          {/* ───────── Right: the conversation, already started ───────── */}
          <div
            className="relative mx-auto w-full max-w-md animate-fade-up motion-reduce:animate-none lg:ml-auto lg:mr-0"
            style={{ animationDelay: "200ms" }}
            data-cursor-glow
          >
            <div className="glass overflow-hidden rounded-[2rem] p-2.5">
              <div className="rounded-[1.5rem] bg-black/60">
                {/* Chat header */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-ink p-2">
                    <img src={brandAssets.logoSquare} alt="" className="h-full w-full object-contain" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-black tracking-tight text-bone">Weboltrix</p>
                    <p className="flex items-center gap-2 text-xs font-semibold text-white/50">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-bone" />
                      Chat on WhatsApp
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div
                  role="group"
                  aria-label="Preview of the WhatsApp message that will be sent"
                  className="flex flex-col justify-end gap-3 px-5 py-6 lg:min-h-[13rem]"
                >
                  <p
                    className="ml-auto max-w-[85%] animate-fade-up rounded-2xl rounded-br-md bg-bone px-4 py-3 text-base font-semibold leading-6 text-ink motion-reduce:animate-none"
                    style={{ animationDelay: "500ms" }}
                  >
                    {FIRST_MESSAGE}
                  </p>

                  <div
                    aria-hidden="true"
                    className="flex w-fit animate-fade-up items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3.5 motion-reduce:animate-none"
                    style={{ animationDelay: "1200ms" }}
                  >
                    <span className="contact-dot h-1.5 w-1.5 rounded-full bg-bone" />
                    <span className="contact-dot h-1.5 w-1.5 rounded-full bg-bone" />
                    <span className="contact-dot h-1.5 w-1.5 rounded-full bg-bone" />
                  </div>
                </div>

                {/* Actions */}
                <div className="grid gap-3 border-t border-white/10 p-5">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-button-light w-full"
                  >
                    Send this on WhatsApp
                  </a>
                  <a
                    href="#enquiry-form"
                    className="text-center text-sm font-bold text-white/58 transition hover:text-white"
                  >
                    Prefer a form? Send an enquiry
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Direct channels: a single strip, same rhythm as the About hero stats ───────── */}
        <dl
          className="mt-14 grid animate-fade-up border-t border-white/10 motion-reduce:animate-none lg:grid-cols-[1fr_1.6fr_1fr] lg:divide-x lg:divide-white/10 lg:mt-16"
          style={{ animationDelay: "400ms" }}
        >
          {CHANNELS.map((channel, index) => (
            <div
              key={channel.label}
              className={`border-b border-white/10 lg:border-b-0 ${
                index === 0 ? "lg:pr-8" : "lg:px-8"
              }`}
            >
              <dt className="pt-5 text-xs font-bold text-white/45">{channel.label}</dt>
              <dd className="pb-5 pt-1.5 lg:pb-0">
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="block break-words text-xl font-black tracking-tight text-bone transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone lg:py-1 lg:text-xl xl:text-2xl"
                >
                  {channel.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}