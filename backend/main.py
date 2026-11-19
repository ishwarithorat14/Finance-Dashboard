import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.database import engine, Base, SessionLocal
from backend.seed_data import seed_database
from backend.routers import (
    dashboard, learning, practice, intelligence, reviews, tasks, settings
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database schema exists and seed initial dataset
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="FINANCE HQ - Personal Finance & Market Intelligence Workspace",
    version="1.0.0",
    description="Sophisticated personal financial research terminal and learning intelligence dashboard.",
    lifespan=lifespan
)

# CORS configuration for development with Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard.router)
app.include_router(learning.router)
app.include_router(practice.router)
app.include_router(intelligence.router)
app.include_router(reviews.router)
app.include_router(tasks.router)
app.include_router(settings.router)

# Mount frontend production build if available
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        file_path = frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def read_root():
        return {
            "app": "FINANCE HQ API",
            "status": "online",
            "documentation": "/docs",
            "frontend": "Run 'npm run dev' inside the frontend directory"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
