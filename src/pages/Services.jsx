import CTASection from "../components/CTASection.jsx";
import ServicesHero from "../components/ServicesHero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { services } from "../data/siteData.js";
import DetailedBreakdown from "../components/DetailedBreakdown.jsx";

export default function Services() {
  return (
    <>
      <ServicesHero />

      <section className="section-padding">
        <div className="container-premium">
          <div className="stagger-grid grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>
      </section>

      <DetailedBreakdown services={services} />

      <section className="section-padding">
        <div className="container-premium">
          <SectionHeading eyebrow="Who it's for" title="Made for local brands with ambition." />
          <div className="stagger-grid mt-10 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.name} className="glass card-hover rounded-[1.7rem] p-7">
                <h3 className="text-2xl font-black">{service.name}</h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{service.audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Add-ons"
            title="Keep the website running cleanly after launch."
            text="Add only what your business needs. The goal is a sharp site that stays reliable."
          />
          <div className="stagger-grid grid gap-5 sm:grid-cols-2">
            {[
              ["Hosting", "Fast, stable hosting guidance so your website stays accessible and professional."],
              ["Maintenance", "Updates, small edits, performance checks, and yearly care for peace of mind."],
            ].map(([title, text]) => (
              <div key={title} className="glass rounded-[1.8rem] p-7">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Choose a website package and start stronger." />
    </>
  );
}