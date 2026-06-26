import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <article
      className={`rounded-[2.2rem] border p-8 transition duration-500 hover:-translate-y-3 sm:p-9 ${
        service.featured
          ? "border-bone bg-bone text-ink shadow-glow"
          : "border-white/10 bg-white/[0.045] text-bone hover:border-white/25"
      }`}
    >
      <p className={`text-xs font-black uppercase tracking-[0.25em] ${service.featured ? "text-black/45" : "text-white/42"}`}>
        {service.price}
      </p>
      <h3 className="mt-5 text-4xl font-black tracking-tight">{service.name}</h3>
      <ul className="mt-8 space-y-5">
        {service.features.map((feature) => (
          <li key={feature} className={`flex gap-3 text-base font-semibold ${service.featured ? "text-black/72" : "text-white/68"}`}>
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border ${
                service.featured ? "border-black bg-black" : "border-white/50"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        className={`mt-10 w-full ${service.featured ? "premium-button bg-black text-white hover:bg-neutral-800" : "premium-button-light"}`}
      >
        Get Your Website
      </Link>
    </article>
  );
}
