// pages/usersManagement/EditUserModal.jsx

import { useState, useEffect } from "react";
import { updateUser } from "../../services/usersManagementService";
import "../../styles/modalStyle/viewEditUserModal.css";

// ── Constants ────────────────────────────────────────────────────
const ROLE_OPTIONS = [
    { value: "tourist",       label: "Tourist"       },
    { value: "establishment", label: "Establishment" },
    { value: "lgu",           label: "LGU"           },
    { value: "admin",         label: "Admin"         },
];

const STATUS_OPTIONS = [
    { value: "active",    label: "Active"    },
    { value: "pending",   label: "Pending"   },
    { value: "suspended", label: "Suspended" },
];

// ── Icons ────────────────────────────────────────────────────────
const IconX = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 16, height: 16 }}>
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
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
const validate = ({ fullname, email, role, status }) => {
    const errs = {};
    if (!fullname.trim())  errs.fullname = "Full name is required.";
    if (!email.trim())     errs.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                           errs.email    = "Enter a valid email address.";
    if (!role)             errs.role     = "Please select a role.";
    if (!status)           errs.status   = "Please select a status.";
    return errs;
};

// ── Component ────────────────────────────────────────────────────
export default function EditUserModal({ user, onClose, onSuccess }) {
    const [form, setForm]             = useState({
        fullname: user.fullname ?? "",
        email:    user.email    ?? "",
        role:     user.role     ?? "",
        status:   user.status   ?? "",
    });
    const [errors, setErrors]         = useState({});
    const [apiError, setApiError]     = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
        setApiError("");
    };

    const handleSubmit = async () => {
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setApiError("");
        try {
            await updateUser(user.id, form);
            onSuccess();
        } catch (err) {
            setApiError(err.message || "Failed to update user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="um-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="um-modal" role="dialog" aria-modal="true" aria-labelledby="eum-title">

                {/* ── Header ─────────────────────────────────── */}
                <div className="um-modal-header">
                    <div>
                        <h2 className="um-modal-title" id="eum-title">Edit User</h2>
                        <p className="um-modal-subtitle">Update account details for {user.fullname}</p>
                    </div>
                    <button className="um-modal-close" onClick={onClose} aria-label="Close modal">
                        <IconX />
                    </button>
                </div>

                {/* ── Body ───────────────────────────────────── */}
                <div className="um-modal-body">

                    {apiError && (
                        <div className="um-api-error">⚠️ {apiError}</div>
                    )}

                    {/* Full Name */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="eum-fullname">
                            Full Name <span>*</span>
                        </label>
                        <input
                            id="eum-fullname"
                            name="fullname"
                            type="text"
                            className={`um-input${errors.fullname ? " error" : ""}`}
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
                        <label className="um-label" htmlFor="eum-email">
                            Email <span>*</span>
                        </label>
                        <input
                            id="eum-email"
                            name="email"
                            type="email"
                            className={`um-input${errors.email ? " error" : ""}`}
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="um-field-error">⚠ {errors.email}</span>
                        )}
                    </div>

                    {/* Role */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="eum-role">
                            Role <span>*</span>
                        </label>
                        <select
                            id="eum-role"
                            name="role"
                            className={`um-select${errors.role ? " error" : ""}`}
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="">Select a role…</option>
                            {ROLE_OPTIONS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        {errors.role && (
                            <span className="um-field-error">⚠ {errors.role}</span>
                        )}
                    </div>

                    {/* Status */}
                    <div className="um-field">
                        <label className="um-label" htmlFor="eum-status">
                            Status <span>*</span>
                        </label>
                        <select
                            id="eum-status"
                            name="status"
                            className={`um-select${errors.status ? " error" : ""}`}
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="">Select a status…</option>
                            {STATUS_OPTIONS.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        {errors.status && (
                            <span className="um-field-error">⚠ {errors.status}</span>
                        )}
                    </div>

                </div>

                {/* ── Footer ─────────────────────────────────── */}
                <div className="um-modal-footer">
                    <button className="um-btn-cancel" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button className="um-btn-submit" onClick={handleSubmit} disabled={submitting}>
                        {submitting && <IconSpinner />}
                        {submitting ? "Saving…" : "Save Changes"}
                    </button>
                </div>

            </div>
        </div>
    );
}