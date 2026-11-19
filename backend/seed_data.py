from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from backend.models import (
    UserSettings, LearningCategory, FinanceConcept, LearningResource,
    Quiz, QuizQuestion, CaseStudy, WatchlistItem, PaperPosition,
    TradingJournalEntry, MarketNewsItem, DailyTask, MonthlyGoal, MonthlyReview
)

def seed_database(db: Session):
    """Populates the database with initial structured finance data if empty."""
    # 1. User Settings
    if not db.query(UserSettings).first():
        settings = UserSettings(
            username="Investor",
            starting_virtual_capital=1000000.0,
            current_cash_balance=875420.0,
            currency="INR",
            market_preference="IN",
            alphavantage_api_key="",
            finnhub_api_key="",
            news_api_key=""
        )
        db.add(settings)

    # 2. Learning Categories & Concepts
    if not db.query(LearningCategory).first():
        categories_data = [
            {
                "name": "Financial Markets",
                "description": "Structure of exchanges, market participants, order matching engines, and liquidity dynamics.",
                "icon": "Building2",
                "display_order": 1,
                "concepts": [
                    {
                        "name": "Market Microstructure & Order Book Dynamics",
                        "short_description": "How limit order books (LOB), bid-ask spreads, and market makers establish clearing prices.",
                        "content": "### What is Market Microstructure?\nMarket microstructure studies the operational mechanisms through which asset prices are determined.\n\n#### Key Components:\n1. **The Order Book**: A continuous list of outstanding buy orders (bids) and sell orders (asks).\n2. **Bid-Ask Spread**: The gap between the highest price a buyer will pay and lowest price a seller accepts.\n3. **Market Depth**: Quantity available at each price level outside the best bid/offer.\n4. **Slippage**: Difference between expected price and executed price due to order size exceeding top-of-book liquidity.",
                        "learning_status": "Completed",
                        "progress_pct": 100,
                        "last_stopping_point": "Completed order book depth analysis and quiz.",
                        "next_action": "Move to Technical Analysis - Support & Resistance.",
                        "personal_notes": "Remember: High spread indicates lower liquidity or high volatility. Always check 5-depth order book before placing large market orders.",
                        "resources": [
                            {"title": "Understanding Order Books - Investopedia", "url": "https://www.investopedia.com/terms/o/order-book.asp", "resource_type": "article", "description": "Fundamentals of bid-ask queues.", "is_completed": True},
                            {"title": "NSE India: Exchange Trading Mechanism Overview", "url": "https://www.nseindia.com", "resource_type": "doc", "description": "Official documentation of NEAT trading system.", "is_completed": True}
                        ],
                        "quiz": {
                            "title": "Market Microstructure Mastery",
                            "description": "Test your knowledge on order books, bid-ask spreads, and execution types.",
                            "questions": [
                                {
                                    "question_text": "What happens when a large market buy order exceeds the volume available at the best ask price?",
                                    "option_a": "The excess volume is automatically cancelled.",
                                    "option_b": "The order fills through multiple price levels upwards, causing slippage.",
                                    "option_c": "The exchange halts trading on that symbol.",
                                    "option_d": "The broker absorbs the cost difference.",
                                    "correct_option": "B",
                                    "explanation": "Market orders demand immediate liquidity. If order volume exceeds the best ask, the engine sweeps subsequent price levels upwards."
                                },
                                {
                                    "question_text": "Which spread measure reflects the direct cost of immediate round-trip transaction?",
                                    "option_a": "Yield spread",
                                    "option_b": "Bid-Ask spread",
                                    "option_c": "Credit default spread",
                                    "option_d": "TED spread",
                                    "correct_option": "B",
                                    "explanation": "The bid-ask spread is the instantaneous liquidity cost incurred when buying at ask and selling at bid."
                                }
                            ]
                        }
                    },
                    {
                        "name": "Equity Market Mechanics & Clearing",
                        "short_description": "Trade lifecycle from order placement to T+1 settlement via clearing corporations.",
                        "content": "### Trade Lifecycle in Modern Exchanges\n1. **Order Routing**: Broker OMS/RMS checks margin and routes to exchange.\n2. **Matching Engine**: Exchange matches orders on price-time priority.\n3. **Clearing & Settlement**: In India, trades settle on **T+1** rolling basis through clearing corporations (NCL/ICCL).",
                        "learning_status": "In Progress",
                        "progress_pct": 65,
                        "last_stopping_point": "Reviewed T+1 clearing cycle vs T+2 historical norm.",
                        "next_action": "Review custodial settlement and securities lending mechanism.",
                        "personal_notes": "India was one of the first major global markets to transition fully to T+1 settlement.",
                        "resources": [
                            {"title": "SEBI Settlement Mechanism Guide", "url": "https://www.sebi.gov.in", "resource_type": "doc", "description": "Regulatory circular on T+1 settlement cycle.", "is_completed": True}
                        ]
                    }
                ]
            },
            {
                "name": "Technical Analysis",
                "description": "Price action, chart patterns, trend determination, and momentum indicators.",
                "icon": "TrendingUp",
                "display_order": 2,
                "concepts": [
                    {
                        "name": "Relative Strength Index (RSI) & Divergences",
                        "short_description": "Measuring velocity and magnitude of price movements to identify overbought/oversold and momentum exhaustion.",
                        "content": "### RSI Calculation & Advanced Divergence Signals\nDeveloped by J. Welles Wilder, RSI oscillates between 0 and 100 over a standard 14-period window.\n\n#### Key Applications:\n- **Overbought (>70)** and **Oversold (<30)** zones.\n- **Regular Bullish Divergence**: Price makes a lower low, but RSI makes a higher low (signaling reversal).\n- **Regular Bearish Divergence**: Price makes a higher high, but RSI makes a lower high (signaling exhaustion).",
                        "learning_status": "In Progress",
                        "progress_pct": 50,
                        "last_stopping_point": "Practicing hidden vs regular divergence on 1-hour charts.",
                        "next_action": "Execute 3 simulated trades based strictly on RSI bullish divergence confirmation.",
                        "personal_notes": "RSI in strong trends can stay overbought (>70) for weeks. Never short purely because RSI is >70 without price action confirmation.",
                        "resources": [
                            {"title": "Wilder's RSI: Original Formula & Practical Tactics", "url": "https://www.investopedia.com/terms/r/rsi.asp", "resource_type": "article", "description": "Mathematical derivation of smoothed RS.", "is_completed": True}
                        ],
                        "quiz": {
                            "title": "RSI & Momentum Quiz",
                            "description": "Assess your understanding of RSI boundaries and divergence setups.",
                            "questions": [
                                {
                                    "question_text": "What does a Regular Bullish Divergence indicate?",
                                    "option_a": "Price makes a higher high while RSI makes a higher high.",
                                    "option_b": "Price makes a lower low while RSI makes a higher low, indicating downside exhaustion.",
                                    "option_c": "Price is moving sideways while volume drops.",
                                    "option_d": "RSI has crossed above 80.",
                                    "correct_option": "B",
                                    "explanation": "A regular bullish divergence occurs when price registers a lower trough while the momentum oscillator forms a higher trough."
                                }
                            ]
                        }
                    },
                    {
                        "name": "Moving Average Crossover Strategies",
                        "short_description": "Golden Cross, Death Cross, Exponential vs Simple moving averages, and trend filters.",
                        "content": "### Moving Averages as Trend Filters\nMoving averages smooth noise to reveal the underlying trend direction.\n\n- **Golden Cross**: 50-day SMA crosses above the 200-day SMA (long-term bullish).\n- **Death Cross**: 50-day SMA crosses below 200-day SMA (long-term bearish).\n- **Key Risk**: Severe lag and whipsaws during sideways consolidation.",
                        "learning_status": "Not Started",
                        "progress_pct": 0,
                        "last_stopping_point": "Haven't started reading.",
                        "next_action": "Read chapter on EMA vs SMA weighting and backtest 50/200 crossover.",
                        "personal_notes": "Needs combination with ATR or ADX to filter out low-trend environments."
                    }
                ]
            },
            {
                "name": "Fundamental Analysis",
                "description": "Balance sheets, cash flow statements, competitive moats, and corporate valuation.",
                "icon": "FileSpreadsheet",
                "display_order": 3,
                "concepts": [
                    {
                        "name": "Free Cash Flow & DCF Valuation",
                        "short_description": "Discounted cash flow model, calculating Free Cash Flow to Firm (FCFF), terminal value, and discount rates (WACC).",
                        "content": "### Why Free Cash Flow Trumps Net Accounting Income\nAccounting profit (Net Income) can be distorted by non-cash charges, revenue recognition policies, and working capital changes. Free Cash Flow (FCF) measures the actual discretionary cash available to business owners.\n\n#### Basic Formula:\n`FCFF = Operating Cash Flow - Capital Expenditures (CapEx)`",
                        "learning_status": "Completed",
                        "progress_pct": 100,
                        "last_stopping_point": "Built DCF spreadsheet model for IT services company.",
                        "next_action": "Perform sensitivity analysis on terminal growth rate.",
                        "personal_notes": "Always check working capital changes. If net income is rising but operating cash flow is falling, receivables are piling up."
                    },
                    {
                        "name": "Economic Moats & Competitive Advantage",
                        "short_description": "Pat Moss / Michael Porter framework: Network effects, switching costs, cost advantages, and intangible assets.",
                        "content": "### The 5 Types of Sustainable Moats\n1. **Network Effects**: Value increases with each additional user (e.g. Visa, NSE, Apple ecosystem).\n2. **High Switching Costs**: Pain and expense of changing vendors (e.g. Core banking software).\n3. **Cost Advantage**: Scale or unique geographic asset (e.g. D-Mart, Costco).\n4. **Intangibles**: Patents, regulatory licenses, brands.\n5. **Efficient Scale**: Natural oligopoly serving a limited market size.",
                        "learning_status": "Completed",
                        "progress_pct": 100,
                        "last_stopping_point": "Finished Porter's Five Forces and case study reviews.",
                        "next_action": "Apply framework to Indian FMCG and Pharma companies.",
                        "personal_notes": "A moat protects high Return on Invested Capital (ROIC) from being competed away."
                    }
                ]
            },
            {
                "name": "Economics",
                "description": "Central bank policy, repo rates, yield curve inversions, and macroeconomic indicators.",
                "icon": "Globe",
                "display_order": 4,
                "concepts": [
                    {
                        "name": "Yield Curve Inversions & The Business Cycle",
                        "short_description": "Treasury yield spread dynamics, term premium, and historical recession prediction power.",
                        "content": "### What does an Inverted Yield Curve signal?\nUnder normal conditions, longer-term bonds carry higher yields than short-term bonds to compensate for duration risk. When 2-year or 3-month yields exceed 10-year yields, the curve is **inverted**.\n\nHistorically, yield curve inversion has preceded almost every US recession over the past 50 years with a 12 to 18 month lead time.",
                        "learning_status": "In Progress",
                        "progress_pct": 40,
                        "last_stopping_point": "Studying 10Y - 2Y sovereign bond spread.",
                        "next_action": "Analyze RBI Monetary Policy Committee (MPC) rate stance.",
                        "personal_notes": "RBI repo rate directly impacts housing loan EMIs and banking Net Interest Margins."
                    }
                ]
            }
        ]

        for cat_data in categories_data:
            concepts = cat_data.pop("concepts", [])
            cat = LearningCategory(**cat_data)
            db.add(cat)
            db.flush()

            for conc_data in concepts:
                resources = conc_data.pop("resources", [])
                quiz_data = conc_data.pop("quiz", None)
                conc = FinanceConcept(category_id=cat.id, **conc_data)
                db.add(conc)
                db.flush()

                for res in resources:
                    db.add(LearningResource(concept_id=conc.id, **res))

                if quiz_data:
                    questions = quiz_data.pop("questions", [])
                    quiz_obj = Quiz(concept_id=conc.id, **quiz_data)
                    db.add(quiz_obj)
                    db.flush()
                    for q in questions:
                        db.add(QuizQuestion(quiz_id=quiz_obj.id, **q))

    # 3. Case Studies
    if not db.query(CaseStudy).first():
        case_studies = [
            CaseStudy(
                company_name="Reliance Industries Limited",
                ticker="RELIANCE.NS",
                sector="Energy & Conglomerate",
                business_model="Integrated conglomerate with dominant positions in Oil-to-Chemicals (O2C), telecom (Jio with 450M+ subscribers), retail (Reliance Retail with 18,000+ stores), and new energy gigafactories.",
                revenue_sources="1. O2C refining & petrochemicals (~55% revenue)\n2. Retail consumer operations (~28% revenue)\n3. Digital services & Jio connectivity (~17% revenue)",
                competitive_advantage="Unmatched capital scale, massive physical store density across India, proprietary telecom optical fiber infrastructure, and zero net debt post-2020 stake sales.",
                financial_performance="Consistent annual EBITDA growth exceeding 15%. High operating cash flows reinvested heavily into 5G rollout and Jamnagar solar/hydrogen manufacturing.",
                growth_opportunities="5G monetization via fixed wireless access (JioAirFiber), retail e-commerce integration (JioMart), and green hydrogen export economics.",
                risks="Global crude refining margin cyclicality, high ongoing CapEx, and regulatory changes in telecom tariffs.",
                personal_observations="Reliance has successfully transformed from an old-economy petrochemical giant into a consumer tech ecosystem with two massive cash-generative pillars.",
                research_resources="Reliance Annual Report FY24, Morgan Stanley Equity Research report on Indian Telecom, Jio Investor Presentation."
            ),
            CaseStudy(
                company_name="Tata Consultancy Services",
                ticker="TCS.NS",
                sector="Information Technology",
                business_model="Global IT services, consulting, and enterprise digital solutions serving Fortune 500 enterprises across 50+ countries with a workforce of 600,000+ professionals.",
                revenue_sources="Banking & Financial Services (BFSI ~32%), Consumer & Retail (~16%), Communications & Media (~10%), Manufacturing (~10%), Life Sciences & Healthcare (~10%).",
                competitive_advantage="Industry-leading EBIT margins (24-26%), lowest attrition among global peers, deep enterprise client relationships (100+ clients contributing $100M+ ARR), and zero long-term debt.",
                financial_performance="Return on Equity (ROE) exceeds 45%. Exceptional Free Cash Flow conversion (>100% of Net Income) with consistent 70-80% dividend payout ratio.",
                growth_opportunities="Generative AI consulting, legacy cloud migrations, cybersecurity, and mega vendor-consolidation contracts from European banks.",
                risks="US/Europe enterprise tech budget slowdown, wage inflation, and potential disruption from automated code-generation agents.",
                personal_observations="A premier compounder. Even during macroeconomic slowdowns, TCS maintains superior pricing power and cash flow stability.",
                research_resources="TCS Analyst Day Transcript, Gartner IT Services Magic Quadrant, FY24 Annual Filing."
            ),
            CaseStudy(
                company_name="NVIDIA Corporation",
                ticker="NVDA",
                sector="Semiconductors & AI",
                business_model="Full-stack accelerated computing platform provider. Designs GPUs, DPUs, networking switches (InfiniBand), and proprietary software architecture (CUDA).",
                revenue_sources="Data Center AI compute & networking (>85% revenue), Gaming GPUs (~10%), Professional Visualization (~3%), Automotive (~2%).",
                competitive_advantage="Massive software moat in CUDA: millions of AI developers and researchers write models exclusively optimized for NVIDIA hardware. Switching costs are extraordinarily high.",
                financial_performance="Gross margins exceeding 75%. Net income grew 400%+ year-over-year during the initial LLM buildout phase. Unprecedented Return on Invested Capital.",
                growth_opportunities="Sovereign AI infrastructure, enterprise AI agent deployments, robotics (Omniverse), and next-generation Blackwell architecture.",
                risks="Hyperscaler custom ASIC silicon development (Google TPU, AWS Trainium), geopolitical semiconductor export restrictions, and customer concentration.",
                personal_observations="NVIDIA is not merely a chip manufacturer; it is a proprietary computing platform akin to Microsoft Windows or Apple iOS for modern AI.",
                research_resources="NVIDIA 10-K Filings, SemiAnalysis deep-dives on CoWoS packaging, GTC Keynote Transcripts."
            )
        ]
        db.add_all(case_studies)

    # 4. Watchlist Items
    if not db.query(WatchlistItem).first():
        watchlist = [
            WatchlistItem(symbol="^NSEI", name="NIFTY 50", exchange="NSE", sector="Benchmark Index", notes="Key barometer for Indian market sentiment."),
            WatchlistItem(symbol="RELIANCE.NS", name="Reliance Industries", exchange="NSE", sector="Conglomerate", notes="Consolidating above 200 EMA."),
            WatchlistItem(symbol="TCS.NS", name="Tata Consultancy Services", exchange="NSE", sector="IT Services", notes="Attractive dividend yield & valuation."),
            WatchlistItem(symbol="HDFCBANK.NS", name="HDFC Bank", exchange="NSE", sector="Banking", notes="Watching loan-to-deposit ratio normalization."),
            WatchlistItem(symbol="NVDA", name="NVIDIA Corporation", exchange="NASDAQ", sector="AI Semiconductors", notes="Monitoring data center demand and Blackwell shipments.")
        ]
        db.add_all(watchlist)

    # 5. Paper Trading Open Positions & Initial Journal
    if not db.query(PaperPosition).first():
        positions = [
            PaperPosition(
                symbol="RELIANCE.NS",
                quantity=25,
                average_entry_price=2940.0,
                current_price=2985.40,
                unrealized_pnl=1135.0,
                unrealized_pnl_pct=1.54,
                status="OPEN"
            ),
            PaperPosition(
                symbol="TCS.NS",
                quantity=12,
                average_entry_price=4150.0,
                current_price=4120.00,
                unrealized_pnl=-360.0,
                unrealized_pnl_pct=-0.72,
                status="OPEN"
            )
        ]
        db.add_all(positions)

    # 6. Trading Journal
    if not db.query(TradingJournalEntry).first():
        journal_entries = [
            TradingJournalEntry(
                instrument="RELIANCE.NS",
                entry_date=datetime.now(timezone.utc) - timedelta(days=5),
                entry_price=2940.0,
                exit_date=None,
                exit_price=None,
                quantity=25,
                strategy_used="Breakout from 20-Day Range",
                reason_entry="Stock broke out of 2,920 resistance with 1.8x average volume and positive divergence on RSI.",
                reason_exit=None,
                stop_loss=2890.0,
                target_price=3050.0,
                result="OPEN",
                pnl_amount=1135.0,
                pnl_percentage=1.54,
                lessons_learned="Holding as per plan. Trailing stop to cost once 3,010 is breached."
            ),
            TradingJournalEntry(
                instrument="INFY.NS",
                entry_date=datetime.now(timezone.utc) - timedelta(days=14),
                entry_price=1760.0,
                exit_date=datetime.now(timezone.utc) - timedelta(days=7),
                exit_price=1835.0,
                quantity=50,
                strategy_used="Earnings Pullback Mean Reversion",
                reason_entry="Overreaction post Q2 results pushed 14-period RSI down to 28 on daily chart near 200 EMA support.",
                reason_exit="Reached resistance at previous swing high (1,840). Booked solid profit.",
                stop_loss=1720.0,
                target_price=1830.0,
                result="WIN",
                pnl_amount=3750.0,
                pnl_percentage=4.26,
                lessons_learned="Disciplined exit at predefined target prevented giving back profits when market consolidated."
            ),
            TradingJournalEntry(
                instrument="TATAMOTORS.NS",
                entry_date=datetime.now(timezone.utc) - timedelta(days=21),
                entry_price=980.0,
                exit_date=datetime.now(timezone.utc) - timedelta(days=16),
                exit_price=950.0,
                quantity=40,
                strategy_used="Momentum Continuation",
                reason_entry="Entered on expected breakout above 980.",
                reason_exit="Hit stop-loss at 950 after broader auto sector faced margin concerns.",
                stop_loss=950.0,
                target_price=1040.0,
                result="LOSS",
                pnl_amount=-1200.0,
                pnl_percentage=-3.06,
                lessons_learned="Honored stop-loss promptly without emotional bargaining. Capital preserved for next setup."
            )
        ]
        db.add_all(journal_entries)

    # 7. Market Intelligence / News
    if not db.query(MarketNewsItem).first():
        news_items = [
            MarketNewsItem(
                headline="RBI Holds Repo Rate Steady at 6.50% While Retaining Withdrawal of Accommodation Stance",
                source="Reserve Bank of India Monetary Policy Statement",
                publication_date=datetime.now(timezone.utc) - timedelta(hours=6),
                category="Monetary Policy",
                sector="Banking & Financials",
                short_explanation="The Monetary Policy Committee voted by majority to maintain the benchmark repo rate at 6.50% to ensure inflation aligns durably with the 4% target while sustaining economic growth.",
                what_happened="RBI kept interest rates unchanged for the 10th consecutive policy meeting, citing unpredictable food price spikes despite core inflation remaining benign.",
                who_affected="Commercial banks, mortgage borrowers, NBFCs, fixed deposit investors, and rate-sensitive real estate sectors.",
                companies_sectors="HDFC Bank, ICICI Bank, SBI, Bajaj Finance, DLF, Godrej Properties.",
                market_implications="Yields on 10-year Indian government bonds are expected to trade in a tight 6.80%-6.85% band. Stable net interest margins for high-CASA banks.",
                what_to_monitor="Monitor upcoming monsoon agricultural yield data and US Federal Reserve rate cut trajectory.",
                personal_observations="Banking stocks may experience mild consolidation; NBFCs with high wholesale funding costs could see margin compression if deposit costs stay sticky.",
                is_bookmarked=True
            ),
            MarketNewsItem(
                headline="NVIDIA Unveils Next-Gen AI Silicon Architecture with Expanded Supply Chain Partners",
                source="Reuters Financial & Tech",
                publication_date=datetime.now(timezone.utc) - timedelta(hours=14),
                category="Technology & AI",
                sector="Semiconductors",
                short_explanation="NVIDIA announced production ramping for its latest Blackwell series GPUs, partnering with TSMC and advanced packaging suppliers to meet hyperscaler order backlogs.",
                what_happened="CEO confirmed production yields are improving rapidly and demand from Microsoft, Meta, Google, and Amazon remains at peak capacity.",
                who_affected="Global AI chip designers, semiconductor foundries, server manufacturers, and enterprise cloud providers.",
                companies_sectors="NVDA, TSM, AMD, MSFT, GOOGL, Super Micro Computer.",
                market_implications="Reinforces long-term CapEx commitments into AI data center infrastructure through 2026-2027.",
                what_to_monitor="Power grid availability constraints in US and European data centers, as power supply is replacing chip availability as the primary bottleneck.",
                personal_observations="AI infrastructure trade remains strong; watching power utility and liquid cooling suppliers as derivative plays.",
                is_bookmarked=True
            ),
            MarketNewsItem(
                headline="India's Goods and Services Tax (GST) Collections Hit Second-Highest Level of ₹1.87 Lakh Crore",
                source="Ministry of Finance Press Release",
                publication_date=datetime.now(timezone.utc) - timedelta(days=1),
                category="Macroeconomics",
                sector="National Economy",
                short_explanation="Gross GST revenue collection for the past month posted an 8.9% year-on-year growth, driven by strong festive consumption and enhanced compliance.",
                what_happened="Domestic transactions recorded healthy expansion while import tax collection remained stable.",
                who_affected="Central and state government fiscal balances, sovereign deficit trajectories, and organized retail.",
                companies_sectors="Organized retail (Trent, Reliance Retail, D-Mart), logistics, and manufacturing.",
                market_implications="Provides the government with fiscal buffer to maintain infrastructure CapEx without expanding market borrowing targets.",
                what_to_monitor="Monthly rural wage growth and vehicle registration numbers (Vahan) for consumer demand breadth.",
                personal_observations="Robust tax collection gives sovereign bond markets confidence that fiscal deficit targets (4.9% of GDP) will be achieved comfortably.",
                is_bookmarked=False
            )
        ]
        db.add_all(news_items)

    # 8. Daily Tasks
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if not db.query(DailyTask).filter(DailyTask.task_date == today_str).first():
        tasks = [
            DailyTask(
                task_date=today_str,
                title="Review Free Cash Flow Valuation notes & DCF sensitivity model",
                category="Learning",
                description="Re-read FCFF vs FCFE formulas and review sensitivity tables for terminal growth rate.",
                is_completed=True,
                due_time="11:00 AM",
                incomplete_reason=None
            ),
            DailyTask(
                task_date=today_str,
                title="Analyze Reliance Industries O2C refining margins & retail segment growth",
                category="Market Analysis",
                description="Inspect quarterly earnings presentation and update personal observations in Case Studies.",
                is_completed=False,
                due_time="03:00 PM",
                incomplete_reason=None
            ),
            DailyTask(
                task_date=today_str,
                title="Execute 1 simulated paper trade based on RSI Divergence setup",
                category="Trading Practice",
                description="Scan NIFTY 50 watchlist on 1-hour timeframe for regular bullish divergence with volume confirmation.",
                is_completed=False,
                due_time="05:30 PM",
                incomplete_reason=None
            )
        ]
        db.add_all(tasks)

    # 9. Monthly Goals
    cur_ym = datetime.now(timezone.utc).strftime("%Y-%m")
    if not db.query(MonthlyGoal).filter(MonthlyGoal.year_month == cur_ym).first():
        goals = [
            MonthlyGoal(
                year_month=cur_ym,
                title="Master 6 Core Fundamental & Technical Analysis Concepts",
                category="Learning",
                target_value=6.0,
                current_value=4.0,
                unit="concepts",
                is_completed=False,
                notes="Completed: Order Books, Market Mechanics, FCF, Moats. In progress: RSI, Moving Averages."
            ),
            MonthlyGoal(
                year_month=cur_ym,
                title="Conduct 4 In-depth Company Case Studies",
                category="Market Analysis",
                target_value=4.0,
                current_value=3.0,
                unit="case studies",
                is_completed=False,
                notes="Completed Reliance, TCS, NVIDIA. Next: HDFC Bank or L&T."
            ),
            MonthlyGoal(
                year_month=cur_ym,
                title="Maintain 100% Trading Journal Logging for Simulated Trades",
                category="Trading",
                target_value=10.0,
                current_value=3.0,
                unit="journal entries",
                is_completed=False,
                notes="Every trade must have entry rationale, stop-loss, and post-trade lesson."
            ),
            MonthlyGoal(
                year_month=cur_ym,
                title="Achieve >60% Win Rate on Simulated Breakout Trades",
                category="Trading",
                target_value=60.0,
                current_value=66.7,
                unit="percent",
                is_completed=False,
                notes="Currently 2 wins out of 3 closed/active trades."
            )
        ]
        db.add_all(goals)

    db.commit()
