import { useRef } from "react";
import { Link } from "react-router-dom";
import BeforeAfter from "../components/BeforeAfter.jsx";
import CTASection from "../components/CTASection.jsx";
import HeroShowcase from "../components/HeroShowcase.jsx";
import IconMark from "../components/IconMark.jsx";
import ProcessTimeline from "../components/ProcessTimeline.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import SignatureHeroMoment from "../components/SignatureHeroMoment.jsx";
import { useWhyChooseMotion } from "../hooks/useSiteMotion.js";
import { experiencePillars, processSteps, projects, resultStats, services, testimonials, uspItems } from "../data/siteData.js";

export default function Home() {
  const whyChooseRef = useRef(null);

  useWhyChooseMotion(whyChooseRef);

  return (
    <>
      <section className="hero-mesh relative isolate overflow-hidden pt-28 lg:min-h-[86vh]">
        <SignatureHeroMoment />
        <div className="fine-grid absolute inset-0 z-0" />
        <div className="container-premium relative z-10 grid items-center gap-12 pb-14 lg:min-h-[calc(86vh-11rem)] lg:grid-cols-[1.15fr_0.85fr] lg:pb-16">
          <div className="max-w-[22rem] sm:max-w-5xl">
            <p className="hero-kicker eyebrow">Premium web design agency</p>
            <h1 className="hero-title mt-6 max-w-[21rem] text-4xl font-black leading-[0.94] tracking-tight text-balance sm:max-w-5xl sm:text-7xl sm:leading-[0.9] lg:text-8xl">
              We build premium websites that bring customers.
            </h1>
            <p className="hero-copy mt-7 max-w-[21rem] text-lg leading-8 text-white/64 sm:max-w-2xl sm:text-xl">
              Turn your business into a premium brand that attracts customers automatically.
            </p>
            <div className="hero-actions mt-9 flex max-w-[21rem] flex-col gap-3 sm:max-w-none sm:flex-row">
              <Link to="/contact" className="premium-button-light w-full sm:w-auto">
                Get Your Website
              </Link>
              <Link to="/work" className="premium-button-dark w-full sm:w-auto">
                View Our Work
              </Link>
            </div>
            <p className="hero-proof mt-6 max-w-[19rem] text-sm font-bold leading-6 text-white/62 sm:max-w-xl">
              Helping local brands like Amor turn visitors into customers
            </p>
          </div>

          <HeroShowcase />
        </div>
      </section>

      <section className="above-fold-hint border-y border-white/10 bg-bone py-6 text-ink">
        <div className="container-premium overflow-hidden">
          <div className="flex min-w-max animate-marquee gap-12 text-xl font-black uppercase tracking-tight sm:text-2xl">
            {[0, 1, 2, 3].map((item) => (
              <span key={item}>Built for local businesses that want to look premium and grow faster.</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Featured work"
            title="Websites designed to look expensive and work hard."
            text="Every project starts with business clarity, then becomes a polished website that builds confidence fast."
          />
          <div className="stagger-grid mt-16 grid gap-8 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeading
            eyebrow="Before / after"
            title="Most websites lose customers before they even load properly."
            text="We rebuild them into fast, premium experiences that convert instantly."
          />
          <BeforeAfter />
        </div>
      </section>

      <section id="weboltrix-signature" className="py-20 lg:py-24">
        <div className="container-premium">
          <div className="max-w-5xl">
            <p className="eyebrow">Weboltrix signature</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
              A scroll experience that feels premium, but still sells.
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-white/58 sm:text-xl sm:leading-9">
              The motion system is built to guide attention: reveal proof, slow down important decisions, and make each page feel custom.
            </p>
          </div>
          <div className="stagger-grid mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {experiencePillars.map(([title, text], index) => (
              <article
                key={title}
                className="signature-panel interactive-card flex min-h-[18rem] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 shadow-premium backdrop-blur-2xl lg:min-h-[19rem]"
              >
                <span className="text-xs font-black uppercase tracking-[0.24em] text-white/38">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl xl:text-3xl">{title}</h3>
                  <p className="mt-5 text-base leading-8 text-white/58">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="why-choose-us"
        ref={whyChooseRef}
        className="section-padding overflow-hidden"
        data-why-scroll
      >
        <div className="container-premium">
          <SectionHeading
            eyebrow="Why choose us"
            title="Built around design quality and customer action."
            align="center"
          />
          <div className="mx-auto mt-8 h-px max-w-2xl overflow-hidden bg-white/10">
            <div className="h-full origin-left bg-bone" data-why-progress />
          </div>
          <div className="mt-14" data-why-viewport>
            <div className="grid gap-6 sm:grid-cols-2 md:flex md:w-max md:gap-5" data-why-track>
            {uspItems.map(([title, text], index) => (
              <div
                key={title}
                className="why-scroll-card glass card-hover rounded-[1.8rem] p-7 md:min-h-[22rem] md:w-[24rem] md:shrink-0 lg:w-[26rem]"
              >
                <IconMark label={title} index={index} />
                <h3 className="mt-6 text-xl font-black tracking-tight">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{text}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Services"
            title="Choose the website level your business needs now."
            text="Simple packages, premium execution, and room to grow as your brand gets stronger."
          />
          <div className="stagger-grid mt-16 grid gap-8 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <SectionHeading eyebrow="Process" title="A clean path from idea to launch." align="center" />
          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-bone text-ink">
        <div className="container-premium">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-black/45">Visual proof</p>
              <h2 className="mt-5 text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Results your customers can feel before they call.
              </h2>
            </div>
            <p className="max-w-2xl text-xl leading-10 text-black/58">
              A premium website should not only look better. It should make your business easier
              to trust, easier to contact, and easier to choose.
            </p>
          </div>
          <div className="stagger-grid mt-16 grid gap-6 lg:grid-cols-3">
            {resultStats.map((item, index) => (
              <div key={item.metric} className="interactive-card rounded-[2rem] border border-black/10 bg-white p-8 shadow-premium transition duration-500 hover:-translate-y-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-sm font-black text-white">
                  0{index + 1}
                </span>
                <h3 className="mt-10 text-4xl font-black tracking-tight">{item.metric}</h3>
                <p className="mt-4 text-base font-black text-black/60">{item.label}</p>
                <p className="mt-5 text-sm leading-7 text-black/52">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            eyebrow="Pricing"
            title="Premium websites with clear starting ranges."
            text="Flexible pricing based on your business needs. Final cost depends on pages, design depth, content, and integrations."
          />
          <div>
            <div className="stagger-grid grid gap-5 sm:grid-cols-2">
              <div className="glass rounded-[2rem] p-8">
                <p className="eyebrow">Setup</p>
                <p className="mt-5 text-4xl font-black">&#8377;5,000 &ndash; &#8377;25,000</p>
              </div>
              <div className="glass rounded-[2rem] p-8">
                <p className="eyebrow">Maintenance</p>
                <p className="mt-5 text-4xl font-black">&#8377;900 &ndash; &#8377;2700/year</p>
              </div>
            </div>
            <p className="mt-5 rounded-full border border-white/10 bg-white/[0.045] px-5 py-3 text-center text-sm font-bold text-white/62">
              No hidden costs. No long-term lock-ins.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium">
          <SectionHeading eyebrow="Testimonials" title="What business owners notice first." align="center" />
          <div className="stagger-grid mt-16 grid gap-7 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.author} className="glass card-hover rounded-[2rem] p-8 sm:p-9">
                <blockquote className="text-xl font-semibold leading-9 text-white/78">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <figcaption className="mt-8 text-sm font-black uppercase tracking-[0.18em] text-white/40">
                  {testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
