import CTASection from "../components/CTASection.jsx";
import AboutHero from "../components/AboutHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import AboutStory from "../components/AboutStory.jsx";
import AboutPrinciples from "../components/AboutPrinciples.jsx";

export default function About() {
  return (
    <>
      <AboutHero eyebrow="About" title="About Weboltrix">
        A boutique web design studio focused on making local businesses look premium, move faster,
        and win more trust online.
      </AboutHero>

      <AboutStory />

      <AboutPrinciples />

      <section className="section-padding">
        <div className="container-premium">
          <div className="rounded-[2rem] border border-white/10 bg-bone p-8 text-ink sm:p-12">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-black/45">Highlight</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Fast, modern, premium mindset for businesses ready to be taken seriously.
            </h2>
          </div>
        </div>
      </section>

      <CTASection title="Let's make your business look premium online." />
    </>
  );
}