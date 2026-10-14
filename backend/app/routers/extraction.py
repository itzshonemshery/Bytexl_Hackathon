import json
import uuid
import sqlite3
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import ExtractionResponse, ExtractionReviewRequest

router = APIRouter(prefix="/extraction", tags=["Extraction & Review"])

@router.get("/{doc_id}")
def get_extraction(
    doc_id: str,
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
        raise HTTPException(status_code=404, detail="Extraction not yet available")

    ext_dict = dict(ext)
    active_data = json.loads(ext_dict["verified_json"]) if ext_dict["verified_json"] else json.loads(ext_dict["raw_extracted_json"])
    
    return {
        "id": ext_dict["id"],
        "document_id": doc_id,
        "document_type": ext_dict["document_type"],
        "confidence_score": ext_dict["confidence_score"],
        "is_verified": bool(ext_dict["is_verified"]),
        "verified_at": ext_dict["verified_at"],
        "data": active_data,
        "raw_extracted_data": json.loads(ext_dict["raw_extracted_json"]),
        "field_confidences": json.loads(ext_dict["field_confidences_json"] or "{}"),
        "ocr_snippets": json.loads(ext_dict["ocr_snippets_json"] or "{}"),
        "raw_text_preview": doc["raw_text"] or "",
        "thumbnail_path": doc["thumbnail_path"]
    }

@router.post("/{doc_id}/review")
def review_and_confirm_extraction(
    doc_id: str,
    review_req: ExtractionReviewRequest,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Saves user-confirmed or corrected values while preserving original raw extraction for auditability."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ? AND user_id = ?", (doc_id, user["id"]))
    doc = cursor.fetchone()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    cursor.execute("SELECT * FROM extractions WHERE document_id = ?", (doc_id,))
    ext = cursor.fetchone()
    if not ext:
        raise HTTPException(status_code=404, detail="Extraction not found")

    verified_json_str = json.dumps(review_req.data)
    now_str = datetime.utcnow().isoformat()

    cursor.execute('''
    UPDATE extractions 
    SET verified_json = ?, is_verified = 1, verified_at = ?, notes = ?, updated_at = ?
    WHERE document_id = ?
    ''', (verified_json_str, now_str, review_req.notes or "", now_str, doc_id))

    cursor.execute("UPDATE documents SET status = 'reviewed' WHERE id = ?", (doc_id,))

    # Synchronize structured records to specialized tables
    doc_type = doc["document_type"]
    verified_data = review_req.data

    if doc_type == "prescription":
        # Clear previous meds for this doc to avoid duplication
        cursor.execute("DELETE FROM medications WHERE document_id = ?", (doc_id,))
        for med in verified_data.get("medicines", []):
            med_id = f"med_{uuid.uuid4().hex[:10]}"
            cursor.execute('''
            INSERT INTO medications (
                id, user_id, document_id, medicine_name, strength, dosage,
                frequency, route, duration, instructions, prescriber, prescription_date,
                status, is_verified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ''', (
                med_id, user["id"], doc_id, med.get("medicine_name"),
                med.get("strength"), med.get("dosage"), med.get("frequency"),
                med.get("route", "Oral"), med.get("duration"), med.get("instructions"),
                verified_data.get("prescriber_name"), verified_data.get("prescription_date"),
                med.get("status", "current")
            ))

    elif doc_type == "lab_report":
        cursor.execute("DELETE FROM lab_observations WHERE document_id = ?", (doc_id,))
        for obs in verified_data.get("observations", []):
            obs_id = f"obs_{uuid.uuid4().hex[:10]}"
            cursor.execute('''
            INSERT INTO lab_observations (
                id, user_id, document_id, test_name, result_value, result_text,
                unit, reference_range_raw, reference_range_low, reference_range_high,
                is_abnormal, abnormal_flag, interpretation, report_date, lab_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                obs_id, user["id"], doc_id, obs.get("test_name"),
                obs.get("result_value"), obs.get("result_text"), obs.get("unit"),
                obs.get("reference_range_raw"), obs.get("reference_range_low"),
                obs.get("reference_range_high"), 1 if obs.get("is_abnormal") else 0,
                obs.get("abnormal_flag"), obs.get("interpretation"),
                verified_data.get("report_date"), verified_data.get("lab_name")
            ))

    elif doc_type == "discharge_summary":
        # Also store discharge medications if present
        for med in verified_data.get("discharge_medications", []):
            med_id = f"med_{uuid.uuid4().hex[:10]}"
            cursor.execute('''
            INSERT INTO medications (
                id, user_id, document_id, medicine_name, strength, dosage,
                frequency, route, duration, instructions, prescriber, prescription_date,
                status, is_verified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'historical', 1)
            ''', (
                med_id, user["id"], doc_id, med.get("medicine_name"),
                med.get("strength"), med.get("dosage"), med.get("frequency"),
                med.get("route", "Oral"), med.get("duration"), med.get("instructions"),
                verified_data.get("hospital_name"), verified_data.get("discharge_date")
            ))

    # Log audit event
    audit_id = f"aud_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO audit_logs (id, user_id, action_type, resource_type, resource_id, details)
    VALUES (?, ?, 'HUMAN_VERIFY', 'EXTRACTION', ?, ?)
    ''', (audit_id, user["id"], doc_id, f"Patient reviewed and confirmed extracted fields for '{doc['original_filename']}'"))

    db.commit()

    return {"message": "Extraction confirmed and synchronized successfully", "status": "reviewed"}
