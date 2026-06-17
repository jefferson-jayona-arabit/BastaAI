// pages/usersManagement/SuccessModal.jsx

import { useEffect } from "react";
import "../../styles/modalStyle/feedbackModals.css";

// ── Icons ────────────────────────────────────────────────────────
const IconX = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 16, height: 16 }}>
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
);

const IconCheckCircle = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        style={{ width: 28, height: 28 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M7 12.5l3.5 3.5 6.5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ── Component ────────────────────────────────────────────────────
// Props:
//   message  — main description line  (e.g. "Heart Arabit has been updated successfully.")
//   onClose  — called when user dismisses
//   autoClose — ms before auto-dismissing (default 3000, pass 0 to disable)

export default function SuccessModal({ message, onClose, autoClose = 3000 }) {

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Auto-close timer
    useEffect(() => {
        if (!autoClose) return;
        const t = setTimeout(onClose, autoClose);
        return () => clearTimeout(t);
    }, [autoClose, onClose]);

    return (
        <div
            className="um-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="fm-modal fm-modal-success" role="dialog" aria-modal="true"
                aria-labelledby="sm-title">

                {/* Close button */}
                <button className="um-modal-close fm-close-btn" onClick={onClose} aria-label="Close">
                    <IconX />
                </button>

                {/* Animated check icon */}
                <div className="fm-icon-wrap fm-icon-success">
                    <IconCheckCircle />
                    <svg className="fm-check-ring" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="26"
                            fill="none" stroke="currentColor" strokeWidth="3"
                            strokeDasharray="163" strokeDashoffset="163"
                            strokeLinecap="round" />
                    </svg>
                </div>

                {/* Content */}
                <h2 className="fm-title" id="sm-title">Success!</h2>
                <p className="fm-desc">{message}</p>

                {/* Progress bar (visual countdown) */}
                {autoClose > 0 && (
                    <div className="fm-progress-wrap">
                        <div
                            className="fm-progress-bar"
                            style={{ animationDuration: `${autoClose}ms` }}
                        />
                    </div>
                )}

                {/* Action */}
                <div className="fm-actions">
                    <button className="fm-btn-success fm-btn-full" onClick={onClose}>
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}