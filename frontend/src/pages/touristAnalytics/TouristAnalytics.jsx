import { useState, useEffect } from "react";
import {
    fetchTouristStats,
    fetchDailyTrend,
    fetchTopDestinations,
} from "../../services/touristAnalyticsService";
import "../../styles/TouristAnalytics.css";

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

const DEFAULT_STATS = { totalUsers: 0, totalVisits: 0, dailyAvg: 0, peakDay: 0 };
const CHART_H = 220;

export default function TouristAnalytics() {
    const [stats,        setStats]        = useState(DEFAULT_STATS);
    const [trend,        setTrend]        = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [s, t, d] = await Promise.all([
                    fetchTouristStats(),
                    fetchDailyTrend(),
                    fetchTopDestinations(5),
                ]);
                setStats(s);
                setTrend(t);
                setDestinations(d);
            } catch (err) {
                setError("Failed to load tourist analytics data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { icon: "👤", color: "teal", num: stats.totalUsers,  label: "Total Users" },
        { icon: "📊", color: "blue", num: stats.totalVisits, label: "Total Visits (This Month)" },
        { icon: "📈", color: "cyan", num: stats.dailyAvg,    label: "Daily Average" },
        { icon: "🎯", color: "rose", num: stats.peakDay,     label: "Peak Day" },
    ];

    // Build SVG line chart from real trend data
    const CHART_W = 840;
    const maxScans = trend.length > 0
        ? Math.max(...trend.map(t => t.totalScans), 1)
        : 220;
    const linePoints = trend.map((t, i) => [
        Math.round((i / Math.max(trend.length - 1, 1)) * CHART_W),
        Math.round(CHART_H - (t.totalScans / maxScans) * (CHART_H - 10)),
    ]);
    const pointsStr = linePoints.map(([x, y]) => `${x + 35},${y + 5}`).join(" ");

    // Bar chart max
    const maxBar = destinations.length > 0
        ? Math.max(...destinations.map(d => d.totalScans), 1)
        : 1;

    return (
        <div>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {/* Page Header */}
            <div className="ta-header">
                <h1>Tourist Analytics</h1>
                <p>
                    Visitor data collected from QR code scan activity —{" "}
                    <span>This Month</span>
                </p>
            </div>

            {/* Error Banner */}
            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "10px", padding: "0.8rem 1rem",
                    color: "#dc2626", fontSize: "0.85rem", marginBottom: "1.2rem"
                }}>⚠️ {error}</div>
            )}

            {/* Stat Cards */}
            <div className="ta-stats-grid">
                {statCards.map((s) => (
                    <div className="ta-stat-card" key={s.label}>
                        <div className={`ta-stat-icon ${s.color}`}>{s.icon}</div>
                        {loading
                            ? <Skeleton w="70px" h="2rem" radius="8px" />
                            : <div className="ta-stat-num">{s.num.toLocaleString()}</div>
                        }
                        <div className="ta-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Line Chart */}
            <div className="ta-chart-card">
                <div className="ta-chart-header">
                    <div>
                        <div className="ta-chart-title">Tourist Visit Trend</div>
                        <div className="ta-chart-sub">Daily visit count for this month</div>
                    </div>
                    <span className="ta-month-badge">This Month</span>
                </div>
                <div className="ta-line-wrap">
                    {loading ? (
                        <Skeleton w="100%" h="250px" radius="8px" />
                    ) : trend.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#9ca3af",
                            padding: "5rem 0", fontSize: "0.87rem" }}>
                            No visit data available yet.
                        </div>
                    ) : (
                        <svg viewBox="0 0 920 260" style={{ height: "260px", width: "100%" }}>
                            {/* Y-axis grid + labels */}
                            {[0, 55, 110, 165, 220].map((y, i) => (
                                <g key={i}>
                                    <line x1="35" y1={y + 5} x2="910" y2={y + 5}
                                        stroke="#f1f5f9" strokeWidth="1" />
                                    <text x="30" y={y + 9} fontSize="10"
                                        fill="#9ca3af" textAnchor="end">
                                        {Math.round(maxScans - (y / CHART_H) * maxScans)}
                                    </text>
                                </g>
                            ))}
                            {/* Area fill */}
                            <defs>
                                <linearGradient id="taAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <polygon
                                points={`35,${CHART_H + 5} ${pointsStr} ${CHART_W + 35},${CHART_H + 5}`}
                                fill="url(#taAreaGrad)"
                            />
                            {/* Line */}
                            <polyline points={pointsStr} fill="none"
                                stroke="#0d9488" strokeWidth="2.5"
                                strokeLinejoin="round" strokeLinecap="round"
                            />
                            {/* Dots */}
                            {linePoints.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
                                <circle key={i} cx={x + 35} cy={y + 5} r="4"
                                    fill="#0d9488" stroke="#fff" strokeWidth="2" />
                            ))}
                            {/* X-axis labels */}
                            {trend.filter((_, i) => i % 2 === 0).map((t, i) => (
                                <text key={i}
                                    x={linePoints[i * 2]?.[0] + 35 ?? 0} y={254}
                                    fontSize="9" fill="#9ca3af" textAnchor="middle">
                                    {t.label}
                                </text>
                            ))}
                        </svg>
                    )}
                </div>
            </div>

            {/* Vertical Bar Chart */}
            <div className="ta-chart-card" style={{ marginTop: "1.5rem" }}>
                <div className="ta-chart-header">
                    <div>
                        <div className="ta-chart-title">Top Destinations by Visits</div>
                        <div className="ta-chart-sub">Ranked by total QR scan count — This Month</div>
                    </div>
                </div>

                {loading ? (
                    <Skeleton w="100%" h="260px" radius="8px" />
                ) : destinations.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9ca3af",
                        padding: "4rem 0", fontSize: "0.87rem" }}>
                        No destination data available yet.
                    </div>
                ) : (
                    <div className="ta-bar-container">
                        {/* Y-axis labels */}
                        {[maxBar, Math.round(maxBar * 0.75), Math.round(maxBar * 0.5),
                          Math.round(maxBar * 0.25), 0].map((val, i) => (
                            <div key={val} className="ta-y-label"
                                style={{ top: `${(i / 4) * CHART_H}px` }}>
                                {val}
                            </div>
                        ))}
                        {/* Bars */}
                        <div className="ta-bars-area" style={{ height: `${CHART_H}px` }}>
                            {destinations.map((d) => (
                                <div className="ta-bar-col" key={d.id}>
                                    <div className="ta-bar-fill"
                                        style={{ height: `${(d.totalScans / maxBar) * CHART_H}px` }}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* X-axis labels */}
                        <div className="ta-x-labels">
                            {destinations.map((d) => (
                                <div className="ta-x-label" key={d.id}>{d.name}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}