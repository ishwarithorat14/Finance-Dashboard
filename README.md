# 🏛️ FINANCE HQ: Personal Finance Learning & Market Intelligence Dashboard

**FINANCE HQ** is a sophisticated personal financial research terminal and learning workspace designed to help users master finance, understand market microstructure, practice risk-managed trading through realistic simulation, analyze companies with deep business model breakdowns, maintain disciplined daily accountability, and track monthly progress with audit-grade persistence.

---

## 🎨 1. Design System & Visual Reference

The application adheres strictly to the terminal aesthetic specified in the design guide:

- **Primary Background**: `#243447` (deep slate navy)
- **Secondary / Accent**: `#9EADB8` (cool metallic silver)
- **Primary Text**: `#F3F5F5` (crisp high-contrast white)
- **Card Surface**: `#1B2735` / `#1E2C3D` (subtle dark surface variations)
- **Borders & Dividers**: `#2D3E52` / `#384E66` (minimalist hairline borders)
- **Positive / Profit / Done**: `#10B981` (sparing emerald green)
- **Negative / Loss / Alert**: `#EF4444` (sparing ruby red)

### Core Interaction Principle: Progressive Disclosure
FINANCE HQ emphasizes **minimalism over information overload**. Summaries and high-level progress indicators are shown initially; complete detailed breakdowns, full 10-point intelligence analyses, and technical charts are disclosed upon interaction without cluttering the main landing view.

---

## 💻 2. Technology Stack

### Frontend
- **React (v19)**: Component-driven reactive user interface.
- **Vite (v8)**: Ultra-fast frontend build tool and dev server.
- **Tailwind CSS (v4)**: Modern utility-first styling with custom theme tokens.
- **Lucide React**: Clean, consistent icon set.
- **TradingView Lightweight Charts (v5)**: Professional canvas-based financial candlestick charts with volume histograms and technical indicators (SMA 20, SMA 50, RSI).

### Backend
- **Python 3.11+**: High-performance core runtime.
- **FastAPI**: Modern, asynchronous, type-safe REST API framework with automatic Swagger docs.
- **SQLAlchemy (v2.0)**: Modular Object-Relational Mapper ready for SQLite and PostgreSQL.
- **Pydantic (v2)**: Strict schema validation and serialization.
- **yfinance & NumPy**: Market data ingestion and time-series computation.

### Database
- **SQLite (Default)**: Embedded database stored locally at `finance_hq.db`.
- **PostgreSQL Ready**: Abstracted via SQLAlchemy engine for simple enterprise migration.

---

## 📂 3. Project Structure

```text
Project3/
├── backend/
│   ├── config.py                 # Configuration and environment variables
│   ├── database.py               # SQLAlchemy engine, session maker, get_db
│   ├── models.py                 # 16 SQLAlchemy entity models
│   ├── schemas.py                # Pydantic validation schemas
│   ├── seed_data.py              # Curriculum, case studies, news & portfolio seeds
│   ├── main.py                   # FastAPI application & SPA static server
│   ├── routers/
│   │   ├── dashboard.py          # Real-time progress aggregation & metrics
│   │   ├── learning.py           # Concepts, categories, resources, quizzes, case studies
│   │   ├── practice.py           # Charts, paper orders, positions, trading journal
│   │   ├── intelligence.py       # News 10-point breakdown, bookmarks, observations
│   │   ├── reviews.py            # Monthly review generation & accountability patterns
│   │   ├── tasks.py              # Daily tasks, carry-forward, incomplete reasons
│   │   └── settings.py           # Capital reset, API keys, database maintenance
│   └── services/
│       ├── market_service.py     # Quotes, OHLCV candles, RSI/SMA/MACD, market hours
│       └── news_service.py       # Modular financial news service layer
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Centralized API fetch wrapper
│   │   ├── components/
│   │   │   ├── layout/           # Sidebar, Topbar, DailyCheckinModal
│   │   │   ├── dashboard/        # MetricCard, UpcomingTasksPanel, MarketSnapshotPanel
│   │   │   ├── charts/           # TradingViewChart (Lightweight Charts)
│   │   │   ├── learn/            # ConceptsList, ConceptDetailModal, QuizModal, CaseStudies
│   │   │   ├── practice/         # OrderForm, PositionsTable, Watchlist, TradingJournal
│   │   │   ├── intelligence/     # NewsList, NewsDetailModal (10-point analysis)
│   │   │   ├── review/           # MonthlyReviewView, GoalTracking
│   │   │   └── settings/         # SettingsView
│   │   ├── App.jsx               # Workspace orchestrator and state coordinator
│   │   ├── index.css             # Tailwind CSS theme tokens
│   │   └── main.jsx              # React DOM entry
│   ├── vite.config.js            # Vite configuration with proxy to FastAPI
│   └── package.json              # Frontend npm dependencies
├── test_api.py                   # Automated API integration verification suite
├── run_app.bat                   # 1-click Windows launcher for web application
├── requirements.txt              # Python dependencies manifest
├── .env.example                  # Environment variables template
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 4. How to Run the Application

### Option A: 1-Click Launch (Recommended on Windows)
Simply double-click or run:
```cmd
run_app.bat
```
This script launches the FastAPI backend on port `8000`, automatically serves the pre-compiled production frontend, and opens `http://127.0.0.1:8000` in your default browser.

