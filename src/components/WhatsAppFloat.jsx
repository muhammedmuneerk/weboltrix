import { whatsappLink } from "../data/siteData.js";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-white/15 bg-bone px-5 py-3 text-sm font-black text-ink shadow-glow transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-ink" />
      Chat with us
    </a>
  );
}
