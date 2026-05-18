// ============================================================
// FeedbackMonitoring.jsx
// Feedback Monitoring Page — fully dynamic from backend API
// ============================================================

import { useState, useEffect, useCallback } from "react";
import {
  fetchFeedbackStats,
  fetchRatingDistribution,
  fetchFeedbackBySpot,
  fetchAllFeedback,
} from "../../services/feedbackService";
import "../../styles/feedbackMonitoring.css";

// ── Constants ─────────────────────────────────────────────────

const TABS = ["All Ratings", "5", "4", "3", "2", "1"];

const AVATAR_COLORS = [
  "#0d9488", "#14b8a6", "#059669", "#0891b2",
  "#7c3aed", "#db2777", "#ea580c", "#ca8a04",
];

const DEFAULT_STATS = {
  total_feedback: 0,
  avg_rating: 0,
  positive_percent: 0,
  this_month_count: 0,
};

const DEFAULT_DISTRIBUTION = {
  five_star: 0, four_star: 0, three_star: 0,
  two_star: 0,  one_star: 0,  total: 0,
};

// ── Helpers ───────────────────────────────────────────────────

/**
 * Derives badge label + CSS class from a numeric star rating.
 */
function getBadgeInfo(rating) {
  if (rating === 5) return { label: "Excellent", cls: "fb-badge-excellent" };
  if (rating === 4) return { label: "Good",      cls: "fb-badge-good"      };
  if (rating === 3) return { label: "Average",   cls: "fb-badge-average"   };
  if (rating === 2) return { label: "Poor",      cls: "fb-badge-poor"      };
  return              { label: "Very Poor",  cls: "fb-badge-poor"      };
}

