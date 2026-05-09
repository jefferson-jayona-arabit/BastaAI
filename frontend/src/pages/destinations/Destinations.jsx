import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/destinations.css";


const categories = ["All", "Accommodation", "Dining", "Cafe", "Agriculture & Learning", "Resort & Recreation", "Nature & Gardens", "Bakery"];

const accreditedEstablishments = [
  {
    id: 1,
    name: "Ina Farmers Learning Site & Agri-Farm Inc.",
    type: "Secondary",
    category: "Agriculture & Learning",
    rating: 4.7,
    address: "Agcuyawan Calsada, Barotac Nuevo, Iloilo",
    desc: "Experience sustainable farming practices and learn about organic agriculture in this educational farm...",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80",
    tag: "Secondary",
  },
  {
    id: 2,
    name: "The Somerset Inn",
    type: "Primary",
    category: "Accommodation",
    rating: 4.5,
    address: "Acuit, Barotac Nuevo, Iloilo",
    desc: "A comfortable and welcoming inn offering quality accommodation for travelers exploring Barotac...",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    tag: "Primary",
  },
  {
    id: 3,
    name: "Feric Hotel",
    type: "Primary",
    category: "Accommodation",
    rating: 4.6,
    address: "Ilaud Poblacion, Barotac Nuevo, Iloilo",
    desc: "Conveniently located in the heart of Barotac Nuevo, offering modern amenities and excellent service.",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe2fa?w=600&q=80",
    tag: "Primary",
  },
  {
    id: 4,
    name: "Juncook Restaurant",
    type: "Secondary",
    category: "Dining",
    rating: 4.8,
    address: "Acuit, Barotac Nuevo, Iloilo",
    desc: "Savor authentic Ilonggo cuisine and local delicacies in a cozy, family-friendly atmosphere.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    tag: "Secondary",
  },
  {
    id: 5,
    name: "Maleia Cafe",
    type: "Secondary",
    category: "Cafe",
    rating: 4.7,
    address: "Acuit, Barotac Nuevo, Iloilo",
    desc: "A trendy cafe perfect for coffee lovers, offering specialty drinks and light meals in a relaxing...",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    tag: "Secondary",
  },
  {
    id: 6,
    name: "Gementiza Inland Resort",
    type: "Primary",
    category: "Resort & Recreation",
    rating: 4.9,
    address: "Tabuc Suba, Barotac Nuevo, Iloilo",
    desc: "Escape to nature at this beautiful inland resort featuring pools, gardens, and recreational facilities.",
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    tag: "Primary",
  },
  {
    id: 7,
    name: "Fine Dust Cafe",
    type: "Secondary",
    category: "Cafe",
    rating: 4.6,
    address: "Ilaya Poblacion, Barotac Nuevo, Iloilo",
    desc: "An artsy cafe with Instagram-worthy interiors, serving premium coffee and delicious pastries.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    tag: "Secondary",
  },
  {
    id: 8,
    name: "Batchmatesweets Cakes and Pastries",
    type: "Secondary",
    category: "Bakery",
    rating: 4.8,
    address: "Market Mall, Barotac Nuevo, Iloilo",
    desc: "Indulge in freshly baked cakes, pastries, and sweet treats made with love and quality ingredients.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    tag: "Secondary",
  },
  {
    id: 9,
    name: "Ina's Greenscape and Flower Farm",
    type: "Secondary",
    category: "Nature & Gardens",
    rating: 4.9,
    address: "Tinorian, Barotac Nuevo, Iloilo",
    desc: "A picturesque flower farm showcasing beautiful blooms, perfect for nature lovers and photography...",
    img: "https://images.unsplash.com/photo-1490750967868-88df5691cc27?w=600&q=80",
    tag: "Secondary",
  },
];

const others = [
  {
    id: 10,
    name: "Lola Di",
    type: "Local",
    category: "Dining",
    rating: 4.4,
    address: "Barotac Nuevo Public Market, Barotac Nuevo, Iloilo",
    desc: "A beloved local eatery inside the public market known for its hearty home-cooked Filipino meals...",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
  },
  {
    id: 11,
    name: "Dried Fish",
    type: "Local",
    category: "Dining",
    rating: 4.3,
    address: "Barotac Nuevo Public Market, Barotac Nuevo, Iloilo",
    desc: "A popular market stall offering a wide variety of sun-dried fish and seafood products, a staple of...",
    img: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&q=80",
  },
  {
    id: 12,
    name: "Mama Edz' Native Chicken Arroz Caldo",
    type: "Local",
    category: "Dining",
    rating: 4.6,
    address: "Tabucan, Barotac Nuevo, Iloilo",
    desc: "Famous for its rich and flavorful native chicken arroz caldo, a comforting Filipino rice porridge...",
    img: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80",
  },
];

