import "../../styles/qrcodeMonitoring.css";

const stats = [
  { icon: "⊞", color: "teal",   num: "5,819", label: "Total QR Scans" },
  { icon: "📅", color: "blue",   num: "1,319", label: "Scans Today" },
];

const spots = [
  { name: "Gementiza Inland Resort",        scans: 950 },
  { name: "Ina's Greenscape & Flower Farm", scans: 800 },
  { name: "Ina Farmers Learning Site",      scans: 680 },
  { name: "Maleia Cafe",                    scans: 600 },
  { name: "Fine Dust Cafe",                 scans: 540 },
  { name: "Feric Hotel",                    scans: 490 },
  { name: "Juncook Restaurant",             scans: 460 },
];

// Build descending line points from spots data
const MAX_VAL = 1000;
const CHART_W = 760;
const CHART_H = 200;
const linePoints = spots.map((s, i) => [
  Math.round((i / (spots.length - 1)) * CHART_W),
  Math.round(CHART_H - (s.scans / MAX_VAL) * CHART_H),
]);
const pointsStr = linePoints.map(([x, y]) => `${x + 40},${y + 5}`).join(" ");

const statusList = [
  { name: "Gementiza Inland Resort",        time: "3 mins ago",  scans: 842,  active: true },
  { name: "Ina's Greenscape & Flower Farm", time: "7 mins ago",  scans: 756,  active: true },
  { name: "Juncook Restaurant",             time: "11 mins ago", scans: 634,  active: true },
  { name: "Ina Farmers Learning Site",      time: "15 mins ago", scans: 598,  active: true },
  { name: "Maleia Cafe",                    time: "22 mins ago", scans: 541,  active: true },
  { name: "Fine Dust Cafe",                 time: "34 mins ago", scans: 510,  active: true },
  { name: "The Somerset Inn",               time: "1 hr ago",    scans: 487,  active: false },
  { name: "Feric Hotel",                    time: "1 hr ago",    scans: 465,  active: false },
  { name: "Batchmatesweets Cakes",          time: "2 hrs ago",   scans: 432,  active: false },
  { name: "Lola Di",                        time: "3 hrs ago",   scans: 210,  active: false },
];

const yLabels = [1000, 750, 500, 250, 0];

export default function QRCodeMonitoring() {
  return (
    <div>
      {/* Page Header */}
      <div className="qr-header">
        <h1>QR Code Monitoring</h1>
        <p>
          Real-time QR scan tracking across all tourist spots —{" "}
          <span>March 2026</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="qr-stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: "560px" }}>
        {stats.map((s) => (
          <div className="qr-stat-card" key={s.label}>
            <div className={`qr-stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="qr-stat-num">{s.num}</div>
              <div className="qr-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Line Chart + Status List */}
      <div className="qr-main-grid">

        {/* Line Chart */}
        <div className="qr-chart-card">
          <div className="qr-chart-header">
            <div className="qr-chart-title">Top Spots by Total Scans</div>
            <div className="qr-chart-sub">Cumulative QR scan count per location</div>
          </div>
          <div className="qr-line-wrap">
            <svg viewBox="0 0 840 240" style={{ height: "240px" }}>
              {/* Y-axis grid + labels */}
              {yLabels.map((val, i) => {
                const y = (i / (yLabels.length - 1)) * CHART_H + 5;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x="35" y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">{val}</text>
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
                points={`40,${CHART_H + 5} ${pointsStr} ${linePoints[linePoints.length - 1][0] + 40},${CHART_H + 5}`}
                fill="url(#qrAreaGrad)"
              />

              {/* Line */}
              <polyline
                points={pointsStr}
                fill="none" stroke="#0d9488" strokeWidth="2.5"
                strokeLinejoin="round" strokeLinecap="round"
              />

              {/* Dots */}
              {linePoints.map(([x, y], i) => (
                <circle key={i} cx={x + 40} cy={y + 5} r="4.5"
                  fill="#0d9488" stroke="#fff" strokeWidth="2" />
              ))}

              {/* X-axis labels */}
              {spots.map((s, i) => {
                const x = Math.round((i / (spots.length - 1)) * CHART_W) + 40;
                return (
                  <text key={i} x={x} y={226} fontSize="9" fill="#9ca3af" textAnchor="middle">
                    {s.name.length > 18 ? s.name.slice(0, 18) + "…" : s.name}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* QR Status List */}
        <div className="qr-status-card">
          <div className="qr-status-header">
            <div className="qr-status-title">QR Code Status List</div>
          </div>
          <div className="qr-status-list">
            {statusList.map((item, i) => (
              <div className="qr-status-item" key={i}>
                <div className={`qr-status-dot ${item.active ? "" : "inactive"}`} />
                <div className="qr-status-info">
                  <div className="qr-status-name">{item.name}</div>
                  <div className="qr-status-time">Last scan: {item.time}</div>
                </div>
                <div className="qr-status-count">
                  <div className="qr-status-count-num">{item.scans.toLocaleString()}</div>
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