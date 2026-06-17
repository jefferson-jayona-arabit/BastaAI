// pages/usersManagement/ConfirmDeleteModal.jsx

import { useEffect, useState } from "react";
import { deleteUser } from "../../services/usersManagementService";
import "../../styles/modalStyle/feedbackModals.css";

// ── Icons ────────────────────────────────────────────────────────
const IconX = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ width: 16, height: 16 }}>
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
);

const IconTrashLg = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
        style={{ width: 28, height: 28 }}>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
);

const IconSpinner = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        className="fm-spinner">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
            strokeLinecap="round" />
    </svg>
);

// ── Component ────────────────────────────────────────────────────
export default function ConfirmDeleteModal({ user, onClose, onSuccess }) {
    const [deleting, setDeleting] = useState(false);
    const [error,    setError]    = useState("");

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleConfirm = async () => {
        setDeleting(true);
        setError("");
        try {
            await deleteUser(user.id);
            onSuccess();
        } catch (err) {
            setError(err.message || "Failed to delete user. Please try again.");
            setDeleting(false);
        }
    };

    return (
        <div
            className="um-overlay"
            onClick={(e) => { if (e.target === e.currentTarget && !deleting) onClose(); }}
        >
            <div className="fm-modal fm-modal-danger" role="alertdialog" aria-modal="true"
                aria-labelledby="cdm-title" aria-describedby="cdm-desc">

                {/* Close button */}
                <button className="um-modal-close fm-close-btn" onClick={onClose}
                    disabled={deleting} aria-label="Close">
                    <IconX />
                </button>

                {/* Icon */}
                <div className="fm-icon-wrap fm-icon-danger">
                    <IconTrashLg />
                </div>

                {/* Content */}
                <h2 className="fm-title" id="cdm-title">Delete User</h2>
                <p className="fm-desc" id="cdm-desc">
                    Are you sure you want to delete{" "}
                    <strong>"{user.fullname}"</strong>?
                    <br />
                    <span className="fm-warning">This action cannot be undone.</span>
                </p>

                {/* Error */}
                {error && (
                    <div className="fm-error-banner">⚠️ {error}</div>
                )}

                {/* Actions */}
                <div className="fm-actions">
                    <button className="um-btn-cancel fm-btn-full"
                        onClick={onClose} disabled={deleting}>
                        Cancel
                    </button>
                    <button className="fm-btn-danger fm-btn-full"
                        onClick={handleConfirm} disabled={deleting}>
                        {deleting ? <><IconSpinner /> Deleting…</> : "Yes, Delete"}
                    </button>
                </div>

            </div>
        </div>
    );
}