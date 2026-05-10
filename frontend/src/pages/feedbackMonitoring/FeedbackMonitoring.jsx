import { useState } from "react";
import "../../styles/feedbackMonitoring.css";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { icon: "💬", color: "teal",  num: "874",    label: "Total Feedback" },
  { icon: "⭐", color: "amber", num: "4.7 / 5", label: "Average Rating" },
  { icon: "👍", color: "green", num: "69%",    label: "Positive Reviews" },
  { icon: "📋", color: "blue",  num: "312",    label: "This Month" },
];

// Donut segments: [label, value, color]
const ratingSegments = [
  { label: "Average (3★)", value: 12, color: "#f59e0b" },
  { label: "Excellent (5★)", value: 48, color: "#0d9488" },
  { label: "Good (4★)", value: 28, color: "#34d399" },
  { label: "Poor (2★)", value: 7,  color: "#f87171" },
  { label: "Very Poor (1★)", value: 5, color: "#ef4444" },
];

const barSpots = [
  { name: "Gementiza",        count: 480 },
  { name: "Ina's Farm",       count: 390 },
  { name: "Juncook",          count: 340 },
  { name: "Maleia Cafe",      count: 290 },
  { name: "Fine Dust",        count: 240 },
  { name: "Batchmatesweets",  count: 195 },
  { name: "Feric Hotel",      count: 160 },
];

const avatarColors = [
  "#0d9488","#14b8a6","#059669","#0891b2",
  "#7c3aed","#db2777","#ea580c","#ca8a04",
];

