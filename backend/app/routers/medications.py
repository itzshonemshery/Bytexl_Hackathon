import sqlite3
from fastapi import APIRouter, Depends
from typing import List, Dict, Any

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import MedicationResponse

router = APIRouter(prefix="/medications", tags=["Medications"])

@router.get("", response_model=Dict[str, Any])
def get_medications(user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
    SELECT m.*, d.original_filename
    FROM medications m
    LEFT JOIN documents d ON m.document_id = d.id
    WHERE m.user_id = ?
    ORDER BY m.prescription_date DESC
    ''', (user["id"],))
    rows = cursor.fetchall()

    current_meds = []
    historical_meds = []
    unknown_meds = []

    for r in rows:
        item = MedicationResponse(
            id=r["id"],
            document_id=r["document_id"],
            document_name=r["original_filename"],
            medicine_name=r["medicine_name"],
            strength=r["strength"],
            dosage=r["dosage"],
            frequency=r["frequency"],
            route=r["route"] or "Oral",
            duration=r["duration"],
            instructions=r["instructions"],
            prescriber=r["prescriber"],
            prescription_date=r["prescription_date"],
            status=r["status"] or "unknown",
            is_verified=bool(r["is_verified"])
        )

        status_val = (r["status"] or "unknown").lower()
        if status_val == "current":
            current_meds.append(item)
        elif status_val == "historical":
            historical_meds.append(item)
        else:
            unknown_meds.append(item)

    doctor_questions = [
        "Doctor, are there any potential drug-drug interactions between my regular diabetes medication and newly prescribed drugs?",
        "Should any of my medications be taken specifically with meals or on an empty stomach?",
        "For medications marked as historical/completed (such as post-discharge antibiotics), do I need any blood test follow-up?"
    ]

    return {
        "current": current_meds,
        "historical": historical_meds,
        "unknown": unknown_meds,
        "total_count": len(rows),
        "doctor_preparation_questions": doctor_questions,
        "safety_notice": (
            "Safety Notice: Healthiecure displays only medications documented in your uploaded medical records. "
            "Never start, stop, or modify your medication dosage without explicit guidance from a qualified doctor."
        )
    }
