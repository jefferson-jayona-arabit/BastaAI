// pages/usersManagement/AddUserModal.jsx

import { useState, useEffect, useRef } from "react";
import { createUser } from "../../services/usersManagementService";
import "../../styles/modalStyle/addUserModal.css";

// ── Role options scoped by the accessor's role ───────────────────
// Both Admin and LGU can create any role
const ROLE_OPTIONS_BY_ACCESSOR = {
    admin: [
        { value: "tourist",       label: "Tourist"       },
        { value: "establishment", label: "Establishment" },
        { value: "lgu",           label: "LGU"           },
        { value: "admin",         label: "Admin"         },
    ],
    lgu: [
        { value: "tourist",       label: "Tourist"       },
        { value: "establishment", label: "Establishment" },
        { value: "lgu",           label: "LGU"           },
        { value: "admin",         label: "Admin"         },
    ],
};

// ── Icons ────────────────────────────────────────────────────────
const IconX = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 16, height: 16 }}>
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
);

const IconEye = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
        <circle cx="10" cy="10" r="2.5" />
    </svg>
);

const IconEyeOff = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13.875 13.875A7.963 7.963 0 0110 15c-5.5 0-9-5-9-5a16.36 16.36 0 014.125-4.125M7.5 4.227A8.1 8.1 0 0110 4c5.5 0 9 5 9 5a16.413 16.413 0 01-2.13 2.73M3 3l14 14"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconSpinner = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        className="um-spinner">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            strokeLinecap="round" />
    </svg>
);

// ── Validation ───────────────────────────────────────────────────
const validate = ({ fullname, email, password, role }) => {
    const errs = {};
    if (!fullname.trim())
        errs.fullname = "Full name is required.";
    if (!email.trim())
        errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        errs.email = "Enter a valid email address.";
    if (!password)
        errs.password = "Password is required.";
    else if (password.length < 8)
        errs.password = "Password must be at least 8 characters.";
    if (!role)
        errs.role = "Please select a role.";
    return errs;
};

// ── Component ────────────────────────────────────────────────────
export default function AddUserModal({ onClose, onSuccess, accessorRole }) {
    const [form, setForm]             = useState({ fullname: "", email: "", password: "", role: "" });
    const [showPass, setShowPass]     = useState(false);
    const [errors, setErrors]         = useState({});
    const [apiError, setApiError]     = useState("");
    const [submitting, setSubmitting] = useState(false);

    const firstInputRef = useRef(null);
    const roleOptions   = ROLE_OPTIONS_BY_ACCESSOR[accessorRole] ?? [];

    // Auto-focus the Full Name field on open
    useEffect(() => { firstInputRef.current?.focus(); }, []);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear field-level error as user types
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        setApiError("");
    };

    const handleSubmit = async () => {
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setApiError("");
        try {
            await createUser(form);
            onSuccess();
        } catch (err) {
            setApiError(err.message || "Failed to create user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="um-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="um-modal" role="dialog" aria-modal="true" aria-labelledby="um-modal-title">

                {/* ── Header ─────────────────────────────────── */}
                <div className="um-modal-header">
                    <div>
                        <h2 className="um-modal-title" id="um-modal-title">Add New User</h2>
                        <p className="um-modal-subtitle">Fill in the details to create a new account</p>
                    </div>
                    <button className="um-modal-close" onClick={onClose} aria-label="Close modal">
                        <IconX />
                    </button>
                </div>

                {/* ── Body ───────────────────────────────────── */}
                <div className="um-modal-body">

                    {/* API-level error */}
                    {apiError && (
                        <div className="um-api-error">⚠️ {apiError}</div>
                    )}

                    {/* Role */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="um-role">
                            Role <span>*</span>
                        </label>
                        <select
                            id="um-role"
                            name="role"
                            className={`um-select${errors.role ? " error" : ""}`}
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="">Select a role…</option>
                            {roleOptions.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        {errors.role && (
                            <span className="um-field-error">⚠ {errors.role}</span>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="um-fullname">
                            Full Name <span>*</span>
                        </label>
                        <input
                            ref={firstInputRef}
                            id="um-fullname"
                            name="fullname"
                            type="text"
                            className={`um-input${errors.fullname ? " error" : ""}`}
                            placeholder="e.g. Juan dela Cruz"
                            value={form.fullname}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        {errors.fullname && (
                            <span className="um-field-error">⚠ {errors.fullname}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="um-email">
                            Email <span>*</span>
                        </label>
                        <input
                            id="um-email"
                            name="email"
                            type="email"
                            className={`um-input${errors.email ? " error" : ""}`}
                            placeholder="e.g. juan@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="um-field-error">⚠ {errors.email}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="um-password">
                            Password <span>*</span>
                        </label>
                        <div className="um-input-wrap">
                            <input
                                id="um-password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                className={`um-input um-input-pass${errors.password ? " error" : ""}`}
                                placeholder="Min. 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="um-pass-toggle"
                                onClick={() => setShowPass(s => !s)}
                                tabIndex={-1}
                                aria-label={showPass ? "Hide password" : "Show password"}
                            >
                                {showPass ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="um-field-error">⚠ {errors.password}</span>
                        )}
                    </div>

                </div>

                {/* ── Footer ─────────────────────────────────── */}
                <div className="um-modal-footer">
                    <button
                        className="um-btn-cancel"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        className="um-btn-submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting && <IconSpinner />}
                        {submitting ? "Creating…" : "Create User"}
                    </button>
                </div>

            </div>
        </div>
    );
}