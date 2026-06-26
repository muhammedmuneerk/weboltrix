import { Link } from "react-router-dom";
import { brandAssets, whatsappLink } from "../data/siteData.js";

export default function CTASection({
  title = "Ready to turn your website into a customer-generating machine?",
  text = "Let us shape a site that makes your business easier to trust, contact, and choose.",
}) {
  return (
    <section className="section-padding">
      <div className="container-premium">
        <div className="hero-mesh relative overflow-hidden rounded-[2.2rem] border border-white/10 px-6 py-14 text-center shadow-premium sm:px-10 sm:py-20">
          <div className="fine-grid absolute inset-0 opacity-45" />
          <div className="relative mx-auto max-w-4xl">
            <img
              src={brandAssets.logoSquare}
              alt=""
              className="mx-auto mb-7 h-20 w-auto object-contain opacity-90"
            />
            <h2 className="text-4xl font-black leading-tight tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {title}
            </h2>
            {text && <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/62">{text}</p>}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className="premium-button-light">
                Get Your Website
              </Link>
              <a href={whatsappLink} className="premium-button-dark">
                WhatsApp Chat
              </a>
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-white/46">
              Limited slots available for new projects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
