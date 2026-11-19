from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import DailyTask
from backend.schemas import DailyTaskResponse, DailyTaskCreate, DailyTaskUpdate

router = APIRouter(prefix="/api/tasks", tags=["Daily Accountability"])

@router.get("", response_model=List[DailyTaskResponse])
def get_daily_tasks(
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    target_date = date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return db.query(DailyTask).filter(DailyTask.task_date == target_date).order_by(DailyTask.is_completed.asc(), DailyTask.id.asc()).all()

@router.post("", response_model=DailyTaskResponse)
def create_daily_task(task_in: DailyTaskCreate, db: Session = Depends(get_db)):
    t_dict = task_in.model_dump()
    if not t_dict.get("task_date"):
        t_dict["task_date"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    task = DailyTask(**t_dict)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}", response_model=DailyTaskResponse)
def update_daily_task(task_id: int, task_update: DailyTaskUpdate, db: Session = Depends(get_db)):
    task = db.query(DailyTask).filter(DailyTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, val in task_update.model_dump(exclude_unset=True).items():
        setattr(task, key, val)
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_daily_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(DailyTask).filter(DailyTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"status": "success", "message": "Task deleted"}

@router.post("/carry-forward")
def carry_forward_incomplete_tasks(from_date: Optional[str] = None, db: Session = Depends(get_db)):
    """Carries forward any incomplete tasks to the next day with audit trail."""
    src_date_str = from_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    src_date = datetime.strptime(src_date_str, "%Y-%m-%d").date()
    next_date_str = (src_date + timedelta(days=1)).strftime("%Y-%m-%d")

    incomplete = db.query(DailyTask).filter(
        DailyTask.task_date == src_date_str,
        DailyTask.is_completed == False
    ).all()

    carried_count = 0
    for t in incomplete:
        t.is_carried_forward = True
        new_task = DailyTask(
            task_date=next_date_str,
            title=t.title,
            category=t.category,
            description=f"(Carried forward from {src_date_str}) {t.description or ''}".strip(),
            due_time=t.due_time,
            is_completed=False,
            incomplete_reason=t.incomplete_reason
        )
        db.add(new_task)
        carried_count += 1
    
    db.commit()
    return {"status": "success", "carried_count": carried_count, "target_date": next_date_str}
