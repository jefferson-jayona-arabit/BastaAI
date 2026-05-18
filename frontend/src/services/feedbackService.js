// ============================================================
// feedbackService.js
// Frontend API Service — Feedback Monitoring
// ============================================================

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Builds Authorization header from localStorage token.
 */
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Handles fetch response — throws on non-2xx.
 */
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// ── Feedback Stats ─────────────────────────────────────────────

/**
 * Fetches stat-card metrics.
 * @returns {{ total_feedback, avg_rating, positive_percent, this_month_count }}
 */
export async function fetchFeedbackStats() {
  const res = await fetch(`${API_BASE}/feedback/stats`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.data;
}

// ── Rating Distribution ────────────────────────────────────────

/**
 * Fetches star-rating breakdown for the donut chart.
 * @returns {{ five_star, four_star, three_star, two_star, one_star, total }}
 */
export async function fetchRatingDistribution() {
  const res = await fetch(`${API_BASE}/feedback/distribution`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.data;
}

// ── Feedback by Spot ───────────────────────────────────────────

/**
 * Fetches feedback count per establishment for the bar chart.
 * @returns {Array<{ id, name, count }>}
 */
export async function fetchFeedbackBySpot() {
  const res = await fetch(`${API_BASE}/feedback/by-spot`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data.data;
}

// ── All Feedback (paginated) ───────────────────────────────────

/**
 * Fetches paginated feedback list with optional rating filter.
 *
 * @param {object} params
 * @param {number|null} params.rating  - star rating filter (1-5), null = all
 * @param {number}      params.page    - page number (default 1)
 * @param {number}      params.limit   - rows per page (default 20)
 * @returns {{ data, total, page, limit }}
 */
export async function fetchAllFeedback({ rating = null, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (rating !== null) params.set("rating", rating);

  const res = await fetch(`${API_BASE}/feedback?${params.toString()}`, {
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data;
}