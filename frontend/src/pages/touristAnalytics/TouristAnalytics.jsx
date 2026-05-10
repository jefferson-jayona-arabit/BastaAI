import "../../styles/touristAnalytics.css";

const stats = [
  { icon: "👤", color: "teal",   num: "423",   label: "Total Users" },
  { icon: "📊", color: "blue",   num: "2,044", label: "Total Visits (Mar)" },
  { icon: "📈", color: "cyan",   num: "128",   label: "Daily Average" },
  { icon: "🎯", color: "rose",   num: "214",   label: "Peak Day" },
];

const linePoints = [
  [0,200],[30,195],[60,188],[90,185],[120,175],[150,178],[180,165],
  [210,162],[240,158],[270,160],[300,152],[330,155],[360,148],[390,142],
  [420,138],[450,142],[480,135],[510,132],[540,128],[570,125],[600,130],
  [630,118],[660,112],[690,108],[720,115],[750,105],[780,98],[810,88],[840,60],
];

const xLabels = [
  "Mar 1","Mar 3","Mar 5","Mar 7","Mar 9","Mar 11","Mar 13","Mar 15",
  "Mar 17","Mar 19","Mar 21","Mar 23","Mar 25","Mar 27","Mar 29","Mar 30"
];

const bars = [
  { name: "Jementiza Inland Resort",        val: 950 },
  { name: "Ina's Greenscape & Flower Farm", val: 780 },
  { name: "Juncook Restaurant",             val: 620 },
  { name: "Ina Farmers Learning Site",      val: 580 },
  { name: "Maleia Cafe",                    val: 520 },
];
const maxBar = 1000;
const chartH = 220;

export default function TouristAnalytics() {
  return (
    <div>
      <div className="page-header">
        <h1>Tourist Analytics</h1>
        <p>
          Visitor data collected from QR code scan activity —{" "}
          <span style={{ color: "#0d9488", fontWeight: 600 }}>March 2026</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "1.5rem" }}>
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="chart-card" style={{ marginBottom: "1.5rem" }}>
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Tourist Visit Trend</div>
            <div className="chart-card-sub">Daily visit count for March 2026</div>
          </div>
          <span className="chart-month-badge">March 2026</span>
        </div>
        <div className="line-chart-wrap">
          <svg viewBox="0 0 880 250" style={{ width: "100%", height: "250px" }}>
            {[0, 55, 110, 165, 220].map((y, i) => (
              <g key={i}>
                <line x1="35" y1={y + 5} x2="870" y2={y + 5} stroke="#f1f5f9" strokeWidth="1" />
                <text x="30" y={y + 9} fontSize="10" fill="#9ca3af" textAnchor="end">
                  {[220, 165, 110, 55, 0][i]}
                </text>
              </g>
            ))}
            <defs>
              <linearGradient id="taGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`35,225 ${linePoints.map(([x,y]) => `${x+35},${y+5}`).join(" ")} 870,225`}
              fill="url(#taGrad)"
            />
            <polyline
              points={linePoints.map(([x,y]) => `${x+35},${y+5}`).join(" ")}
              fill="none" stroke="#0d9488" strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round"
            />
            {linePoints.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
              <circle key={i} cx={x+35} cy={y+5} r="4" fill="#0d9488" stroke="#fff" strokeWidth="2" />
            ))}
            {xLabels.map((label, i) => (
              <text key={i} x={i * 54 + 35} y={244} fontSize="9" fill="#9ca3af" textAnchor="middle">{label}</text>
            ))}
          </svg>
        </div>
      </div>

      {/* Vertical Bar Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-card-title">Top Destinations by Visits</div>
            <div className="chart-card-sub">Ranked by total QR scan count — March</div>
          </div>
        </div>
        <div style={{ position: "relative", paddingLeft: "44px", paddingBottom: "40px" }}>
          {[1000, 750, 500, 250, 0].map((val, i) => (
            <div key={val} style={{
              position: "absolute", left: 0,
              top: `${(i / 4) * chartH}px`,
              fontSize: "0.72rem", color: "#9ca3af",
              transform: "translateY(-50%)"
            }}>{val}</div>
          ))}
          <div style={{
            display: "flex", alignItems: "flex-end", gap: "2.5rem",
            height: `${chartH}px`,
            borderLeft: "1px solid #e5e7eb",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 2rem",
          }}>
            {bars.map((b) => {
              const barH = (b.val / maxBar) * chartH;
              return (
                <div key={b.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: "100%",
                    height: `${barH}px`,
                    background: "#0d9488",
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.6s ease",
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "2.5rem", paddingLeft: "2rem", marginTop: "0.6rem" }}>
            {bars.map((b) => (
              <div key={b.name} style={{
                flex: 1, textAlign: "center",
                fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.4
              }}>{b.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}