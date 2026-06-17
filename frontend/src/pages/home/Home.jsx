// pages/home/Home.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApprovedEstablishments } from "../../services/establishmentService";
import "../../styles/home.css";

const API_BASE = "http://localhost:5000";

const navLinks = ["Home", "Destinations", "About", "Contact"];

const features = [
  { icon: "⊞", title: "Smart Check-In System", desc: "Scan QR codes at tourist spots to track your journey, access exclusive content, and contribute to tourism analytics." },
  { icon: "🤖", title: "AI Travel Companion", desc: "Get personalized itineraries based on your goals, interests, and time. Our AI understands your preferences and suggests the best routes." },
  { icon: "🗺️", title: "Real-Time Map Navigation", desc: "Navigate seamlessly with integrated maps showing directions, nearby attractions, and live updates on your personalized route." },
];

const steps = [
  { icon: "🏠", label: "Access Homepage",      desc: "Open the BASTA AI app and explore main features." },
  { icon: "🔍", label: "Explore Information",  desc: "Browse destinations, culture, and local establishments." },
  { icon: "🤖", label: "AI Assistant",          desc: "Get personalized itinerary based on your preferences." },
  { icon: "🗺️", label: "Map Navigation",        desc: "Follow directions to your selected destinations." },
  { icon: "📱", label: "QR Scanning",           desc: "Scan codes at locations to record your visit." },
  { icon: "⭐", label: "Feedback",              desc: "Share ratings and comments to help improve services." },
];

const bottomFeatures = [
  { icon: "⊞", label: "QR Scanner Interface", color: "#0d9488" },
  { icon: "🔍", label: "AI Chatbot Assistant", color: "#8b5cf6" },
  { icon: "🗺️", label: "Interactive Map View", color: "#0d9488" },
];

// ── Helpers ──────────────────────────────────────────────────────
const getImageUrl = (imgPath) => {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  return `${API_BASE}${imgPath}`;
};

const getAccreditationClass = (accreditation) => {
  if (!accreditation || accreditation === "None") return "accredited";
  if (accreditation.toLowerCase().includes("primary"))   return "primary-tag";
  if (accreditation.toLowerCase().includes("secondary")) return "secondary-tag";
  return "accredited";
};

