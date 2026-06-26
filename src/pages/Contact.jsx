import PageHero from "../components/PageHero.jsx";
import { contactDetails, whatsappLink } from "../data/siteData.js";

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      "Hi, I want a website for my business.",
      `Name: ${formData.get("name") || ""}`,
      `Business: ${formData.get("business") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Message: ${formData.get("message") || ""}`,
    ].join("\n");
    const baseUrl = whatsappLink.split("?")[0];

    window.open(`${baseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's Build Your Website">
        Tell us about your business and the kind of website you want. We will help shape it into a
        premium, high-converting online presence.
      </PageHero>

      <section className="section-padding">
        <div className="container-premium stagger-grid grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="glass rounded-[2rem] p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-white/75">
                Name
                <input className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-white/35" type="text" name="name" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-white/75">
                Business Name
                <input className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-white/35" type="text" name="business" required />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-bold text-white/75">
              Phone
              <input className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-white/35" type="tel" name="phone" required />
            </label>
            <label className="mt-5 grid gap-2 text-sm font-bold text-white/75">
              Message
              <textarea className="min-h-40 rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none transition focus:border-white/35" name="message" />
            </label>
            <button className="premium-button-light mt-6 w-full" type="submit">
              Send Enquiry
            </button>
          </form>

          <aside className="space-y-5">
            <div className="glass rounded-[2rem] p-8">
              <p className="eyebrow">Direct chat</p>
              <h2 className="mt-4 text-3xl font-black">Prefer WhatsApp?</h2>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Start with a quick message about your business, pages needed, and launch timeline.
              </p>
              <a href={whatsappLink} className="premium-button-light mt-7 w-full">
                WhatsApp CTA
              </a>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-bone p-8 text-ink">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-black/45">Email</p>
              <a className="mt-4 block break-words text-xl font-black" href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>
            </div>
            <div className="glass rounded-[2rem] p-8">
              <p className="eyebrow">Direct contact</p>
              <div className="mt-5 grid gap-4">
                <a className="text-xl font-black transition hover:text-white/72" href={`tel:${contactDetails.phone}`}>
                  {contactDetails.phoneDisplay}
                </a>
                <a className="text-sm font-bold text-white/58 transition hover:text-white" href={contactDetails.instagram} target="_blank" rel="noreferrer">
                  Instagram: @weboltrix
                </a>
              </div>
            </div>
            <div className="glass rounded-[2rem] p-8">
              <p className="eyebrow">Best start</p>
              <ul className="mt-5 space-y-3 text-sm font-bold text-white/62">
                {["Business type", "Pages needed", "Reference websites", "Launch timeline"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
