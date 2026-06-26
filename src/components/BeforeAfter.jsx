import { Link } from "react-router-dom";
import { beforeAfterProjects } from "../data/siteData.js";

export default function BeforeAfter({ compact = false, limit }) {
  const projects = limit ? beforeAfterProjects.slice(0, limit) : beforeAfterProjects;

  return (
    <div className={`stagger-grid grid gap-5 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2"}`}>
      {projects.map((project) => (
        <article key={project.slug} className="glass card-hover overflow-hidden rounded-[2rem] p-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Before", project.before, project.beforeAlt],
              ["After", project.after, project.afterAlt],
            ].map(([label, image, alt]) => (
              <figure
                key={label}
                className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-black"
                data-image-reveal
              >
                <img
                  src={image}
                  alt={alt}
                  className="aspect-[4/5] h-full w-full object-cover object-top transition duration-700 hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/78 backdrop-blur">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="px-2 pb-2 pt-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/38">
              {project.category}
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight">{project.title}</h3>
            <p className="mt-3 text-sm leading-7 text-white/55">{project.description}</p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs font-bold leading-6 text-white/62">
              {project.outcome}
            </p>
            <Link
              to={`/work/${project.slug}`}
              className="mt-5 inline-flex gap-2 text-sm font-bold text-white transition hover:translate-x-1"
            >
              View transformation <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
