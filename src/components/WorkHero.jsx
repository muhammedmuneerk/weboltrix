export default function WorkHero({ projects }) {
  const featuredProjects = projects.slice(0, 3);
  const industryCount = new Set(projects.map((project) => project.category)).size;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.07] hero-mesh">
      <style>{workHeroStyles}</style>

      <div className="fine-grid absolute inset-0 -z-10" />
      <div className="work-hero-glow" aria-hidden="true" />

      <div className="container-premium relative z-10 grid items-end gap-10 pb-12 pt-36 sm:pb-16 lg:min-h-[82vh] lg:grid-cols-[minmax(0,1fr)_0.9fr] lg:gap-12 lg:pb-20">
        <div className="pb-[0.35rem]">
          <p className="eyebrow">Selected work · {projects.length} transformations</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Proof that premium changes perception.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/64 sm:text-xl">
            A considered collection of websites designed to make businesses look established,
            earn trust faster, and turn attention into enquiries.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-black uppercase tracking-[0.16em] text-white/48">
            <span>{projects.length} selected projects</span>
            <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
            <span>{industryCount} business categories</span>
            <span className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
            <span>Built for clarity</span>
          </div>

          <a href="#project-index" className="work-hero-explore mt-9">
            Explore the work <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="w-[min(100%,37rem)] justify-self-end max-[860px]:w-[min(100%,31rem)] max-[860px]:justify-self-start" aria-label="A preview of selected Weboltrix projects">
          <p className="mb-[0.85rem] text-[0.625rem] font-black uppercase tracking-[0.16em] text-white/34">
            A few of the transformations
          </p>
          <div className="relative min-h-[clamp(19rem,32vw,27rem)] max-[520px]:min-h-[17rem]">
            {featuredProjects.map((project, index) => {
              const cardStyles = [
                "left-0 top-[13%] w-[56%] aspect-[4/5] rotate-[-5deg] max-[520px]:left-[1%] max-[520px]:w-[57%]",
                "right-[1%] top-0 z-[2] w-[59%] aspect-[4/5] rotate-[4deg] max-[520px]:right-0 max-[520px]:w-[59%]",
                "bottom-0 left-[24%] z-[3] w-[50%] aspect-[16/10] rotate-[-1.5deg] max-[520px]:left-[23%] max-[520px]:w-[53%]",
              ];
              return (
                <article className={`absolute overflow-hidden rounded-[0.85rem] border border-white/[0.14] bg-[#101010] shadow-[0_24px_70px_rgba(0,0,0,0.35)] ${cardStyles[index]}`} key={project.slug}>
                  <img src={project.image} alt="" className="work-hero-card-image" />
                  <div className="absolute inset-0 work-hero-card-overlay" />
                  <div className="absolute bottom-3 left-[0.9rem] right-[0.9rem] flex items-center justify-between gap-3 text-[0.5625rem] font-black uppercase tracking-[0.12em] text-white/54 max-[520px]:bottom-[0.55rem] max-[520px]:left-[0.65rem] max-[520px]:right-[0.65rem]">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong className="overflow-hidden whitespace-nowrap text-ellipsis text-[0.625rem] text-white">
                      {project.title}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const workHeroStyles = `
  .work-hero-glow {
    position: absolute;
    right: -12rem;
    top: 8rem;
    width: min(56vw, 52rem);
    aspect-ratio: 1;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.13), transparent 68%);
    filter: blur(12px);
    pointer-events: none;
  }

  .work-hero-explore {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .work-hero-explore::before {
    content: "";
    width: 2.5rem;
    height: 1px;
    background: rgba(255, 255, 255, 0.48);
    transition: width 0.25s ease;
  }

  .work-hero-explore:hover::before { width: 3.5rem; }
  .work-hero-explore span { font-size: 1.1rem; line-height: 0; }

  .work-hero-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    filter: saturate(0.82) contrast(1.04);
  }

  .work-hero-card-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.82), transparent 57%);
  }
`;