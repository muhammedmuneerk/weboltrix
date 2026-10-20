import { useId } from "react";
import { brandAssets, projects, services, studioAssets } from "../data/siteData.js";

// Sizing notes
// --arch-h    desktop arch height. Tall screens: sits above a full-width stat strip.
//             Short screens (<= 700px high, see the media query): the stat strip moves
//             under the text column and the arch runs the full height of the hero.
// --m-arch-h  mobile / tablet arch height.
const css = `
  @keyframes about-ring-spin { to { transform: rotate(360deg); } }
  .about-ring { animation: about-ring-spin 24s linear infinite; transform-origin: 50% 50%; }
  @media (prefers-reduced-motion: reduce) { .about-ring { animation: none; } }

  .about-hero {
    --arch-h: clamp(20rem, calc(100svh - 17rem), 38rem);
    --m-arch-h: clamp(16rem, 46svh, 26rem);
  }

  @media (min-width: 1024px) and (max-height: 700px) {
    .about-hero { --arch-h: clamp(22rem, calc(100svh - 9.5rem), 44rem); }
    .about-hero .about-stats { grid-column: 1; }
    .about-hero .about-arch { grid-row: 1 / span 2; }
    .about-hero .about-stats dd { font-size: 2rem; }
    .about-hero .about-stats dt { font-size: 0.6rem; letter-spacing: 0.16em; }
  }
`;

// Same props as PageHero, so About.jsx keeps its copy exactly as written.
export default function AboutHero({ eyebrow, title, children }) {
  const [firstWord, ...restWords] = String(title).split(" ");
  const rest = restWords.join(" ");

  const stats = [
    [String(projects.length), "Selected projects"],
    [String(new Set(projects.map((project) => project.category)).size), "Business categories"],
    [String(services.length), "Package levels"],
  ];

  return (
    <section className="about-hero hero-mesh relative isolate overflow-hidden lg:flex lg:min-h-[100svh] lg:items-center">
      <style>{css}</style>
      <div className="fine-grid absolute inset-0 -z-10" />

      <div className="container-premium flex w-full flex-col pb-14 pt-28 sm:pt-32 lg:min-h-[100svh] lg:pb-6 lg:pt-24">
        {/* ───────── Mobile / tablet layout (below lg): window first, then the story ───────── */}
        <div className="lg:hidden">
          <ArchWindow
            className="mx-auto aspect-[4/5] w-[min(100%,calc(var(--m-arch-h)*0.8))]"
            delay="0ms"
          />

          <div className="mt-14">
            <HeroText
              centered
              eyebrow={eyebrow}
              firstWord={firstWord}
              rest={rest}
              titleClass="text-[3.25rem] sm:text-[5.5rem]"
            >
              {children}
            </HeroText>
          </div>

          <Stats stats={stats} centered className="mt-12" />
        </div>

        {/* ───────── Desktop layout (lg and up) ───────── */}
        <div className="hidden lg:grid lg:flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-rows-[1fr_auto] lg:gap-x-14 xl:gap-x-20">
          <div className="min-w-0 self-center lg:col-start-1 lg:row-start-1">
            <HeroText
              eyebrow={eyebrow}
              firstWord={firstWord}
              rest={rest}
              titleClass="lg:text-[clamp(4rem,min(8.4vw,13vh),6.75rem)]"
            >
              {children}
            </HeroText>
          </div>

          <ArchWindow
            className="about-arch self-center justify-self-end lg:col-start-2 lg:row-start-1 lg:aspect-[4/5] lg:w-[min(100%,calc(var(--arch-h)*0.8))]"
            delay="220ms"
          />

          <Stats
            stats={stats}
            className="about-stats lg:col-span-2 lg:col-start-1 lg:row-start-2"
          />
        </div>
      </div>
    </section>
  );
}

