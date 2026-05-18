import { useState, useEffect } from "react";
import {
    fetchEstablishments,
    updateEstablishmentStatus,
    deleteEstablishment,
} from "../../services/establishmentService";
import AddEstablishmentModal from "./AddEstablishmentModal";
import "../../styles/Establishments.css";

function Skeleton({ w = "100%", h = "1rem", radius = "6px" }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
        }} />
    );
}

const FILTERS = ["All", "Approved", "Pending", "New"];
const DEFAULT_STATS = { total: 0, approved: 0, pending: 0, new: 0 };

export default function Establishments() {
    const [establishments, setEstablishments] = useState([]);
    const [stats,          setStats]          = useState(DEFAULT_STATS);
    const [search,         setSearch]         = useState("");
    const [filter,         setFilter]         = useState("All");
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState("");
    const [showModal,      setShowModal]      = useState(false);

    const load = async () => {
        setLoading(true); setError("");
        try {
            const data = await fetchEstablishments();
            setEstablishments(data.establishments);
            setStats(data.stats);
        } catch (err) {
            setError("Failed to load establishments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

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
                <button
                    className="est-add-btn"
                    onClick={() => setShowModal(true)}
                >
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
                                        ? "No establishments yet. Click \"+ Add Establishment\" to get started."
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
                                            <span className="est-star">★</span>{e.rating}
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
                                                    title="Delete"
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