export default function Destinations() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = accreditedEstablishments.filter((e) =>
    activeCategory === "All" || e.category === activeCategory
  );

  const visibleEstablishments = showAll ? filtered : filtered.slice(0, 9);

  return (
    <div className="destinations-page">
      <div className="dest-topbar">
        <div className="dest-topbar-left">
          <button className="dest-topbar-back" onClick={() => navigate("/")}>←</button>
          <div className="dest-topbar-title-group">
            <h1 className="dest-topbar-title">Tourist Attractions</h1>
            <p className="dest-topbar-sub">Barotac Nuevo, Iloilo — {accreditedEstablishments.length + others.length} places to explore</p>
          </div>
        </div>
        <button className="dest-ai-btn">🤖 AI Assistant</button>
      </div>

      {/* ACCREDITED SECTION */}
      <section className="dest-section">
        <div className="dest-section-inner">
          <div className="dest-section-header">
            <div className="dest-section-title-row">
              <span className="dest-section-icon-badge">⊞</span>
              <div>
                <h2 className="dest-section-title">Accredited Establishments</h2>
                <span className="dest-dot-badge">DOT Certified</span>
              </div>
            </div>
            <p className="dest-section-desc">Officially recognized by the Department of Tourism — quality assured for every visitor.</p>
          </div>

          {/* CATEGORY FILTER */}
          <div className="dest-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`dest-cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CARDS GRID */}
          {visibleEstablishments.length === 0 ? (
            <div className="dest-empty">
              <p>No establishments found in {activeCategory}.</p>
            </div>
          ) : (
            <div className="dest-cards-grid">
              {visibleEstablishments.map((est) => (
                <div className="dest-card" key={est.id}>
                  <div className="dest-card-img-wrap">
                    <img src={est.img} alt={est.name} className="dest-card-img" />
                    <span className={`dest-card-badge ${est.tag === "Primary" ? "badge-primary" : "badge-secondary"}`}>
                      {est.tag}
                    </span>
                    <button className="dest-card-fav">☆</button>
                  </div>
                  <div className="dest-card-body">
                    <div className="dest-card-top-row">
                      <span className="dest-accredited-dot">● Accredited</span>
                      <span className="dest-rating">⭐ {est.rating}</span>
                    </div>
                    <h3 className="dest-card-name">{est.name}</h3>
                    <p className="dest-card-desc">{est.desc}</p>
                    <p className="dest-card-address">📍 {est.address}</p>
                    <button className="dest-view-btn" onClick={() => navigate(`/attractions/${est.id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAll && filtered.length > 9 && (
            <div className="dest-scroll-more">
              <button className="dest-load-more" onClick={() => setShowAll(true)}>
                Load More Establishments ↓
              </button>
            </div>
          )}
        </div>
      </section>

      {/* OTHERS / LOCAL FAVORITES */}
      <section className="dest-section dest-others-section">
        <div className="dest-section-inner">
          <div className="dest-section-header">
            <div className="dest-section-title-row">
              <span className="dest-section-icon-badge orange">🏠</span>
              <div>
                <h2 className="dest-section-title">Others</h2>
                <span className="dest-dot-badge local">Local Favorites</span>
              </div>
            </div>
            <p className="dest-section-desc">Discover local gems and community favorites worth visiting in Barotac Nuevo.</p>
          </div>

          <div className="dest-cards-grid">
            {others.map((est) => (
              <div className="dest-card" key={est.id}>
                <div className="dest-card-img-wrap">
                  <img src={est.img} alt={est.name} className="dest-card-img" />
                  <span className="dest-card-badge badge-local">Local</span>
                  <button className="dest-card-fav">☆</button>
                </div>
                <div className="dest-card-body">
                  <div className="dest-card-top-row">
                    <span className="dest-local-dot">● Local</span>
                    <span className="dest-rating">⭐ {est.rating}</span>
                  </div>
                  <h3 className="dest-card-name">{est.name}</h3>
                  <p className="dest-card-desc">{est.desc}</p>
                  <p className="dest-card-address">📍 {est.address}</p>
                  <button className="dest-view-btn" onClick={() => navigate(`/attractions/${est.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="nav-logo-icon">🌐</span>
              <span className="nav-logo-text">BASTA AI</span>
            </div>
            <p className="footer-tagline">Barotac Nuevo's Analytics & Sustainable Tourism through Agentic Artificial Intelligence</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Enter your email" className="footer-email-input" />
              <button className="footer-email-btn">→</button>
            </div>
            <p className="footer-update">Stay updated on tourism news & events</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <a href="#">Home</a><a href="#">Destinations</a><a href="#">Establishments</a>
            </div>
            <div className="footer-col">
              <h4>Features</h4>
              <a href="#">QR Scanner</a><a href="#">AI Assistant</a><a href="#">Map Navigation</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Contact Us</a><a href="#">Feedback</a><a href="#">Help Center</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 BASTA AI. All rights reserved.</p>
          <div className="footer-socials">
            <span>f</span><span>in</span><span>X</span><span>📷</span>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}