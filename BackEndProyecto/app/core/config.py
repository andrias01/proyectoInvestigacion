"""Application configuration utilities."""
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


ALLOWED_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:3000",
    "*",
]


def setup_cors(app: FastAPI) -> None:
    """Configure CORS middleware for the FastAPI application."""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
