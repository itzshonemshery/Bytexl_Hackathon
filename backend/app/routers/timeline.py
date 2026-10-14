import json
import sqlite3
from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import TimelineItem

router = APIRouter(prefix="/timeline", tags=["Health Timeline"])

@router.get("", response_model=List[TimelineItem])
def get_timeline(
    record_type: Optional[str] = Query(None, description="Filter: prescription, lab_report, discharge_summary, diagnostic_report"),
    search: Optional[str] = Query(None, description="Search term in title, facility, or summary"),
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    cursor = db.cursor()
    query = '''
    SELECT d.id as doc_id, d.original_filename, d.document_type, d.upload_date,
           e.verified_json, e.raw_extracted_json, e.is_verified, e.confidence_score
    FROM documents d
    LEFT JOIN extractions e ON d.id = e.document_id
    WHERE d.user_id = ?
    '''
    params = [user["id"]]

    if record_type and record_type != "all":
        query += " AND d.document_type = ?"
        params.append(record_type)

    query += " ORDER BY d.upload_date DESC"
    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    timeline_items = []
    for r in rows:
        data = {}
        if r["verified_json"]:
            data = json.loads(r["verified_json"])
        elif r["raw_extracted_json"]:
            data = json.loads(r["raw_extracted_json"])

        doc_type = r["document_type"]
        title = r["original_filename"].replace(".pdf", "").replace(".jpg", "").replace("_", " ")
        date_str = r["upload_date"][:10] if r["upload_date"] else "2026-03-12"
        facility = None
        metrics = []
        snippet = ""

        if doc_type == "prescription":
            facility = data.get("clinic_or_hospital", "Clinic")
            prescriber = data.get("prescriber_name", "Doctor")
            title = f"Prescription - {prescriber}"
            if data.get("prescription_date"):
                date_str = data.get("prescription_date")
            meds = [m.get("medicine_name") for m in data.get("medicines", [])]
            metrics = meds[:3]
            snippet = f"Prescribed: {', '.join(meds[:3])}"

        elif doc_type == "lab_report":
            facility = data.get("lab_name", "Clinical Laboratory")
            title = f"Pathology Report - {facility}"
            if data.get("report_date"):
                date_str = data.get("report_date")
            for obs in data.get("observations", []):
                if obs.get("is_abnormal"):
                    metrics.append(f"{obs.get('test_name')}: {obs.get('result_value')} {obs.get('unit', '')} ({obs.get('abnormal_flag')})")
                elif len(metrics) < 2:
                    metrics.append(f"{obs.get('test_name')}: {obs.get('result_value')} {obs.get('unit', '')}")
            snippet = f"Recorded {len(data.get('observations', []))} biochemical observations."

        elif doc_type == "discharge_summary":
            facility = data.get("hospital_name", "Hospital")
            diag = data.get("primary_diagnosis", "Inpatient Admission")
            title = f"Discharge Summary - {diag}"
            if data.get("discharge_date"):
                date_str = data.get("discharge_date")
            metrics = [f"Stay: {data.get('admission_date', '')} to {data.get('discharge_date', '')}", f"Diagnosis: {diag}"]
            snippet = data.get("hospital_course", "")[:120] + "..." if data.get("hospital_course") else "Inpatient hospital stay summary."

        elif doc_type == "diagnostic_report":
            facility = data.get("facility_name", "Imaging Facility")
            inv = data.get("investigation_type", "Diagnostic Radiology")
            title = f"Diagnostic Study - {inv}"
            if data.get("study_date"):
                date_str = data.get("study_date")
            metrics = [inv, data.get("impression", "Normal")[:40]]
            snippet = data.get("impression", "Imaging examination complete.")

        # Filter by search term if provided
        if search:
            s_low = search.lower()
            combined = f"{title} {facility} {snippet} {' '.join(metrics)}".lower()
            if s_low not in combined:
                continue

        timeline_items.append(TimelineItem(
            id=f"tl_{r['doc_id']}",
            date=date_str,
            record_type=doc_type,
            title=title,
            facility_or_provider=facility,
            status="Reviewed & Verified" if r["is_verified"] else "Extracted",
            summary_snippet=snippet,
            document_id=r["doc_id"],
            original_filename=r["original_filename"],
            key_metrics=metrics
        ))

    # Sort descending by date
    timeline_items.sort(key=lambda x: x.date, reverse=True)
    return timeline_items
