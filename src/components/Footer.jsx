import { Link } from "react-router-dom";
import { brandAssets, contactDetails, navLinks, whatsappLink } from "../data/siteData.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container-premium py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="MMK Websites home">
              <img
                src={brandAssets.logoWide}
                alt="MMK Websites"
                className="h-16 lg:h-24 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
              Premium websites for local businesses that want to look trusted, modern, and ready
              for more customers.
            </p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <div className="mt-5 grid gap-3">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-sm text-white/58 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Contact</p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              <a className="transition hover:text-white" href={`mailto:${contactDetails.email}`}>
                {contactDetails.email}
              </a>
              <a className="transition hover:text-white" href={`tel:${contactDetails.phone}`}>
                Phone: {contactDetails.phoneDisplay}
              </a>
              <a className="transition hover:text-white" href={whatsappLink}>
                WhatsApp: {contactDetails.phoneDisplay}
              </a>
              <a className="transition hover:text-white" href={contactDetails.instagram} target="_blank" rel="noreferrer">
                Instagram: @mmk_websites
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MMK Websites. All rights reserved.</p>
          <p>Built with clarity, speed, and premium intent.</p>
        </div>
      </div>
    </footer>
  );
}
