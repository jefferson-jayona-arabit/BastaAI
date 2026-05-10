import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

const navLinks = ["Home", "Destinations", "About", "Contact"];

const features = [
  { icon: "⊞", title: "Smart Check-In System", desc: "Scan QR codes at tourist spots to track your journey, access exclusive content, and contribute to tourism analytics." },
  { icon: "🤖", title: "AI Travel Companion", desc: "Get personalized itineraries based on your goals, interests, and time. Our AI understands your preferences and suggests the best routes." },
  { icon: "🗺️", title: "Real-Time Map Navigation", desc: "Navigate seamlessly with integrated maps showing directions, nearby attractions, and live updates on your personalized route." },
];

const establishments = [
  { name: "Ina Farmers Learning Site & Agri-Farm Inc.", type: "Secondary Accredited", tag: null, large: true },
  { name: "The Somerset Inn", type: "Accredited", tag: "Primary", img: true },
  { name: "Feric Hotel", type: "Accredited", tag: "Primary", img: true },
  { name: "Juncook Restaurant", type: "Accredited", tag: "Secondary", img: true },
  { name: "Mateia Cafe", type: "Accredited", tag: "Secondary", img: true },
];

const steps = [
  { icon: "🏠", label: "Access Homepage", desc: "Open the BASTA AI app and explore main features." },
  { icon: "🔍", label: "Explore Information", desc: "Browse destinations, culture, and local establishments." },
  { icon: "🤖", label: "AI Assistant", desc: "Get personalized itinerary based on your preferences." },
  { icon: "🗺️", label: "Map Navigation", desc: "Follow directions to your selected destinations." },
  { icon: "📱", label: "QR Scanning", desc: "Scan codes at locations to record your visit." },
  { icon: "⭐", label: "Feedback", desc: "Share ratings and comments to help improve services." },
];

const bottomFeatures = [
  { icon: "⊞", label: "QR Scanner Interface", color: "#0d9488" },
  { icon: "🔍", label: "AI Chatbot Assistant", color: "#8b5cf6" },
  { icon: "🗺️", label: "Interactive Map View", color: "#0d9488" },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home">
      {/* NAVBAR */}
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
                  onClick={l === "Destinations" ? (e) => { e.preventDefault(); navigate("/destinations"); } : undefined}
                >
                  {l}
                </a>
            ))}
          </div>
          <button className="nav-login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </nav>

      {/* HERO */}
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

      {/* FEATURES */}
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

      {/* ESTABLISHMENTS */}
      <section className="section estab-section" id="destinations">
        <div className="section-inner">
          <div className="estab-header">
            <h2 className="section-title">Explore Our Accredited<br />Establishments</h2>
            <p className="estab-desc">All establishments are DOT accredited, ensuring quality standards and excellent service for your visit.</p>
          </div>
          <div className="estab-grid">
            {/* Large card */}
            <div className="estab-card large">
              <div className="estab-img-placeholder green" />
              <div className="estab-card-body">
                <span className="estab-badge secondary">Secondary Accredited</span>
                <h4 className="estab-name">Ina Farmers Learning Site & Agri-Farm Inc.</h4>
                <p className="estab-loc">📍 Agri-Lorem Calzada, Barotac Nuevo, Iloilo</p>
                <button className="estab-btn outline-dark">View Details</button>
              </div>
            </div>
            {/* Right grid */}
            <div className="estab-right">
              {[
                { name: "The Somerset Inn", tag: "Primary" },
                { name: "Feric Hotel", tag: "Primary" },
                { name: "Juncook Restaurant", tag: "Secondary" },
                { name: "Mateia Cafe", tag: "Secondary" },
              ].map((e) => (
                <div className="estab-card small" key={e.name}>
                  <div className="estab-img-placeholder gray" />
                  <div className="estab-card-body">
                    <div className="estab-card-top">
                      <span className="estab-badge accredited">Accredited</span>
                      <span className={`estab-badge ${e.tag === "Primary" ? "primary-tag" : "secondary-tag"}`}>{e.tag}</span>
                    </div>
                    <h4 className="estab-name small">{e.name}</h4>
                    <p className="estab-loc small">📍 Acab, Barotac Nuevo, Iloilo</p>
                    <button className="estab-explore-btn">Explore</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="estab-view-all">
            <button className="view-all-btn">View All Establishments →</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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

      {/* ABOUT MUNICIPALITY */}
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

      {/* CTA */}
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

      {/* FOOTER */}
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