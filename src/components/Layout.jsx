import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import WhatsAppFloat from "./WhatsAppFloat.jsx";
import CursorGlow from "./CursorGlow.jsx";
import { usePageMotion, useSmoothScroll } from "../hooks/useSiteMotion.js";

export default function Layout() {
  const location = useLocation();

  useSmoothScroll();
  usePageMotion(location.pathname, location.hash);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-bone">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsAppFloat />
      <Footer />
      <CursorGlow />
    </div>
  );
}
