import { useState, useEffect } from "react";
import {
    fetchAllUsers,
    updateUserStatus,
    deleteUser,
} from "../../services/usersManagementService";
import "../../styles/usersManagement.css";

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ w = "100%", h = "1rem", radius = "6px" }) {
    return (
        <div style={{
            width: w, height: h, borderRadius: radius,
            background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
            backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
        }} />
    );
}

// ── Icons ──────────────────────────────────────────────────────
const IconSearch = () => (
    <svg className="um-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="8.5" cy="8.5" r="5.5" /><path d="M15 15l-3-3" strokeLinecap="round" />
    </svg>
);
const IconUserPlus = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM3 17a7 7 0 0110.33-6.15M16 11v6M13 14h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconEye = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" /><circle cx="10" cy="10" r="2.5" />
    </svg>
);
const IconEdit = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14.7 4.3a1 1 0 011.4 1.4l-9.9 9.9L3 16l.4-3.2 9.9-9.9z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconTrash = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 5h14M8 5V3h4v2M6 5l1 11h6l1-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconChevronLeft = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const IconChevronRight = () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ROLE_LABELS = {
    tourist: "Tourist", admin: "Admin",
    lgu: "LGU", establishment: "Establishment",
};

const AVATAR_COLORS = [
    "#0d9488","#14b8a6","#ef4444","#0891b2",
    "#7c3aed","#db2777","#ea580c","#ca8a04",
    "#059669","#0284c7","#9333ea","#e11d48",
];

const DEFAULT_SUMMARY = { total: 0, tourist: 0, admin: 0, lgu: 0, establishment: 0 };
const PER_PAGE = 6;

