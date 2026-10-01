import CTASection from "../components/CTASection.jsx";
import FaqSection from "../components/FaqSection.jsx";
import ProcessHero from "../components/ProcessHero.jsx";
import ProcessSteps from "../components/ProcessSteps.jsx";
import ProcessQuality from "../components/ProcessQuality.jsx";

export default function Process() {
  return (
    <>
      <ProcessHero eyebrow="Process" title="How we turn a local business into a premium website.">
        A focused build rhythm: clarity first, design second, conversion always. Every step is shaped
        to get the website launched cleanly and ready for real customer action.
      </ProcessHero>

      <ProcessSteps />

      <ProcessQuality />

      <FaqSection />

      <CTASection title="Let's build with a clear process and a premium finish." />
    </>
  );
}
