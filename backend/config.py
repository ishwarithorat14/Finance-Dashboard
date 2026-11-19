import os
from pathlib import Path
from dotenv import load_dotenv

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env
load_dotenv(BASE_DIR / ".env")

# Database Configuration (SQLite by default, modular for PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'finance_hq.db'}")

# External API Configuration (Modular service layer)
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

# Default Paper Trading Capital
DEFAULT_VIRTUAL_CAPITAL = float(os.getenv("DEFAULT_VIRTUAL_CAPITAL", "1000000.0"))  # ₹10,00,000 INR default

# Application Mode
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
