import { useState, useEffect } from "react";
import {
    fetchDashboardStats,
    fetchDailyVisits,
    fetchSubmissions,
    fetchTopSpots,
    fetchFeedbackDistribution,
} from "../../services/dashboardService";
import "../../styles/Dashboard.css";

// ── Default / fallback values ─────────────────────────────────
const DEFAULT_STATS = {
    totalTouristUsers: 0, totalQRScans: 0,
    touristDestinations: 0, totalEstablishments: 0, totalFeedback: 0,
};
const DEFAULT_SUBMISSIONS = {
    pending: 0, approved: 0, newRegistrations: 0, total: 0, approvalRate: 0,
};
const DEFAULT_FEEDBACK = {
    totalReviews: 0, avgRating: 0, positiveRate: 0,
    distribution: { fiveStar:0, fourStar:0, threeStar:0, twoStar:0, oneStar:0 },
};

// ── Donut Chart ────────────────────────────────────────────────
const DONUT_COLORS = {
    fiveStar: "#0d9488", fourStar: "#22c55e",
    threeStar: "#facc15", twoStar: "#f97316", oneStar: "#ef4444",
};
const DONUT_LABELS = {
    fiveStar: "Excellent (5★)", fourStar: "Good (4★)",
    threeStar: "Average (3★)", twoStar: "Poor (2★)", oneStar: "Very Poor (1★)",
};

function DonutChart({ dist, avg }) {
    const r = 70, cx = 90, cy = 90, stroke = 28;
    const circ = 2 * Math.PI * r;
    const total = Object.values(dist).reduce((s, v) => s + v, 0);
    let offset = 0;
    return (
        <svg viewBox="0 0 180 180" className="donut-svg">
            {total === 0 ? (
                <circle cx={cx} cy={cy} r={r} fill="none"
                    stroke="#e5e7eb" strokeWidth={stroke} />
            ) : Object.entries(dist).map(([key, val], i) => {
                const pct  = val / total;
                const dash = pct * circ;
                const gap  = circ - dash;
                const el = (
                    <circle key={`slice-${i}`} cx={cx} cy={cy} r={r}
                        fill="none" stroke={DONUT_COLORS[key]} strokeWidth={stroke}
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                    />
                );
                offset += dash;
                return el;
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16"
                fontWeight="800" fill="#1a2332" fontFamily="Sora,sans-serif">
                {avg > 0 ? avg.toFixed(1) : "—"}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#6b7280">
                Avg Rating
            </text>
        </svg>
    );
}

// ── Skeleton loader ────────────────────────────────────────────
function Skeleton({ w = "100%", h = "1rem", radius = "6px" }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
        }} />
    );
}

