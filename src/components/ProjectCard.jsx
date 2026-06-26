import { Link } from "react-router-dom";

export default function ProjectCard({ project, index = 0 }) {
  const liveLink = project.linkAfter || project.link;

  return (
    <article className="glass project-card-hover group overflow-hidden rounded-[2rem]">
      <div className="relative aspect-[4/3] overflow-hidden" data-image-reveal>
        <img
          src={project.image}
          alt={project.visualAlt}
          className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/8 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-bold text-white/70 backdrop-blur">
          0{index + 1}
        </span>
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
          {project.metrics.slice(0, 2).map((metric) => (
            <span key={metric} className="rounded-full border border-white/[0.12] bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/72 backdrop-blur">
              {metric}
            </span>
          ))}
        </div>
      </div>
      <div className="p-7 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/42">{project.category}</p>
        <h3 className="mt-3 text-2xl font-black tracking-tight">{project.title}</h3>
        <p className="mt-4 min-h-24 text-base leading-8 text-white/55">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white/52"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-7 grid gap-4 rounded-3xl border border-white/10 bg-black/25 p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/38">
            Before - After
          </p>
          <p className="text-sm font-black text-white">{project.transformation}</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/42">
            Result: {project.impact}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link to={`/work/${project.slug}`} className="inline-flex gap-2 text-sm font-bold text-white transition hover:translate-x-1">
            View Case Study <span aria-hidden="true">&rarr;</span>
          </Link>
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-white/52 transition hover:text-white"
            >
              Live Site
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