const StarRating = ({ rating }) => {
  const r = parseFloat(rating) || 0;
  return (
    <div className="estab-stars" aria-label={`Rating: ${r} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(r) ? "star filled" : "star"}>★</span>
      ))}
      {r > 0 && <span className="star-value">{r.toFixed(1)}</span>}
    </div>
  );
};

// ── Establishment image with fallback ────────────────────────────
function EstabImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false);
  const url = getImageUrl(src);

  if (!url || errored) {
    return <div className={`estab-img-placeholder ${className ?? "gray"}`} />;
  }
  return (
    <img
      src={url}
      alt={alt}
      className="estab-real-img"
      onError={() => setErrored(true)}
    />
  );
}

// ── Skeleton card ────────────────────────────────────────────────
function EstabSkeleton({ large }) {
  return (
    <div className={`estab-card ${large ? "large" : "small"} estab-skeleton`}>
      <div className="estab-img-placeholder skeleton-pulse" />
      <div className="estab-card-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line long"  />
        <div className="skeleton-line med"   />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [scrolled,        setScrolled]        = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [establishments,  setEstablishments]  = useState([]);
  const [estabLoading,    setEstabLoading]    = useState(true);
  const [estabError,      setEstabError]      = useState("");

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch approved establishments
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchApprovedEstablishments();
        setEstablishments(data);
      } catch (err) {
        setEstabError("Could not load establishments.");
      } finally {
        setEstabLoading(false);
      }
    };
    load();
  }, []);

  // Split: first card is "large", rest are "small"
  const [featured, ...rest] = establishments;
  const smallCards = rest.slice(0, 4); // show max 4 small cards

  return (
    <div className="home">

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="nav-logo-icon">🌐</span>
            <span className="nav-logo-text">BASTA AI</span>
          </div>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            {navLinks.map((l) => (
              <a key={l}
                href={`#${l.toLowerCase()}`}
                className="nav-link"
                onClick={l === "Destinations"
                  ? (e) => { e.preventDefault(); navigate("/destinations"); }
                  : undefined}
              >
                {l}
              </a>
            ))}
          </div>
          <button className="nav-login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">Discover<br />Barotac Nuevo</h1>
          <p className="hero-subtitle">Your AI-Powered Travel Companion for Sustainable Tourism</p>
          <div className="hero-btns">
            <button className="hero-btn outline">⊞ Scan QR Code</button>
            <button className="hero-btn teal">🤖 Chat with AI</button>
            <button className="hero-btn dark">📍 Explore Spots</button>
          </div>
        </div>
        <button className="hero-play">▶</button>
        <div className="hero-watch">Watch Video</div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-inner">
          <p className="section-tag">PLATFORM FEATURES</p>
          <h2 className="section-title">Everything You Need for<br />Your Perfect Journey</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-name">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <a href="#" className="feature-link">Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESTABLISHMENTS ───────────────────────────────────── */}
      <section className="section estab-section" id="destinations">
        <div className="section-inner">
          <div className="estab-header">
            <h2 className="section-title">Explore Our Accredited<br />Establishments</h2>
            <p className="estab-desc">
              All establishments are DOT accredited, ensuring quality standards and excellent service for your visit.
            </p>
          </div>

          {/* ── Error state ──────────────────────────────────── */}
          {estabError && !estabLoading && (
            <div className="estab-error">
              ⚠️ {estabError}
            </div>
          )}

          {/* ── Loading skeleton ──────────────────────────────── */}
          {estabLoading && (
            <div className="estab-grid">
              <EstabSkeleton large />
              <div className="estab-right">
                <EstabSkeleton /><EstabSkeleton />
                <EstabSkeleton /><EstabSkeleton />
              </div>
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {!estabLoading && !estabError && establishments.length === 0 && (
            <div className="estab-empty">
              <span>🏪</span>
              <p>No accredited establishments available yet.</p>
            </div>
          )}

          {/* ── Real data ─────────────────────────────────────── */}
          {!estabLoading && !estabError && establishments.length > 0 && (
            <div className="estab-grid">

              {/* Large featured card */}
              <div className="estab-card large">
                <EstabImage
                  src={featured.primaryImage}
                  alt={featured.name}
                  className="green"
                />
                <div className="estab-card-body">
                  <span className={`estab-badge ${getAccreditationClass(featured.accreditation)}`}>
                    {featured.accreditation && featured.accreditation !== "None"
                      ? featured.accreditation
                      : "Accredited"}
                  </span>
                  <h4 className="estab-name">{featured.name}</h4>
                  <p className="estab-loc">📍 {featured.address ?? "Barotac Nuevo, Iloilo"}</p>
                  {featured.rating && <StarRating rating={featured.rating} />}
                  <button
                    className="estab-btn outline-dark"
                    onClick={() => navigate(`/establishments/${featured.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Small cards (up to 4) */}
              <div className="estab-right">
                {smallCards.map((e) => (
                  <div className="estab-card small" key={e.id}>
                    <EstabImage src={e.primaryImage} alt={e.name} className="gray" />
                    <div className="estab-card-body">
                      <div className="estab-card-top">
                        <span className="estab-badge accredited">Accredited</span>
                        {e.accreditation && e.accreditation !== "None" && (
                          <span className={`estab-badge ${getAccreditationClass(e.accreditation)}`}>
                            {e.accreditation}
                          </span>
                        )}
                      </div>
                      <h4 className="estab-name small">{e.name}</h4>
                      <p className="estab-loc small">📍 {e.address ?? "Barotac Nuevo, Iloilo"}</p>
                      {e.rating && <StarRating rating={e.rating} />}
                      <button
                        className="estab-explore-btn"
                        onClick={() => navigate(`/establishments/${e.id}`)}
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          <div className="estab-view-all">
            <button className="view-all-btn" onClick={() => navigate("/establishments")}>
              View All Establishments →
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="section how-section">
        <div className="section-inner">
          <h2 className="section-title center">How BASTA AI Works</h2>
          <p className="how-subtitle">Your journey from arrival to feedback in 6 simple steps</p>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={s.label}>
                <div className="step-icon-wrap">
                  <span className="step-icon">{s.icon}</span>
                  <span className="step-num">{i + 1}</span>
                </div>
                <p className="step-label">{s.label}</p>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section className="section about-section" id="about">
        <div className="section-inner about-inner">
          <div className="about-text">
            <p className="section-tag">ABOUT THE MUNICIPALITY</p>
            <h2 className="section-title">A Hidden Gem in<br />Western Visayas</h2>
            <p className="about-para">Barotac Nuevo is a small town in Iloilo, about 34 kilometers north of Iloilo City. It became a separate province in 1811 through the efforts of Don Simon Raimundo Protacio, a respected local leader during the Spanish era. Its name is believed to have come from the Spanish word baro and the last syllable of the Hiligaynon word Malatuor, both linked to the meaning "trust."</p>
            <p className="about-para">According to local lore, the area was already famous in the 11th century for its prized horses, especially Tamasak, a white stallion known for its strength, speed, and beauty. When Governor-General Manuel Gonzales de Aguilar searched for a horse to match one he had received from India, his men found Tamasak in Malatuor, then still part of Dumangas. Don Simon refused to sell the horse, but offered it freely on the condition that Malatuor be made a separate town. The Governor-General agreed, and the separation was carried out in 1811.</p>
            <p className="about-para">To honor Don Simon Protacio and Tamasak, Mayor Bernardo Saaming built a monument in 1927 at the center of the town plaza. Over time, Barotac Nuevo developed into a prosperous agricultural town known for rice, sugarcane, and fish, and it is now proudly recognized as the Football Capital of the Philippines.</p>
          </div>
          <div className="about-imgs">
            <div className="about-img-main placeholder-img" />
            <div className="about-img-row">
              <div className="about-img-sm placeholder-img" />
              <div className="about-img-sm placeholder-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="section-inner">
          <h2 className="cta-title">Start Your Journey Today</h2>
          <p className="cta-subtitle">Experience Barotac Nuevo like never before with AI-powered travel assistance</p>
          <button className="cta-btn" onClick={() => navigate("/register")}>Launch BASTA AI →</button>
          <div className="cta-features">
            {bottomFeatures.map((f) => (
              <div className="cta-feature-card" key={f.label} style={{ background: f.color }}>
                <span className="cta-feature-icon">{f.icon}</span>
                <span className="cta-feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="footer" id="contact">
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