/**
 * Returns initials (up to 2 chars) from a full name.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Sub-components ────────────────────────────────────────────

function Stars({ n }) {
  return (
    <div className="fb-review-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`fb-star${i > n ? " empty" : ""}`}>★</span>
      ))}
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────

function DonutChart({ dist }) {
  const total = dist.total || 0;

  const segments = [
    { label: "Excellent (5★)", value: dist.five_star,  color: "#0d9488" },
    { label: "Good (4★)",      value: dist.four_star,  color: "#34d399" },
    { label: "Average (3★)",   value: dist.three_star, color: "#f59e0b" },
    { label: "Poor (2★)",      value: dist.two_star,   color: "#f87171" },
    { label: "Very Poor (1★)", value: dist.one_star,   color: "#ef4444" },
  ];

  const R = 80, cx = 100, cy = 100, strokeW = 28;
  let angle = -90;

  const arcs = total > 0
    ? segments.map((seg) => {
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
      })
    : [];

  return (
    <div className="fb-donut-wrap">
      <svg className="fb-donut-svg" viewBox="0 0 200 200" width="200" height="200">
        {/* Empty-state ring */}
        {total === 0 && (
          <circle cx={cx} cy={cy} r={R} fill="none"
            stroke="#e5e7eb" strokeWidth={strokeW} />
        )}
        {arcs.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22"
          fontWeight="800" fontFamily="Sora,sans-serif" fill="#1a2332">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#9ca3af">
          total reviews
        </text>
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

// ── Bar Chart ─────────────────────────────────────────────────

function BarChart({ spots }) {
  const MAX = spots.length > 0 ? Math.max(...spots.map((s) => s.count), 1) : 1;
  const W = 560, H = 180;
  const BAR_W = 54;
  const GAP = spots.length > 0
    ? (W - spots.length * BAR_W) / (spots.length + 1)
    : 0;

  const yMax  = Math.ceil(MAX / 100) * 100 || 100;
  const steps = [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0];

  if (spots.length === 0) {
    return (
      <div className="fb-bar-wrap fb-bar-empty">
        <span>No data available</span>
      </div>
    );
  }

  return (
    <div className="fb-bar-wrap">
      <svg viewBox={`0 0 ${W + 60} ${H + 50}`} style={{ height: "230px" }}>
        {steps.map((v, i) => {
          const y = (i / (steps.length - 1)) * H + 5;
          return (
            <g key={v}>
              <line x1="40" y1={y} x2={W + 50} y2={y}
                stroke="#f1f5f9" strokeWidth="1" />
              <text x="36" y={y + 4} fontSize="9" fill="#9ca3af"
                textAnchor="end">{Math.round(v)}</text>
            </g>
          );
        })}
        {spots.map((s, i) => {
          const barH = (s.count / MAX) * (H - 10);
          const x = 40 + GAP + i * (BAR_W + GAP);
          const y = H + 5 - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={BAR_W} height={barH}
                rx="6" fill="#0d9488" opacity="0.85" />
              <text x={x + BAR_W / 2} y={H + 22}
                fontSize="9" fill="#9ca3af" textAnchor="middle">
                {s.name.length > 10 ? `${s.name.slice(0, 10)}…` : s.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Skeleton Loader ───────────────────────────────────────────

function SkeletonCard() {
  return <div className="fb-skeleton fb-stat-card" aria-hidden="true" />;
}

// ── Main Component ────────────────────────────────────────────

export default function FeedbackMonitoring() {
  const [activeTab,    setActiveTab]    = useState("All Ratings");
  const [stats,        setStats]        = useState(DEFAULT_STATS);
  const [distribution, setDistribution] = useState(DEFAULT_DISTRIBUTION);
  const [spots,        setSpots]        = useState([]);
  const [reviews,      setReviews]      = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error,        setError]        = useState(null);

  const LIMIT = 20;

  // ── Fetch overview data (stats, distribution, spots) ─────────
  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);
        const [s, d, sp] = await Promise.all([
          fetchFeedbackStats(),
          fetchRatingDistribution(),
          fetchFeedbackBySpot(),
        ]);
        setStats(s);
        setDistribution(d);
        setSpots(sp);
      } catch (err) {
        console.error("[FeedbackMonitoring] overview load error:", err);
        setError("Failed to load feedback data. Please try again.");
        // Keep defaults (zeros) on error
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  // ── Fetch reviews list (on tab or page change) ─────────────────
  const loadReviews = useCallback(async (rating, currentPage) => {
    try {
      setReviewsLoading(true);
      const result = await fetchAllFeedback({
        rating: rating === "All Ratings" ? null : Number(rating),
        page: currentPage,
        limit: LIMIT,
      });
      setReviews(result.data);
      setTotalReviews(result.total);
    } catch (err) {
      console.error("[FeedbackMonitoring] reviews load error:", err);
      setReviews([]);
      setTotalReviews(0);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews(activeTab, page);
  }, [activeTab, page, loadReviews]);

  // ── Tab change: reset to page 1 ───────────────────────────────
  function handleTabChange(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  // ── Derived stat-card values ──────────────────────────────────
  const statCards = [
    {
      icon: "💬", color: "teal",
      num: loading ? "—" : stats.total_feedback.toLocaleString(),
      label: "Total Feedback",
    },
    {
      icon: "⭐", color: "amber",
      num: loading ? "—" : `${stats.avg_rating} / 5`,
      label: "Average Rating",
    },
    {
      icon: "👍", color: "green",
      num: loading ? "—" : `${stats.positive_percent}%`,
      label: "Positive Reviews",
    },
    {
      icon: "📋", color: "blue",
      num: loading ? "—" : stats.this_month_count.toLocaleString(),
      label: "This Month",
    },
  ];

  const totalPages = Math.ceil(totalReviews / LIMIT);

  return (
    <div>
      {/* Page Header */}
      <div className="fb-header">
        <h1>Feedback Monitoring</h1>
        <p>
          Tourist satisfaction insights —{" "}
          <span>
            {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="fb-error-banner" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="fb-stats-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((s) => (
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
          {loading
            ? <div className="fb-skeleton fb-skeleton-chart" aria-hidden="true" />
            : <DonutChart dist={distribution} />}
        </div>

        {/* Bar */}
        <div className="fb-card">
          <div className="fb-card-title">Feedback Count by Spot</div>
          <div className="fb-card-sub">Total reviews submitted per tourist destination</div>
          {loading
            ? <div className="fb-skeleton fb-skeleton-chart" aria-hidden="true" />
            : <BarChart spots={spots} />}
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
              onClick={() => handleTabChange(tab)}
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

      {/* Reviews List */}
      <div className="fb-reviews-list">
        {reviewsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="fb-skeleton fb-skeleton-review" aria-hidden="true" />
          ))
        ) : reviews.length === 0 ? (
          <div className="fb-empty-state">
            No reviews match this rating filter.
          </div>
        ) : (
          reviews.map((r, i) => {
            const initials = getInitials(r.reviewer_name);
            const badge    = getBadgeInfo(r.rating);
            const dateStr  = new Date(r.created_at).toISOString().split("T")[0];

            return (
              <div className="fb-review-card" key={r.id}>
                {/* Avatar */}
                <div
                  className="fb-avatar"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {initials || "?"}
                </div>

                {/* Body */}
                <div>
                  <div className="fb-review-meta">
                    <span className="fb-review-name">{r.reviewer_name}</span>
                    <span className={`fb-review-badge ${badge.cls}`}>{badge.label}</span>
                    <span className="fb-review-visit">{r.visit_type}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Stars n={r.rating} />
                    <span className="fb-review-spot">{r.establishment_name}</span>
                  </div>
                  {r.comment && (
                    <div className="fb-review-text">{r.comment}</div>
                  )}
                </div>

                {/* Date */}
                <div className="fb-review-date">{dateStr}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !reviewsLoading && (
        <div className="fb-pagination">
          <button
            className="fb-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span className="fb-page-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="fb-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}