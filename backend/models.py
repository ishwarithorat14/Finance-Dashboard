from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from backend.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class UserSettings(Base):
    """Stores user configuration, starting paper capital, API keys, and preferences."""
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), default="Investor", nullable=False)
    starting_virtual_capital = Column(Float, default=1000000.0, nullable=False)
    current_cash_balance = Column(Float, default=1000000.0, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    market_preference = Column(String(20), default="IN", nullable=False)  # "IN", "US", "GLOBAL"
    alphavantage_api_key = Column(String(255), default="", nullable=True)
    finnhub_api_key = Column(String(255), default="", nullable=True)
    news_api_key = Column(String(255), default="", nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class LearningCategory(Base):
    """Organizes finance concepts into major educational domains."""
    __tablename__ = "learning_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="BookOpen")
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

    concepts = relationship("FinanceConcept", back_populates="category", cascade="all, delete-orphan")


class FinanceConcept(Base):
    """Core finance learning concept with progress tracking, notes, and quiz."""
    __tablename__ = "finance_concepts"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("learning_categories.id"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    short_description = Column(Text, nullable=False)
    content = Column(Text, nullable=True)  # Markdown or detailed study guide
    learning_status = Column(String(50), default="Not Started")  # "Not Started", "In Progress", "Completed"
    progress_pct = Column(Integer, default=0)  # 0 to 100
    last_stopping_point = Column(String(255), nullable=True)
    next_action = Column(String(255), nullable=True)
    personal_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    category = relationship("LearningCategory", back_populates="concepts")
    resources = relationship("LearningResource", back_populates="concept", cascade="all, delete-orphan")
    quiz = relationship("Quiz", uselist=False, back_populates="concept", cascade="all, delete-orphan")


class LearningResource(Base):
    """External links, papers, videos, and books attached to a finance concept."""
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("finance_concepts.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    url = Column(String(500), nullable=True)
    resource_type = Column(String(50), default="article")  # "article", "video", "book", "report", "tool"
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    concept = relationship("FinanceConcept", back_populates="resources")


class Quiz(Base):
    """Quiz associated with a finance concept."""
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    concept_id = Column(Integer, ForeignKey("finance_concepts.id"), nullable=False, unique=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    concept = relationship("FinanceConcept", back_populates="quiz")
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


class QuizQuestion(Base):
    """Multiple choice question with answer validation and explanation."""
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(5), nullable=False)  # "A", "B", "C", "D"
    explanation = Column(Text, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    """Record of a completed quiz attempt for score calculation and history."""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    percentage = Column(Float, nullable=False)
    completed_at = Column(DateTime, default=utc_now)

    quiz = relationship("Quiz", back_populates="attempts")


class CaseStudy(Base):
    """Deep business analysis workspace for companies and industries."""
    __tablename__ = "case_studies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), nullable=False)
    ticker = Column(String(50), nullable=True, index=True)
    sector = Column(String(100), nullable=False, index=True)
    business_model = Column(Text, nullable=True)
    revenue_sources = Column(Text, nullable=True)
    competitive_advantage = Column(Text, nullable=True)
    financial_performance = Column(Text, nullable=True)
    growth_opportunities = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    personal_observations = Column(Text, nullable=True)
    research_resources = Column(Text, nullable=True)
    analysis_date = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class WatchlistItem(Base):
    """User watchlist of instruments."""
    __tablename__ = "watchlist_items"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(150), nullable=False)
    exchange = Column(String(50), default="NSE")
    sector = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    added_at = Column(DateTime, default=utc_now)


class PaperOrder(Base):
    """Simulated buy and sell orders."""
    __tablename__ = "paper_orders"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), nullable=False, index=True)
    order_type = Column(String(10), nullable=False)  # "BUY", "SELL"
    order_style = Column(String(20), default="MARKET")  # "MARKET", "LIMIT"
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="EXECUTED")  # "EXECUTED", "CANCELLED"
    executed_at = Column(DateTime, default=utc_now)


class PaperPosition(Base):
    """Current open simulated trading positions."""
    __tablename__ = "paper_positions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(50), unique=True, nullable=False, index=True)
    quantity = Column(Integer, nullable=False)
    average_entry_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    unrealized_pnl = Column(Float, default=0.0)
    unrealized_pnl_pct = Column(Float, default=0.0)
    status = Column(String(20), default="OPEN")  # "OPEN", "CLOSED"
    opened_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class TradingJournalEntry(Base):
    """Complete record of a simulated trade with psychological & technical reflections."""
    __tablename__ = "trading_journal"

    id = Column(Integer, primary_key=True, index=True)
    instrument = Column(String(50), nullable=False, index=True)
    entry_date = Column(DateTime, default=utc_now)
    entry_price = Column(Float, nullable=False)
    exit_date = Column(DateTime, nullable=True)
    exit_price = Column(Float, nullable=True)
    quantity = Column(Integer, default=1)
    strategy_used = Column(String(100), nullable=False)  # "Breakout", "Moving Average Crossover", "Mean Reversion", "Value Investing"
    reason_entry = Column(Text, nullable=False)
    reason_exit = Column(Text, nullable=True)
    stop_loss = Column(Float, nullable=True)
    target_price = Column(Float, nullable=True)
    result = Column(String(20), nullable=True)  # "WIN", "LOSS", "OPEN", "BREAKEVEN"
    pnl_amount = Column(Float, default=0.0)
    pnl_percentage = Column(Float, default=0.0)
    lessons_learned = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)


