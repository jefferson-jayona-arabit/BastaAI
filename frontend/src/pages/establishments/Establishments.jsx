import { useState } from "react";
import "../../styles/establishments.css";

const allEstablishments = [
  { id: 1,  name: "Ina Farmers Learning Site & Agri-Farm Inc.", type: "Agriculture & Learning", owner: "Ina Agri-Farm Corp.",          submitted: "2026-01-10", rating: 4.7, status: "Approved" },
  { id: 2,  name: "The Somerset Inn",                           type: "Accommodation",          owner: "Somerset Properties",          submitted: "2026-01-15", rating: 4.5, status: "Approved" },
  { id: 3,  name: "Feric Hotel",                                type: "Accommodation",          owner: "Feric Hospitality Inc.",        submitted: "2026-01-20", rating: 4.6, status: "Approved" },
  { id: 4,  name: "Juncook Restaurant",                         type: "Dining",                 owner: "Juncook Food Corp.",            submitted: "2026-01-25", rating: 4.8, status: "Approved" },
  { id: 5,  name: "Maleia Cafe",                                type: "Cafe",                   owner: "Maleia Food & Beverage",        submitted: "2026-02-01", rating: 4.7, status: "Approved" },
  { id: 6,  name: "Gementiza Inland Resort",                    type: "Resort & Recreation",    owner: "Gementiza Resort Inc.",         submitted: "2026-02-05", rating: 4.9, status: "Approved" },
  { id: 7,  name: "Fine Dust Cafe",                             type: "Cafe",                   owner: "Fine Dust F&B Group",           submitted: "2026-02-10", rating: 4.6, status: "Approved" },
  { id: 8,  name: "Batchmatesweets Cakes and Pastries",         type: "Bakery",                 owner: "Batchmatesweets Co.",           submitted: "2026-02-15", rating: 4.8, status: "Approved" },
  { id: 9,  name: "Ina's Greenscape and Flower Farm",           type: "Nature & Gardens",       owner: "Ina's Greenscape",             submitted: "2026-02-20", rating: 4.9, status: "Approved" },
  { id: 10, name: "Lola Di",                                    type: "Dining",                 owner: "Lola Di Eatery",               submitted: "2026-03-10", rating: null, status: "Pending" },
  { id: 11, name: "Dried Fish Stall",                           type: "Local Products",         owner: "Barotac Nuevo Market Vendors", submitted: "2026-03-25", rating: null, status: "New" },
  { id: 12, name: "Mama Edz' Native Chicken Arroz Caldo",       type: "Dining",                 owner: "Mama Edz' Kitchen",            submitted: "2026-03-28", rating: null, status: "New" },
];

const FILTERS = ["All", "Approved", "Pending", "New"];

export default function Establishments() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = allEstablishments.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.owner.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const total    = allEstablishments.length;
  const approved = allEstablishments.filter(e => e.status === "Approved").length;
  const pending  = allEstablishments.filter(e => e.status === "Pending").length;
  const newCount = allEstablishments.filter(e => e.status === "New").length;

  const stats = [
    { num: total,    label: "Total Establishments",   active: true },
    { num: approved, label: "Approved Establishments", active: false },
    { num: pending,  label: "Pending Establishments",  active: false },
    { num: newCount, label: "New Establishments",      active: false },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="est-header">
        <div className="est-header-left">
          <h1>Establishments</h1>
          <p>Manage and review tourism establishment registrations</p>
        </div>
        <button className="est-add-btn">+ Add Establishment</button>
      </div>

      {/* Stat Cards */}
      <div className="est-stats-grid">
        {stats.map((s) => (
          <div className={`est-stat-card ${s.active ? "active-card" : ""}`} key={s.label}>
            <div className="est-stat-num">{s.num}</div>
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
            <button
              key={f}
              className={`est-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
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
            {filtered.map((e) => (
              <tr key={e.id}>
                {/* Name */}
                <td>
                  <div className="est-name-cell">
                    <div className="est-avatar">🏢</div>
                    <span className="est-name">{e.name}</span>
                  </div>
                </td>
                {/* Type */}
                <td className="est-type">{e.type}</td>
                {/* Owner */}
                <td className="est-owner">{e.owner}</td>
                {/* Submitted */}
                <td className="est-submitted">{e.submitted}</td>
                {/* Rating */}
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
                {/* Status */}
                <td>
                  <span className={`est-badge ${e.status.toLowerCase()}`}>
                    {e.status}
                  </span>
                </td>
                {/* Actions */}
                <td>
                  <div className="est-actions">
                    <button className="est-action-btn" title="View">👁</button>
                    {e.status === "Approved" && (
                      <button className="est-action-btn" title="Edit">✏️</button>
                    )}
                    {(e.status === "Pending" || e.status === "New") && (
                      <>
                        <button className="est-action-btn approve" title="Approve">✓</button>
                        <button className="est-action-btn reject" title="Reject">✕</button>
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