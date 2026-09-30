import CTASection from "../components/CTASection.jsx";
import PageHero from "../components/PageHero.jsx";
import ProcessHero from "../components/ProcessHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import ProcessQuality from "../components/ProcessQuality.jsx";
import { faqs, processDetails } from "../data/siteData.js";

export default function Process() {
  return (
    <>
      <ProcessHero eyebrow="Process" title="How we turn a local business into a premium website.">
        A focused build rhythm: clarity first, design second, conversion always. Every step is shaped
        to get the website launched cleanly and ready for real customer action.
      </ProcessHero>

      <ProcessSteps />

      <ProcessQuality />

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
