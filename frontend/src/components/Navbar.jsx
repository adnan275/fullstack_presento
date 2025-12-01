import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Navbar.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/shop" },
  { label: "My Orders", to: "/orders" },
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/terms" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login", { replace: true });
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="pt-navbar">
      <div className="pt-navbar__brand" onClick={() => navigate("/")}>
        Presento Treasure
      </div>

      {}
      <div className="pt-navbar__links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `pt-navbar__link ${isActive ? "is-active" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `pt-navbar__link ${isActive ? "is-active" : ""}`
          }
        >
          Profile (User Page)
        </NavLink>

        <button className="pt-navbar__cart" onClick={() => navigate("/cart")}>
          Cart
          {cartCount > 0 && <span className="pt-navbar__badge">{cartCount}</span>}
        </button>
        {localStorage.getItem("token") && (
          <button className="pt-navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {}
      <button className="pt-navbar__toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      {}
      <div
        className={`pt-navbar__mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {}
      <div className={`pt-navbar__mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="pt-navbar__mobile-header">
          <div className="pt-navbar__brand">Presento Treasure</div>
          <button className="pt-navbar__mobile-close" onClick={closeMobileMenu} aria-label="Close menu">
            ×
          </button>
        </div>

        <div className="pt-navbar__mobile-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `pt-navbar__link ${isActive ? "is-active" : ""}`
              }
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `pt-navbar__link ${isActive ? "is-active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Profile (User Page)
          </NavLink>
        </div>

        <div className="pt-navbar__mobile-actions">
          <button className="pt-navbar__cart" onClick={() => { navigate("/cart"); closeMobileMenu(); }}>
            Cart
            {cartCount > 0 && <span className="pt-navbar__badge">{cartCount}</span>}
          </button>
          {localStorage.getItem("token") && (
            <button className="pt-navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
