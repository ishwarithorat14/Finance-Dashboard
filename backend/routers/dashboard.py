from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import (
    FinanceConcept, LearningResource, CaseStudy, PaperPosition,
    TradingJournalEntry, MarketNewsItem, DailyTask, MonthlyGoal, UserSettings
)
from backend.services.market_service import MarketService

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Computes all Home Dashboard metrics from actual database records.
    Nothing is fabricated or randomly generated.
    """
    now_utc = datetime.now(timezone.utc)
    # India offset for friendly greeting
    ist_hour = (now_utc.hour + 5 + (1 if now_utc.minute + 30 >= 60 else 0)) % 24
    if 5 <= ist_hour < 12:
        greeting = "Good morning"
    elif 12 <= ist_hour < 17:
        greeting = "Good afternoon"
    elif 17 <= ist_hour < 22:
        greeting = "Good evening"
    else:
        greeting = "Welcome back"

    settings = db.query(UserSettings).first()
    pref = settings.market_preference if settings else "IN"
    market_status = MarketService.get_market_status(pref)

    # 1. Learning Progress Calculation
    concepts = db.query(FinanceConcept).all()
    total_concepts = len(concepts)
    completed_concepts = sum(1 for c in concepts if c.learning_status == "Completed")
    in_progress_concepts = sum(1 for c in concepts if c.learning_status == "In Progress")
    
    if total_concepts > 0:
        total_progress_sum = sum(c.progress_pct for c in concepts)
        learning_pct = round(total_progress_sum / total_concepts, 1)
    else:
        learning_pct = 0.0

    # Calculate completed in last 7 days
    seven_days_ago = now_utc - timedelta(days=7)
    recent_resources_done = db.query(LearningResource).filter(
        LearningResource.is_completed == True,
        LearningResource.created_at >= seven_days_ago
    ).count()

    # 2. Trading Practice Calculation
    positions = db.query(PaperPosition).filter(PaperPosition.status == "OPEN").all()
    closed_trades = db.query(TradingJournalEntry).filter(TradingJournalEntry.result.in_(["WIN", "LOSS", "BREAKEVEN"])).all()
    total_closed = len(closed_trades)
    winning_trades = sum(1 for t in closed_trades if t.result == "WIN")
    win_rate = round((winning_trades / total_closed * 100), 1) if total_closed > 0 else 0.0
    
    realized_pnl = sum(t.pnl_amount for t in closed_trades)
    unrealized_pnl = sum(p.unrealized_pnl for p in positions)
    total_pnl = round(realized_pnl + unrealized_pnl, 2)
    
    starting_cap = settings.starting_virtual_capital if settings else 1000000.0
    cash_bal = settings.current_cash_balance if settings else 1000000.0
    positions_val = sum(p.quantity * p.current_price for p in positions)
    portfolio_equity = round(cash_bal + positions_val, 2)
    portfolio_return_pct = round(((portfolio_equity - starting_cap) / starting_cap) * 100, 2) if starting_cap > 0 else 0.0

    # 3. Market Analysis Calculation
    case_studies_count = db.query(CaseStudy).count()
    news_analyzed = db.query(MarketNewsItem).filter(
        (MarketNewsItem.personal_observations != None) & (MarketNewsItem.personal_observations != "")
    ).count()
    total_news = db.query(MarketNewsItem).count()
    bookmarked_news = db.query(MarketNewsItem).filter(MarketNewsItem.is_bookmarked == True).count()

    # 4. Monthly Goal Calculation
    cur_ym = now_utc.strftime("%Y-%m")
    goals = db.query(MonthlyGoal).filter(MonthlyGoal.year_month == cur_ym).all()
    total_goals = len(goals)
    completed_goals = sum(1 for g in goals if g.is_completed)
    goal_pct = round((completed_goals / total_goals * 100), 1) if total_goals > 0 else 0.0

    # Days remaining in month
    next_month = (now_utc.replace(day=28) + timedelta(days=4)).replace(day=1)
    days_remaining = max(0, (next_month - now_utc).days)

    # Upcoming Tasks Summary (for Collapsible Section)
    today_str = now_utc.strftime("%Y-%m-%d")
    tasks = db.query(DailyTask).filter(DailyTask.task_date == today_str).order_by(DailyTask.is_completed.asc(), DailyTask.id.asc()).all()
    pending_tasks = sum(1 for t in tasks if not t.is_completed)
    completed_tasks = sum(1 for t in tasks if t.is_completed)

    # Market Snapshot Summary (for Collapsible Section)
    market_snapshot = MarketService.get_market_snapshot()

    return {
        "greeting": f"{greeting}, {settings.username if settings else 'Investor'}",
        "motivational_subtitle": "Consistent discipline and risk-adjusted research compound into market mastery.",
        "current_date": now_utc.strftime("%A, %B %d, %Y"),
        "market_status": market_status,
        "learning_progress": {
            "title": "Learning Progress",
            "progress_pct": learning_pct,
            "completed_concepts": completed_concepts,
            "total_concepts": total_concepts,
            "in_progress": in_progress_concepts,
            "weekly_activity": f"+{recent_resources_done} resources studied this week",
            "action_label": "Continue Learning",
            "route": "learn"
        },
        "trading_practice": {
            "title": "Trading Practice",
            "progress_pct": win_rate if total_closed > 0 else 0.0,
            "metric_label": f"{win_rate}% Win Rate",
            "open_positions": len(positions),
            "portfolio_return_pct": portfolio_return_pct,
            "total_pnl": total_pnl,
            "currency": settings.currency if settings else "INR",
            "weekly_activity": f"{total_closed} closed simulated trades",
            "action_label": "Enter Practice",
            "route": "practice"
        },
        "market_analysis": {
            "title": "Market Analysis",
            "progress_pct": min(100, int((case_studies_count / 5.0) * 100)) if case_studies_count > 0 else 0,
            "case_studies_count": case_studies_count,
            "news_analyzed": news_analyzed,
            "bookmarked_count": bookmarked_news,
            "weekly_activity": f"{case_studies_count} company deep-dives completed",
            "action_label": "View Intelligence",
            "route": "intelligence"
        },
        "monthly_goal": {
            "title": "Monthly Goal",
            "progress_pct": goal_pct,
            "completed_goals": completed_goals,
            "total_goals": total_goals,
            "days_remaining": days_remaining,
            "weekly_activity": f"{days_remaining} days remaining in this review cycle",
            "action_label": "Open Review",
            "route": "review"
        },
        "upcoming_tasks_summary": {
            "pending_count": pending_tasks,
            "completed_count": completed_tasks,
            "total_count": len(tasks),
            "tasks": [
                {
                    "id": t.id,
                    "title": t.title,
                    "category": t.category,
                    "due_time": t.due_time,
                    "is_completed": t.is_completed,
                    "incomplete_reason": t.incomplete_reason,
                    "task_date": t.task_date
                }
                for t in tasks
            ]
        },
        "market_snapshot_summary": market_snapshot
    }
