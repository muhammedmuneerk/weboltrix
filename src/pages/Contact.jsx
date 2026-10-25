import ContactHero from "../components/ContactHero.jsx";
import ContactEnquiry from "../components/ContactEnquiry.jsx";
// import ContactEnquiry from "../components/ContactEnquiryFlow.jsx";
// import ContactEnquiry from "../components/ContactEnquiryBrief.jsx";
// import ContactEnquiry from "../components/ContactEnquiryPackages.jsx";
// import ContactEnquiry from "../components/ContactEnquiryBento.jsx";
// import ContactEnquiry from "../components/ContactEnquiryCompose.jsx";
// import ContactEnquiry from "../components/ContactEnquiryPass.jsx";
// import ContactEnquiry from "../components/ContactEnquirySite.jsx";

export default function Contact() {
  return (
    <>
      <ContactHero eyebrow="Contact" title="Let's Build Your Website">
        Tell us about your business and the kind of website you want. We will help shape it into a
        premium, high-converting online presence.
      </ContactHero>

      <ContactEnquiry />
    </>
  );
}