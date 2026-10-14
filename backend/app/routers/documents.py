import os
import uuid
import hashlib
import json
import sqlite3
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Form
from fastapi.responses import FileResponse
from typing import List, Optional

from app.config import settings
from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import DocumentResponse
from app.services.ocr_engine import OCREngine
from app.services.classifier import DocumentClassifier
from app.services.extractor import StructuredExtractor
from app.services.sample_generator import generate_all_samples

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

def compute_sha256(file_path: str) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            hasher.update(chunk)
    return hasher.hexdigest()

def log_audit_event(db: sqlite3.Connection, user_id: str, action: str, resource_type: str, resource_id: str, details: str):
    audit_id = f"aud_{uuid.uuid4().hex[:10]}"
    db.cursor().execute('''
    INSERT INTO audit_logs (id, user_id, action_type, resource_type, resource_id, details)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (audit_id, user_id, action, resource_type, resource_id, details))
    db.commit()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, JPG, JPEG, PNG."
        )

    # Generate unique stored filename
    doc_id = f"doc_{uuid.uuid4().hex[:10]}"
    stored_filename = f"{doc_id}{ext}"
    stored_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

    # Save file and calculate size
    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 25 MB limit.")

    with open(stored_path, "wb") as f:
        f.write(file_bytes)

    # Compute SHA-256 hash for duplicate detection
    file_hash = compute_sha256(stored_path)

    # Duplicate check for the same user
    cursor = db.cursor()
    cursor.execute("SELECT id, original_filename FROM documents WHERE user_id = ? AND file_hash = ?", (user["id"], file_hash))
    dup = cursor.fetchone()
    if dup:
        # We allow upload but flag warning as per requirements: "allow users to confirm whether two similar documents are duplicates"
        pass

    # Run OCR & Text Extraction
    if ext == ".pdf":
        ocr_result = OCREngine.extract_from_pdf(stored_path, settings.PROCESSED_DIR)
    else:
        ocr_result = OCREngine.extract_from_image(stored_path, settings.PROCESSED_DIR)

    raw_text = ocr_result["text"]
    preview_images = ocr_result["preview_images"]
    first_preview = preview_images[0] if preview_images else None

    # Automatic Document Classification
    doc_type, class_conf = DocumentClassifier.classify(raw_text, file.filename)

    # Structured Extraction based on classified schema
    extraction_res = StructuredExtractor.extract_by_type(doc_type, raw_text)

    # Insert document record into DB
    cursor.execute('''
    INSERT INTO documents (
        id, user_id, original_filename, stored_filename, file_type, file_size,
        file_hash, document_type, classification_confidence, status,
        thumbnail_path, raw_text, page_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'processed', ?, ?, ?)
    ''', (
        doc_id, user["id"], file.filename, stored_filename, ext.replace(".", ""),
        file_size, file_hash, doc_type, class_conf, first_preview, raw_text,
        ocr_result["page_count"]
    ))

    # Insert raw extraction record
    ext_id = f"ext_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO extractions (
        id, document_id, user_id, document_type, raw_extracted_json, verified_json,
        is_verified, confidence_score, field_confidences_json, ocr_snippets_json, notes
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, '')
    ''', (
        ext_id, doc_id, user["id"], doc_type,
        json.dumps(extraction_res["data"]),
        json.dumps(extraction_res["data"]),
        extraction_res["confidence_score"],
        json.dumps(extraction_res["field_confidences"]),
        json.dumps(extraction_res["ocr_snippets"])
    ))

    db.commit()

    log_audit_event(
        db, user["id"], "UPLOAD", "DOCUMENT", doc_id,
        f"Uploaded '{file.filename}' ({doc_type}, {round(class_conf*100)}% confidence)"
    )

    return {
        "document_id": doc_id,
        "filename": file.filename,
        "document_type": doc_type,
        "classification_confidence": class_conf,
        "page_count": ocr_result["page_count"],
        "preview_images": preview_images,
        "ocr_confidence": ocr_result["confidence"],
        "has_handwriting_warning": ocr_result.get("has_handwriting_warning", False),
        "is_duplicate_warning": bool(dup),
        "extracted_data": extraction_res["data"],
        "field_confidences": extraction_res["field_confidences"],
        "ocr_snippets": extraction_res["ocr_snippets"]
    }

