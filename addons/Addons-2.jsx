import SectionHeading from "./SectionHeading.jsx";

const EYEBROW = "Add-ons";
const TITLE = "Keep the website running cleanly after launch.";
const TEXT = "Add only what your business needs. The goal is a sharp site that stays reliable.";

const HOSTING = {
  name: "Hosting",
  text: "Fast, stable hosting guidance so your website stays accessible and professional.",
};
const MAINTENANCE = {
  name: "Maintenance",
  text: "Updates, small edits, performance checks, and yearly care for peace of mind.",
  // taken straight from the description above
  tasks: ["Updates", "Small edits", "Performance checks", "Yearly care"],
};

const BARS = 36;

const pad = (n) => String(n + 1).padStart(2, "0");

const css = `
  @keyframes addon-bar { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
  @keyframes addon-live { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.8); opacity: 0.3; } }
  @keyframes addon-dot {
    0%, 8% { background: transparent; border-color: rgba(255,255,255,0.25); }
    14%, 86% { background: #f5f3ef; border-color: #f5f3ef; }
    94%, 100% { background: transparent; border-color: rgba(255,255,255,0.25); }
  }
  @keyframes addon-mark {
    0%, 8% { opacity: 0; transform: scale(0.5); }
    14%, 86% { opacity: 1; transform: scale(1); }
    94%, 100% { opacity: 0; transform: scale(0.5); }
  }
  @keyframes addon-label {
    0%, 8% { color: rgba(255,255,255,0.45); }
    14%, 86% { color: #f5f3ef; }
    94%, 100% { color: rgba(255,255,255,0.45); }
  }
  .addon-bar { transform-origin: bottom; animation: addon-bar 2.4s ease-in-out infinite; animation-delay: var(--delay, 0s); }
  .addon-live { animation: addon-live 2.4s ease-in-out infinite; }
  .addon-check-dot { animation: addon-dot 9s ease-in-out infinite; animation-delay: var(--delay, 0s); }
  .addon-check-mark { animation: addon-mark 9s ease-in-out infinite; animation-delay: var(--delay, 0s); opacity: 0; }
  .addon-check-label { animation: addon-label 9s ease-in-out infinite; animation-delay: var(--delay, 0s); }
  @media (prefers-reduced-motion: reduce) {
    .addon-bar, .addon-live { animation: none; }
    .addon-check-dot { animation: none; background: #f5f3ef; border-color: #f5f3ef; }
    .addon-check-mark { animation: none; opacity: 1; }
    .addon-check-label { animation: none; color: #f5f3ef; }
  }
`;

// Two status widgets, like a small control panel for the live site:
// hosting shows a live signal, maintenance a checklist that keeps ticking.
export default function AddOns() {
  return (
    <section className="section-padding border-y border-white/10 bg-white/[0.025]">
      <style>{css}</style>

      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2">
          {/* ───────── Hosting ───────── */}
          <article className="glass flex flex-col justify-between gap-10 rounded-[2rem] p-7 sm:p-9">
            <div>
              <p className="text-xs font-black tabular-nums tracking-[0.1em] text-white/35">
                {pad(0)}
              </p>
              <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {HOSTING.name}
              </h3>
              <p className="mt-4 max-w-md text-base leading-8 text-white/58">{HOSTING.text}</p>
            </div>

            <div
              aria-hidden="true"
              className="rounded-2xl border border-white/10 bg-black/35 p-5 sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span className="addon-live h-2.5 w-2.5 rounded-full bg-bone" />
                <span className="text-xs font-black uppercase tracking-[0.22em] text-bone">
                  Online
                </span>
              </div>
              <div className="mt-6 flex h-16 items-end gap-1">
                {Array.from({ length: BARS }, (_, index) => (
                  <span
                    key={index}
                    className="addon-bar h-full flex-1 rounded-sm bg-bone/70"
                    style={{ "--delay": `${index * 0.07}s` }}
                  />
                ))}
              </div>
            </div>
          </article>

          {/* ───────── Maintenance ───────── */}
          <article className="glass flex flex-col justify-between gap-10 rounded-[2rem] p-7 sm:p-9">
            <div>
              <p className="text-xs font-black tabular-nums tracking-[0.1em] text-white/35">
                {pad(1)}
              </p>
              <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {MAINTENANCE.name}
              </h3>
              <p className="mt-4 max-w-md text-base leading-8 text-white/58">
                {MAINTENANCE.text}
              </p>
            </div>

            <ul
              aria-hidden="true"
              className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/35 px-5 sm:px-6"
            >
              {MAINTENANCE.tasks.map((task, index) => (
                <li
                  key={task}
                  className="flex items-center gap-4 py-4"
                  style={{ "--delay": `${index * 1.6}s` }}
                >
                  <span className="addon-check-dot flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/25">
                    <svg
                      viewBox="0 0 24 24"
                      className="addon-check-mark h-3 w-3 fill-none stroke-ink"
                      strokeWidth="3"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="addon-check-label text-sm font-black tracking-tight sm:text-base">
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}