# 🏛️ FINANCE HQ: Master Project Documentation & Architecture Guide

**System Name**: FINANCE HQ — Personal Finance Learning & Market Intelligence Dashboard  
**Project Directory**: `C:\Users\Admin\Desktop\Ishwari\Project3`  
**Documentation Location**: `C:\Users\Admin\Desktop\Ishwari\Personal Dashboard`  
**Visual Reference**: `Dark Finance HQ Dashboard.png`  
**Date Created**: November 19, 2026  

---

## 📖 1. Project Purpose & Philosophy

**FINANCE HQ** was designed and engineered as a high-performance personal financial research terminal and learning intelligence system. It moves away from generic admin dashboards to provide an environment focused on:
1. **Curated Finance Curriculum**: Mastering market microstructure, technical indicators, corporate valuation, economics, and corporate finance.
2. **Realistic Market Simulation**: Paper trading with real market data, zero-risk execution, mark-to-market positions, and a reflective trading journal.
3. **Structured Market Intelligence**: Processing macroeconomic news through an institutional 10-point analysis model rather than passive reading.
4. **Daily Accountability & Habit Tracking**: Setting daily goals, documenting obstacles if tasks are missed, and analyzing recurring behavioral patterns during monthly reviews.
5. **Progressive Disclosure**: Maintaining a minimalist, calm workspace where high-level metrics are clean and comprehensive data is revealed purposefully on user interaction.

---

## 🎨 2. Design System & Visual Identity

The interface replicates the visual hierarchy and color harmony of `Dark Finance HQ Dashboard.png`:

| Design Token | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Primary Background** | `#243447` | Deep slate-navy base background |
| **Secondary / Accent** | `#9EADB8` | Cool metallic silver for metadata, subtitles, and icons |
| **Primary Text** | `#F3F5F5` | Crisp white high-contrast text |
| **Card Surface** | `#1B2735` / `#1E2C3D` | Darker container panels with hairline borders |
| **Borders & Dividers** | `#2D3E52` / `#384E66` | Subtle, clean architectural dividing lines |
| **Success / Profits / Done** | `#10B981` | Emerald green (used sparingly for profits, completed items) |
| **Alert / Loss / Drawdown** | `#EF4444` | Ruby red (used sparingly for negative P&L and losses) |

### Key Interaction Principles
- **Progressive Disclosure**: The home dashboard presents compact summaries initially. The **Upcoming Tasks** and **Market Snapshot** panels are collapsed by default and expand on click.
- **Accurate Provenance**: Financial feeds explicitly tag whether a price is `LIVE`, `CACHED`, or `DEMONSTRATION`. Synthetic numbers are never misrepresented as real-time market data.

---

## 💻 3. Technology Stack

- **Frontend**:
  - **React (v19)** with functional hooks and modern modular state.
  - **Vite (v8)** for fast bundling and development.
  - **Tailwind CSS (v4)** configured with custom `@theme` tokens.
  - **TradingView Lightweight Charts (v5)**: Native canvas financial charting engine rendering candlesticks, volume histograms, and SMA 20/50 overlays.
  - **Lucide React**: Clean, minimalist iconography.
- **Backend**:
  - **Python 3.11+** running on **FastAPI** with async lifespan and CORS.
  - **Uvicorn**: High-performance ASGI production server.
  - **SQLAlchemy (v2.0)** ORM: Fully abstracted database layer, modular for SQLite or PostgreSQL.
  - **Pydantic (v2)**: Strict type validation and response serialization.
  - **yfinance**: Live market quote and historical OHLCV data resolution with offline-first fallbacks.
- **Storage**:
  - Local SQLite database located at `C:\Users\Admin\Desktop\Ishwari\Project3\finance_hq.db`.

---

## 🗄️ 4. Database Schema (16 Models)

Located in `Project3/backend/models.py`:

1. **`UserSettings`**: Starting virtual capital, available cash, currency, market preference (IN/US), and API keys.
2. **`LearningCategory`**: Core finance knowledge domains (Financial Markets, Technical Analysis, etc.).
3. **`FinanceConcept`**: Individual curriculum topics with progress %, stopping points, next actions, and personal notes.
4. **`LearningResource`**: Curated articles, documentation, books, and videos linked to concepts.
5. **`Quiz`**: Concept-specific mastery assessment.
6. **`QuizQuestion`**: Multiple-choice questions with options A, B, C, D, correct key, and educational explanations.
7. **`QuizAttempt`**: Historical score records.
8. **`CaseStudy`**: Corporate business model analysis with 10 fields (moats, revenue, risks, etc.).
9. **`WatchlistItem`**: Pinned market tickers for rapid charting.
10. **`PaperOrder`**: Executed buy and sell orders with timestamp and execution price.
11. **`PaperPosition`**: Active open positions tracking mark-to-market valuations and unrealized P&L.
12. **`TradingJournalEntry`**: Comprehensive post-trade logs capturing strategy, rationale, and psychological lessons learned.
13. **`MarketNewsItem`**: Structured financial intelligence articles featuring the 10-point analysis model.
14. **`DailyTask`**: Daily accountability checklist with completion timestamps and incomplete reason logging.
15. **`MonthlyGoal`**: Target metrics per monthly review cycle.
16. **`MonthlyReview`**: Archived automated monthly performance evaluations.

---

## 🧭 5. Workspaces & Feature Walkthrough

