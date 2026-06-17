// pages/usersManagement/ViewUserModal.jsx

import { useEffect } from "react";
import "../../styles/modalStyle/viewEditUserModal.css";

// ── Constants ────────────────────────────────────────────────────
const ROLE_LABELS = {
    tourist:       "Tourist",
    admin:         "Admin",
    lgu:           "LGU",
    establishment: "Establishment",
};

const AVATAR_COLORS = [
    "#0d9488", "#14b8a6", "#ef4444", "#0891b2",
    "#7c3aed", "#db2777", "#ea580c", "#ca8a04",
    "#059669", "#0284c7", "#9333ea", "#e11d48",
];

// ── Icons ────────────────────────────────────────────────────────
const IconX = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 16, height: 16 }}>
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
);

const IconMail = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
        style={{ width: 15, height: 15 }}>
        <rect x="2" y="4" width="16" height="12" rx="2" />
        <path d="M2 7l8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconCalendar = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
        style={{ width: 15, height: 15 }}>
        <rect x="2" y="3" width="16" height="15" rx="2" />
        <path d="M6 1v4M14 1v4M2 8h16" strokeLinecap="round" />
    </svg>
);

const IconActivity = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
        style={{ width: 15, height: 15 }}>
        <path d="M2 10h3l2-6 3 12 2-8 2 4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconShield = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
        style={{ width: 15, height: 15 }}>
        <path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ── Component ────────────────────────────────────────────────────
export default function ViewUserModal({ user, onClose }) {
    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const avatarColor = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
    const statusClass = `vum-status-badge vum-status-${user.status}`;

    return (
        <div
            className="um-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="um-modal vum-modal" role="dialog" aria-modal="true" aria-labelledby="vum-title">

                {/* ── Header ─────────────────────────────────── */}
                <div className="um-modal-header">
                    <div>
                        <h2 className="um-modal-title" id="vum-title">User Details</h2>
                        <p className="um-modal-subtitle">Viewing account information</p>
                    </div>
                    <button className="um-modal-close" onClick={onClose} aria-label="Close modal">
                        <IconX />
                    </button>
                </div>

                {/* ── Body ───────────────────────────────────── */}
                <div className="vum-body">

                    {/* Avatar + name block */}
                    <div className="vum-profile">
                        <div className="vum-avatar" style={{ background: avatarColor }}>
                            {user.initials}
                        </div>
                        <div className="vum-profile-info">
                            <h3 className="vum-name">{user.fullname}</h3>
                            <div className="vum-badges">
                                <span className={`vum-role-badge vum-role-${user.role}`}>
                                    {ROLE_LABELS[user.role] ?? user.role}
                                </span>
                                <span className={statusClass}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Detail rows */}
                    <div className="vum-details">
                        <div className="vum-detail-row">
                            <span className="vum-detail-icon"><IconMail /></span>
                            <span className="vum-detail-label">Email</span>
                            <span className="vum-detail-value">{user.email}</span>
                        </div>
                        <div className="vum-detail-row">
                            <span className="vum-detail-icon"><IconShield /></span>
                            <span className="vum-detail-label">Role</span>
                            <span className="vum-detail-value">{ROLE_LABELS[user.role] ?? user.role}</span>
                        </div>
                        <div className="vum-detail-row">
                            <span className="vum-detail-icon"><IconCalendar /></span>
                            <span className="vum-detail-label">Joined</span>
                            <span className="vum-detail-value">{user.joined ?? "—"}</span>
                        </div>
                        <div className="vum-detail-row">
                            <span className="vum-detail-icon"><IconActivity /></span>
                            <span className="vum-detail-label">Total Visits</span>
                            <span className="vum-detail-value">
                                {user.visits ? <strong>{user.visits}</strong> : "—"}
                            </span>
                        </div>
                    </div>

                </div>

                {/* ── Footer ─────────────────────────────────── */}
                <div className="um-modal-footer">
                    <button className="um-btn-cancel" onClick={onClose}>Close</button>
                </div>

            </div>
        </div>
    );
}