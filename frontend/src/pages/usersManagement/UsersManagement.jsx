import { useState } from "react";
import "../../styles/usersManagement.css";

// ── Data ──────────────────────────────────────────────────────────────────────

const users = [
  {
    initials: "ML", name: "Maria Lourdes Javellana",
    email: "mljavellana@email.com", role: "tourist",
    joined: "2026-01-10", visits: 9, status: "active",
  },
  {
    initials: "CE", name: "Carlo Espino",
    email: "carlo.espino@email.com", role: "tourist",
    joined: "2026-01-28", visits: 6, status: "active",
  },
  {
    initials: "AB", name: "Admin BASTA",
    email: "admin@basta.gov.ph", role: "admin",
    joined: "2025-08-01", visits: null, status: "active",
  },
  {
    initials: "LO", name: "LGU Officer Barotac",
    email: "lgu@barotacnuevo.gov.ph", role: "lgu",
    joined: "2025-08-01", visits: null, status: "active",
  },
  {
    initials: "RT", name: "Rosalind Teves",
    email: "rosalind.t@email.com", role: "tourist",
    joined: "2026-02-14", visits: 4, status: "active",
  },
  {
    initials: "DM", name: "Dante Macabenta",
    email: "dante.m@email.com", role: "tourist",
    joined: "2026-01-22", visits: 15, status: "active",
  },
  {
    initials: "AG", name: "Analyn Gabieta",
    email: "analyn.g@email.com", role: "tourist",
    joined: "2026-03-02", visits: 2, status: "active",
  },
  {
    initials: "JV", name: "Jerome Villanueva",
    email: "jerome.v@email.com", role: "tourist",
    joined: "2026-03-15", visits: 1, status: "active",
  },
  {
    initials: "LD", name: "Lola Di Eatery",
    email: "loladi@email.com", role: "establishment",
    joined: "2026-03-09", visits: null, status: "pending",
  },
  {
    initials: "ME", name: "Mama Edz' Kitchen",
    email: "mamaedz@email.com", role: "establishment",
    joined: "2026-03-27", visits: null, status: "pending",
  },
  {
    initials: "BM", name: "Barotac Market Vendors",
    email: "bnmarket@email.com", role: "establishment",
    joined: "2026-03-24", visits: null, status: "pending",
  },
  {
    initials: "GR", name: "Gementiza Resort Inc.",
    email: "gementiza@email.com", role: "establishment",
    joined: "2026-02-04", visits: null, status: "active",
  },
];

const avatarColors = [
  "#0d9488","#14b8a6","#ef4444","#0891b2",
  "#0d9488","#0d9488","#0d9488","#0d9488",
  "#f59e0b","#f59e0b","#f59e0b","#f59e0b",
];

const ROLE_LABELS = {
  tourist:       "Tourist",
  admin:         "Admin",
  lgu:           "LGU",
  establishment: "Establishment",
};

// ── Icons (inline SVG) ────────────────────────────────────────────────────────

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

// ── Summary card definitions ──────────────────────────────────────────────────
// roleFilter value: null = all, otherwise matches u.role
const summaryCards = [
  { label: "Total Users",   roleFilter: null,            count: users.length },
  { label: "Tourist",       roleFilter: "tourist",       count: users.filter(u => u.role === "tourist").length },
  { label: "Admin",         roleFilter: "admin",         count: users.filter(u => u.role === "admin").length },
  { label: "LGU",           roleFilter: "lgu",           count: users.filter(u => u.role === "lgu").length },
  { label: "Establishment", roleFilter: "establishment", count: users.filter(u => u.role === "establishment").length },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function UsersManagement() {
  const [search, setSearch]         = useState("");
  const [tab, setTab]               = useState("All");
  const [roleFilter, setRoleFilter] = useState(null); // null = Total Users (all)
  const [page, setPage]             = useState(1);
  const PER_PAGE = 6;

  // Combined filter: search + status tab + role card
  const filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div>
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

      {/* Summary Cards */}
      <div className="um-summary-row">
        {summaryCards.map((c) => (
          <div
            className={`um-summary-card${roleFilter === c.roleFilter ? " active-card" : ""}`}
            key={c.label}
            onClick={() => handleCard(c.roleFilter)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCard(c.roleFilter)}
          >
            <div className="um-summary-num">{c.count}</div>
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
            <input
              className="um-search"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="um-tabs">
            {["All", "Active", "Pending"].map(t => (
              <button
                key={t}
                className={`um-tab${tab === t ? " active" : ""}`}
                onClick={() => handleTab(t)}
              >{t}</button>
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: "2.5rem" }}>
                  No users match your search.
                </td>
              </tr>
            ) : paginated.map((u, i) => (
              <tr key={i}>
                {/* User */}
                <td>
                  <div className="um-user-cell">
                    <div
                      className="um-avatar"
                      style={{ background: avatarColors[users.indexOf(u)] }}
                    >{u.initials}</div>
                    <span className="um-user-name">{u.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td style={{ color: "#6b7280" }}>{u.email}</td>

                {/* Role */}
                <td>
                  <span className={`um-role um-role-${u.role}`}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </td>

                {/* Joined */}
                <td style={{ color: "#6b7280" }}>{u.joined}</td>

                {/* Visits */}
                <td>
                  {u.visits !== null
                    ? <strong style={{ color: "#1a2332" }}>{u.visits}</strong>
                    : <span className="um-dash">—</span>
                  }
                </td>

                {/* Status */}
                <td>
                  <span className={`um-status um-status-${u.status}`}>
                    {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="um-actions">
                    <button className="um-action-btn" title="View"><IconEye /></button>
                    <button className="um-action-btn" title="Edit"><IconEdit /></button>
                    <button className="um-action-btn delete" title="Delete"><IconTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="um-footer">
          <span className="um-footer-label">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} users
          </span>
          <div className="um-pagination">
            <button
              className="um-page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            ><IconChevronLeft /></button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`um-page-btn${page === n ? " active" : ""}`}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}

            <button
              className="um-page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            ><IconChevronRight /></button>
          </div>
        </div>
      </div>
    </div>
  );
}