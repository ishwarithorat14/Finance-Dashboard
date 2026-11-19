from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import (
    UserSettings, WatchlistItem, PaperOrder, PaperPosition, TradingJournalEntry
)
from backend.schemas import (
    PaperOrderCreate, PaperOrderResponse, PaperPositionResponse,
    TradingJournalCreate, TradingJournalResponse
)
from backend.services.market_service import MarketService

router = APIRouter(prefix="/api/practice", tags=["Practice"])

# --- Market Workspace & Data ---
@router.get("/search")
def search_instruments(q: str = Query("", description="Symbol or name to search")):
    return MarketService.search_instruments(q)

@router.get("/quote/{symbol}")
def get_quote(symbol: str):
    return MarketService.get_quote(symbol)

@router.get("/candles/{symbol}")
def get_candlesticks(symbol: str, timeframe: str = "1M"):
    return MarketService.get_candlesticks(symbol, timeframe)

# --- Watchlist ---
@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db)):
    items = db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()
    results = []
    for item in items:
        quote = MarketService.get_quote(item.symbol)
        results.append({
            "id": item.id,
            "symbol": item.symbol,
            "name": item.name,
            "exchange": item.exchange,
            "sector": item.sector,
            "notes": item.notes,
            "price": quote["price"],
            "change": quote["change"],
            "change_pct": quote["change_pct"],
            "data_mode": quote["data_mode"]
        })
    return results

@router.post("/watchlist")
def add_to_watchlist(symbol: str, db: Session = Depends(get_db)):
    clean_sym = symbol.strip().upper()
    existing = db.query(WatchlistItem).filter(WatchlistItem.symbol == clean_sym).first()
    if existing:
        return {"status": "exists", "item_id": existing.id}
    
    quote = MarketService.get_quote(clean_sym)
    item = WatchlistItem(
        symbol=clean_sym,
        name=quote["name"],
        exchange="NSE" if ".NS" in clean_sym or clean_sym.startswith("^") else "NASDAQ",
        notes=""
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"status": "success", "item_id": item.id}

@router.delete("/watchlist/{symbol}")
def remove_from_watchlist(symbol: str, db: Session = Depends(get_db)):
    clean_sym = symbol.strip().upper()
    item = db.query(WatchlistItem).filter(WatchlistItem.symbol == clean_sym).first()
    if not item:
        raise HTTPException(status_code=404, detail="Symbol not found in watchlist")
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Removed from watchlist"}

