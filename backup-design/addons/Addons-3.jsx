import SectionHeading from "./SectionHeading.jsx";

const EYEBROW = "Add-ons";
const TITLE = "Keep the website running cleanly after launch.";
const TEXT = "Add only what your business needs.";
const RESULT = "The goal is a sharp site that stays reliable.";

const ADDONS = [
  {
    name: "Hosting",
    text: "Fast, stable hosting guidance so your website stays accessible and professional.",
  },
  {
    name: "Maintenance",
    text: "Updates, small edits, performance checks, and yearly care for peace of mind.",
  },
];

const Operator = ({ symbol, filled = false }) => (
  <span
    aria-hidden="true"
    className={`flex h-12 w-12 flex-none items-center justify-center justify-self-center self-center rounded-full border text-2xl font-black ${
      filled ? "border-bone bg-bone text-ink shadow-glow" : "border-white/15 bg-white/5 text-bone"
    }`}
  >
    {symbol}
  </span>
);

// The whole section as one small equation: Hosting + Maintenance = a reliable site.
export default function AddOns() {
  const [hosting, maintenance] = ADDONS;

  return (
    <section className="section-padding border-y border-white/10 bg-white/[0.025]">
      <div className="container-premium">
        <SectionHeading eyebrow={EYEBROW} title={TITLE} text={TEXT} />

        <div className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_auto_1fr_auto_1.1fr] lg:items-stretch lg:gap-5">
          <article className="glass card-hover rounded-[1.8rem] p-7 sm:p-8">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{hosting.name}</h3>
            <p className="mt-4 text-sm leading-7 text-white/58">{hosting.text}</p>
          </article>

          <Operator symbol="+" />

          <article className="glass card-hover rounded-[1.8rem] p-7 sm:p-8">
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl">{maintenance.name}</h3>
            <p className="mt-4 text-sm leading-7 text-white/58">{maintenance.text}</p>
          </article>

          <Operator symbol="=" filled />

          <article className="relative flex flex-col justify-end overflow-hidden rounded-[1.8rem] border border-bone bg-bone p-7 text-ink shadow-glow sm:p-8">
            {/* Ghost sign */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] font-black leading-none tracking-tighter text-transparent"
              style={{ WebkitTextStroke: "1px rgba(5,5,5,0.12)" }}
            >
              =
            </span>
            <p className="relative text-2xl font-black leading-snug tracking-tight text-balance sm:text-3xl">
              {RESULT}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}