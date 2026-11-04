import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <article data-color-scope="service-card" data-color-key={service.name}
      className={`rounded-[2.2rem] border p-8 transition duration-500 hover:-translate-y-3 sm:p-9 ${
        service.featured
          ? "border-signal bg-emphasis text-on-emphasis shadow-glow"
          : "border-line/10 bg-layer/[0.045] text-heading hover:border-line/25"
      }`}
    >
      <p className={`text-xs font-black uppercase tracking-[0.25em] ${service.featured ? "text-on-emphasis-soft/45" : "text-content/42"}`}>
        {service.price}
      </p>
      <h3 className="mt-5 text-4xl font-black tracking-tight">{service.name}</h3>
      <ul className="mt-8 space-y-5">
        {service.features.map((feature) => (
          <li key={feature} className={`flex gap-3 text-base font-semibold ${service.featured ? "text-on-emphasis-soft/72" : "text-content/68"}`}>
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border ${
                service.featured ? "border-contrast-line bg-recess" : "border-line/50"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        to="/contact"
        data-color-part="action"
        className={`mt-10 w-full ${service.featured ? "premium-button bg-inverse-action text-inverse-foreground hover:bg-inverse-hover" : "premium-button-light"}`}
      >
        Get Your Website
      </Link>
    </article>
  );
}
