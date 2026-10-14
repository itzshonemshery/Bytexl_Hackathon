import json
import sqlite3
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.routers.auth import get_current_user
from app.services.fhir_converter import FHIRConverter

router = APIRouter(prefix="/fhir", tags=["FHIR Interoperability"])

@router.get("/bundle/{doc_id}")
def get_fhir_bundle(
    doc_id: str,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Returns compliant FHIR R4 Document Bundle for a specific medical document."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ? AND user_id = ?", (doc_id, user["id"]))
    doc = cursor.fetchone()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    cursor.execute("SELECT * FROM extractions WHERE document_id = ?", (doc_id,))
    ext = cursor.fetchone()
    if not ext:
        raise HTTPException(status_code=404, detail="Extraction not found for this document")

    doc_dict = dict(doc)
    ext_dict = dict(ext)
    data = json.loads(ext_dict["verified_json"] if ext_dict["verified_json"] else ext_dict["raw_extracted_json"])

    bundle = FHIRConverter.generate_bundle(
        user_data=user,
        document_data=doc_dict,
        extraction_data={"data": data}
    )

    return bundle

@router.get("/patient-summary-bundle")
def get_patient_summary_bundle(
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Returns FHIR R4 Patient Summary with all observations and medication requests."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC LIMIT 1", (user["id"],))
    doc = cursor.fetchone()
    
    if not doc:
        # Generate baseline bundle for patient
        pat_res = FHIRConverter.create_patient_resource(user)
        return {
            "resourceType": "Bundle",
            "type": "collection",
            "entry": [{"resource": pat_res}]
        }

    return get_fhir_bundle(doc["id"], user, db)
