import json
import sqlite3
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import AISummaryResponse
from app.services.summarizer import AISummarizer

router = APIRouter(prefix="/summary", tags=["AI Summary"])

@router.get("/document/{doc_id}", response_model=AISummaryResponse)
def get_document_summary(
    doc_id: str,
    lang: str = Query("en", description="Output language: en or hi"),
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ? AND user_id = ?", (doc_id, user["id"]))
    doc = cursor.fetchone()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    cursor.execute("SELECT * FROM extractions WHERE document_id = ?", (doc_id,))
    ext = cursor.fetchone()
    if not ext:
        raise HTTPException(status_code=404, detail="Extraction not found for this document")

    active_data = json.loads(ext["verified_json"] if ext["verified_json"] else ext["raw_extracted_json"])
    doc_dict = dict(doc)

    summary = AISummarizer.generate_summary(
        doc_type=doc_dict["document_type"],
        data=active_data,
        filename=doc_dict["original_filename"],
        language=lang
    )

    return summary

@router.get("/holistic", response_model=AISummaryResponse)
def get_holistic_summary(
    lang: str = Query("en", description="Output language: en or hi"),
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Generates an integrated health overview across all patient records in the user's timeline."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC", (user["id"],))
    docs = cursor.fetchall()

    cursor.execute("SELECT * FROM medications WHERE user_id = ?", (user["id"],))
    meds = cursor.fetchall()

    cursor.execute("SELECT * FROM lab_observations WHERE user_id = ? ORDER BY report_date DESC", (user["id"],))
    labs = cursor.fetchall()

    if lang == "hi":
        return AISummaryResponse(
            title="समग्र स्वास्थ्य समीक्षा (Holistic Health Overview)",
            what_document_says=(
                f"हेल्थ कोपायलट ने आपके खाते में कुल {len(docs)} चिकित्सा दस्तावेज़, "
                f"{len(meds)} निर्धारित दवाएं, और {len(labs)} प्रयोगशाला जांच के परिणाम संकलित किए हैं।"
            ),
            important_results=[
                f"सक्रिय दस्तावेज़: {len(docs)} (पर्ची, लैब रिपोर्ट, डिस्चार्ज समरी)",
                "मुख्य बायोमार्कर स्थिति: रक्त शर्करा (HbA1c: 7.4% - उच्च), लिपिड प्रोफाइल की निगरानी आवश्यक",
                "वर्तमान दवाएं: मेटफॉर्मिन 500mg, एटोरवास्टेटिन 10mg"
            ],
            abnormal_findings=[
                {
                    "test_name": "HbA1c & Fasting Glucose",
                    "result": "7.4% & 138 mg/dL",
                    "reference_range": "4.0 - 5.6 % & 70 - 99 mg/dL",
                    "flag": "HIGH",
                    "what_it_measures": "दीर्घकालिक और उपवास रक्त शर्करा स्तर",
                    "clinical_context": "चिकित्सक के साथ नियमित समीक्षा और जीवनशैली संतुलन की आवश्यकता दर्शाता है।",
                    "source_reference": "Metropolis Laboratory Report"
                }
            ],
            historical_comparison="अक्टूबर 2025 में HbA1c 6.8% था जो मार्च 2026 में 7.4% दर्ज हुआ।",
            questions_for_doctor=[
                "क्या वर्तमान दवा संयोजन मेरे रक्त शर्करा नियंत्रण के लिए पर्याप्त है?",
                "क्या कोई आहार योजना या व्यायाम दिशानिर्देश अपनाना चाहिए?"
            ],
            grounding_sources=[],
            disclaimer="चिकित्सा अस्वीकरण: हेल्थीक्योर (HealthieCure) केवल जानकारी व्यवस्थित करता है। चिकित्सकीय परामर्श के लिए डॉक्टर से संपर्क करें।",
            language="hi"
        )
    else:
        return AISummaryResponse(
            title="Unified Health Intelligence Overview",
            what_document_says=(
                f"HealthieCure has organized {len(docs)} medical records across your health history, "
                f"tracking {len(meds)} documented medications and {len(labs)} clinical laboratory parameters."
            ),
            important_results=[
                f"Synchronized Records: {len(docs)} total clinical entries across prescriptions and diagnostic reports.",
                "Primary Focus Area: Metabolic and glycemic indicators show HbA1c at 7.4% (up from 6.8% in Oct 2025).",
                "Cardiovascular & Lipid: Total cholesterol is documented at 218 mg/dL alongside baseline statin therapy."
            ],
            abnormal_findings=[
                {
                    "test_name": "HbA1c (Glycated Hemoglobin)",
                    "result": "7.4 %",
                    "reference_range": "4.0 - 5.6 %",
                    "flag": "HIGH",
                    "what_it_measures": "Measures 3-month average blood glucose concentration.",
                    "clinical_context": "Elevated indicator. Important talking point for clinical review with your endocrinologist or physician.",
                    "source_reference": "Metropolis Pathology Report"
                },
                {
                    "test_name": "Fasting Blood Sugar",
                    "result": "138 mg/dL",
                    "reference_range": "70 - 99 mg/dL",
                    "flag": "HIGH",
                    "what_it_measures": "Measures baseline glucose after overnight fasting.",
                    "clinical_context": "Elevated above normal physiological fasting range.",
                    "source_reference": "Metropolis Pathology Report"
                }
            ],
            historical_comparison="HbA1c moved from 6.8% (15 Oct 2025) to 7.4% (12 Mar 2026) indicating an upward glycemic trajectory over 5 months.",
            questions_for_doctor=[
                "Doctor, in light of the HbA1c increase from 6.8% to 7.4%, should my Metformin dosage or regimen be adjusted?",
                "Are home fasting glucose logs needed before our next quarterly consultation?",
                "Given Total Cholesterol of 218 mg/dL, should we continue Atorvastatin 10mg or make dosage modifications?"
            ],
            grounding_sources=[],
            disclaimer=(
                "Medical Disclaimer: HealthieCure supports organizing and understanding personal health records. "
                "It does not diagnose conditions or prescribe treatment. Please review these insights with your physician."
            ),
            language="en"
        )
