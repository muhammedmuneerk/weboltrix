import { Link } from "react-router-dom";

export default function ProjectRow({ project, index }) {
  const num = String(index + 1).padStart(2, '0');
  const liveLink = project.linkAfter || project.link;

  return (
    <article className="group relative grid transition-colors duration-400"
             style={{ gridTemplateColumns: '4.5rem 1fr', borderTop: index > 0 ? '1px solid var(--editorial-content-a006)' : 'none' }}>

      {/* Left rail */}
      <div className="relative flex flex-col items-center pt-12 flex-shrink-0">
        {/* Diamond dot on spine */}
        <div className="absolute right-[-3px] top-[3.25rem] h-[6px] w-[6px] rotate-45 border transition-colors duration-300 group-hover:bg-[color:var(--editorial-accent)]"
             style={{ border: '1px solid var(--editorial-accent)', background: 'var(--surface-editorial)' }} />
        <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] [writing-mode:vertical-rl] [transform:rotate(180deg)] leading-none"
              style={{ color: 'var(--editorial-accent)' }}>
          {num} · {project.categoryShort}
        </span>
      </div>

      {/* Content: meta left, image right */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1.1fr', paddingLeft: '2.5rem' }}>

        {/* Meta */}
        <div className="flex flex-col justify-center py-12 pr-10"
             style={{ borderRight: '1px solid var(--editorial-content-a006)' }}>
          <p className="mb-5 text-[9px] font-black uppercase tracking-[0.22em]"
             style={{ color: 'var(--editorial-accent-a07)' }}>
            {project.category}
          </p>
          <h3 className="mb-5 font-display text-[clamp(1.4rem,2.5vw,2rem)] font-black leading-[1.12] tracking-tight"
              style={{ color: 'var(--editorial-content)' }}>
            {project.title}
          </h3>
          <p className="mb-7 max-w-[320px] text-[13px] leading-[1.85]"
             style={{ color: 'var(--editorial-content-a05)' }}>
            {project.description}
          </p>
          <div className="mb-8 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map(tag => (
              <span key={tag} className="border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em]"
                    style={{ color: 'var(--editorial-content-a035)', borderColor: 'var(--editorial-content-a008)' }}>
                {tag}
              </span>
            ))}
          </div>
          <Link to={`/work/${project.slug}`}
                className="mt-auto inline-flex items-center gap-2.5 text-[0.75rem] font-bold"
                style={{ color: 'var(--editorial-content)' }}>
            View Case Study
            <span className="inline-flex h-7 w-7 items-center justify-center border transition-colors duration-250 group-hover:bg-[color:var(--editorial-accent)] group-hover:border-[color:var(--editorial-accent)] group-hover:text-[color:var(--surface-editorial)]"
                  style={{ borderColor: 'var(--editorial-accent-a04)', color: 'var(--editorial-accent)' }}
                  aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* Image panel */}
        <div className="relative overflow-hidden" style={{ minHeight: '320px' }}>
          {/* Ghost number */}
          <span className="pointer-events-none absolute right-[-0.5rem] top-1/2 -translate-y-1/2 font-display font-black leading-none select-none z-0"
                style={{ fontSize: '11rem', color: 'transparent', WebkitTextStroke: '1px var(--editorial-accent-a008)' }}
                aria-hidden="true">
            {num}
          </span>
          <img src={project.image} alt={project.visualAlt}
               className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
               style={{ filter: 'grayscale(20%)', transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s' }}
               style={{ ...(/* hover via JS or CSS class */ {}) }} />
          {/* Film overlay */}
          <div className="absolute inset-0 z-10"
               style={{ background: 'linear-gradient(135deg, var(--surface-editorial-a055) 0%, var(--surface-editorial-a01) 100%)' }} />
          {/* Impact overlay */}
          <div className="absolute bottom-7 left-7 right-7 z-20">
            <p className="mb-2 text-[8px] font-black uppercase tracking-[0.22em]"
               style={{ color: 'var(--editorial-accent-a07)' }}>
              Outcome
            </p>
            <p className="mb-2.5 font-display text-xl font-black leading-[1.2]"
               style={{ color: 'var(--editorial-content)' }}>
              {project.impact}
            </p>
            <div className="flex flex-wrap gap-4">
              {project.metrics.slice(0, 2).map(m => (
                <span key={m} className="border-l-2 pl-2 text-[8px] font-black uppercase tracking-[0.14em]"
                      style={{ borderColor: 'var(--editorial-accent)', color: 'var(--editorial-content-a055)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}