// ── Main Component ─────────────────────────────────────────────
export default function DashboardHome() {
    const [stats,       setStats]       = useState(DEFAULT_STATS);
    const [visits,      setVisits]      = useState([]);
    const [submissions, setSubmissions] = useState(DEFAULT_SUBMISSIONS);
    const [topSpots,    setTopSpots]    = useState([]);
    const [feedback,    setFeedback]    = useState(DEFAULT_FEEDBACK);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [s, v, sub, spots, fb] = await Promise.all([
                    fetchDashboardStats(),
                    fetchDailyVisits(),
                    fetchSubmissions(),
                    fetchTopSpots(),
                    fetchFeedbackDistribution(),
                ]);
                setStats(s);
                setVisits(v);
                setSubmissions(sub);
                setTopSpots(spots);
                setFeedback(fb);
            } catch (err) {
                setError("Failed to load dashboard data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { icon: "👤", color: "teal",   num: stats.totalTouristUsers,   label: "Total Tourist Users" },
        { icon: "⊞",  color: "blue",   num: stats.totalQRScans,        label: "Total QR Scans" },
        { icon: "📍", color: "cyan",   num: stats.touristDestinations,  label: "Tourist Destinations" },
        { icon: "🏨", color: "purple", num: stats.totalEstablishments,  label: "Establishments" },
        { icon: "💬", color: "rose",   num: stats.totalFeedback,        label: "Total Feedback" },
    ];

    // Build SVG line chart from visits data
    const CHART_W = 780, CHART_H = 200;
    const maxVisits = visits.length > 0
        ? Math.max(...visits.map(v => v.total_scans), 1)
        : 1;
    const linePoints = visits.map((v, i) => [
        Math.round((i / Math.max(visits.length - 1, 1)) * CHART_W),
        Math.round(CHART_H - (v.total_scans / maxVisits) * CHART_H),
    ]);
    const pointsStr = linePoints.map(([x, y]) => `${x},${y}`).join(" ");

    // Bar chart max
    const maxBar = topSpots.length > 0
        ? Math.max(...topSpots.map(s => s.totalScans), 1)
        : 1;

    return (
        <div>
            {/* Shimmer style */}
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "10px", padding: "0.8rem 1rem",
                    color: "#dc2626", fontSize: "0.85rem", marginBottom: "1.2rem"
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* ── Stat Cards ── */}
            <div className="stats-grid">
                {statCards.map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                        {loading
                            ? <Skeleton w="60px" h="2rem" radius="8px" />
                            : <div className="stat-num">
                                {s.num.toLocaleString()}
                              </div>
                        }
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="charts-row">
                {/* Line Chart */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">Tourist Visits Analytics</div>
                            <div className="chart-card-sub">Daily visits for this month</div>
                        </div>
                        <span className="chart-month-badge">This Month</span>
                    </div>
                    <div className="line-chart-wrap">
                        {loading ? (
                            <Skeleton w="100%" h="200px" radius="8px" />
                        ) : visits.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af",
                                padding: "4rem 0", fontSize: "0.87rem" }}>
                                No visit data yet.
                            </div>
                        ) : (
                            <svg viewBox="0 0 800 230" preserveAspectRatio="none">
                                {[0, 50, 100, 150, 200].map((y, i) => (
                                    <g key={`grid-${i}`}>
                                        <line x1="0" y1={y} x2="800" y2={y}
                                            stroke="#f1f5f9" strokeWidth="1" />
                                        <text x="0" y={y + 4} fontSize="10" fill="#9ca3af">
                                            {Math.round(maxVisits - (y / CHART_H) * maxVisits)}
                                        </text>
                                    </g>
                                ))}
                                <defs>
                                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points={`0,${CHART_H} ${pointsStr} ${CHART_W},${CHART_H}`}
                                    fill="url(#areaGrad)"
                                />
                                <polyline points={pointsStr} fill="none"
                                    stroke="#0d9488" strokeWidth="2.5"
                                    strokeLinejoin="round" strokeLinecap="round"
                                />
                                {linePoints.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
                                    <circle key={`point-${i}`} cx={x} cy={y} r="4"
                                        fill="#0d9488" stroke="#fff" strokeWidth="2" />
                                ))}
                                {visits.filter((_, i) => i % 3 === 0).map((v, i) => (
                                    <text key={`label-${i}`}
                                        x={linePoints[i * 3]?.[0] ?? 0} y={225}
                                        fontSize="8.5" fill="#9ca3af" textAnchor="middle">
                                        {v.label}
                                    </text>
                                ))}
                            </svg>
                        )}
                    </div>
                </div>

                {/* Establishment Submissions */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">Establishment Submissions</div>
                            <div className="chart-card-sub">Promotional content & registrations</div>
                        </div>
                    </div>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                            <Skeleton h="60px" radius="10px" />
                            <Skeleton h="60px" radius="10px" />
                            <Skeleton h="60px" radius="10px" />
                        </div>
                    ) : (
                        <>
                            <div className="submission-list">
                                {[
                                    { icon: "⏱️", num: submissions.pending,          label: "Pending Review",    badge: "Pending", cls: "pending",  badgeCls: "pending" },
                                    { icon: "✅",  num: submissions.approved,         label: "Approved",          badge: "Active",  cls: "approved", badgeCls: "active"  },
                                    { icon: "🔵",  num: submissions.newRegistrations, label: "New Registrations", badge: "New",     cls: "new",      badgeCls: "new-b"   },
                                ].map((s) => (
                                    <div className={`submission-item ${s.cls}`} key={s.label}>
                                        <span className="sub-icon">{s.icon}</span>
                                        <div className="sub-info">
                                            <div className="sub-num">{s.num}</div>
                                            <div className="sub-label">{s.label}</div>
                                        </div>
                                        <span className={`sub-badge ${s.badgeCls}`}>{s.badge}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="total-estab">
                                <div className="total-estab-row">
                                    <span>Total Establishments</span>
                                    <span>{submissions.total}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill"
                                        style={{ width: `${submissions.approvalRate}%` }} />
                                </div>
                                <p className="progress-label">{submissions.approvalRate}% approval rate</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── Bottom Row ── */}
            <div className="bottom-row">
                {/* Horizontal Bar Chart */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">Most Visited Tourist Spots</div>
                            <div className="chart-card-sub">Based on total QR code scans</div>
                        </div>
                    </div>
                    <div className="bar-chart-wrap">
                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {[...Array(5)].map((_, i) => <Skeleton key={i} h="18px" radius="4px" />)}
                            </div>
                        ) : topSpots.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af",
                                padding: "2rem 0", fontSize: "0.87rem" }}>
                                No scan data yet.
                            </div>
                        ) : topSpots.map((b) => (
                            <div className="bar-item" key={b.id}>
                                <span className="bar-name">{b.name}</span>
                                <div className="bar-track">
                                    <div className="bar-fill"
                                        style={{ width: `${(b.totalScans / maxBar) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                        {!loading && topSpots.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
                                {[0, Math.round(maxBar * 0.25), Math.round(maxBar * 0.5),
                                  Math.round(maxBar * 0.75), maxBar].map((v, i) => (
                                    <span key={`bar-label-${i}`} style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{v}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">Feedback & Rating Distribution</div>
                            <div className="chart-card-sub">Overall satisfaction from tourist feedback</div>
                        </div>
                    </div>
                    <div className="donut-wrap">
                        {loading ? (
                            <Skeleton w="180px" h="180px" radius="50%" />
                        ) : (
                            <DonutChart dist={feedback.distribution} avg={feedback.avgRating} />
                        )}
                        <div className="donut-legend">
                            {Object.entries(DONUT_LABELS).map(([key, label]) => (
                                <div className="legend-item" key={key}>
                                    <span className="legend-dot" style={{ background: DONUT_COLORS[key] }} />
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="donut-stats">
                            <div className="donut-stat">
                                <div className="donut-stat-num">
                                    {loading ? "—" : (feedback.avgRating > 0 ? feedback.avgRating.toFixed(1) : "0")}
                                </div>
                                <div className="donut-stat-label">Avg Rating</div>
                            </div>
                            <div className="donut-stat">
                                <div className="donut-stat-num">
                                    {loading ? "—" : feedback.totalReviews.toLocaleString()}
                                </div>
                                <div className="donut-stat-label">Total Reviews</div>
                            </div>
                            <div className="donut-stat">
                                <div className="donut-stat-num">
                                    {loading ? "—" : `${feedback.positiveRate}%`}
                                </div>
                                <div className="donut-stat-label">Positive</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}