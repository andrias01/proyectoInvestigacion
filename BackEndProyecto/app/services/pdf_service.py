"""Service for generating research project PDFs."""
from datetime import datetime
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.models.research_model import ResearchProject


TMP_DIR = Path("/tmp")


def _build_document_elements(project: ResearchProject) -> list:
    """Create the list of ReportLab flowables for the PDF document."""
    styles = getSampleStyleSheet()
    title_style = styles["Heading1"].clone("TitleStyle")
    title_style.alignment = 1  # Center align title

    section_title_style = ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading2"],
        spaceBefore=12,
        spaceAfter=6,
    )
    body_style = styles["BodyText"]
    body_style.leading = 14

    elements = [Paragraph("Proyecto de Investigación", title_style), Spacer(1, 0.25 * inch)]

    sections = [
        ("Planteamiento del Problema", project.problema),
        ("Objetivo General", project.obj_general),
        ("Objetivos Específicos", project.obj_especificos),
        ("Marco Teórico", project.marco),
        ("Metodología", project.metodologia),
        ("Resultados Esperados", project.resultados),
        ("Conclusiones", project.conclusiones),
        ("Referencias", project.referencias),
    ]

    for title, content in sections:
        elements.append(Paragraph(title, section_title_style))
        elements.append(Paragraph(content.replace("\n", "<br/>"), body_style))
        elements.append(Spacer(1, 0.2 * inch))

    generated_at = datetime.now().strftime("%d/%m/%Y %H:%M")
    footer_style = ParagraphStyle(
        name="Footer",
        parent=styles["Normal"],
        fontSize=9,
        alignment=2,
        textColor="#666666",
    )
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(f"Generado automáticamente el {generated_at}.", footer_style))

    return elements


def generate_pdf(project: ResearchProject) -> str:
    """Generate a PDF file for the given project and return its absolute path."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = f"proyecto_investigacion_{timestamp}.pdf"
    file_path = TMP_DIR / file_name

    document = SimpleDocTemplate(str(file_path), pagesize=LETTER, leftMargin=inch, rightMargin=inch)
    elements = _build_document_elements(project)
    document.build(elements)

    return str(file_path.resolve())
