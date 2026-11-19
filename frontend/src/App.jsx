import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import DailyCheckinModal from "./components/layout/DailyCheckinModal";

// Home Dashboard Components
import MetricCard from "./components/dashboard/MetricCard";
import UpcomingTasksPanel from "./components/dashboard/UpcomingTasksPanel";
import MarketSnapshotPanel from "./components/dashboard/MarketSnapshotPanel";
import QuickAccessCard from "./components/dashboard/QuickAccessCard";

// Learn Components
import ConceptsList from "./components/learn/ConceptsList";
import ConceptDetailModal from "./components/learn/ConceptDetailModal";
import QuizModal from "./components/learn/QuizModal";
import CaseStudiesList from "./components/learn/CaseStudiesList";
import CaseStudyModal from "./components/learn/CaseStudyModal";

// Practice Components
import TradingViewChart from "./components/charts/TradingViewChart";
import OrderForm from "./components/practice/OrderForm";
import PositionsTable from "./components/practice/PositionsTable";
import Watchlist from "./components/practice/Watchlist";
import TradingJournal from "./components/practice/TradingJournal";
import JournalModal from "./components/practice/JournalModal";

// Intelligence Components
import NewsList from "./components/intelligence/NewsList";
import NewsDetailModal from "./components/intelligence/NewsDetailModal";

// Review Components
import MonthlyReviewView from "./components/review/MonthlyReviewView";

// Settings Components
import SettingsView from "./components/settings/SettingsView";

