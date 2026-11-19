from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

# User & Settings
class UserSettingsBase(BaseModel):
    username: str = "Investor"
    starting_virtual_capital: float = 1000000.0
    current_cash_balance: float = 1000000.0
    currency: str = "INR"
    market_preference: str = "IN"
    alphavantage_api_key: Optional[str] = ""
    finnhub_api_key: Optional[str] = ""
    news_api_key: Optional[str] = ""

class UserSettingsUpdate(BaseModel):
    username: Optional[str] = None
    starting_virtual_capital: Optional[float] = None
    market_preference: Optional[str] = None
    alphavantage_api_key: Optional[str] = None
    finnhub_api_key: Optional[str] = None
    news_api_key: Optional[str] = None

class UserSettingsResponse(UserSettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Learning Category
class LearningCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "BookOpen"
    display_order: Optional[int] = 0

class LearningCategoryResponse(LearningCategoryBase):
    id: int
    concept_count: Optional[int] = 0
    completed_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Learning Resource
class LearningResourceBase(BaseModel):
    title: str
    url: Optional[str] = None
    resource_type: str = "article"
    description: Optional[str] = None
    is_completed: bool = False
    notes: Optional[str] = None

class LearningResourceCreate(LearningResourceBase):
    concept_id: int

class LearningResourceUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    resource_type: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    notes: Optional[str] = None

class LearningResourceResponse(LearningResourceBase):
    id: int
    concept_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Quiz
class QuizQuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    explanation: str

class QuizQuestionCreate(QuizQuestionBase):
    quiz_id: int

class QuizQuestionResponse(QuizQuestionBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None

class QuizResponse(QuizBase):
    id: int
    concept_id: int
    questions: List[QuizQuestionResponse] = []

    class Config:
        from_attributes = True

class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]  # question_id -> selected_option ("A", "B", "C", "D")

class QuizSubmitResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    results: List[Dict[str, Any]]  # question details with user_answer, is_correct, explanation


# Finance Concept
class FinanceConceptBase(BaseModel):
    name: str
    short_description: str
    content: Optional[str] = None
    learning_status: str = "Not Started"
    progress_pct: int = 0
    last_stopping_point: Optional[str] = None
    next_action: Optional[str] = None
    personal_notes: Optional[str] = None

class FinanceConceptCreate(FinanceConceptBase):
    category_id: int

class FinanceConceptUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[str] = None
    learning_status: Optional[str] = None
    progress_pct: Optional[int] = None
    last_stopping_point: Optional[str] = None
    next_action: Optional[str] = None
    personal_notes: Optional[str] = None

class FinanceConceptResponse(FinanceConceptBase):
    id: int
    category_id: int
    category_name: Optional[str] = None
    resources: List[LearningResourceResponse] = []
    has_quiz: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Case Study
class CaseStudyBase(BaseModel):
    company_name: str
    ticker: Optional[str] = None
    sector: str
    business_model: Optional[str] = None
    revenue_sources: Optional[str] = None
    competitive_advantage: Optional[str] = None
    financial_performance: Optional[str] = None
    growth_opportunities: Optional[str] = None
    risks: Optional[str] = None
    personal_observations: Optional[str] = None
    research_resources: Optional[str] = None

class CaseStudyCreate(CaseStudyBase):
    pass

class CaseStudyUpdate(BaseModel):
    company_name: Optional[str] = None
    ticker: Optional[str] = None
    sector: Optional[str] = None
    business_model: Optional[str] = None
    revenue_sources: Optional[str] = None
    competitive_advantage: Optional[str] = None
    financial_performance: Optional[str] = None
    growth_opportunities: Optional[str] = None
    risks: Optional[str] = None
    personal_observations: Optional[str] = None
    research_resources: Optional[str] = None

class CaseStudyResponse(CaseStudyBase):
    id: int
    analysis_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Paper Trading
class PaperOrderCreate(BaseModel):
    symbol: str
    order_type: str = Field(..., pattern="^(BUY|SELL)$")
    order_style: str = "MARKET"
    quantity: int = Field(..., gt=0)
    price: Optional[float] = None  # None = use current market quote

class PaperOrderResponse(BaseModel):
    id: int
    symbol: str
    order_type: str
    order_style: str
    quantity: int
    price: float
    total_amount: float
    status: str
    executed_at: datetime

    class Config:
        from_attributes = True

class PaperPositionResponse(BaseModel):
    id: int
    symbol: str
    quantity: int
    average_entry_price: float
    current_price: float
    unrealized_pnl: float
    unrealized_pnl_pct: float
    status: str
    opened_at: datetime

    class Config:
        from_attributes = True

class TradingJournalCreate(BaseModel):
    instrument: str
    entry_date: Optional[datetime] = None
    entry_price: float
    exit_date: Optional[datetime] = None
    exit_price: Optional[float] = None
    quantity: int = 1
    strategy_used: str
    reason_entry: str
    reason_exit: Optional[str] = None
    stop_loss: Optional[float] = None
    target_price: Optional[float] = None
    result: Optional[str] = None  # "WIN", "LOSS", "OPEN", "BREAKEVEN"
    lessons_learned: Optional[str] = None

class TradingJournalResponse(BaseModel):
    id: int
    instrument: str
    entry_date: datetime
    entry_price: float
    exit_date: Optional[datetime] = None
    exit_price: Optional[float] = None
    quantity: int
    strategy_used: str
    reason_entry: str
    reason_exit: Optional[str] = None
    stop_loss: Optional[float] = None
    target_price: Optional[float] = None
    result: Optional[str] = None
    pnl_amount: float
    pnl_percentage: float
    lessons_learned: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Market News
class MarketNewsBase(BaseModel):
    headline: str
    source: str
    category: str = "Macroeconomics"
    sector: Optional[str] = None
    short_explanation: str
    what_happened: Optional[str] = None
    who_affected: Optional[str] = None
    companies_sectors: Optional[str] = None
    market_implications: Optional[str] = None
    what_to_monitor: Optional[str] = None
    personal_observations: Optional[str] = None
    is_bookmarked: bool = False

class MarketNewsResponse(MarketNewsBase):
    id: int
    publication_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class MarketNewsObservationUpdate(BaseModel):
    personal_observations: str
    is_bookmarked: Optional[bool] = None


# Daily Tasks
class DailyTaskBase(BaseModel):
    title: str
    category: str = "Learning"
    description: Optional[str] = None
    due_time: Optional[str] = None
    is_completed: bool = False
    incomplete_reason: Optional[str] = None

class DailyTaskCreate(DailyTaskBase):
    task_date: Optional[str] = None

class DailyTaskUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    due_time: Optional[str] = None
    is_completed: Optional[bool] = None
    incomplete_reason: Optional[str] = None
    is_carried_forward: Optional[bool] = None

class DailyTaskResponse(DailyTaskBase):
    id: int
    task_date: str
    is_carried_forward: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Monthly Goals
class MonthlyGoalBase(BaseModel):
    title: str
    category: str = "Learning"
    target_value: float = 1.0
    current_value: float = 0.0
    unit: str = "items"
    is_completed: bool = False
    incomplete_reason: Optional[str] = None
    notes: Optional[str] = None

class MonthlyGoalCreate(MonthlyGoalBase):
    year_month: Optional[str] = None

class MonthlyGoalUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    is_completed: Optional[bool] = None
    incomplete_reason: Optional[str] = None
    notes: Optional[str] = None

class MonthlyGoalResponse(MonthlyGoalBase):
    id: int
    year_month: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Dashboard Overview Response
class DashboardMetricsResponse(BaseModel):
    greeting: str
    motivational_subtitle: str
    current_date: str
    market_status: Dict[str, Any]
    learning_progress: Dict[str, Any]
    trading_practice: Dict[str, Any]
    market_analysis: Dict[str, Any]
    monthly_goal: Dict[str, Any]
    upcoming_tasks_summary: Dict[str, Any]
    market_snapshot_summary: List[Dict[str, Any]]