### 1. Home Dashboard
- **Dynamic Header**: Greeting, motivational motto, and a **real-time Market Status widget** calculating live trading hours (e.g. NSE/BSE 09:15–15:30 IST).
- **4 Progress Cards**:
  - *Learning Progress*: Curriculum completion % and weekly resources studied.
  - *Trading Practice*: Win rate %, active positions, and simulated net P&L.
  - *Market Analysis*: Company case studies and news analyzed.
  - *Monthly Goal*: Milestone completion rate and days remaining in cycle.
- **Upcoming Tasks Panel**: Collapsed by default. Expands to reveal today's tasks, complete toggles, reason selection for missed tasks, and a **Carry Forward** button.
- **Market Snapshot Panel**: Collapsed by default. Expands to display NIFTY 50, SENSEX, and BANK NIFTY with SVG sparklines and data origin badges.
- **Quick Access Cards**: One-click shortcuts to Learn, Practice, and Market Intelligence.

### 2. Learn Workspace
- **Sub-Tab A: Concepts & Curriculum**:
  - Category selector pills (Financial Markets, Technical Analysis, Fundamentals, Economics, Corporate Finance, Banking).
  - Concept cards with progress bars and status badges (*Not Started, In Progress, Completed*).
  - Detailed Study Modal: Reading material, editable stopping points, next actions, personal synthesis notes, and resource link manager.
  - Interactive Quiz Modal: Multiple-choice questions with answer validation, score calculation, and detailed rationale for each answer.
- **Sub-Tab B: Case Studies**:
  - Deep-dive corporate research (*Reliance Industries, Tata Consultancy Services, NVIDIA Corporation*).
  - Captures: Business Model, Revenue Segments, Economic Moats, Financial Margins, Growth Opportunities, Vulnerabilities, and Personal Investment Thesis.

### 3. Practice Workspace (Paper Trading & Simulation)
- **Market Terminal**:
  - Instrument search and quote header (Price, Change, 52w bounds, Volume).
  - **TradingView Lightweight Candlestick Chart** with volume histogram and SMA 20 / SMA 50 overlays. Timeframe selectors: `1D`, `1W`, `1M`, `3M`, `1Y`.
  - Pinned Watchlist with 1-click chart switching.
- **Paper Trading Engine**:
  - BUY and SELL market and limit order execution with cash balance and margin validation.
  - Real-time mark-to-market Open Positions table with instant **Close Position** liquidation.
- **Trading Journal**:
  - Performance statistics: Win rate %, Profit Factor, Net Realized P&L.
  - Detailed trade log table with entry/exit dates, strategy, stop-loss, target, and **lessons learned**.

### 4. Market Intelligence Workspace
- Progressive headline-first list with source attribution and category pills.
- Clicking any headline opens the **10-Point Analysis Breakdown**:
  1. Headline & Source Attribution
  2. Publication Date
  3. Executive Summary
  4. What Happened?
  5. Who Was Affected?
  6. Companies & Sectors Involved
  7. Potential Market Implications
  8. What Should I Monitor or Investigate?
  9. Personal Observations (editable with direct database persistence)
  10. Bookmark Toggle

### 5. Monthly Review & Daily Accountability
- **Automated Monthly Summary**: Compiles your actual learning progress, trading win rate, total P&L, and research output into an executive summary.
- **Missed Goal Reasoning**: Ability to record and review the specific reason whenever a monthly goal is incomplete.
- **Recurring Obstacle Analysis**: Aggregates the daily task incomplete reasons (*Lack of time, Unexpected interruption, Difficulty understanding, Lack of focus*) to reveal productivity bottlenecks.
- **Daily Check-In Modal**: Quick checklist modal accessible from anywhere on the top navigation bar.

### 6. Settings
- Virtual Capital Adjustment: Reset or customize starting paper trading balance.
- Market Preferences: Toggle between Indian Markets (NSE/BSE) and US Markets (NYSE/NASDAQ).
- API Keys: Optional fields for Alpha Vantage, Finnhub, and NewsAPI.
- Database Maintenance: 1-click re-seed button to restore pristine curriculum and sample data.

---

## 🚀 6. How to Run FINANCE HQ

The application code is located in `C:\Users\Admin\Desktop\Ishwari\Project3`.

### Option 1: 1-Click Launcher (Fastest)
Double-click:
```text
C:\Users\Admin\Desktop\Ishwari\Personal Dashboard\run_finance_hq.bat
```
*(Or `C:\Users\Admin\Desktop\Ishwari\Project3\run_app.bat`)*

This starts the backend, serves the frontend, and opens **`http://127.0.0.1:8000`** in your default browser.

### Option 2: Running via Terminal
```powershell
cd "C:\Users\Admin\Desktop\Ishwari\Project3"
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
Open your browser at: **`http://127.0.0.1:8000`**

---

## 🧪 7. Automated Test Verification

All modules and backend endpoints passed 100% automated verification via `test_api.py`:
- ✅ Dynamic market status calculated accurately against live IST hours.
- ✅ Full learning curriculum, quizzes, and resources loaded and submitted.
- ✅ Multi-field case studies saved and retrieved.
- ✅ Real-time quotes and 30-day OHLCV candles rendered with SMA indicators.
- ✅ Paper trading BUY order executed with cash deduction and position creation.
- ✅ Trading journal statistics (win rate, profit factor, realized P&L) verified.
- ✅ 10-point news breakdown and observations verified.
- ✅ Monthly review synthesis and daily task carry-forward verified.
