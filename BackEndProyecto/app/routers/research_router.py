"""API routes for research project PDF generation."""
from pathlib import Path
from typing import Dict

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.models.research_model import ResearchProject
from app.services.pdf_service import generate_pdf


router = APIRouter(prefix="/api/research", tags=["Research"])

# In-memory cache mapping filenames to absolute file paths.
_pdf_cache: Dict[str, str] = {}


@router.post("/generate")
def generate_research_pdf(project: ResearchProject) -> Dict[str, str]:
    """Generate a PDF for the provided research project details."""
    pdf_path = generate_pdf(project)
    file_name = Path(pdf_path).name
    _pdf_cache[file_name] = pdf_path

    return {
        "message": "PDF generado exitosamente",
        "file_path": f"/api/research/download/{file_name}",
    }


@router.get("/download/{file_name}")
def download_research_pdf(file_name: str) -> FileResponse:
    """Return the generated PDF file to the client."""
    pdf_path = _pdf_cache.get(file_name)
    if not pdf_path:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    path_obj = Path(pdf_path)
    if not path_obj.exists():
        _pdf_cache.pop(file_name, None)
        raise HTTPException(status_code=410, detail="El archivo ya no está disponible")

    return FileResponse(
        path=str(path_obj),
        filename=file_name,
        media_type="application/pdf",
    )
