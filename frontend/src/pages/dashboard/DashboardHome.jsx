import "../../styles/Dashboard.css";

const stats = [
  { icon: "👤", color: "teal",   num: "423",   label: "Total Tourist Users" },
  { icon: "⊞",  color: "blue",   num: "5,819", label: "Total QR Scans" },
  { icon: "📍", color: "cyan",   num: "12",    label: "Tourist Destinations" },
  { icon: "🏨", color: "purple", num: "12",    label: "Establishments" },
  { icon: "💬", color: "rose",   num: "874",   label: "Total Feedback" },
];

// Line chart points (normalized 0–220 height, 0–790 width)
const linePoints = [
  [0,190],[30,185],[60,175],[90,170],[120,160],[150,165],[180,155],
  [210,150],[240,145],[270,148],[300,140],[330,142],[360,138],[390,132],
  [420,130],[450,135],[480,128],[510,125],[540,120],[570,118],[600,115],
  [630,110],[660,105],[680,100],[720,95],[750,90],[780,50]
];
const pointsStr = linePoints.map(([x,y]) => `${x},${y}`).join(" ");

const submissions = [
  { icon: "⏱️", num: 1, label: "Pending Review", badge: "Pending",  cls: "pending",  badgeCls: "pending"  },
  { icon: "✅",  num: 9, label: "Approved",       badge: "Active",   cls: "approved", badgeCls: "active"   },
  { icon: "🔵",  num: 2, label: "New Registrations", badge: "New",  cls: "new",      badgeCls: "new-b"    },
];

const bars = [
  { name: "Jementiza Inland Resort",          val: 950, max: 1000 },
  { name: "Ina's Greenscape & Flower Farm",   val: 780, max: 1000 },
  { name: "Juncook Restaurant",               val: 600, max: 1000 },
  { name: "Ina Farmers Learning Site",        val: 570, max: 1000 },
  { name: "Maleia Cafe",                      val: 540, max: 1000 },
  { name: "Fine Dust Cafe",                   val: 520, max: 1000 },
  { name: "Iatchmatesweets Cakes & Pastries", val: 500, max: 1000 },
  { name: "Feric Hotel",                      val: 480, max: 1000 },
];

// Donut chart segments
const donutData = [
  { label: "Excellent (5★)", color: "#0d9488", pct: 0.45 },
  { label: "Good (4★)",      color: "#22c55e", pct: 0.24 },
  { label: "Average (3★)",   color: "#facc15", pct: 0.15 },
  { label: "Poor (2★)",      color: "#f97316", pct: 0.10 },
  { label: "Very Poor (1★)", color: "#ef4444", pct: 0.06 },
];

function DonutChart({ data }) {
  const r = 70, cx = 90, cy = 90, stroke = 28;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 180 180" className="donut-svg">
      {data.map((seg, i) => {
        const dash = seg.pct * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#1a2332" fontFamily="Sora,sans-serif">4.2</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#6b7280">Avg Rating</text>
    </svg>
  );
}

export default function DashboardHome() {
  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Tourist Visits Analytics</div>
              <div className="chart-card-sub">Daily visits for March 2026</div>
            </div>
            <span className="chart-month-badge">March 2026</span>
          </div>
          <div className="line-chart-wrap">
            <svg viewBox="0 0 800 230" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 55, 110, 165, 220].map((y, i) => (
                <g key={i}>
                  <line x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  <text x="0" y={y + 4} fontSize="10" fill="#9ca3af">{220 - y === 0 ? "0" : 220 - y}</text>
                </g>
              ))}
              {/* Area fill */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,220 ${pointsStr} 780,220`} fill="url(#areaGrad)" />
              {/* Line */}
              <polyline points={pointsStr} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {/* Dots */}
              {linePoints.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#0d9488" stroke="#fff" strokeWidth="2" />
              ))}
              {/* X-axis labels */}
              {["Mar 1","Mar 3","Mar 5","Mar 7","Mar 9","Mar 11","Mar 13","Mar 15","Mar 17","Mar 19","Mar 21","Mar 23","Mar 25","Mar 27","Mar 29","Mar 30"].map((label, i) => (
                <text key={i} x={i * 50} y={225} fontSize="8.5" fill="#9ca3af" textAnchor="middle">{label}</text>
              ))}
            </svg>
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
          <div className="submission-list">
            {submissions.map((s) => (
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
              <span>12</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
            <p className="progress-label">75% approval rate</p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Most Visited Tourist Spots</div>
              <div className="chart-card-sub">Based on total QR code scans — March</div>
            </div>
          </div>
          <div className="bar-chart-wrap">
            {bars.map((b) => (
              <div className="bar-item" key={b.name}>
                <span className="bar-name">{b.name}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(b.val / b.max) * 100}%` }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
              {[0, 250, 500, 750, 1000].map(v => (
                <span key={v} style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Feedback & Rating Distribution</div>
              <div className="chart-card-sub">Overall satisfaction from tourist feedback — March</div>
            </div>
          </div>
          <div className="donut-wrap">
            <DonutChart data={donutData} />
            <div className="donut-legend">
              {donutData.map((d) => (
                <div className="legend-item" key={d.label}>
                  <span className="legend-dot" style={{ background: d.color }} />
                  {d.label}
                </div>
              ))}
            </div>
            <div className="donut-stats">
              <div className="donut-stat"><div className="donut-stat-num">4.2</div><div className="donut-stat-label">Avg Rating</div></div>
              <div className="donut-stat"><div className="donut-stat-num">2,931</div><div className="donut-stat-label">Total Reviews</div></div>
              <div className="donut-stat"><div className="donut-stat-num">69%</div><div className="donut-stat-label">Positive</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}