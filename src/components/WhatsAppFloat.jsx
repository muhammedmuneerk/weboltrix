import { whatsappLink } from "../data/siteData.js";

export default function WhatsAppFloat() {
  return (
    <a data-color-scope="whatsapp-float"
      href={whatsappLink}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-line/15 bg-action px-5 py-3 text-sm font-black text-action-foreground shadow-glow transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-action-bright"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-canvas" />
      Chat with us
    </a>
  );
}
