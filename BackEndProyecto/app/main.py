"""Entry point for the FastAPI application."""

from fastapi import FastAPI

from .core.config import setup_cors
from .routers.research_router import router as research_router


app = FastAPI(title="Proyecto Investigacion API")

setup_cors(app)
app.include_router(research_router)