# --- Paper Trading Simulator ---
@router.get("/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    positions = db.query(PaperPosition).filter(PaperPosition.status == "OPEN").all()
    
    total_positions_val = 0.0
    total_unrealized_pnl = 0.0
    detailed_positions = []

    for pos in positions:
        quote = MarketService.get_quote(pos.symbol)
        curr_price = quote["price"]
        pos.current_price = curr_price
        
        pos_val = pos.quantity * curr_price
        total_positions_val += pos_val
        
        u_pnl = round((curr_price - pos.average_entry_price) * pos.quantity, 2)
        u_pnl_pct = round(((curr_price - pos.average_entry_price) / pos.average_entry_price) * 100, 2)
        pos.unrealized_pnl = u_pnl
        pos.unrealized_pnl_pct = u_pnl_pct
        total_unrealized_pnl += u_pnl

        detailed_positions.append({
            "id": pos.id,
            "symbol": pos.symbol,
            "quantity": pos.quantity,
            "average_entry_price": pos.average_entry_price,
            "current_price": curr_price,
            "unrealized_pnl": u_pnl,
            "unrealized_pnl_pct": u_pnl_pct,
            "total_value": round(pos_val, 2),
            "data_mode": quote["data_mode"]
        })
    
    db.commit()

    total_equity = round(settings.current_cash_balance + total_positions_val, 2)
    starting_cap = settings.starting_virtual_capital
    total_return_pct = round(((total_equity - starting_cap) / starting_cap) * 100, 2) if starting_cap > 0 else 0.0

    return {
        "starting_virtual_capital": starting_cap,
        "current_cash_balance": round(settings.current_cash_balance, 2),
        "positions_value": round(total_positions_val, 2),
        "total_equity": total_equity,
        "total_unrealized_pnl": round(total_unrealized_pnl, 2),
        "total_return_pct": total_return_pct,
        "currency": settings.currency,
        "open_positions": detailed_positions
    }

@router.post("/order", response_model=PaperOrderResponse)
def execute_order(order_in: PaperOrderCreate, db: Session = Depends(get_db)):
    settings = db.query(UserSettings).first()
    if not settings:
        settings = UserSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)

    clean_sym = order_in.symbol.strip().upper()
    quote = MarketService.get_quote(clean_sym)
    exec_price = order_in.price if order_in.price and order_in.price > 0 else quote["price"]
    total_cost = round(exec_price * order_in.quantity, 2)

    if order_in.order_type == "BUY":
        if settings.current_cash_balance < total_cost:
            raise HTTPException(status_code=400, detail=f"Insufficient virtual cash balance. Required: {total_cost}, Available: {settings.current_cash_balance:.2f}")

        settings.current_cash_balance = round(settings.current_cash_balance - total_cost, 2)
        
        pos = db.query(PaperPosition).filter(PaperPosition.symbol == clean_sym, PaperPosition.status == "OPEN").first()
        if pos:
            new_qty = pos.quantity + order_in.quantity
            pos.average_entry_price = round(((pos.average_entry_price * pos.quantity) + total_cost) / new_qty, 2)
            pos.quantity = new_qty
            pos.current_price = exec_price
        else:
            pos = PaperPosition(
                symbol=clean_sym,
                quantity=order_in.quantity,
                average_entry_price=exec_price,
                current_price=exec_price,
                unrealized_pnl=0.0,
                unrealized_pnl_pct=0.0,
                status="OPEN"
            )
            db.add(pos)

    elif order_in.order_type == "SELL":
        pos = db.query(PaperPosition).filter(PaperPosition.symbol == clean_sym, PaperPosition.status == "OPEN").first()
        if not pos or pos.quantity < order_in.quantity:
            avail = pos.quantity if pos else 0
            raise HTTPException(status_code=400, detail=f"Insufficient open position to sell. Available: {avail}, Requested: {order_in.quantity}")

        settings.current_cash_balance = round(settings.current_cash_balance + total_cost, 2)
        realized_pnl = round((exec_price - pos.average_entry_price) * order_in.quantity, 2)
        realized_pnl_pct = round(((exec_price - pos.average_entry_price) / pos.average_entry_price) * 100, 2)

        # Log auto journal entry for the closed trade
        journal_entry = TradingJournalEntry(
            instrument=clean_sym,
            entry_date=pos.opened_at,
            entry_price=pos.average_entry_price,
            exit_date=datetime.now(timezone.utc),
            exit_price=exec_price,
            quantity=order_in.quantity,
            strategy_used="Simulated Market Order",
            reason_entry="Simulated practice order entry.",
            reason_exit="Simulated exit at market.",
            result="WIN" if realized_pnl > 0 else ("LOSS" if realized_pnl < 0 else "BREAKEVEN"),
            pnl_amount=realized_pnl,
            pnl_percentage=realized_pnl_pct,
            lessons_learned="Trade closed through practice interface."
        )
        db.add(journal_entry)

        if pos.quantity == order_in.quantity:
            pos.status = "CLOSED"
            db.delete(pos)
        else:
            pos.quantity -= order_in.quantity

    # Record order history
    order = PaperOrder(
        symbol=clean_sym,
        order_type=order_in.order_type,
        order_style=order_in.order_style,
        quantity=order_in.quantity,
        price=exec_price,
        total_amount=total_cost,
        status="EXECUTED"
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order

@router.get("/orders", response_model=List[PaperOrderResponse])
def get_orders_history(db: Session = Depends(get_db)):
    return db.query(PaperOrder).order_by(PaperOrder.executed_at.desc()).limit(50).all()

# --- Trading Journal ---
@router.get("/journal", response_model=List[TradingJournalResponse])
def get_journal_entries(
    result: Optional[str] = None,
    strategy: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TradingJournalEntry)
    if result and result != "All":
        query = query.filter(TradingJournalEntry.result == result)
    if strategy and strategy != "All":
        query = query.filter(TradingJournalEntry.strategy_used.ilike(f"%{strategy}%"))
    
    return query.order_by(TradingJournalEntry.entry_date.desc()).all()

@router.post("/journal", response_model=TradingJournalResponse)
def create_journal_entry(entry_in: TradingJournalCreate, db: Session = Depends(get_db)):
    entry_dict = entry_in.model_dump()
    if not entry_dict.get("entry_date"):
        entry_dict["entry_date"] = datetime.now(timezone.utc)
    
    # Calculate P&L if exit price is provided
    if entry_dict.get("exit_price") and entry_dict.get("entry_price"):
        pnl = round((entry_dict["exit_price"] - entry_dict["entry_price"]) * entry_dict.get("quantity", 1), 2)
        pnl_pct = round(((entry_dict["exit_price"] - entry_dict["entry_price"]) / entry_dict["entry_price"]) * 100, 2)
        entry_dict["pnl_amount"] = pnl
        entry_dict["pnl_percentage"] = pnl_pct
        if not entry_dict.get("result"):
            entry_dict["result"] = "WIN" if pnl > 0 else ("LOSS" if pnl < 0 else "BREAKEVEN")
    else:
        entry_dict["pnl_amount"] = 0.0
        entry_dict["pnl_percentage"] = 0.0
        if not entry_dict.get("result"):
            entry_dict["result"] = "OPEN"

    entry = TradingJournalEntry(**entry_dict)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/journal/stats")
def get_journal_statistics(db: Session = Depends(get_db)):
    entries = db.query(TradingJournalEntry).all()
    total_trades = len(entries)
    closed_trades = [e for e in entries if e.result in ["WIN", "LOSS", "BREAKEVEN"]]
    
    wins = [e for e in closed_trades if e.result == "WIN"]
    losses = [e for e in closed_trades if e.result == "LOSS"]
    
    win_rate = round((len(wins) / len(closed_trades) * 100), 1) if closed_trades else 0.0
    total_pnl = round(sum(e.pnl_amount for e in closed_trades), 2)
    
    gross_profit = sum(e.pnl_amount for e in wins)
    gross_loss = abs(sum(e.pnl_amount for e in losses))
    profit_factor = round(gross_profit / gross_loss, 2) if gross_loss > 0 else (gross_profit if gross_profit > 0 else 0.0)

    # Strategy breakdown
    strategies = {}
    for e in closed_trades:
        st = e.strategy_used or "Discretionary"
        if st not in strategies:
            strategies[st] = {"count": 0, "wins": 0, "pnl": 0.0}
        strategies[st]["count"] += 1
        if e.result == "WIN":
            strategies[st]["wins"] += 1
        strategies[st]["pnl"] = round(strategies[st]["pnl"] + e.pnl_amount, 2)

    return {
        "total_trades": total_trades,
        "closed_trades": len(closed_trades),
        "wins": len(wins),
        "losses": len(losses),
        "win_rate": win_rate,
        "total_pnl": total_pnl,
        "profit_factor": profit_factor,
        "strategies": strategies
    }
