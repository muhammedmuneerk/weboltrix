import CTASection from "../components/CTASection.jsx";
import ServicesHero from "../components/ServicesHero.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { services } from "../data/siteData.js";
import DetailedBreakdown from "../components/DetailedBreakdown.jsx";
import WhoItsFor from "../components/WhoItsFor.jsx";
import AddOns from "../components/Addons.jsx";

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

      <DetailedBreakdown />

      <WhoItsFor />

      <AddOns />

      <CTASection title="Choose a website package and start stronger." />
    </>
  );
}