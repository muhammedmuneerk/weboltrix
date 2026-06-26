import CTASection from "../components/CTASection.jsx";
import PageHero from "../components/PageHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { faqs, processDetails } from "../data/siteData.js";

export default function Process() {
  return (
    <>
      <PageHero eyebrow="Process" title="How we turn a local business into a premium website.">
        A focused build rhythm: clarity first, design second, conversion always. Every step is shaped
        to get the website launched cleanly and ready for real customer action.
      </PageHero>

      <section className="section-padding">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Build rhythm"
            title="Four moves from idea to launch."
            text="The process stays lean, but the details stay premium: strategy, layout, content, animation, contact flow, and final polish."
          />
          <div className="stagger-grid mt-14 grid gap-5 lg:grid-cols-4">
            {processDetails.map((step) => (
              <article key={step.title} className="glass card-hover rounded-[1.8rem] p-7">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/38">
                  {step.eyebrow}
                </p>
                <h2 className="mt-8 text-3xl font-black tracking-tight">{step.title}</h2>
                <p className="mt-5 text-sm leading-7 text-white/58">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/10 bg-white/[0.025]">
        <div className="container-premium grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            eyebrow="Quality checks"
            title="Launch polish is treated like part of the design."
            text="Before handoff, the site is checked for mobile fit, CTA clarity, section rhythm, asset loading, and a clean first impression."
          />
          <div className="stagger-grid grid gap-4 sm:grid-cols-2">
            {["Mobile flow", "Animation timing", "Contact path", "Image polish", "Content clarity", "Speed basics"].map((item) => (
              <div key={item} className="interactive-card rounded-[1.4rem] border border-white/10 bg-white/[0.055] p-5 text-lg font-black">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-premium">
          <SectionHeading eyebrow="FAQ" title="Straight answers before we start." align="center" />
          <div className="stagger-grid mx-auto mt-12 grid max-w-4xl gap-4">
            {faqs.map(([question, answer]) => (
              <article key={question} className="glass rounded-[1.6rem] p-6">
                <h2 className="text-xl font-black">{question}</h2>
                <p className="mt-3 text-sm leading-7 text-white/58">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Let's build with a clear process and a premium finish." />
    </>
  );
}
