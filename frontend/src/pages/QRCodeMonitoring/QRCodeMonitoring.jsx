import { useState, useEffect } from "react";
import {
    fetchQRStats,
    fetchTopSpots,
    fetchStatusList,
} from "../../services/qrMonitoringService";
import "../../styles/QRCodeMonitoring.css";

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ w = "100%", h = "1rem", radius = "6px" }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
        }} />
    );
}

const DEFAULT_STATS = { totalScans: 0, scansToday: 0 };
const CHART_H = 200;
const CHART_W = 760;

export default function QRCodeMonitoring() {
    const [stats,      setStats]      = useState(DEFAULT_STATS);
    const [topSpots,   setTopSpots]   = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [s, spots, list] = await Promise.all([
                    fetchQRStats(),
                    fetchTopSpots(7),
                    fetchStatusList(),
                ]);
                setStats(s);
                setTopSpots(spots);
                setStatusList(list);
            } catch (err) {
                setError("Failed to load QR monitoring data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
        // Auto-refresh every 60 seconds (real-time feel)
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, []);

    // ── Build SVG line chart from real top-spots data ────────────
    const maxVal = topSpots.length > 0
        ? Math.max(...topSpots.map(s => s.totalScans), 1)
        : 1;

    const linePoints = topSpots.map((s, i) => [
        Math.round((i / Math.max(topSpots.length - 1, 1)) * CHART_W),
        Math.round(CHART_H - (s.totalScans / maxVal) * CHART_H),
    ]);
    const pointsStr = linePoints.map(([x, y]) => `${x + 40},${y + 5}`).join(" ");

    const yLabels = [
        maxVal,
        Math.round(maxVal * 0.75),
        Math.round(maxVal * 0.5),
        Math.round(maxVal * 0.25),
        0,
    ];

    const statCards = [
        { icon: "⊞", color: "teal", num: stats.totalScans, label: "Total QR Scans" },
        { icon: "📅", color: "blue", num: stats.scansToday, label: "Scans Today"    },
    ];

    return (
        <div>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {/* Page Header */}
            <div className="qr-header">
                <h1>QR Code Monitoring</h1>
                <p>
                    Real-time QR scan tracking across all tourist spots —{" "}
                    <span>March 2026</span>
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
            <div className="qr-stats-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", maxWidth: "560px" }}>
                {statCards.map((s) => (
                    <div className="qr-stat-card" key={s.label}>
                        <div className={`qr-stat-icon ${s.color}`}>{s.icon}</div>
                        <div>
                            {loading
                                ? <Skeleton w="80px" h="1.8rem" radius="8px" />
                                : <div className="qr-stat-num">{s.num.toLocaleString()}</div>
                            }
                            <div className="qr-stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="qr-main-grid">

                {/* Line Chart */}
                <div className="qr-chart-card">
                    <div className="qr-chart-header">
                        <div className="qr-chart-title">Top Spots by Total Scans</div>
                        <div className="qr-chart-sub">Cumulative QR scan count per location</div>
                    </div>
                    <div className="qr-line-wrap">
                        {loading ? (
                            <Skeleton w="100%" h="240px" radius="8px" />
                        ) : topSpots.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af",
                                padding: "5rem 0", fontSize: "0.87rem" }}>
                                No scan data available yet.
                            </div>
                        ) : (
                            <svg viewBox="0 0 840 240" style={{ height: "240px", width: "100%" }}>
                                {/* Y-axis grid + labels */}
                                {yLabels.map((val, i) => {
                                    const y = (i / (yLabels.length - 1)) * CHART_H + 5;
                                    return (
                                        <g key={`grid-${i}`}>
                                            <line x1="40" y1={y} x2="800" y2={y}
                                                stroke="#f1f5f9" strokeWidth="1" />
                                            <text x="35" y={y + 4} fontSize="10"
                                                fill="#9ca3af" textAnchor="end">{val}</text>
                                        </g>
                                    );
                                })}

                                {/* Area fill */}
                                <defs>
                                    <linearGradient id="qrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polygon
                                    points={`40,${CHART_H + 5} ${pointsStr} ${linePoints[linePoints.length - 1]?.[0] + 40},${CHART_H + 5}`}
                                    fill="url(#qrAreaGrad)"
                                />

                                {/* Line */}
                                <polyline points={pointsStr} fill="none"
                                    stroke="#0d9488" strokeWidth="2.5"
                                    strokeLinejoin="round" strokeLinecap="round"
                                />

                                {/* Dots */}
                                {linePoints.map(([x, y], i) => (
                                    <circle key={`dot-${i}`} cx={x + 40} cy={y + 5} r="4.5"
                                        fill="#0d9488" stroke="#fff" strokeWidth="2" />
                                ))}

                                {/* X-axis labels */}
                                {topSpots.map((s, i) => {
                                    const x = linePoints[i]?.[0] + 40 ?? 0;
                                    const label = s.name.length > 18
                                        ? s.name.slice(0, 18) + "…"
                                        : s.name;
                                    return (
                                        <text key={`label-${i}`} x={x} y={226} fontSize="9"
                                            fill="#9ca3af" textAnchor="middle">
                                            {label}
                                        </text>
                                    );
                                })}
                            </svg>
                        )}
                    </div>
                </div>

                {/* QR Status List */}
                <div className="qr-status-card">
                    <div className="qr-status-header">
                        <div className="qr-status-title">QR Code Status List</div>
                    </div>
                    <div className="qr-status-list">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="qr-status-item">
                                    <Skeleton w="9px" h="9px" radius="50%" />
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                        <Skeleton w="70%" h="12px" />
                                        <Skeleton w="40%" h="10px" />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-end" }}>
                                        <Skeleton w="40px" h="14px" />
                                        <Skeleton w="55px" h="10px" />
                                    </div>
                                </div>
                            ))
                        ) : statusList.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af",
                                padding: "3rem 1rem", fontSize: "0.87rem" }}>
                                No establishments found.
                            </div>
                        ) : statusList.map((item) => (
                            <div className="qr-status-item" key={item.id}>
                                <div className={`qr-status-dot ${item.isActive ? "" : "inactive"}`} />
                                <div className="qr-status-info">
                                    <div className="qr-status-name">{item.name}</div>
                                    <div className="qr-status-time">
                                        {item.lastScanAgo
                                            ? `Last scan: ${item.lastScanAgo}`
                                            : "No scans yet"}
                                    </div>
                                </div>
                                <div className="qr-status-count">
                                    <div className="qr-status-count-num">
                                        {item.totalScans.toLocaleString()}
                                    </div>
                                    <div className="qr-status-count-label">total scans</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}