import { api } from "./api/client";
import {
  BookOpen,
  Activity,
  Compass,
  CalendarCheck,
  TrendingUp,
  Search,
  Sparkles,
  BarChart2,
  PieChart,
  ListFilter
} from "lucide-react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  // Sub-tabs
  const [learnSubTab, setLearnSubTab] = useState("concepts"); // "concepts" | "cases"
  const [practiceSubTab, setPracticeSubTab] = useState("simulator"); // "simulator" | "journal"

  // Global Dashboard & Metrics
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  // Learning State
  const [categories, setCategories] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeConceptDetail, setActiveConceptDetail] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [activeCaseStudyModal, setActiveCaseStudyModal] = useState(null);

  // Practice & Market State
  const [selectedSymbol, setSelectedSymbol] = useState("RELIANCE.NS");
  const [chartTimeframe, setChartTimeframe] = useState("1M");
  const [candlesData, setCandlesData] = useState({ candles: [], indicators: {}, quote: {} });
  const [portfolio, setPortfolio] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalStats, setJournalStats] = useState({});
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Intelligence State
  const [news, setNews] = useState([]);
  const [intelFilters, setIntelFilters] = useState({ categories: ["All"], sectors: ["All"] });
  const [selectedNewsCategory, setSelectedNewsCategory] = useState(null);
  const [selectedNewsSector, setSelectedNewsSector] = useState(null);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [activeNewsDetail, setActiveNewsDetail] = useState(null);

  // Monthly Review State
  const [currentYearMonth, setCurrentYearMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [reviewData, setReviewData] = useState(null);

  // Settings State
  const [settings, setSettings] = useState(null);

  // Initial Load
  useEffect(() => {
    loadDashboardMetrics();
    loadLearningData();
    loadPracticeData();
    loadIntelligenceData();
    loadReviewData(currentYearMonth);
    loadSettings();
  }, []);

  // When selected symbol or timeframe changes in Practice
  useEffect(() => {
    if (selectedSymbol) {
      loadChartData(selectedSymbol, chartTimeframe);
    }
  }, [selectedSymbol, chartTimeframe]);

  // Loaders
  const loadDashboardMetrics = async () => {
    try {
      const data = await api.getDashboardMetrics();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const loadLearningData = async () => {
    try {
      const [cats, concs, cases] = await Promise.all([
        api.getCategories(),
        api.getConcepts(),
        api.getCaseStudies(),
      ]);
      setCategories(cats);
      setConcepts(concs);
      setCaseStudies(cases);
    } catch (err) {
      console.error("Learning data load error:", err);
    }
  };

  const loadPracticeData = async () => {
    try {
      const [port, wl, jEntries, jStats] = await Promise.all([
        api.getPortfolio(),
        api.getWatchlist(),
        api.getJournalEntries(),
        api.getJournalStats(),
      ]);
      setPortfolio(port);
      setWatchlist(wl);
      setJournalEntries(jEntries);
      setJournalStats(jStats);
    } catch (err) {
      console.error("Practice data error:", err);
    }
  };

  const loadChartData = async (symbol, timeframe) => {
    try {
      const res = await api.getCandles(symbol, timeframe);
      setCandlesData(res);
    } catch (err) {
      console.error("Chart data error:", err);
    }
  };

  const loadIntelligenceData = async () => {
    try {
      const [newsItems, filters] = await Promise.all([
        api.getNews({
          category: selectedNewsCategory,
          sector: selectedNewsSector,
          bookmarked_only: bookmarkedOnly,
        }),
        api.getIntelligenceFilters(),
      ]);
      setNews(newsItems);
      setIntelFilters(filters);
    } catch (err) {
      console.error("Intelligence error:", err);
    }
  };

  const loadReviewData = async (ym) => {
    try {
      const rev = await api.getMonthlySummary(ym);
      setReviewData(rev);
    } catch (err) {
      console.error("Review data error:", err);
    }
  };

  const loadSettings = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
    } catch (err) {
      console.error("Settings load error:", err);
    }
  };

  // --- Handlers: Tasks & Accountability ---
  const handleToggleTaskComplete = async (taskId, isCompleted) => {
    await api.updateDailyTask(taskId, { is_completed: isCompleted });
    loadDashboardMetrics();
  };

  const handleAddTask = async (taskData) => {
    await api.createDailyTask(taskData);
    loadDashboardMetrics();
  };

  const handleUpdateTaskReason = async (taskId, reason) => {
    await api.updateDailyTask(taskId, { incomplete_reason: reason });
    loadDashboardMetrics();
  };

  const handleCarryForwardTasks = async () => {
    await api.carryForwardTasks();
    alert("Incomplete tasks carried forward to tomorrow!");
    loadDashboardMetrics();
  };

  // --- Handlers: Learning ---
  const handleOpenConcept = async (concept) => {
    const full = await api.getConcept(concept.id);
    setActiveConceptDetail(full);
  };

  const handleUpdateConcept = async (conceptId, updateData) => {
    const updated = await api.updateConcept(conceptId, updateData);
    setActiveConceptDetail(updated);
    loadLearningData();
    loadDashboardMetrics();
  };

  const handleAddResource = async (resData) => {
    await api.addResource(resData);
    if (activeConceptDetail) {
      const full = await api.getConcept(activeConceptDetail.id);
      setActiveConceptDetail(full);
    }
    loadLearningData();
  };

  const handleUpdateResource = async (resId, updateData) => {
    await api.updateResource(resId, updateData);
    if (activeConceptDetail) {
      const full = await api.getConcept(activeConceptDetail.id);
      setActiveConceptDetail(full);
    }
    loadLearningData();
  };

  const handleDeleteResource = async (resId) => {
    await api.deleteResource(resId);
    if (activeConceptDetail) {
      const full = await api.getConcept(activeConceptDetail.id);
      setActiveConceptDetail(full);
    }
    loadLearningData();
  };

  const handleOpenQuiz = async (concept) => {
    try {
      const q = await api.getQuiz(concept.id);
      setActiveQuiz({ ...q, concept_name: concept.name });
    } catch (err) {
      alert("No quiz available for this concept yet.");
    }
  };

  const handleSubmitQuiz = async (conceptId, answers) => {
    const result = await api.submitQuiz(conceptId, answers);
    loadLearningData();
    loadDashboardMetrics();
    return result;
  };

  const handleSaveCaseStudy = async (studyData) => {
    if (activeCaseStudyModal?.id) {
      await api.updateCaseStudy(activeCaseStudyModal.id, studyData);
    } else {
      await api.createCaseStudy(studyData);
    }
    setActiveCaseStudyModal(null);
    loadLearningData();
    loadDashboardMetrics();
  };

  const handleDeleteCaseStudy = async (studyId) => {
    if (window.confirm("Delete this case study?")) {
      await api.deleteCaseStudy(studyId);
      setActiveCaseStudyModal(null);
      loadLearningData();
      loadDashboardMetrics();
    }
  };

  // --- Handlers: Practice & Orders ---
  const handleExecuteOrder = async (orderData) => {
    await api.executeOrder(orderData);
    await loadPracticeData();
    await loadDashboardMetrics();
  };

  const handleClosePosition = async (symbol, qty) => {
    await api.executeOrder({
      symbol,
      order_type: "SELL",
      order_style: "MARKET",
      quantity: qty,
    });
    await loadPracticeData();
    await loadDashboardMetrics();
  };

  const handleAddToWatchlist = async (sym) => {
    await api.addToWatchlist(sym);
    loadPracticeData();
  };

  const handleRemoveFromWatchlist = async (sym) => {
    await api.removeFromWatchlist(sym);
    loadPracticeData();
  };

  const handleSaveJournalEntry = async (entryData) => {
    await api.createJournalEntry(entryData);
    loadPracticeData();
    loadDashboardMetrics();
  };

  // --- Handlers: Intelligence ---
  const handleToggleBookmark = async (newsId) => {
    await api.toggleBookmark(newsId);
    if (activeNewsDetail?.id === newsId) {
      setActiveNewsDetail((prev) => ({ ...prev, is_bookmarked: !prev.is_bookmarked }));
    }
    loadIntelligenceData();
    loadDashboardMetrics();
  };

  const handleSaveObservations = async (newsId, obs, isBookmarked) => {
    const updated = await api.updateObservations(newsId, obs, isBookmarked);
    setActiveNewsDetail(updated);
    loadIntelligenceData();
    loadDashboardMetrics();
  };

  // --- Handlers: Goals & Settings ---
  const handleAddGoal = async (goalData) => {
    await api.createMonthlyGoal(goalData);
    loadReviewData(currentYearMonth);
    loadDashboardMetrics();
  };

  const handleUpdateGoal = async (goalId, goalUpdate) => {
    await api.updateMonthlyGoal(goalId, goalUpdate);
    loadReviewData(currentYearMonth);
    loadDashboardMetrics();
  };

  const handleUpdateSettings = async (settingsData) => {
    const s = await api.updateSettings(settingsData);
    setSettings(s);
    loadDashboardMetrics();
  };

  const handleResetCapital = async (amount) => {
    await api.resetVirtualCapital(amount, true);
    loadPracticeData();
    loadDashboardMetrics();
    loadSettings();
  };

  const handleResetDatabase = async () => {
    await api.resetDatabase();
    alert("Curriculum and sample portfolios re-seeded!");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#243447] text-[#F3F5F5] flex flex-col font-sans selection:bg-[#38bdf8]/30">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Topbar */}
      <Topbar
        marketStatus={dashboardData?.market_status}
        onSearch={(q) => {
          if (q) {
            setActiveTab("practice");
            setSelectedSymbol(q.toUpperCase());
          }
        }}
        onOpenCheckin={() => setIsCheckinOpen(true)}
        pendingTasksCount={dashboardData?.upcoming_tasks_summary?.pending_count || 0}
        onOpenSettings={() => setActiveTab("settings")}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`pt-20 pb-12 px-6 sm:px-8 transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="max-w-6xl w-full mx-auto space-y-6 flex-1">
          {/* ==================== WORKSPACE 1: HOME DASHBOARD ==================== */}
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="p-6 bg-[#1B2735] border border-[#2D3E52] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F5F5]">
                    {dashboardData?.greeting || "Welcome to Finance HQ"}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#9EADB8] mt-1">
                    {dashboardData?.motivational_subtitle ||
                      "Personal Finance Learning & Market Intelligence Dashboard"}
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-[#243447] px-3.5 py-2 rounded-xl border border-[#384E66]">
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`inline-flex rounded-full h-2 w-2 ${
                        dashboardData?.market_status?.is_open
                          ? "bg-[#10B981]"
                          : "bg-[#6C7E8D]"
                      }`}
                    />
                  </span>
                  <span className="text-xs font-semibold text-[#F3F5F5]">
                    {dashboardData?.market_status?.message || "Market Status"}
                  </span>
                </div>
              </div>

              {/* Four Compact Progress Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Learning Progress"
                  progressPct={dashboardData?.learning_progress?.progress_pct || 0}
                  weeklyActivity={dashboardData?.learning_progress?.weekly_activity}
                  actionLabel="Continue Learning"
                  onClick={() => setActiveTab("learn")}
                  iconType="learning"
                />
                <MetricCard
                  title="Trading Practice"
                  progressPct={dashboardData?.trading_practice?.progress_pct || 0}
                  metricLabel={dashboardData?.trading_practice?.metric_label}
                  weeklyActivity={dashboardData?.trading_practice?.weekly_activity}
                  actionLabel="Open Simulator"
                  onClick={() => setActiveTab("practice")}
                  iconType="trading"
                />
                <MetricCard
                  title="Market Analysis"
                  progressPct={dashboardData?.market_analysis?.progress_pct || 0}
                  weeklyActivity={dashboardData?.market_analysis?.weekly_activity}
                  actionLabel="View Intelligence"
                  onClick={() => setActiveTab("intelligence")}
                  iconType="analysis"
                />
                <MetricCard
                  title="Monthly Goal"
                  progressPct={dashboardData?.monthly_goal?.progress_pct || 0}
                  weeklyActivity={dashboardData?.monthly_goal?.weekly_activity}
                  actionLabel="Monthly Review"
                  onClick={() => setActiveTab("review")}
                  iconType="goal"
                />
              </div>

              {/* Upcoming Tasks (Collapsed by default following Progressive Disclosure) */}
              <UpcomingTasksPanel
                tasks={dashboardData?.upcoming_tasks_summary?.tasks || []}
                pendingCount={dashboardData?.upcoming_tasks_summary?.pending_count || 0}
                completedCount={dashboardData?.upcoming_tasks_summary?.completed_count || 0}
                onToggleComplete={handleToggleTaskComplete}
                onAddTask={handleAddTask}
                onUpdateReason={handleUpdateTaskReason}
                onCarryForward={handleCarryForwardTasks}
              />

              {/* Market Snapshot (Collapsed by default following Progressive Disclosure) */}
              <MarketSnapshotPanel
                snapshot={dashboardData?.market_snapshot_summary || []}
              />

              {/* Quick Access Cards */}
              <QuickAccessCard onNavigate={(tab) => setActiveTab(tab)} />
            </div>
          )}

          {/* ==================== WORKSPACE 2: LEARN WORKSPACE ==================== */}
          {activeTab === "learn" && (
            <div className="space-y-6">
              {/* Top Sub-tabs Bar */}
              <div className="flex items-center justify-between border-b border-[#2D3E52] pb-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLearnSubTab("concepts")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
                      learnSubTab === "concepts"
                        ? "bg-[#1B2735] text-[#38bdf8] border border-[#2D3E52]"
                        : "text-[#9EADB8] hover:text-[#F3F5F5]"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Finance Concepts & Curriculum</span>
                  </button>
                  <button
                    onClick={() => setLearnSubTab("cases")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
                      learnSubTab === "cases"
                        ? "bg-[#1B2735] text-[#fbbf24] border border-[#2D3E52]"
                        : "text-[#9EADB8] hover:text-[#F3F5F5]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Company Case Studies & Moats</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Concepts */}
              {learnSubTab === "concepts" && (
                <ConceptsList
                  categories={categories}
                  concepts={concepts}
                  selectedCategoryId={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  onOpenConcept={handleOpenConcept}
                  onOpenQuiz={handleOpenQuiz}
                  onCreateConcept={async (cData) => {
                    await api.createConcept(cData);
                    loadLearningData();
                  }}
                />
              )}

              {/* Sub-tab 2: Case Studies */}
              {learnSubTab === "cases" && (
                <CaseStudiesList
                  caseStudies={caseStudies}
                  onOpenCaseStudy={(cs) => setActiveCaseStudyModal(cs)}
                  onNewCaseStudy={() =>
                    setActiveCaseStudyModal({
                      company_name: "",
                      sector: "Information Technology",
                    })
                  }
                />
              )}
            </div>
          )}

          {/* ==================== WORKSPACE 3: PRACTICE WORKSPACE ==================== */}
          {activeTab === "practice" && (
            <div className="space-y-6">
              {/* Practice Sub-tabs */}
              <div className="flex items-center justify-between border-b border-[#2D3E52] pb-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPracticeSubTab("simulator")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
                      practiceSubTab === "simulator"
                        ? "bg-[#1B2735] text-[#10B981] border border-[#2D3E52]"
                        : "text-[#9EADB8] hover:text-[#F3F5F5]"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Market Workspace & Paper Simulator</span>
                  </button>
                  <button
                    onClick={() => setPracticeSubTab("journal")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors ${
                      practiceSubTab === "journal"
                        ? "bg-[#1B2735] text-[#38bdf8] border border-[#2D3E52]"
                        : "text-[#9EADB8] hover:text-[#F3F5F5]"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Trading Journal & Trade Logs</span>
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Market & Paper Trading */}
              {practiceSubTab === "simulator" && (
                <div className="space-y-6">
                  {/* Top Chart & Watchlist Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-3 space-y-3">
                      {/* Instrument Header Bar */}
                      <div className="p-4 bg-[#1B2735] border border-[#2D3E52] rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-bold text-[#F3F5F5] font-mono">
                                {candlesData?.symbol || selectedSymbol}
                              </h3>
                              <span className="text-[10px] text-[#9EADB8]">
                                {candlesData?.quote?.name}
                              </span>
                            </div>
                            <div className="flex items-baseline space-x-2 mt-0.5">
                              <span className="font-mono text-base font-bold text-[#F3F5F5]">
                                ₹
                                {candlesData?.quote?.price?.toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                              <span
                                className={`font-mono text-xs ${
                                  (candlesData?.quote?.change_pct || 0) >= 0
                                    ? "text-[#10B981]"
                                    : "text-[#EF4444]"
                                }`}
                              >
                                {(candlesData?.quote?.change_pct || 0) >= 0 ? "+" : ""}
                                {candlesData?.quote?.change} (
                                {(candlesData?.quote?.change_pct || 0) >= 0 ? "+" : ""}
                                {candlesData?.quote?.change_pct}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timeframe Selector & Data Origin */}
                        <div className="flex items-center space-x-2">
                          <div className="flex bg-[#243447] p-0.5 rounded-lg border border-[#2D3E52]">
                            {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                              <button
                                key={tf}
                                onClick={() => setChartTimeframe(tf)}
                                className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition-colors ${
                                  chartTimeframe === tf
                                    ? "bg-[#384E66] text-[#F3F5F5]"
                                    : "text-[#9EADB8] hover:text-[#F3F5F5]"
                                }`}
                              >
                                {tf}
                              </button>
                            ))}
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#243447] text-[#9EADB8] border border-[#2D3E52] uppercase">
                            {candlesData?.data_mode || "DATA FEED"}
                          </span>
                        </div>
                      </div>

                      {/* TradingView Lightweight Candlestick Chart */}
                      <TradingViewChart
                        candles={candlesData?.candles || []}
                        indicators={candlesData?.indicators || {}}
                        showVolume={true}
                        showSma20={true}
                        showSma50={true}
                        height={380}
                      />
                    </div>

                    {/* Right Watchlist Sidebar */}
                    <div className="lg:col-span-1 h-[480px]">
                      <Watchlist
                        watchlist={watchlist}
                        selectedSymbol={selectedSymbol}
                        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
                        onAddToWatchlist={handleAddToWatchlist}
                        onRemoveFromWatchlist={handleRemoveFromWatchlist}
                      />
                    </div>
                  </div>

                  {/* Bottom: Simulated Order Form & Positions Table */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                      <OrderForm
                        selectedInstrument={selectedSymbol}
                        currentPrice={candlesData?.quote?.price || 1000}
                        availableCash={portfolio?.current_cash_balance || 1000000}
                        currency={portfolio?.currency || "INR"}
                        onExecuteOrder={handleExecuteOrder}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <PositionsTable
                        portfolio={portfolio}
                        onClosePosition={handleClosePosition}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Trading Journal */}
              {practiceSubTab === "journal" && (
                <TradingJournal
                  entries={journalEntries}
                  stats={journalStats}
                  onOpenNewEntry={() => setIsJournalModalOpen(true)}
                />
              )}
            </div>
          )}

          {/* ==================== WORKSPACE 4: MARKET INTELLIGENCE ==================== */}
          {activeTab === "intelligence" && (
            <NewsList
              news={news}
              categories={intelFilters.categories}
              sectors={intelFilters.sectors}
              selectedCategory={selectedNewsCategory}
              onSelectCategory={(cat) => {
                setSelectedNewsCategory(cat);
                api
                  .getNews({
                    category: cat,
                    sector: selectedNewsSector,
                    bookmarked_only: bookmarkedOnly,
                  })
                  .then(setNews);
              }}
              selectedSector={selectedNewsSector}
              onSelectSector={(sec) => {
                setSelectedNewsSector(sec);
                api
                  .getNews({
                    category: selectedNewsCategory,
                    sector: sec,
                    bookmarked_only: bookmarkedOnly,
                  })
                  .then(setNews);
              }}
              bookmarkedOnly={bookmarkedOnly}
              onToggleBookmarkedOnly={() => {
                const nextVal = !bookmarkedOnly;
                setBookmarkedOnly(nextVal);
                api
                  .getNews({
                    category: selectedNewsCategory,
                    sector: selectedNewsSector,
                    bookmarked_only: nextVal,
                  })
                  .then(setNews);
              }}
              onOpenNewsDetail={(item) => setActiveNewsDetail(item)}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {/* ==================== WORKSPACE 5: MONTHLY REVIEW ==================== */}
          {activeTab === "review" && (
            <MonthlyReviewView
              reviewData={reviewData}
              currentYearMonth={currentYearMonth}
              onChangeYearMonth={(ym) => {
                setCurrentYearMonth(ym);
                loadReviewData(ym);
              }}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={async (id) => {
                await api.deleteMonthlyGoal(id);
                loadReviewData(currentYearMonth);
              }}
            />
          )}

          {/* ==================== WORKSPACE 6: SETTINGS ==================== */}
          {activeTab === "settings" && (
            <SettingsView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetCapital={handleResetCapital}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </div>
      </main>

      {/* ==================== MODALS ==================== */}
      {/* Daily Check-in Modal */}
      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        tasks={dashboardData?.upcoming_tasks_summary?.tasks || []}
        onToggleComplete={handleToggleTaskComplete}
        onAddTask={handleAddTask}
        onUpdateReason={handleUpdateTaskReason}
        onCarryForward={handleCarryForwardTasks}
      />

      {/* Concept Detail Modal */}
      <ConceptDetailModal
        isOpen={!!activeConceptDetail}
        onClose={() => setActiveConceptDetail(null)}
        concept={activeConceptDetail}
        onUpdateConcept={handleUpdateConcept}
        onAddResource={handleAddResource}
        onUpdateResource={handleUpdateResource}
        onDeleteResource={handleDeleteResource}
        onOpenQuiz={(c) => {
          setActiveConceptDetail(null);
          handleOpenQuiz(c);
        }}
      />

      {/* Concept Quiz Modal */}
      <QuizModal
        isOpen={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
        quiz={activeQuiz}
        conceptName={activeQuiz?.concept_name}
        onSubmitQuiz={handleSubmitQuiz}
      />

      {/* Case Study Modal */}
      <CaseStudyModal
        isOpen={!!activeCaseStudyModal}
        onClose={() => setActiveCaseStudyModal(null)}
        caseStudy={activeCaseStudyModal}
        onSave={handleSaveCaseStudy}
        onDelete={handleDeleteCaseStudy}
      />

      {/* News 10-Point Analysis Detail Modal */}
      <NewsDetailModal
        isOpen={!!activeNewsDetail}
        onClose={() => setActiveNewsDetail(null)}
        newsItem={activeNewsDetail}
        onToggleBookmark={handleToggleBookmark}
        onSaveObservations={handleSaveObservations}
      />

      {/* Manual Trading Journal Log Modal */}
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        onSave={handleSaveJournalEntry}
      />
    </div>
  );
}