class MarketNewsItem(Base):
    """Structured financial news and research with 10-point intelligence breakdown."""
    __tablename__ = "market_news"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String(300), nullable=False, index=True)
    source = Column(String(100), nullable=False)
    publication_date = Column(DateTime, default=utc_now)
    category = Column(String(100), default="Macroeconomics", index=True)
    sector = Column(String(100), nullable=True, index=True)
    short_explanation = Column(Text, nullable=False)
    what_happened = Column(Text, nullable=True)
    who_affected = Column(Text, nullable=True)
    companies_sectors = Column(Text, nullable=True)
    market_implications = Column(Text, nullable=True)
    what_to_monitor = Column(Text, nullable=True)
    personal_observations = Column(Text, nullable=True)
    is_bookmarked = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=utc_now)


class DailyTask(Base):
    """Daily accountability tasks, completion tracking, reasons for incomplete, carry forward."""
    __tablename__ = "daily_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_date = Column(String(10), nullable=False, index=True)  # "YYYY-MM-DD"
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="Learning")  # "Learning", "Trading Practice", "Market Analysis", "Review"
    description = Column(Text, nullable=True)
    due_time = Column(String(20), nullable=True)
    is_completed = Column(Boolean, default=False, index=True)
    incomplete_reason = Column(String(100), nullable=True)  # "Lack of time", "Unexpected interruption", "Difficulty understanding the topic", "Lack of focus", "Other"
    is_carried_forward = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class MonthlyGoal(Base):
    """Monthly learning and trading targets."""
    __tablename__ = "monthly_goals"

    id = Column(Integer, primary_key=True, index=True)
    year_month = Column(String(7), nullable=False, index=True)  # "YYYY-MM"
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="Learning")  # "Learning", "Trading", "Analysis"
    target_value = Column(Float, default=1.0)
    current_value = Column(Float, default=0.0)
    unit = Column(String(30), default="items")  # "concepts", "trades", "case studies"
    is_completed = Column(Boolean, default=False)
    incomplete_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)


class MonthlyReview(Base):
    """Archived monthly review generated from stored user data."""
    __tablename__ = "monthly_reviews"

    id = Column(Integer, primary_key=True, index=True)
    year_month = Column(String(7), unique=True, nullable=False, index=True)  # "YYYY-MM"
    summary_text = Column(Text, nullable=True)
    concepts_completed_count = Column(Integer, default=0)
    learning_progress_pct = Column(Float, default=0.0)
    resources_studied_count = Column(Integer, default=0)
    trades_count = Column(Integer, default=0)
    winning_trades_count = Column(Integer, default=0)
    losing_trades_count = Column(Integer, default=0)
    total_pnl = Column(Float, default=0.0)
    strategy_performance = Column(Text, nullable=True)  # JSON string
    news_analyzed_count = Column(Integer, default=0)
    companies_studied_count = Column(Integer, default=0)
    recurring_patterns = Column(Text, nullable=True)  # Insights on why tasks were missed
    generated_at = Column(DateTime, default=utc_now)
