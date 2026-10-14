import sqlite3
from fastapi import APIRouter, Depends
from typing import List

from app.database import get_db
from app.routers.auth import get_current_user
from app.models.schemas import AuditLogItem

router = APIRouter(prefix="/audit", tags=["Audit & Security"])

@router.get("/logs", response_model=List[AuditLogItem])
def get_audit_logs(user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute('''
    SELECT * FROM audit_logs 
    WHERE user_id = ? 
    ORDER BY timestamp DESC
    LIMIT 50
    ''', (user["id"],))
    rows = cursor.fetchall()

    return [
        AuditLogItem(
            id=r["id"],
            action_type=r["action_type"],
            resource_type=r["resource_type"],
            resource_id=r["resource_id"],
            details=r["details"],
            timestamp=r["timestamp"]
        ) for r in rows
    ]
