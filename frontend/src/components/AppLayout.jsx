import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Layout.css";

export default function AppLayout() {
  const { toast, dismissToast } = useCart();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__body">
        <Outlet />
      </main>
      <Footer />
      {toast && (
        <div className="cart-toast" onClick={dismissToast}>
          {toast}
        </div>
      )}
    </div>
  );
}