function HeroText({ eyebrow, firstWord, rest, titleClass, centered = false, children }) {
  return (
    <>
      {eyebrow && (
        <p
          className={`hero-kicker eyebrow flex animate-fade-up items-center gap-4 motion-reduce:animate-none ${
            centered ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="h-px w-10 bg-white/40" />
          {eyebrow}
          {centered && <span aria-hidden="true" className="h-px w-10 bg-white/40" />}
        </p>
      )}

      <h1
        className={`hero-title mt-6 font-black leading-[0.9] tracking-tight ${titleClass} ${
          centered ? "text-center" : ""
        }`}
      >
        <span
          className="block animate-fade-up text-transparent motion-reduce:animate-none"
          style={{
            WebkitTextStroke: "1.5px rgba(245,243,239,0.6)",
            animationDelay: "80ms",
          }}
        >
          {firstWord}
        </span>
        {rest && (
          <span
            className="block animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "180ms" }}
          >
            {rest}
          </span>
        )}
      </h1>

      {children && (
        <div
          className={`hero-copy mt-8 animate-fade-up text-white/62 motion-reduce:animate-none ${
            centered
              ? "mx-auto max-w-md text-center text-base leading-7 sm:text-lg sm:leading-8"
              : "max-w-xl border-l-2 border-white/20 pl-5 text-lg leading-8 sm:text-xl sm:leading-9"
          }`}
          style={{ animationDelay: "300ms" }}
        >
          {children}
        </div>
      )}
    </>
  );
}

// The arch "studio window". Everything inside is sized in % of the arch itself, so it
// holds together at any size. The parent decides the arch's width and aspect ratio.
function ArchWindow({ className = "", delay = "0ms" }) {
  const ringId = `about-ring-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={`relative animate-fade-up motion-reduce:animate-none ${className}`}
      style={{ animationDelay: delay }}
      data-cursor-glow
    >
      <div className="h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-white/[0.12] bg-white/[0.06] p-2.5 shadow-premium backdrop-blur-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-black">
          <img
            src={studioAssets.heroStudio}
            alt="Premium website mockup on desktop and mobile screens inside a dark studio."
            className="h-full w-full scale-110 object-cover object-center"
            data-parallax-media
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
        </div>
      </div>

      {/* Spinning studio badge */}
      <div className="absolute -left-[7%] top-[20%] flex aspect-square w-[27%] min-w-[5rem] max-w-[7.5rem] items-center justify-center rounded-full border border-white/[0.14] bg-ink/90 shadow-premium backdrop-blur">
        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          className="about-ring absolute inset-0 h-full w-full text-white/70"
        >
          <defs>
            <path id={ringId} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
          </defs>
          <text fill="currentColor" fontSize="8.5" fontWeight="800" letterSpacing="2">
            <textPath href={`#${ringId}`} textLength="292" lengthAdjust="spacing">
              PREMIUM WEB DESIGN • LOCAL BUSINESSES •
            </textPath>
          </text>
        </svg>
        <img
          src={brandAssets.logoSquare}
          alt=""
          className="relative max-h-[34%] w-auto max-w-[52%] object-contain"
        />
      </div>

      {/* Studio tag */}
      <div className="absolute -bottom-5 right-[5%] whitespace-nowrap rounded-full border border-white/10 bg-bone px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-ink shadow-premium">
        Boutique studio
      </div>
    </div>
  );
}

function Stats({ stats, centered = false, className = "" }) {
  return (
    <dl
      className={`grid animate-fade-up grid-cols-3 divide-x divide-white/10 border-t border-white/10 motion-reduce:animate-none ${className}`}
      style={{ animationDelay: "400ms" }}
    >
      {stats.map(([value, label], index) => (
        <div
          key={label}
          className={`py-6 lg:py-4 ${
            centered
              ? "px-2 text-center"
              : index === 0
                ? "pr-3 sm:pr-6"
                : "px-3 sm:px-8"
          }`}
        >
          <dd
            className={`font-black tracking-tight tabular-nums ${
              centered ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-4xl xl:text-5xl"
            }`}
          >
            {value}
          </dd>
          <dt className="mt-2 text-[0.6rem] font-black uppercase leading-4 tracking-[0.18em] text-white/45 sm:text-xs sm:tracking-[0.22em]">
            {label}
          </dt>
        </div>
      ))}
    </dl>
  );
}