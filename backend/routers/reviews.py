import json
from collections import Counter
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import (
    FinanceConcept, LearningResource, CaseStudy,
    TradingJournalEntry, MarketNewsItem, DailyTask, MonthlyGoal, MonthlyReview
)
from backend.schemas import (
    MonthlyGoalResponse, MonthlyGoalCreate, MonthlyGoalUpdate
)

router = APIRouter(prefix="/api/reviews", tags=["Monthly Review"])

@router.get("/summary/{year_month}")
def get_monthly_summary(year_month: str, db: Session = Depends(get_db)):
    """
    Computes a comprehensive monthly performance review strictly from stored data.
    Aggregates learning, trading, market intelligence, goals, and recurring accountability patterns.
    """
    # 1. Learning Performance
    concepts = db.query(FinanceConcept).all()
    completed_concepts = [c for c in concepts if c.learning_status == "Completed"]
    total_concepts = len(concepts)
    learning_progress_pct = round((sum(c.progress_pct for c in concepts) / total_concepts), 1) if total_concepts else 0.0
    resources_studied = db.query(LearningResource).filter(LearningResource.is_completed == True).count()

    # 2. Trading Performance
    # Filter trades that occurred within or around this month
    all_journal_trades = db.query(TradingJournalEntry).all()
    closed_trades = [t for t in all_journal_trades if t.result in ["WIN", "LOSS", "BREAKEVEN"]]
    wins = [t for t in closed_trades if t.result == "WIN"]
    losses = [t for t in closed_trades if t.result == "LOSS"]
    total_pnl = round(sum(t.pnl_amount for t in closed_trades), 2)
    win_rate = round((len(wins) / len(closed_trades) * 100), 1) if closed_trades else 0.0

    # Strategy breakdown
    strategy_perf = {}
    for t in closed_trades:
        st = t.strategy_used or "General"
        if st not in strategy_perf:
            strategy_perf[st] = {"trades": 0, "wins": 0, "pnl": 0.0}
        strategy_perf[st]["trades"] += 1
        if t.result == "WIN":
            strategy_perf[st]["wins"] += 1
        strategy_perf[st]["pnl"] = round(strategy_perf[st]["pnl"] + t.pnl_amount, 2)

    # 3. Market Analysis
    news_items = db.query(MarketNewsItem).all()
    news_analyzed = [n for n in news_items if n.personal_observations and len(n.personal_observations.strip()) > 0]
    case_studies = db.query(CaseStudy).all()
    observations_count = len(news_analyzed) + sum(1 for c in case_studies if c.personal_observations)

    # 4. Goal Tracking
    goals = db.query(MonthlyGoal).filter(MonthlyGoal.year_month == year_month).all()
    completed_goals = [g for g in goals if g.is_completed]
    incomplete_goals = [g for g in goals if not g.is_completed]

    # 5. Daily Accountability & Recurring Patterns Identification
    tasks = db.query(DailyTask).filter(DailyTask.task_date.startswith(year_month)).all()
    incomplete_tasks = [t for t in tasks if not t.is_completed and t.incomplete_reason]
    reason_counts = Counter(t.incomplete_reason for t in incomplete_tasks)
    
    recurring_patterns = []
    for reason, count in reason_counts.most_common():
        recurring_patterns.append({
            "reason": reason,
            "occurrences": count,
            "impact": "High" if count >= 3 else "Medium"
        })

    # Synthesized executive summary
    summary_paragraph = (
        f"In {year_month}, you mastered {len(completed_concepts)} concepts across financial markets and fundamentals, "
        f"achieving an overall learning progress score of {learning_progress_pct}%. "
        f"Your simulated trading practice yielded {len(closed_trades)} closed executions with a {win_rate}% win rate "
        f"and total net P&L of {total_pnl:+.2f}. "
        f"You logged {len(case_studies)} company case studies and analyzed {len(news_analyzed)} market events. "
        f"Out of {len(goals)} monthly targets, {len(completed_goals)} were accomplished."
    )

    return {
        "year_month": year_month,
        "executive_summary": summary_paragraph,
        "learning": {
            "concepts_completed": len(completed_concepts),
            "total_concepts": total_concepts,
            "learning_progress_pct": learning_progress_pct,
            "resources_studied": resources_studied,
            "recently_completed": [c.name for c in completed_concepts[:4]]
        },
        "trading": {
            "total_simulated_trades": len(closed_trades),
            "winning_trades": len(wins),
            "losing_trades": len(losses),
            "win_rate": win_rate,
            "total_pnl": total_pnl,
            "strategy_breakdown": strategy_perf
        },
        "market_analysis": {
            "news_analyzed_count": len(news_analyzed),
            "companies_studied_count": len(case_studies),
            "observations_recorded": observations_count,
            "companies": [c.company_name for c in case_studies]
        },
        "goals": {
            "total_goals": len(goals),
            "completed_goals": len(completed_goals),
            "incomplete_goals": len(incomplete_goals),
            "items": [MonthlyGoalResponse.model_validate(g) for g in goals]
        },
        "accountability_patterns": recurring_patterns
    }

# --- Monthly Goals Management ---
@router.get("/goals/{year_month}", response_model=List[MonthlyGoalResponse])
def get_monthly_goals(year_month: str, db: Session = Depends(get_db)):
    return db.query(MonthlyGoal).filter(MonthlyGoal.year_month == year_month).all()

@router.post("/goals", response_model=MonthlyGoalResponse)
def create_monthly_goal(goal_in: MonthlyGoalCreate, db: Session = Depends(get_db)):
    ym = goal_in.year_month or datetime.now(timezone.utc).strftime("%Y-%m")
    goal = MonthlyGoal(
        year_month=ym,
        title=goal_in.title,
        category=goal_in.category,
        target_value=goal_in.target_value,
        current_value=goal_in.current_value,
        unit=goal_in.unit,
        is_completed=goal_in.is_completed,
        incomplete_reason=goal_in.incomplete_reason,
        notes=goal_in.notes
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal

@router.put("/goals/{goal_id}", response_model=MonthlyGoalResponse)
def update_monthly_goal(goal_id: int, goal_update: MonthlyGoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(MonthlyGoal).filter(MonthlyGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    for key, val in goal_update.model_dump(exclude_unset=True).items():
        setattr(goal, key, val)
    
    # Auto mark complete if current >= target
    if goal.current_value >= goal.target_value and goal.target_value > 0:
        goal.is_completed = True

    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/goals/{goal_id}")
def delete_monthly_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(MonthlyGoal).filter(MonthlyGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"status": "success", "message": "Goal deleted"}