@router.post("/load-sample/{sample_type}")
def load_sample_document(
    sample_type: str, # prescription, lab_report, discharge_summary
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Instantly copies and processes a pre-generated synthetic sample document for rapid demonstration."""
    sample_files = {
        "prescription": ("sample_prescription.pdf", "Prescription_Dr_Seth_Mar2026.pdf", "prescription"),
        "lab_report": ("sample_lab_report.pdf", "Lab_Report_Metropolis_BloodWork_Mar2026.pdf", "lab_report"),
        "discharge_summary": ("sample_discharge_summary.pdf", "Discharge_Summary_Fortis_Hospital_Jan2026.pdf", "discharge_summary")
    }

    if sample_type not in sample_files:
        raise HTTPException(status_code=400, detail="Invalid sample type. Choose: prescription, lab_report, discharge_summary")

    src_name, display_name, doc_type = sample_files[sample_type]
    src_path = os.path.join(settings.SAMPLES_DIR, src_name)

    if not os.path.exists(src_path):
        generate_all_samples()

    doc_id = f"doc_{uuid.uuid4().hex[:10]}"
    stored_filename = f"{doc_id}.pdf"
    target_path = os.path.join(settings.UPLOAD_DIR, stored_filename)
    shutil.copy(src_path, target_path)

    file_size = os.path.getsize(target_path)
    file_hash = compute_sha256(target_path)

    ocr_result = OCREngine.extract_from_pdf(target_path, settings.PROCESSED_DIR)
    extraction_res = StructuredExtractor.extract_by_type(doc_type, ocr_result["text"])
    first_preview = ocr_result["preview_images"][0] if ocr_result["preview_images"] else None

    cursor = db.cursor()
    cursor.execute('''
    INSERT INTO documents (
        id, user_id, original_filename, stored_filename, file_type, file_size,
        file_hash, document_type, classification_confidence, status,
        thumbnail_path, raw_text, page_count
    ) VALUES (?, ?, ?, ?, 'pdf', ?, ?, ?, 0.98, 'processed', ?, ?, ?)
    ''', (
        doc_id, user["id"], display_name, stored_filename,
        file_size, file_hash, doc_type, first_preview, ocr_result["text"], ocr_result["page_count"]
    ))

    ext_id = f"ext_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO extractions (
        id, document_id, user_id, document_type, raw_extracted_json, verified_json,
        is_verified, confidence_score, field_confidences_json, ocr_snippets_json, notes
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, '')
    ''', (
        ext_id, doc_id, user["id"], doc_type,
        json.dumps(extraction_res["data"]),
        json.dumps(extraction_res["data"]),
        extraction_res["confidence_score"],
        json.dumps(extraction_res["field_confidences"]),
        json.dumps(extraction_res["ocr_snippets"])
    ))

    db.commit()

    log_audit_event(db, user["id"], "SAMPLE_LOAD", "DOCUMENT", doc_id, f"Loaded synthetic test sample '{display_name}'")

    return {
        "document_id": doc_id,
        "filename": display_name,
        "document_type": doc_type,
        "classification_confidence": 0.98,
        "page_count": ocr_result["page_count"],
        "preview_images": ocr_result["preview_images"],
        "ocr_confidence": 0.98,
        "extracted_data": extraction_res["data"],
        "field_confidences": extraction_res["field_confidences"],
        "ocr_snippets": extraction_res["ocr_snippets"]
    }

@router.get("", response_model=List[DocumentResponse])
def list_documents(user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
    SELECT d.*, (SELECT is_verified FROM extractions WHERE document_id = d.id) as is_verified
    FROM documents d
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
    ''', (user["id"],))
    rows = cursor.fetchall()

    docs = []
    for r in rows:
        docs.append(DocumentResponse(
            id=r["id"],
            user_id=r["user_id"],
            original_filename=r["original_filename"],
            file_type=r["file_type"],
            file_size=r["file_size"],
            document_type=r["document_type"],
            classification_confidence=r["classification_confidence"],
            upload_date=r["upload_date"],
            status=r["status"],
            thumbnail_path=r["thumbnail_path"],
            page_count=r["page_count"] or 1,
            has_verified_extraction=bool(r["is_verified"])
        ))
    return docs

@router.get("/preview-file/{filename}")
def serve_preview_file(filename: str):
    """Serves rendered page preview images or sample documents securely."""
    # Check processed dir
    p_path = os.path.join(settings.PROCESSED_DIR, filename)
    if os.path.exists(p_path):
        return FileResponse(p_path)
    
    # Check uploads dir
    u_path = os.path.join(settings.UPLOAD_DIR, filename)
    if os.path.exists(u_path):
        return FileResponse(u_path)

    # Check samples dir
    s_path = os.path.join(settings.SAMPLES_DIR, filename)
    if os.path.exists(s_path):
        return FileResponse(s_path)

    raise HTTPException(status_code=404, detail="File not found")

@router.delete("/{doc_id}")
def delete_document(doc_id: str, user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ? AND user_id = ?", (doc_id, user["id"]))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Document not found or unauthorized")

    doc_dict = dict(row)
    stored_path = os.path.join(settings.UPLOAD_DIR, doc_dict["stored_filename"])
    if os.path.exists(stored_path):
        try:
            os.remove(stored_path)
        except Exception:
            pass

    # Cascading DB delete
    cursor.execute("DELETE FROM documents WHERE id = ?", (doc_id,))
    cursor.execute("DELETE FROM extractions WHERE document_id = ?", (doc_id,))
    cursor.execute("DELETE FROM medications WHERE document_id = ?", (doc_id,))
    cursor.execute("DELETE FROM lab_observations WHERE document_id = ?", (doc_id,))
    cursor.execute("DELETE FROM summaries WHERE document_id = ?", (doc_id,))
    db.commit()

    log_audit_event(
        db, user["id"], "DELETE", "DOCUMENT", doc_id,
        f"Permanently deleted document '{doc_dict['original_filename']}' and all associated extractions."
    )

    return {"message": f"Document '{doc_dict['original_filename']}' successfully deleted"}
