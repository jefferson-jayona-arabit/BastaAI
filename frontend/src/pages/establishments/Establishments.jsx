import { useState, useEffect, useRef } from "react";
import {
    fetchEstablishments,
    updateEstablishmentStatus,
    deleteEstablishment,
    createEstablishment,
} from "../../services/establishmentService";
import "../../styles/Establishments.css";

// ── Skeleton loader ──────────────────────────────────────────────
function Skeleton({ w = "100%", h = "1rem", radius = "6px" }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
        }} />
    );
}

// ── Constants ────────────────────────────────────────────────────
const FILTERS      = ["All", "Approved", "Pending", "New"];
const DEFAULT_STATS = { total: 0, approved: 0, pending: 0, new: 0 };

const ESTABLISHMENT_TYPES = [
    "Hotel", "Resort", "Restaurant", "Cafe", "Bar",
    "Tourist Spot", "Souvenir Shop", "Transport",
    "Tour Operator", "Spa & Wellness", "Other",
];

const ACCREDITATION_OPTIONS = ["None", "Primary", "Secondary"];

const EMPTY_FORM = {
    name:          "",
    type:          "",
    owner_name:    "",
    address:       "",
    description:   "",
    latitude:      "",
    longitude:     "",
    accreditation: "None",
};

// ── Add Establishment Modal ──────────────────────────────────────
function AddEstablishmentModal({ onClose, onSuccess }) {
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [errors,      setErrors]      = useState({});
    const [submitting,  setSubmitting]  = useState(false);
    const [locLoading,  setLocLoading]  = useState(false);
    const [locMsg,      setLocMsg]      = useState("");
    const overlayRef = useRef(null);

    // Close on backdrop click
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    const set = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    // ── Geolocation ─────────────────────────────────────────────
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocMsg("⚠️ Geolocation is not supported by your browser.");
            return;
        }
        setLocLoading(true);
        setLocMsg("");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm((prev) => ({
                    ...prev,
                    latitude:  pos.coords.latitude.toFixed(6),
                    longitude: pos.coords.longitude.toFixed(6),
                }));
                setErrors((prev) => ({ ...prev, latitude: "", longitude: "" }));
                setLocMsg("✅ Location captured successfully.");
                setLocLoading(false);
            },
            (err) => {
                const msgs = {
                    1: "⚠️ Permission denied. Please allow location access.",
                    2: "⚠️ Position unavailable. Try again.",
                    3: "⚠️ Request timed out. Try again.",
                };
                setLocMsg(msgs[err.code] || "⚠️ Could not get location.");
                setLocLoading(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    // ── Validation ───────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.name.trim())       e.name       = "Establishment name is required.";
        if (!form.type)              e.type        = "Please select a type.";
        if (!form.owner_name.trim()) e.owner_name  = "Owner name is required.";
        if (form.latitude && isNaN(Number(form.latitude)))
            e.latitude = "Must be a valid number.";
        if (form.longitude && isNaN(Number(form.longitude)))
            e.longitude = "Must be a valid number.";
        return e;
    };

    // ── Submit ───────────────────────────────────────────────────
    const handleSubmit = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            await createEstablishment({
                name:          form.name.trim(),
                type:          form.type,
                owner_name:    form.owner_name.trim(),
                address:       form.address.trim()     || undefined,
                description:   form.description.trim() || undefined,
                latitude:      form.latitude           || undefined,
                longitude:     form.longitude          || undefined,
                accreditation: form.accreditation,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setErrors({ submit: err.message || "Failed to create establishment." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">

                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon">🏢</div>
                        <div>
                            <h2 id="modal-title" className="modal-title">Add Establishment</h2>
                            <p className="modal-subtitle">Fill in the details to register a new establishment</p>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Body */}
                <div className="modal-body">

                    {/* Submit error */}
                    {errors.submit && (
                        <div className="modal-error-banner">⚠️ {errors.submit}</div>
                    )}

                    {/* Section: Basic Info */}
                    <p className="modal-section-label">Basic Information</p>
                    <div className="modal-grid-2">

                        {/* Name */}
                        <div className={`modal-field ${errors.name ? "has-error" : ""}`}>
                            <label className="modal-label">
                                Establishment Name <span className="required">*</span>
                            </label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="e.g. Sunrise Beach Resort"
                                value={form.name}
                                onChange={set("name")}
                            />
                            {errors.name && <span className="modal-field-error">{errors.name}</span>}
                        </div>

                        {/* Type */}
                        <div className={`modal-field ${errors.type ? "has-error" : ""}`}>
                            <label className="modal-label">
                                Type <span className="required">*</span>
                            </label>
                            <select className="modal-input modal-select" value={form.type} onChange={set("type")}>
                                <option value="">Select type…</option>
                                {ESTABLISHMENT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {errors.type && <span className="modal-field-error">{errors.type}</span>}
                        </div>

                        {/* Owner */}
                        <div className={`modal-field ${errors.owner_name ? "has-error" : ""}`}>
                            <label className="modal-label">
                                Owner Name <span className="required">*</span>
                            </label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="e.g. Juan dela Cruz"
                                value={form.owner_name}
                                onChange={set("owner_name")}
                            />
                            {errors.owner_name && <span className="modal-field-error">{errors.owner_name}</span>}
                        </div>

                        {/* Accreditation */}
                        <div className="modal-field">
                            <label className="modal-label">Accreditation</label>
                            <select className="modal-input modal-select" value={form.accreditation} onChange={set("accreditation")}>
                                {ACCREDITATION_OPTIONS.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Address — full width */}
                    <div className="modal-field">
                        <label className="modal-label">Address</label>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="e.g. Brgy. San Isidro, Batangas City"
                            value={form.address}
                            onChange={set("address")}
                        />
                    </div>

                    {/* Description — full width */}
                    <div className="modal-field">
                        <label className="modal-label">Description</label>
                        <textarea
                            className="modal-input modal-textarea"
                            placeholder="Brief description of the establishment…"
                            value={form.description}
                            onChange={set("description")}
                            rows={3}
                        />
                    </div>

                    {/* Section: Location */}
                    <p className="modal-section-label">Location Coordinates</p>

                    {/* Get Location button */}
                    <button
                        type="button"
                        className={`get-location-btn ${locLoading ? "loading" : ""}`}
                        onClick={handleGetLocation}
                        disabled={locLoading}
                    >
                        {locLoading ? (
                            <>
                                <span className="loc-spinner" />
                                Detecting location…
                            </>
                        ) : (
                            <>
                                <span className="loc-icon">📍</span>
                                Get Current Location
                            </>
                        )}
                    </button>

                    {locMsg && (
                        <p className={`loc-msg ${locMsg.startsWith("✅") ? "success" : "warn"}`}>
                            {locMsg}
                        </p>
                    )}

                    <div className="modal-grid-2" style={{ marginTop: "0.75rem" }}>
                        <div className={`modal-field ${errors.latitude ? "has-error" : ""}`}>
                            <label className="modal-label">Latitude</label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="e.g. 13.756331"
                                value={form.latitude}
                                onChange={set("latitude")}
                            />
                            {errors.latitude && <span className="modal-field-error">{errors.latitude}</span>}
                        </div>
                        <div className={`modal-field ${errors.longitude ? "has-error" : ""}`}>
                            <label className="modal-label">Longitude</label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="e.g. 121.053962"
                                value={form.longitude}
                                onChange={set("longitude")}
                            />
                            {errors.longitude && <span className="modal-field-error">{errors.longitude}</span>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="modal-btn-cancel" onClick={onClose} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        className={`modal-btn-submit ${submitting ? "loading" : ""}`}
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <><span className="loc-spinner" /> Saving…</>
                        ) : (
                            "Add Establishment"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────
export default function Establishments() {
    const [establishments, setEstablishments] = useState([]);
    const [stats,          setStats]          = useState(DEFAULT_STATS);
    const [search,         setSearch]         = useState("");
    const [filter,         setFilter]         = useState("All");
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState("");
    const [showModal,      setShowModal]      = useState(false);

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchEstablishments();
            setEstablishments(data.establishments);
            setStats(data.stats);
        } catch (err) {
            setError("Failed to load establishments.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [showModal]);

    const handleStatusChange = async (id, status) => {
        try {
            await updateEstablishmentStatus(id, status);
            await load();
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await deleteEstablishment(id);
            await load();
        } catch (err) {
            alert(`Failed to delete: ${err.message}`);
        }
    };

    const filtered = establishments.filter((e) => {
        const q = search.toLowerCase();
        const matchSearch =
            e.name?.toLowerCase().includes(q) ||
            e.owner?.toLowerCase().includes(q);
        const matchFilter = filter === "All" || e.status === filter;
        return matchSearch && matchFilter;
    });

    const statCards = [
        { num: stats.total,    label: "Total Establishments",    active: true  },
        { num: stats.approved, label: "Approved Establishments", active: false },
        { num: stats.pending,  label: "Pending Establishments",  active: false },
        { num: stats.new,      label: "New Establishments",      active: false },
    ];

    return (
        <div>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Modal overlay ── */
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                    animation: fadeInOverlay 0.18s ease;
                }
                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Modal panel ── */
                .modal-panel {
                    background: #fff;
                    border-radius: 18px;
                    width: 100%;
                    max-width: 620px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
                    animation: slideUpModal 0.22s cubic-bezier(0.34,1.56,0.64,1);
                    overflow: hidden;
                }
                @keyframes slideUpModal {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)     scale(1);   }
                }

                /* ── Modal header ── */
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.4rem 1.6rem 1.2rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .modal-header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                }
                .modal-icon {
                    font-size: 1.6rem;
                    background: #f0fdf4;
                    border: 1.5px solid #bbf7d0;
                    border-radius: 12px;
                    width: 46px;
                    height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .modal-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 2px;
                }
                .modal-subtitle {
                    font-size: 0.78rem;
                    color: #94a3b8;
                    margin: 0;
                }
                .modal-close {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    width: 34px;
                    height: 34px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s, color 0.15s;
                    flex-shrink: 0;
                }
                .modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

                /* ── Modal body ── */
                .modal-body {
                    padding: 1.4rem 1.6rem;
                    overflow-y: auto;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.85rem;
                }
                .modal-section-label {
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #94a3b8;
                    margin: 0.3rem 0 0;
                }
                .modal-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                .modal-field {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .modal-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #374151;
                }
                .required { color: #ef4444; }
                .modal-input {
                    border: 1.5px solid #e2e8f0;
                    border-radius: 9px;
                    padding: 0.55rem 0.75rem;
                    font-size: 0.85rem;
                    color: #1e293b;
                    background: #fafafa;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                }
                .modal-input:focus {
                    border-color: #2a9d8f;
                    box-shadow: 0 0 0 3px rgba(42,157,143,0.12);
                    background: #fff;
                }
                .modal-select { cursor: pointer; appearance: auto; }
                .modal-textarea { resize: vertical; min-height: 80px; font-family: inherit; }
                .has-error .modal-input { border-color: #fca5a5; background: #fff5f5; }
                .modal-field-error { font-size: 0.72rem; color: #ef4444; }
                .modal-error-banner {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 9px;
                    padding: 0.65rem 0.9rem;
                    font-size: 0.82rem;
                    color: #dc2626;
                }

                /* ── Get Location button ── */
                .get-location-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f0fdf4;
                    border: 1.5px solid #86efac;
                    border-radius: 9px;
                    padding: 0.55rem 1rem;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #16a34a;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s, transform 0.1s;
                    align-self: flex-start;
                }
                .get-location-btn:hover:not(:disabled) {
                    background: #dcfce7;
                    border-color: #4ade80;
                    transform: translateY(-1px);
                }
                .get-location-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .loc-icon { font-size: 1rem; }
                .loc-spinner {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border: 2px solid #86efac;
                    border-top-color: #16a34a;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .loc-msg {
                    font-size: 0.78rem;
                    margin: 0;
                    padding: 0.45rem 0.75rem;
                    border-radius: 7px;
                }
                .loc-msg.success { background: #f0fdf4; color: #16a34a; }
                .loc-msg.warn    { background: #fffbeb; color: #b45309; }

                /* ── Modal footer ── */
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    padding: 1rem 1.6rem 1.3rem;
                    border-top: 1px solid #f1f5f9;
                }
                .modal-btn-cancel {
                    background: #f8fafc;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 9px;
                    padding: 0.6rem 1.3rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .modal-btn-cancel:hover:not(:disabled) { background: #f1f5f9; }
                .modal-btn-submit {
                    background: #2a9d8f;
                    border: none;
                    border-radius: 9px;
                    padding: 0.6rem 1.4rem;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #fff;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: background 0.15s, transform 0.1s;
                }
                .modal-btn-submit:hover:not(:disabled) { background: #21867a; transform: translateY(-1px); }
                .modal-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
                .modal-btn-submit .loc-spinner { border-color: rgba(255,255,255,0.4); border-top-color: #fff; }

                @media (max-width: 520px) {
                    .modal-grid-2 { grid-template-columns: 1fr; }
                    .modal-panel  { border-radius: 14px; }
                }
            `}</style>

            {/* Add Establishment Modal */}
            {showModal && (
                <AddEstablishmentModal
                    onClose={() => setShowModal(false)}
                    onSuccess={load}
                />
            )}

            {/* Page Header */}
            <div className="est-header">
                <div className="est-header-left">
                    <h1>Establishments</h1>
                    <p>Manage and review tourism establishment registrations</p>
                </div>
                <button className="est-add-btn" onClick={() => setShowModal(true)}>
                    + Add Establishment
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div style={{
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "10px", padding: "0.8rem 1rem",
                    color: "#dc2626", fontSize: "0.85rem", marginBottom: "1.2rem"
                }}>⚠️ {error}</div>
            )}

            {/* Stat Cards */}
            <div className="est-stats-grid">
                {statCards.map((s) => (
                    <div className={`est-stat-card ${s.active ? "active-card" : ""}`} key={s.label}>
                        {loading
                            ? <Skeleton w="50px" h="2rem" radius="8px" />
                            : <div className="est-stat-num">{s.num}</div>
                        }
                        <div className="est-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="est-toolbar">
                <div className="est-search-wrap">
                    <span className="est-search-icon">🔍</span>
                    <input
                        className="est-search-input"
                        type="text"
                        placeholder="Search by name or owner..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="est-filter-tabs">
                    {FILTERS.map((f) => (
                        <button key={f}
                            className={`est-filter-btn ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="est-table-wrap">
                <table className="est-table">
                    <thead>
                        <tr>
                            <th>Establishment</th>
                            <th>Type</th>
                            <th>Owner</th>
                            <th>Submitted</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={j} style={{ padding: "1rem" }}>
                                            <Skeleton h="14px" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{
                                    textAlign: "center", color: "#9ca3af",
                                    padding: "3rem", fontSize: "0.87rem"
                                }}>
                                    {establishments.length === 0
                                        ? "No establishments found."
                                        : "No results match your search."}
                                </td>
                            </tr>
                        ) : filtered.map((e) => (
                            <tr key={e.id}>
                                <td>
                                    <div className="est-name-cell">
                                        <div className="est-avatar">🏢</div>
                                        <span className="est-name">{e.name}</span>
                                    </div>
                                </td>
                                <td className="est-type">{e.type}</td>
                                <td className="est-owner">{e.owner}</td>
                                <td className="est-submitted">{e.submitted}</td>
                                <td>
                                    {e.rating ? (
                                        <span className="est-rating">
                                            <span className="est-star">★</span>
                                            {e.rating}
                                        </span>
                                    ) : (
                                        <span className="est-no-rating">—</span>
                                    )}
                                </td>
                                <td>
                                    <span className={`est-badge ${e.status.toLowerCase()}`}>
                                        {e.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="est-actions">
                                        <button className="est-action-btn" title="View">👁</button>
                                        {e.status === "Approved" && (
                                            <button className="est-action-btn" title="Edit">✏️</button>
                                        )}
                                        {(e.status === "Pending" || e.status === "New") && (
                                            <>
                                                <button
                                                    className="est-action-btn approve"
                                                    title="Approve"
                                                    onClick={() => handleStatusChange(e.id, "Approved")}>
                                                    ✓
                                                </button>
                                                <button
                                                    className="est-action-btn reject"
                                                    title="Reject"
                                                    onClick={() => handleDelete(e.id, e.name)}>
                                                    ✕
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}