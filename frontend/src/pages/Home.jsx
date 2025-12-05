import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const offerings = [
    { title: "Personalized Nikah Nama", icon: "✨" },
    { title: "Hampers & Gift Boxes", icon: "🎁" },
    { title: "Wallets, Pens & Keychains (for him)", icon: "🕴️" },
    { title: "Scrunchies, Chudiyan & Jhumkas (for her)", icon: "💖" },
  ];

  const reasons = [
    { title: "Customized with love", text: "Every detail reflects your story." },
    { title: "Creative packaging", text: "Layered textures, ribbons, and luxe touches." },
    { title: "Gifts for both him & her", text: "Balanced curation for every recipient." },
  ];

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data } = await api.get("/products");
        const featured = data.products ? data.products.filter(p => p.isFeatured) : data.filter(p => p.isFeatured);
        setTrendingProducts(featured.length > 0 ? featured : (data.products || data).slice(0, 5));
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const getBadgeClass = (badgeText) => {
    if (!badgeText) return "";
    if (badgeText === "Best Seller") return "";
    if (badgeText === "New Arrival") return "new";
    if (badgeText === "Popular") return "popular";
    if (badgeText === "Limited Edition") return "limited";
    if (badgeText === "Trending") return "trending";
    return "";
  };

  return (
    <div className="home-page">
      { }
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-pill">Presento Treasure</p>
          <h1>Where every gift tells a story</h1>
          <p className="home-hero__text">
            Personalized & thoughtful gifts for every occasion. Discover curated hampers,
            Nikah Namas, and keepsakes infused with pastel elegance.
          </p>
          <div className="home-hero__cta">
            <button className="btn-primary" onClick={() => navigate("/shop")}>
              Shop Now
            </button>
            <button className="btn-ghost" onClick={() => navigate("/contact")}>
              Talk to us
            </button>
          </div>
        </div>
        <div className="home-hero__visual">
          <div className="hero-card">
            <span className="hero-card__tag">Pastel Dreams</span>
            <h3>Custom Hampers</h3>
            <p>Soft palettes. Luxe elements. Love in every layer.</p>
          </div>
          <div className="hero-card hero-card--secondary">
            <h3>Nikah Nama</h3>
            <p>Made-to-order artworks to celebrate sacred promises.</p>
          </div>
        </div>
      </section>

      { }
      <section className="trending-section">
        <div className="trending-container">
          <div className="trending-header">
            <h2>Trending Gifts This Season</h2>
            <p>Our most loved creations, curated just for you 💞</p>
          </div>

          {loading ? (
            <div className="trending-loading">Loading products...</div>
          ) : (
            <>
              <div className="trending-grid">
                {trendingProducts.map((product) => {
                  const badgeClass = getBadgeClass(product.badge);
                  return (
                    <div
                      key={product.id}
                      className="trending-card"
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="trending-image-wrapper">
                        <img src={product.imageUrl} alt={product.name} />
                        {product.badge && <span className={`trending-badge ${badgeClass}`}>{product.badge}</span>}
                      </div>
                      <div className="trending-info">
                        <h3>{product.name}</h3>
                        <p className="trending-price">₹{product.price}</p>
                        <p className="trending-category">{product.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="trending-view-all">
                <button className="btn-secondary" onClick={() => navigate("/shop")}>
                  View All Products →
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      { }
      <section className="home-section home-card--about">
        <h2>About Us !</h2>
        <p>
          A one-stop shop for personalized & thoughtful gifts because every occasion
          deserves something special.
        </p>
      </section>

      { }
      <section className="home-section home-card--occasions">
        <h2>For Every Occasion</h2>
        <p>Weddings | Birthdays | Anniversaries | Festive Moments</p>
        <span>We make celebrations unforgettable!</span>
      </section>

      { }
      <section className="home-section home-card--offerings">
        <h2>What We Offer</h2>
        <div className="home-offerings-grid">
          {offerings.map((item) => (
            <article key={item.title}>
              <span>{item.icon}</span>
              <p>{item.title}</p>
            </article>
          ))}
        </div>
      </section>

      { }
      <section className="home-why">
        <h2>Why Choose Presento Treasure?</h2>
        <div className="home-why__grid">
          {reasons.map((card) => (
            <div key={card.title} className="home-why__card">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      { }
      <section className="home-section home-card--cta">
        <h2>Let Presento Treasure be part of your next celebration!</h2>
        <p>DM us for orders | Follow for ideas</p>
        <a
          href="https://www.instagram.com/presento_treasure?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noreferrer"
          className="btn-instagram"
        >
          Follow us on Instagram
        </a>
      </section>
    </div>
  );
}
