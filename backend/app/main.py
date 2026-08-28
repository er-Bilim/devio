from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.limiter import limiter
from app.db import engine
from app.routers import auth, roadmaps, stages, stats, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(title="devio API")
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return _rate_limit_exceeded_handler(request, exc)


app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roadmaps.router)
app.include_router(stats.router)
app.include_router(stages.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
