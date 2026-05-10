import { useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import TouristAnalytics from "../touristAnalytics/TouristAnalytics";
import Establishments from "../establishments/Establishments";
import QRCodeMonitoring from "../QRCodeMonitoring/QRCodeMonitoring";
import FeedbackMonitoring from "../feedbackMonitoring/FeedbackMonitoring";
import UsersManagement from "../usersManagement/UsersManagement"; // ← no 's'
import "../../styles/Dashboard.css";

const navItems = [
  { key: "dashboard",         label: "Dashboard",           icon: "⊞", path: "/admin/dashboard" },
  { key: "tourist-analytics", label: "Tourist Analytics",   icon: "📈", path: "/admin/dashboard/tourist-analytics" },
  { key: "establishments",    label: "Establishments",      icon: "🏨", path: "/admin/dashboard/establishments" },
  { key: "qr-monitoring",     label: "QR Code Monitoring",  icon: "⊡", path: "/admin/dashboard/qr-monitoring" },
  { key: "feedback",          label: "Feedback Monitoring", icon: "💬", path: "/admin/dashboard/feedback" },
  { key: "users",             label: "Users Management",    icon: "👥", path: "/admin/dashboard/users" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || '{"fullname":"Admin","role":"admin"}');
  const activeKey = navItems.find(n => location.pathname === n.path)?.key || "dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`dash-wrapper ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">🌐</span>
          {sidebarOpen && <span className="sidebar-logo-text">BASTA AI</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-item ${activeKey === item.key ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              {activeKey === item.key && sidebarOpen && <span className="sidebar-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <>
              <p className="sidebar-system">LGU Barotac Nuevo Tourism System</p>
              <p className="sidebar-version">v2.1.0 © 2026</p>
            </>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <div className="dash-main">
        {/* TOPBAR */}
        <header className="dash-topbar">
          <div className="topbar-left">
            <button className="topbar-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div>
              <h2 className="topbar-title">BASTA AI Tourism Dashboard</h2>
              <p className="topbar-sub">Dashboard Overview</p>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-date">📅 March 2026 ▾</div>
            <div className="topbar-user" onClick={handleLogout} title="Click to logout">
              <div className="topbar-avatar">
                {user.fullname?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="topbar-name">{user.fullname || "Admin"}</p>
                <p className="topbar-role">{user.role || "admin"}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="dash-content">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="tourist-analytics" element={<TouristAnalytics />} />
            <Route path="establishments" element={<Establishments />} />
            <Route path="qr-monitoring" element={<QRCodeMonitoring />} />
            <Route path="feedback" element={<FeedbackMonitoring />} />
            <Route path="users" element={<UsersManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}