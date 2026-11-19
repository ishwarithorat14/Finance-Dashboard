from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db, Base, engine
from backend.models import UserSettings, PaperPosition, PaperOrder, TradingJournalEntry
from backend.schemas import UserSettingsResponse, UserSettingsUpdate
from backend.seed_data import seed_database

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("", response_model=UserSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=UserSettingsResponse)
def update_settings(update_in: UserSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
    
    for key, val in update_in.model_dump(exclude_unset=True).items():
        setattr(settings, key, val)
    
    db.commit()
    db.refresh(settings)
    return settings

@router.post("/reset-capital")
def reset_virtual_capital(
    reset_amount: float = 1000000.0,
    clear_open_positions: bool = True,
    db: Session = Depends(get_db)
):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)

    settings.starting_virtual_capital = reset_amount
    settings.current_cash_balance = reset_amount

    if clear_open_positions:
        db.query(PaperPosition).delete()

    db.commit()
    db.refresh(settings)
    return {
        "status": "success",
        "message": f"Virtual capital reset to {settings.currency} {reset_amount:,.2f}",
        "new_balance": settings.current_cash_balance
    }

@router.post("/reset-database")
def reset_database_to_seeds(db: Session = Depends(get_db)):
    """Wipes and re-seeds database with pristine reference content."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(db)
    return {"status": "success", "message": "Database reset and re-seeded with initial curriculum."}
