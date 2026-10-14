import json
import uuid
import sqlite3
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import (
    ABHAConnectRequest, ABHAProfileResponse, ABHARecordItem, ABHAImportRequest
)
from app.services.abha_service import ABHAMockService

router = APIRouter(prefix="/abha", tags=["ABHA Sandbox Connect"])

@router.get("/status", response_model=ABHAProfileResponse)
def get_abha_status(user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM abha_profiles WHERE user_id = ?", (user["id"],))
    profile = cursor.fetchone()

    # Preloaded synthetic discoverable records
    abha_num = profile["abha_number"] if profile else user.get("abha_id", "91-4521-8890-1234")
    discoverable = ABHAMockService.get_discoverable_care_contexts(abha_num)

    if not profile:
        return ABHAProfileResponse(
            abha_number=user.get("abha_id") or "91-4521-8890-1234",
            abha_address="aarav.sharma@abdm",
            status="disconnected",
            consent_granted=False,
            available_records=discoverable,
            imported_records_count=0
        )

    profile_dict = dict(profile)
    imported_list = json.loads(profile_dict.get("imported_records_json") or "[]")
    
    # Mark which discoverable items are imported
    records = []
    for d in discoverable:
        is_imp = d["care_context_id"] in imported_list
        records.append(ABHARecordItem(
            care_context_id=d["care_context_id"],
            facility_name=d["facility_name"],
            hip_id=d["hip_id"],
            record_type=d["record_type"],
            date=d["date"],
            title=d["title"],
            summary=d["summary"],
            fhir_bundle_preview=d["fhir_bundle_preview"],
            is_imported=is_imp
        ))

    return ABHAProfileResponse(
        abha_number=profile_dict["abha_number"],
        abha_address=profile_dict["abha_address"],
        status=profile_dict["status"],
        consent_granted=bool(profile_dict["consent_granted"]),
        consent_granted_at=profile_dict.get("consent_granted_at"),
        last_sync_at=profile_dict.get("last_sync_at"),
        available_records=records,
        imported_records_count=len(imported_list)
    )

@router.post("/connect")
def connect_abha(
    req: ABHAConnectRequest,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Establishes simulated ABHA gateway connection with explicit patient consent."""
    cursor = db.cursor()
    now_str = datetime.utcnow().isoformat()
    prof_id = f"abha_{uuid.uuid4().hex[:10]}"

    cursor.execute('''
    INSERT OR REPLACE INTO abha_profiles (
        id, user_id, abha_number, abha_address, status, consent_granted,
        consent_granted_at, last_sync_at, linked_facilities_json, imported_records_json
    ) VALUES (?, ?, ?, ?, 'connected', 1, ?, ?, ?, '["CC-LAL-2025-4491"]')
    ''', (
        prof_id, user["id"], req.abha_id, req.abha_address,
        now_str, now_str, json.dumps(ABHAMockService.get_sandbox_facilities())
    ))

    # Update user abha_id
    cursor.execute("UPDATE users SET abha_id = ? WHERE id = ?", (req.abha_id, user["id"]))

    # Log audit event
    audit_id = f"aud_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO audit_logs (id, user_id, action_type, resource_type, resource_id, details)
    VALUES (?, ?, 'ABHA_CONNECT', 'ABHA_PROFILE', ?, ?)
    ''', (audit_id, user["id"], prof_id, f"Linked mock ABHA ID {req.abha_id} with patient consent"))

    db.commit()

    return {
        "message": f"Successfully connected to simulated ABDM Sandbox with ABHA ID {req.abha_id}",
        "status": "connected"
    }

@router.post("/import")
def import_care_contexts(
    req: ABHAImportRequest,
    user: dict = Depends(get_current_user),
    db: sqlite3.Connection = Depends(get_db)
):
    """Imports selected discoverable care contexts into patient records."""
    cursor = db.cursor()
    cursor.execute("SELECT * FROM abha_profiles WHERE user_id = ?", (user["id"],))
    profile = cursor.fetchone()
    if not profile or profile["status"] != "connected":
        raise HTTPException(status_code=400, detail="ABHA connection not active or consent revoked")

    profile_dict = dict(profile)
    imported = set(json.loads(profile_dict.get("imported_records_json") or "[]"))
    imported.update(req.care_context_ids)

    cursor.execute('''
    UPDATE abha_profiles 
    SET imported_records_json = ?, last_sync_at = ?
    WHERE user_id = ?
    ''', (json.dumps(list(imported)), datetime.utcnow().isoformat(), user["id"]))

    # Log audit event
    audit_id = f"aud_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO audit_logs (id, user_id, action_type, resource_type, resource_id, details)
    VALUES (?, ?, 'ABHA_IMPORT', 'CARE_CONTEXTS', ?, ?)
    ''', (audit_id, user["id"], ", ".join(req.care_context_ids), f"Imported {len(req.care_context_ids)} care contexts via ABHA"))

    db.commit()

    return {
        "message": f"Successfully imported {len(req.care_context_ids)} record(s) into your unified health timeline.",
        "imported_ids": list(imported)
    }

@router.post("/disconnect")
def disconnect_abha(user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    """Disconnects ABHA and revokes sharing consent."""
    cursor = db.cursor()
    cursor.execute('''
    UPDATE abha_profiles 
    SET status = 'disconnected', consent_granted = 0 
    WHERE user_id = ?
    ''', (user["id"],))

    audit_id = f"aud_{uuid.uuid4().hex[:10]}"
    cursor.execute('''
    INSERT INTO audit_logs (id, user_id, action_type, resource_type, resource_id, details)
    VALUES (?, ?, 'ABHA_REVOKE_CONSENT', 'ABHA_PROFILE', ?, ?)
    ''', (audit_id, user["id"], user["id"], "Patient disconnected ABHA ID and revoked sharing consent"))

    db.commit()

    return {"message": "ABHA connection disconnected and consent revoked."}
