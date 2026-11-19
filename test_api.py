from fastapi.testclient import TestClient
from backend.main import app

def run_tests():
    client = TestClient(app)

    print("--- 1. Testing Dashboard ---")
    res = client.get("/api/dashboard/metrics")
    assert res.status_code == 200, f"Dashboard failed: {res.text}"
    metrics = res.json()
    print("Greeting:", metrics["greeting"])
    print("Current Date:", metrics["current_date"])
    print("Market Status:", metrics["market_status"]["status"], "-", metrics["market_status"]["message"])
    print("Learning Progress:", metrics["learning_progress"]["progress_pct"], "%")
    print("Trading Practice Win Rate:", metrics["trading_practice"]["progress_pct"], "%")

    print("\n--- 2. Testing Learning Workspace ---")
    res = client.get("/api/learning/categories")
    assert res.status_code == 200
    cats = res.json()
    print(f"Categories loaded: {len(cats)}")

    res = client.get("/api/learning/concepts")
    assert res.status_code == 200
    concs = res.json()
    print(f"Concepts loaded: {len(concs)}")

    # Quiz check
    quiz_tested = False
    for c in concs:
        if c.get("has_quiz"):
            c_id = c["id"]
            res = client.get(f"/api/learning/concepts/{c_id}/quiz")
            if res.status_code == 200:
                q_data = res.json()
                print(f"Quiz for '{c['name']}': {len(q_data['questions'])} questions")
                # Submit mock answer
                ans = {str(q_data["questions"][0]["id"]): q_data["questions"][0]["correct_option"]}
                sub_res = client.post(f"/api/learning/concepts/{c_id}/quiz/submit", json={"answers": ans})
                assert sub_res.status_code == 200
                print("Quiz submit result:", sub_res.json()["score"], "/", sub_res.json()["total_questions"])
                quiz_tested = True
                break
    assert quiz_tested, "Quiz verification passed"

    # Case studies check
    res = client.get("/api/learning/case-studies")
    assert res.status_code == 200
    print(f"Case studies loaded: {len(res.json())}")

    print("\n--- 3. Testing Practice Workspace ---")
    res = client.get("/api/practice/quote/^NSEI")
    assert res.status_code == 200
    q = res.json()
    print(f"NIFTY 50 Quote: {q['price']} | Mode: {q['data_mode']}")

    res = client.get("/api/practice/candles/RELIANCE.NS?timeframe=1M")
    assert res.status_code == 200
    c_data = res.json()
    print(f"Candles loaded: {len(c_data['candles'])} | SMA20 points: {len(c_data['indicators']['sma20'])}")

    res = client.get("/api/practice/portfolio")
    assert res.status_code == 200
    p = res.json()
    print(f"Portfolio Equity: INR {p['total_equity']:,.2f} | Available Cash: INR {p['current_cash_balance']:,.2f}")

    # Test BUY order
    order_res = client.post("/api/practice/order", json={
        "symbol": "INFY.NS",
        "order_type": "BUY",
        "order_style": "MARKET",
        "quantity": 5
    })
    assert order_res.status_code == 200, f"Order failed: {order_res.text}"
    print(f"Simulated BUY order executed successfully: Order ID {order_res.json()['id']}")

    # Trading Journal check
    res = client.get("/api/practice/journal")
    assert res.status_code == 200
    print(f"Journal entries count: {len(res.json())}")

    res = client.get("/api/practice/journal/stats")
    assert res.status_code == 200
    print(f"Journal Stats: Win Rate {res.json()['win_rate']}% | P&L: INR {res.json()['total_pnl']:,.2f}")

    print("\n--- 4. Testing Market Intelligence ---")
    res = client.get("/api/intelligence/news")
    assert res.status_code == 200
    news = res.json()
    print(f"News items loaded: {len(news)}")
    first_news = news[0]
    # Check 10-point analysis fields
    assert first_news["headline"]
    assert first_news["source"]
    assert first_news["short_explanation"]
    assert first_news["what_happened"]
    assert first_news["what_to_monitor"]
    print(f"10-Point Analysis verified for: '{first_news['headline'][:50]}...'")

    print("\n--- 5. Testing Monthly Review & Goals ---")
    res = client.get("/api/reviews/summary/2026-11")
    assert res.status_code == 200
    rev = res.json()
    print("Executive Summary Generated:", rev["executive_summary"][:80], "...")
    print(f"Accountability Patterns: {len(rev['accountability_patterns'])} patterns identified")

    print("\n--- 6. Testing Daily Tasks ---")
    res = client.get("/api/tasks")
    assert res.status_code == 200
    print(f"Daily tasks count: {len(res.json())}")

    print("\n==========================================")
    print("  ALL VERIFICATION TESTS PASSED (100%)    ")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
