import FeaturedWorkAccordion from "./FeaturedWorkAccordion";

{/* ── Featured Work Section ── */}
<section className="section-padding">
  <div className="container-premium">
    <SectionHeading
      eyebrow="Featured work"
      title="Websites designed to look expensive and work hard."
      text="Every project starts with business clarity, then becomes a polished website that builds confidence fast."
    />
    <FeaturedWorkAccordion projects={projects} />
  </div>
</section>
