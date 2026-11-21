from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from database import Base, engine
from config import settings
from routers import auth_router, breaches, username, github, domain, ai

Base.metadata.create_all(bind=engine)
app = FastAPI(title="OSINTX")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

app.include_router(auth_router.router)
app.include_router(breaches.router)
app.include_router(username.router)
app.include_router(github.router)
app.include_router(domain.router)
app.include_router(ai.router)

STATIC = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=STATIC), name="static")

@app.get("/api/health")
def health():
    return {"app": "OSINTX", "status": "ok", "configured": {
        "ai": bool(settings.AI_API_KEY),
        "hibp": bool(settings.HIBP_KEY),
        "github": bool(settings.GITHUB_TOKEN),
    }}

@app.get("/")
def index():
    return FileResponse(os.path.join(STATIC, "index.html"))
