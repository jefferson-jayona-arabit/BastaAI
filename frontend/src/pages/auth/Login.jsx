import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "../../styles/auth.css";

const roles = [
  { value: "tourist",       label: "Tourist",       icon: "🌍" },
  { value: "admin",         label: "Admin",         icon: "🛡️" },
  { value: "establishment", label: "Establishment", icon: "🏨" },
  { value: "lgu",           label: "LGU",           icon: "🏛️" },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.role) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      const role = data.user.role;
      if (role === "admin")         navigate("/admin/dashboard");
      else if (role === "lgu")      navigate("/lgu/dashboard");
      else if (role === "establishment") navigate("/establishment/dashboard");
      else                          navigate("/tourist/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌐</span>
          <span className="auth-logo-text">BASTA AI</span>
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to access the tourism dashboard</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Role</label>
            <div className="role-selector">
              {roles.map((r) => (
                <button type="button" key={r.value}
                  className={`role-btn ${form.role === r.value ? "active" : ""}`}
                  onClick={() => setForm({ ...form, role: r.value })}>
                  <span>{r.icon}</span><span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input className="auth-input" type="email" name="email"
                placeholder="Enter your email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input className="auth-input" type={showPassword ? "text" : "password"}
                name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
              <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && <p className="auth-error">⚠️ {error}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "🔐 Sign In"}
          </button>
        </form>
        <p className="auth-switch">Don't have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>Register here</span>
        </p>
        <p className="auth-back" onClick={() => navigate("/")}>← Back to BASTA AI Homepage</p>
        <p className="auth-footer">BASTA AI Tourism Management System © 2026 LGU Barotac Nuevo, Iloilo</p>
      </div>
    </div>
  );
}