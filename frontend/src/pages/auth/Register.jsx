import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "../../styles/auth.css";

const roles = [
  { value: "tourist",       label: "Tourist",       icon: "🌍" },
  { value: "establishment", label: "Establishment", icon: "🏨" },
  { value: "lgu",           label: "LGU",           icon: "🏛️" },
];

export default function Register() {
  const [form, setForm] = useState({ fullname: "", email: "", password: "", confirmPassword: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); setSuccess(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword || !form.role) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      const { confirmPassword, ...submitData } = form;
      await registerUser(submitData);
      setSuccess("✅ Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <span className="auth-logo-icon">🌐</span>
          <span className="auth-logo-text">BASTA AI</span>
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join the BASTA AI Tourism Management System</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Register as</label>
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
          <div className="auth-grid-2">
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input className="auth-input" type="text" name="fullname"
                  placeholder="Enter your full name" value={form.fullname} onChange={handleChange} />
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
          </div>
          <div className="auth-grid-2">
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input className="auth-input" type={showPassword ? "text" : "password"}
                  name="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
                <button type="button" className="auth-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input className="auth-input" type={showConfirm ? "text" : "password"}
                  name="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} />
                <button type="button" className="auth-toggle-pw" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="auth-error">⚠️ {error}</p>}
          {success && <p className="auth-success">{success}</p>}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "✅ Create Account"}
          </button>
        </form>
        <p className="auth-switch">Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>Sign in here</span>
        </p>
        <p className="auth-back" onClick={() => navigate("/")}>← Back to BASTA AI Homepage</p>
        <p className="auth-footer">BASTA AI Tourism Management System © 2026 LGU Barotac Nuevo, Iloilo</p>
      </div>
    </div>
  );
}