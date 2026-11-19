/**
 * Finance HQ API Client
 * Centralized fetch wrapper communicating with FastAPI backend
 */

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorDetail = "An unexpected error occurred";
      try {
        const errJson = await res.json();
        errorDetail = errJson.detail || errorDetail;
      } catch (e) {
        errorDetail = res.statusText || errorDetail;
      }
      throw new Error(errorDetail);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardMetrics: () => request("/dashboard/metrics"),

  // Learning - Categories & Concepts
  getCategories: () => request("/learning/categories"),
  getConcepts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category_id) query.append("category_id", params.category_id);
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    return request(`/learning/concepts?${query.toString()}`);
  },
  getConcept: (id) => request(`/learning/concepts/${id}`),
  createConcept: (data) => request("/learning/concepts", { method: "POST", body: JSON.stringify(data) }),
  updateConcept: (id, data) => request(`/learning/concepts/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Resources
  addResource: (data) => request("/learning/resources", { method: "POST", body: JSON.stringify(data) }),
  updateResource: (id, data) => request(`/learning/resources/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteResource: (id) => request(`/learning/resources/${id}`, { method: "DELETE" }),

  // Quiz
  getQuiz: (conceptId) => request(`/learning/concepts/${conceptId}/quiz`),
  submitQuiz: (conceptId, answers) => request(`/learning/concepts/${conceptId}/quiz/submit`, { method: "POST", body: JSON.stringify({ answers }) }),

  // Case Studies
  getCaseStudies: (params = {}) => {
    const query = new URLSearchParams();
    if (params.sector) query.append("sector", params.sector);
    if (params.search) query.append("search", params.search);
    return request(`/learning/case-studies?${query.toString()}`);
  },
  getCaseStudy: (id) => request(`/learning/case-studies/${id}`),
  createCaseStudy: (data) => request("/learning/case-studies", { method: "POST", body: JSON.stringify(data) }),
  updateCaseStudy: (id, data) => request(`/learning/case-studies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCaseStudy: (id) => request(`/learning/case-studies/${id}`, { method: "DELETE" }),

  // Practice & Market Data
  searchInstruments: (q) => request(`/practice/search?q=${encodeURIComponent(q)}`),
  getQuote: (symbol) => request(`/practice/quote/${encodeURIComponent(symbol)}`),
  getCandles: (symbol, timeframe = "1M") => request(`/practice/candles/${encodeURIComponent(symbol)}?timeframe=${timeframe}`),
  
  // Watchlist
  getWatchlist: () => request("/practice/watchlist"),
  addToWatchlist: (symbol) => request(`/practice/watchlist?symbol=${encodeURIComponent(symbol)}`, { method: "POST" }),
  removeFromWatchlist: (symbol) => request(`/practice/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE" }),

  // Paper Trading
  getPortfolio: () => request("/practice/portfolio"),
  executeOrder: (orderData) => request("/practice/order", { method: "POST", body: JSON.stringify(orderData) }),
  getOrdersHistory: () => request("/practice/orders"),

  // Trading Journal
  getJournalEntries: (params = {}) => {
    const query = new URLSearchParams();
    if (params.result) query.append("result", params.result);
    if (params.strategy) query.append("strategy", params.strategy);
    return request(`/practice/journal?${query.toString()}`);
  },
  createJournalEntry: (data) => request("/practice/journal", { method: "POST", body: JSON.stringify(data) }),
  getJournalStats: () => request("/practice/journal/stats"),

  // Market Intelligence
  getNews: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append("category", params.category);
    if (params.sector) query.append("sector", params.sector);
    if (params.bookmarked_only) query.append("bookmarked_only", "true");
    if (params.search) query.append("search", params.search);
    return request(`/intelligence/news?${query.toString()}`);
  },
  getNewsDetail: (id) => request(`/intelligence/news/${id}`),
  toggleBookmark: (id) => request(`/intelligence/news/${id}/bookmark`, { method: "PUT" }),
  updateObservations: (id, observations, isBookmarked = null) =>
    request(`/intelligence/news/${id}/observations`, {
      method: "PUT",
      body: JSON.stringify({ personal_observations: observations, is_bookmarked: isBookmarked }),
    }),
  getIntelligenceFilters: () => request("/intelligence/filters"),

  // Daily Tasks
  getDailyTasks: (date) => request(date ? `/tasks?date=${date}` : "/tasks"),
  createDailyTask: (data) => request("/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateDailyTask: (id, data) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteDailyTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
  carryForwardTasks: (fromDate) => request(fromDate ? `/tasks/carry-forward?from_date=${fromDate}` : "/tasks/carry-forward", { method: "POST" }),

  // Monthly Review & Goals
  getMonthlySummary: (yearMonth) => request(`/reviews/summary/${yearMonth}`),
  getMonthlyGoals: (yearMonth) => request(`/reviews/goals/${yearMonth}`),
  createMonthlyGoal: (data) => request("/reviews/goals", { method: "POST", body: JSON.stringify(data) }),
  updateMonthlyGoal: (id, data) => request(`/reviews/goals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMonthlyGoal: (id) => request(`/reviews/goals/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => request("/settings"),
  updateSettings: (data) => request("/settings", { method: "PUT", body: JSON.stringify(data) }),
  resetVirtualCapital: (amount = 1000000.0, clearPositions = true) =>
    request(`/settings/reset-capital?reset_amount=${amount}&clear_open_positions=${clearPositions}`, { method: "POST" }),
  resetDatabase: () => request("/settings/reset-database", { method: "POST" }),
};
