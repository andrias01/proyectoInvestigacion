"""API routes for research project PDF generation."""
from pathlib import Path
from tempfile import gettempdir
from typing import Dict

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from ..models.research_model import ResearchProject
from ..services.pdf_service import generate_pdf


router = APIRouter(prefix="/api/research", tags=["Research"])


@router.post("/generate")
def generate_research_pdf(project: ResearchProject) -> Dict[str, str]:
    """Generate a PDF for the provided research project details."""
    pdf_path = generate_pdf(project)
    file_name = Path(pdf_path).name

    return {
        "message": "PDF generado exitosamente",
        "file_path": f"/api/research/download/{file_name}",
    }


@router.get("/download/{file_name}")
def download_research_pdf(file_name: str) -> FileResponse:
    """Return the generated PDF file to the client."""
    file_path = Path(gettempdir()) / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    return FileResponse(
        path=str(file_path.resolve()),
        filename=file_name,
        media_type="application/pdf",
    )