---

### Option B: Manual Command Line Execution

#### Step 1: Install Dependencies
```bash
# Install Python backend dependencies
python -m pip install -r requirements.txt

# Install Node.js frontend dependencies
cd frontend
npm install
```

#### Step 2: Run Backend
```bash
# In project root
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at: `http://127.0.0.1:8000`.  
Interactive API Swagger docs are available at: `http://127.0.0.1:8000/docs`.

#### Step 3: Run Frontend (Dev Mode with Hot Reload)
```bash
cd frontend
npm run dev
```
The Vite development server will start at: `http://127.0.0.1:5173`.  
Requests to `/api/*` are automatically proxied to the FastAPI server at `http://127.0.0.1:8000`.

#### Step 4: Build Frontend for Production (Optional)
```bash
cd frontend
npm run build
```
Generates optimized static assets in `frontend/dist`. The FastAPI backend automatically serves these files directly at `http://127.0.0.1:8000/`.

---

## ⚙️ 5. Database Setup & Persistence

The application uses SQLAlchemy ORM with SQLite stored at `finance_hq.db`.

On the very first launch, the backend automatically:
1. Generates all database tables (`user_settings`, `finance_concepts`, `case_studies`, `paper_positions`, `trading_journal`, `market_news`, `daily_tasks`, `monthly_goals`).
2. Populates curated curriculum data, interactive quizzes, realistic case studies (Reliance, TCS, NVIDIA), sample paper trades, and daily accountability tasks.
3. Ensures all user actions (trade orders, personal research notes, quiz attempts, task completions, and observations) are permanently stored and persist across app restarts.

To reset the database back to initial pristine seed data at any time, navigate to **Settings > Re-seed Curriculum Data**.

---

## 🔑 6. Modular Market Data & API Configuration

FINANCE HQ features an offline-first modular fallback service. You do **NOT** need external API keys to explore the full terminal.

- If API keys are left blank, high-fidelity verified cached and demonstration feeds are used with clear provenance badges (`LIVE`, `CACHED`, `DEMONSTRATION`).
- If internet access is active, live quotes for NSE/BSE and US equities are resolved via `yfinance`.
- To configure external APIs (e.g., Alpha Vantage, Finnhub, NewsAPI), add them in `Settings` or in `.env`:

