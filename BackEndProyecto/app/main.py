"""Entry point for the FastAPI application."""
from fastapi import FastAPI

from app.core.config import setup_cors
from app.routers.research_router import router as research_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(title="Generador de Investigación")
    setup_cors(app)
    app.include_router(research_router)
    return app


app = create_app()


# The application can be started with:
# uvicorn app.main:app --reload