const reviews = [
  {
    initials: "MLJ", name: "Maria Lourdes Javellana",
    badge: "excellent", visit: "First Visit",
    rating: 5, spot: "Gementiza Inland Resort",
    text: "The resort is absolutely stunning! Great pools, lush gardens, and very relaxing atmosphere. Perfect for family outings in Barotac Nuevo!",
    date: "2026-03-30",
  },
  {
    initials: "CE", name: "Carlo Espino",
    badge: "excellent", visit: "First Visit",
    rating: 5, spot: "Ina's Greenscape & Flower Farm",
    text: "A hidden gem in Iloilo! The flower arrangements are breathtaking and perfect for photos. The staff was warm and accommodating.",
    date: "2026-03-29",
  },
  {
    initials: "RT", name: "Rosalind Teves",
    badge: "excellent", visit: "Returning Visitor",
    rating: 5, spot: "Juncook Restaurant",
    text: "Best Ilonggo food in Barotac Nuevo! The flavors are authentic and portions are generous. Will definitely come back!",
    date: "2026-03-29",
  },
  {
    initials: "DM", name: "Dante Macabenta",
    badge: "good", visit: "Regular Guest",
    rating: 4, spot: "Fine Dust Cafe",
    text: "Very Instagrammable interiors and great coffee. The pastries were fresh and delicious. A bit pricey but worth it.",
    date: "2026-03-28",
  },
  {
    initials: "AG", name: "Analyn Gabieta",
    badge: "excellent", visit: "First Visit",
    rating: 5, spot: "Ina Farmers Learning Site",
    text: "Educational and eye-opening! Great for school visits and those interested in sustainable farming. The tour guide was very informative.",
    date: "2026-03-26",
  },
  {
    initials: "JV", name: "Jerome Villanueva",
    badge: "good", visit: "Returning Visitor",
    rating: 4, spot: "Maleia Cafe",
    text: "Cozy ambiance and great specialty drinks. Love the local vibes. The service could be a little faster but overall a great experience!",
    date: "2026-03-27",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function badgeClass(b) {
  return { excellent: "fb-badge-excellent", good: "fb-badge-good",
           average: "fb-badge-average", poor: "fb-badge-poor" }[b] ?? "fb-badge-average";
}

function Stars({ n }) {
  return (
    <div className="fb-review-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`fb-star${i > n ? " empty" : ""}`}>★</span>
      ))}
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────

function DonutChart({ segments }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 80, cx = 100, cy = 100, stroke = 28;
  let angle = -90;
  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const startAngle = angle;
    angle += pct * 360;
    const endAngle = angle;
    const toRad = (d) => (d * Math.PI) / 180;
    const x1 = cx + R * Math.cos(toRad(startAngle));
    const y1 = cy + R * Math.sin(toRad(startAngle));
    const x2 = cx + R * Math.cos(toRad(endAngle));
    const y2 = cy + R * Math.sin(toRad(endAngle));
    const large = pct > 0.5 ? 1 : 0;
    return { ...seg, d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, pct };
  });

  return (
    <div className="fb-donut-wrap">
      <svg className="fb-donut-svg" viewBox="0 0 200 200" width="200" height="200">
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800"
          fontFamily="Sora,sans-serif" fill="#1a2332">874</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#9ca3af">total reviews</text>
      </svg>
      <div className="fb-donut-legend">
        {segments.map((s, i) => (
          <div className="fb-legend-item" key={i}>
            <div className="fb-legend-dot" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ spots }) {
  const MAX = Math.max(...spots.map(s => s.count));
  const W = 560, H = 180;
  const BAR_W = 54, GAP = (W - spots.length * BAR_W) / (spots.length + 1);
  const yLabels = [600, 450, 300, 150, 0];

  return (
    <div className="fb-bar-wrap">
      <svg viewBox={`0 0 ${W + 60} ${H + 50}`} style={{ height: "230px" }}>
        {/* Y-axis grid */}
        {yLabels.map((v, i) => {
          const y = (i / (yLabels.length - 1)) * H + 5;
          return (
            <g key={v}>
              <line x1="40" y1={y} x2={W + 50} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x="36" y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{v}</text>
            </g>
          );
        })}
        {/* Bars */}
        {spots.map((s, i) => {
          const barH = (s.count / MAX) * (H - 10);
          const x = 40 + GAP + i * (BAR_W + GAP);
          const y = H + 5 - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={BAR_W} height={barH}
                rx="6" fill="#0d9488" opacity="0.85" />
              <text x={x + BAR_W / 2} y={H + 22}
                fontSize="9" fill="#9ca3af" textAnchor="middle">{s.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = ["All Ratings", "5", "4", "3", "2", "1"];

export default function FeedbackMonitoring() {
  const [activeTab, setActiveTab] = useState("All Ratings");

  const filtered = activeTab === "All Ratings"
    ? reviews
    : reviews.filter(r => r.rating === Number(activeTab));

  return (
    <div>
      {/* Page Header */}
      <div className="fb-header">
        <h1>Feedback Monitoring</h1>
        <p>Tourist satisfaction insights — <span>March 2026</span></p>
      </div>

      {/* Stat Cards */}
      <div className="fb-stats-grid">
        {stats.map((s) => (
          <div className="fb-stat-card" key={s.label}>
            <div className={`fb-stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="fb-stat-num">{s.num}</div>
              <div className="fb-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="fb-main-grid">
        {/* Donut */}
        <div className="fb-card">
          <div className="fb-card-title">Rating Distribution</div>
          <div className="fb-card-sub">Breakdown of feedback ratings</div>
          <DonutChart segments={ratingSegments} />
        </div>

        {/* Bar */}
        <div className="fb-card">
          <div className="fb-card-title">Feedback Count by Spot</div>
          <div className="fb-card-sub">Total reviews submitted per tourist destination</div>
          <BarChart spots={barSpots} />
        </div>
      </div>

      {/* All Feedback */}
      <div className="fb-all-header">
        <div>
          <div className="fb-all-title">All Feedback</div>
          <div className="fb-all-sub">Filter and view tourist reviews</div>
        </div>
        <div className="fb-rating-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`fb-rating-tab${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "All Ratings" ? (
                "All Ratings"
              ) : (
                <><span className="fb-tab-star">★</span>{tab}</>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="fb-reviews-list">
        {filtered.map((r, i) => (
          <div className="fb-review-card" key={i}>
            {/* Avatar */}
            <div className="fb-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
              {r.initials}
            </div>

            {/* Body */}
            <div>
              <div className="fb-review-meta">
                <span className="fb-review-name">{r.name}</span>
                <span className={`fb-review-badge ${badgeClass(r.badge)}`}>
                  {r.badge.charAt(0).toUpperCase() + r.badge.slice(1)}
                </span>
                <span className="fb-review-visit">{r.visit}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Stars n={r.rating} />
                <span className="fb-review-spot">{r.spot}</span>
              </div>
              <div className="fb-review-text">{r.text}</div>
            </div>

            {/* Date */}
            <div className="fb-review-date">{r.date}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "2rem", fontSize: "0.87rem" }}>
            No reviews match this rating filter.
          </div>
        )}
      </div>
    </div>
  );
}