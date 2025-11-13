"""Pydantic models for research projects."""
from pydantic import BaseModel


class ResearchProject(BaseModel):
    """Model representing a research project submission."""

    problema: str
    obj_general: str
    obj_especificos: str
    marco: str
    metodologia: str
    resultados: str
    conclusiones: str
    referencias: str