```env
ALPHA_VANTAGE_API_KEY=your_key_here
FINNHUB_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

---

## 🧭 7. Feature Walkthrough

### 1. Collapsible Sidebar & Dynamic Topbar
- **Sidebar**: Collapses between expanded (icon + text label) and compact (icon-only with tooltips). Preserves state across workspace transitions.
- **Topbar**: Live auto-updating date and time, dashboard-wide search, Daily Check-In button, and a **dynamic Market Status indicator** (calculates whether NSE/BSE or NYSE are in session, pre-market, or closed).

### 2. Home Dashboard (Minimalist & Progressive Disclosure)
- **Greeting & Status**: Context-aware greeting and motivational subtitle.
- **4 Compact Progress Cards**:
  - *Learning Progress*: Aggregated % of concepts completed.
  - *Trading Practice*: Win rate % and simulated P&L.
  - *Market Analysis*: Company case studies and news analyzed.
  - *Monthly Goal*: Monthly goal completion status and days remaining.
- **Upcoming Tasks Panel**: Collapsed by default. Clicking reveals pending/completed tasks, categories, due times, reason selection for incomplete items, and carry-forward actions.
- **Market Snapshot Panel**: Collapsed by default. Clicking reveals NIFTY 50, SENSEX, and BANK NIFTY with SVG sparklines and data origin badges.
- **Quick Access Cards**: Direct navigation to Learn, Practice, and Market Intelligence.

### 3. Learn Workspace
- **Finance Concepts**: Organized into domains (*Financial Markets, Technical Analysis, Fundamental Analysis, Economics, Corporate Finance, Banking*). Each concept includes:
  - Short description and study content.
  - Status selector (*Not Started*, *In Progress*, *Completed*).
  - Progress slider (0–100%).
  - Last stopping point and next action fields.
  - Personal notes.
  - Learning resources manager (external links, completion status, delete).
  - Interactive Multiple-Choice Quiz with immediate score feedback, correct answer verification, and educational explanations.
- **Case Studies**: Deep-dive corporate analysis (*Reliance Industries, TCS, NVIDIA*). Includes Business Model, Revenue Sources, Economic Moats, Financial Performance, Growth Drivers, Risks, and Personal Thesis. Searchable by company and filterable by industry sector.

### 4. Practice Workspace (Simulated Trading Environment)
- **Market Terminal**:
  - Symbol search with instant autocomplete.
  - **TradingView Lightweight Charts** candlestick chart with volume histogram, SMA 20, SMA 50, and timeframe toggles (1D, 1W, 1M, 3M, 1Y).
  - Live watchlist widget with quick symbol switching.
- **Paper Trading Simulator**:
  - Virtual starting capital (₹10,00,000 INR default).
  - Simulated BUY and SELL market/limit orders with margin and cash balance checks.
  - Open positions table with mark-to-market valuations, unrealized P&L, and 1-click **Close Position** liquidation.
- **Trading Journal**:
  - Automatic trade recording upon position close, plus manual trade logging.
  - Captures strategy, entry/exit rationale, stop-loss, target, and **lessons learned**.
  - Performance statistics: Win rate %, profit factor, realized P&L, strategy breakdown.

### 5. Market Intelligence Workspace
- Displays headlines initially following progressive disclosure.
- Clicking any headline opens the **10-Point Analysis Breakdown**:
  1. Headline
  2. Source & Publication Date
  3. Executive Summary
  4. What Happened?
  5. Who Was Affected?
  6. Companies & Sectors Involved
  7. Potential Market Implications
  8. What Should I Monitor or Investigate?
  9. Personal Observations (editable and auto-saved to DB)
  10. Bookmark Toggle
- Category and sector filters, search, and bookmark filtering.

### 6. Monthly Review Workspace
- Month-by-month review selector.
- Automated executive summary generated from stored application records.
- 4 Performance pillars: Learning Mastery, Trading Simulation, Market Research, and Goal Tracking.
- **Missed Goal Reasoning**: Allows recording why any goal was missed.
- **Daily Accountability Obstacle Patterns**: Identifies recurring bottlenecks from daily task reasons (*Lack of time, Unexpected interruption, Difficulty understanding, Lack of focus*).

### 7. Daily Accountability Check-in
- Quick-access modal from top navigation bar.
- Daily task checklist with category and target time.
- Dropdown to record why an incomplete task was missed.
- **Carry Forward** button to migrate unfinished tasks to tomorrow.

---

## 🧪 8. Automated Verification Test Suite

Run the full API test suite to verify all endpoints and database models:
```bash
python test_api.py
```
This tests:
- Dashboard calculation accuracy
- Concept loading & quiz submission
- Case studies retrieval & editing
- Real-time market data quotes & candles
- Paper trading order execution & cash accounting
- 10-point news breakdown verification
- Monthly review generation & accountability pattern aggregation

---

## 📜 9. License

Built for educational research and market intelligence. Zero brokerage connectivity; strictly simulated paper trading.