export default function UsersManagement() {
    const [users,      setUsers]      = useState([]);
    const [summary,    setSummary]    = useState(DEFAULT_SUMMARY);
    const [search,     setSearch]     = useState("");
    const [tab,        setTab]        = useState("All");
    const [roleFilter, setRoleFilter] = useState(null);
    const [page,       setPage]       = useState(1);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState("");

    // Get logged-in user role to check access
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const canManage   = ["admin", "lgu"].includes(currentUser.role);

    const load = async () => {
        if (!canManage) {
            setError("Access denied. Only Admin and LGU accounts can view user management.");
            setLoading(false);
            return;
        }
        setLoading(true); setError("");
        try {
            const data = await fetchAllUsers();
            setUsers(data.users);
            setSummary(data.summary);
        } catch (err) {
            setError(err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateUserStatus(id, status);
            await load();
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        try {
            await deleteUser(id);
            await load();
        } catch (err) {
            alert(`Failed to delete: ${err.message}`);
        }
    };

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchSearch =
            u.fullname?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q);
        const matchTab =
            tab === "All"     ? true :
            tab === "Active"  ? u.status === "active" :
            tab === "Pending" ? u.status === "pending" : true;
        const matchRole = roleFilter === null ? true : u.role === roleFilter;
        return matchSearch && matchTab && matchRole;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
    const handleTab    = (t)  => { setTab(t); setPage(1); };
    const handleCard   = (rf) => { setRoleFilter(rf); setTab("All"); setPage(1); };

    const summaryCards = [
        { label: "Total Users",   roleFilter: null,            count: summary.total         },
        { label: "Tourist",       roleFilter: "tourist",       count: summary.tourist       },
        { label: "Admin",         roleFilter: "admin",         count: summary.admin         },
        { label: "LGU",           roleFilter: "lgu",           count: summary.lgu           },
        { label: "Establishment", roleFilter: "establishment", count: summary.establishment },
    ];

    // ── Access denied screen ─────────────────────────────────────
    if (!canManage) {
        return (
            <div style={{ display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                minHeight: "60vh", gap: "1rem" }}>
                <div style={{ fontSize: "3rem" }}>🔒</div>
                <h2 style={{ fontFamily: "Sora,sans-serif", color: "#1a2332" }}>Access Denied</h2>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                    Only Admin and LGU accounts can access Users Management.
                </p>
            </div>
        );
    }

    return (
        <div>
            <style>{`
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            {/* Page Header */}
            <div className="um-header">
                <div className="um-header-text">
                    <h1>Users Management</h1>
                    <p>Manage tourists, admins, LGU officers and establishment accounts</p>
                </div>
                <button className="um-add-btn">
                    <IconUserPlus /> Add User
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

            {/* Summary Cards */}
            <div className="um-summary-row">
                {summaryCards.map((c) => (
                    <div
                        key={c.label}
                        className={`um-summary-card${roleFilter === c.roleFilter ? " active-card" : ""}`}
                        onClick={() => handleCard(c.roleFilter)}
                        role="button" tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleCard(c.roleFilter)}
                    >
                        {loading
                            ? <Skeleton w="40px" h="1.8rem" radius="6px" />
                            : <div className="um-summary-num">{c.count}</div>
                        }
                        <div className="um-summary-label">{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="um-table-wrap">
                {/* Toolbar */}
                <div className="um-toolbar" style={{ padding: "1rem 1.2rem" }}>
                    <div className="um-search-wrap">
                        <IconSearch />
                        <input className="um-search" type="text"
                            placeholder="Search by name or email..."
                            value={search} onChange={handleSearch} />
                    </div>
                    <div className="um-tabs">
                        {["All", "Active", "Pending"].map(t => (
                            <button key={t}
                                className={`um-tab${tab === t ? " active" : ""}`}
                                onClick={() => handleTab(t)}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <table className="um-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Visits</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // ✅ Fix: use unique keys with prefix "skel-row-"
                            [...Array(6)].map((_, i) => (
                                <tr key={`skel-row-${i}`}>
                                    {[...Array(7)].map((_, j) => (
                                        <td key={`skel-cell-${i}-${j}`} style={{ padding: "1rem" }}>
                                            <Skeleton h="14px" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{
                                    textAlign: "center", color: "#9ca3af",
                                    padding: "2.5rem", fontSize: "0.87rem"
                                }}>
                                    {users.length === 0
                                        ? "No users found."
                                        : "No users match your search."}
                                </td>
                            </tr>
                        ) : paginated.map((u) => (
                            // ✅ Fix: use u.id (unique from DB) as key
                            <tr key={`user-${u.id}`}>
                                <td>
                                    <div className="um-user-cell">
                                        <div className="um-avatar"
                                            style={{ background: AVATAR_COLORS[u.id % AVATAR_COLORS.length] }}>
                                            {u.initials}
                                        </div>
                                        <span className="um-user-name">{u.fullname}</span>
                                    </div>
                                </td>
                                <td style={{ color: "#6b7280" }}>{u.email}</td>
                                <td>
                                    <span className={`um-role um-role-${u.role}`}>
                                        {ROLE_LABELS[u.role] ?? u.role}
                                    </span>
                                </td>
                                <td style={{ color: "#6b7280" }}>{u.joined}</td>
                                <td>
                                    {u.visits
                                        ? <strong style={{ color: "#1a2332" }}>{u.visits}</strong>
                                        : <span className="um-dash">—</span>
                                    }
                                </td>
                                <td>
                                    <span className={`um-status um-status-${u.status}`}>
                                        {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    <div className="um-actions">
                                        <button className="um-action-btn" title="View"><IconEye /></button>
                                        <button className="um-action-btn" title="Edit"><IconEdit /></button>
                                        <button className="um-action-btn delete" title="Delete"
                                            onClick={() => handleDelete(u.id, u.fullname)}>
                                            <IconTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Footer */}
                <div className="um-footer">
                    <span className="um-footer-label">
                        {loading ? "Loading..." : (
                            filtered.length === 0 ? "No results"
                                : `Showing ${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length} users`
                        )}
                    </span>
                    <div className="um-pagination">
                        <button className="um-page-btn"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}>
                            <IconChevronLeft />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={`page-${n}`}
                                className={`um-page-btn${page === n ? " active" : ""}`}
                                onClick={() => setPage(n)} disabled={loading}>
                                {n}
                            </button>
                        ))}
                        <button className="um-page-btn"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}>
                            <IconChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}