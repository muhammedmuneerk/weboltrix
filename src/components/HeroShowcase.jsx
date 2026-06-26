import { studioAssets } from "../data/siteData.js";

export default function HeroShowcase() {
  return (
    <div className="hero-showcase relative hidden lg:block" data-cursor-glow>
      <div className="relative overflow-hidden rounded-[2.4rem] border border-white/[0.12] bg-white/[0.06] p-3 shadow-premium backdrop-blur-2xl">
        <div className="absolute right-6 top-6 z-20 rounded-full border border-white/15 bg-black/[0.42] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/68 backdrop-blur">
          MMK signature
        </div>
        <div className="absolute bottom-6 left-6 z-20 max-w-52 rounded-[1.4rem] border border-white/[0.12] bg-black/[0.48] p-5 text-sm font-bold leading-6 text-white/72 backdrop-blur-xl">
          Built to make customers trust the business before they call.
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-black">
          <img
            src={studioAssets.heroStudio}
            alt="Premium website mockup on desktop and mobile screens inside a dark studio."
            className="h-full w-full scale-110 object-cover object-center"
            data-parallax-media
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 grid grid-cols-3 gap-2">
            {["Trust", "Leads", "Polish"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/[0.12] bg-white/10 px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.16em] text-white/72 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -right-6 top-24 h-24 w-24 rounded-[1.4rem] border border-white/[0.12] bg-bone p-4 text-ink shadow-premium">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">Avg. focus</p>
        <p className="mt-2 text-3xl font-black">3s</p>
      </div>
    </div>
  );
}
