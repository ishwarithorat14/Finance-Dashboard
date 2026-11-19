from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import MarketNewsItem
from backend.schemas import MarketNewsResponse, MarketNewsObservationUpdate

router = APIRouter(prefix="/api/intelligence", tags=["Market Intelligence"])

@router.get("/news", response_model=List[MarketNewsResponse])
def get_market_news(
    category: Optional[str] = None,
    sector: Optional[str] = None,
    bookmarked_only: Optional[bool] = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(MarketNewsItem)
    if category and category != "All":
        query = query.filter(MarketNewsItem.category == category)
    if sector and sector != "All":
        query = query.filter(MarketNewsItem.sector == sector)
    if bookmarked_only:
        query = query.filter(MarketNewsItem.is_bookmarked == True)
    if search:
        query = query.filter(
            MarketNewsItem.headline.ilike(f"%{search}%") |
            MarketNewsItem.short_explanation.ilike(f"%{search}%") |
            MarketNewsItem.companies_sectors.ilike(f"%{search}%")
        )
    
    return query.order_by(MarketNewsItem.publication_date.desc()).all()

@router.get("/news/{news_id}", response_model=MarketNewsResponse)
def get_news_detail(news_id: int, db: Session = Depends(get_db)):
    item = db.query(MarketNewsItem).filter(MarketNewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    return item

@router.put("/news/{news_id}/bookmark")
def toggle_bookmark(news_id: int, db: Session = Depends(get_db)):
    item = db.query(MarketNewsItem).filter(MarketNewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    item.is_bookmarked = not item.is_bookmarked
    db.commit()
    db.refresh(item)
    return {"status": "success", "is_bookmarked": item.is_bookmarked}

@router.put("/news/{news_id}/observations", response_model=MarketNewsResponse)
def update_news_observations(
    news_id: int,
    obs_in: MarketNewsObservationUpdate,
    db: Session = Depends(get_db)
):
    item = db.query(MarketNewsItem).filter(MarketNewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News item not found")
    
    item.personal_observations = obs_in.personal_observations
    if obs_in.is_bookmarked is not None:
        item.is_bookmarked = obs_in.is_bookmarked
    
    db.commit()
    db.refresh(item)
    return item

@router.get("/filters")
def get_intelligence_filters(db: Session = Depends(get_db)):
    categories = db.query(MarketNewsItem.category).distinct().all()
    sectors = db.query(MarketNewsItem.sector).distinct().all()
    return {
        "categories": ["All"] + [c[0] for c in categories if c[0]],
        "sectors": ["All"] + [s[0] for s in sectors if s[0]]
    }
