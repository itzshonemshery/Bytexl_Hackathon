import uuid
import sqlite3
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status, Header
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from app.config import settings
from app.database import get_db
from app.models.schemas import UserCreate, UserLogin, UserResponse, UserProfileUpdate, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user(authorization: Optional[str] = Header(None), db: sqlite3.Connection = Depends(get_db)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid authentication token")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return dict(user)

@router.post("/signup", response_model=Token)
def signup(user_data: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (user_data.email.lower(),))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user_id = f"usr_{uuid.uuid4().hex[:10]}"
    hashed_pw = get_password_hash(user_data.password)
    
    cursor.execute('''
    INSERT INTO users (id, email, password_hash, full_name, dob, gender, blood_group, preferred_language, emergency_contact_name, emergency_contact_phone, is_demo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    ''', (
        user_id, user_data.email.lower(), hashed_pw, user_data.full_name,
        user_data.dob, user_data.gender, user_data.blood_group,
        user_data.preferred_language, user_data.emergency_contact_name,
        user_data.emergency_contact_phone
    ))
    db.commit()

    token = create_access_token({"sub": user_id, "email": user_data.email.lower()})
    user_resp = UserResponse(
        id=user_id, email=user_data.email.lower(), full_name=user_data.full_name,
        dob=user_data.dob, gender=user_data.gender, blood_group=user_data.blood_group,
        preferred_language=user_data.preferred_language,
        emergency_contact_name=user_data.emergency_contact_name,
        emergency_contact_phone=user_data.emergency_contact_phone,
        is_demo=False
    )
    return Token(access_token=token, user=user_resp)

@router.post("/login", response_model=Token)
def login(creds: UserLogin, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (creds.email.lower(),))
    row = cursor.fetchone()
    if not row or not verify_password(creds.password, row["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    user_dict = dict(row)
    token = create_access_token({"sub": user_dict["id"], "email": user_dict["email"]})
    return Token(
        access_token=token,
        user=UserResponse(
            id=user_dict["id"],
            email=user_dict["email"],
            full_name=user_dict["full_name"],
            dob=user_dict.get("dob"),
            gender=user_dict.get("gender"),
            blood_group=user_dict.get("blood_group"),
            preferred_language=user_dict.get("preferred_language", "en"),
            emergency_contact_name=user_dict.get("emergency_contact_name"),
            emergency_contact_phone=user_dict.get("emergency_contact_phone"),
            abha_id=user_dict.get("abha_id"),
            is_demo=bool(user_dict.get("is_demo", 0))
        )
    )

@router.post("/demo-login", response_model=Token)
def demo_login(db: sqlite3.Connection = Depends(get_db)):
    """Provides immediate, 1-click synthetic demo access for hackathon judges."""
    cursor = db.cursor()
    demo_email = "aarav.sharma.demo@healthcopilot.local"
    demo_id = "demo_user_aarav_sharma"
    
    cursor.execute("SELECT * FROM users WHERE id = ?", (demo_id,))
    row = cursor.fetchone()
    
    if not row:
        hashed_pw = get_password_hash("DemoSecret2026!")
        cursor.execute('''
        INSERT INTO users (id, email, password_hash, full_name, dob, gender, blood_group, preferred_language, emergency_contact_name, emergency_contact_phone, abha_id, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ''', (
            demo_id, demo_email, hashed_pw, "Aarav Sharma", "1983-05-14", "Male", "B+", "en",
            "Sunita Sharma (Spouse)", "+91 98765 43210", "91-4521-8890-1234"
        ))
        db.commit()
    
    token = create_access_token({"sub": demo_id, "email": demo_email, "is_demo": True})
    return Token(
        access_token=token,
        user=UserResponse(
            id=demo_id,
            email=demo_email,
            full_name="Aarav Sharma",
            dob="1983-05-14",
            gender="Male",
            blood_group="B+",
            preferred_language="en",
            emergency_contact_name="Sunita Sharma (Spouse)",
            emergency_contact_phone="+91 98765 43210",
            abha_id="91-4521-8890-1234",
            is_demo=True
        )
    )

@router.get("/me", response_model=UserResponse)
def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        dob=user.get("dob"),
        gender=user.get("gender"),
        blood_group=user.get("blood_group"),
        preferred_language=user.get("preferred_language", "en"),
        emergency_contact_name=user.get("emergency_contact_name"),
        emergency_contact_phone=user.get("emergency_contact_phone"),
        abha_id=user.get("abha_id"),
        is_demo=bool(user.get("is_demo", 0))
    )

@router.put("/profile", response_model=UserResponse)
def update_profile(updates: UserProfileUpdate, user: dict = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    fields = []
    values = []
    
    if updates.full_name is not None:
        fields.append("full_name = ?")
        values.append(updates.full_name)
    if updates.dob is not None:
        fields.append("dob = ?")
        values.append(updates.dob)
    if updates.gender is not None:
        fields.append("gender = ?")
        values.append(updates.gender)
    if updates.blood_group is not None:
        fields.append("blood_group = ?")
        values.append(updates.blood_group)
    if updates.preferred_language is not None:
        fields.append("preferred_language = ?")
        values.append(updates.preferred_language)
    if updates.emergency_contact_name is not None:
        fields.append("emergency_contact_name = ?")
        values.append(updates.emergency_contact_name)
    if updates.emergency_contact_phone is not None:
        fields.append("emergency_contact_phone = ?")
        values.append(updates.emergency_contact_phone)
    if updates.abha_id is not None:
        fields.append("abha_id = ?")
        values.append(updates.abha_id)

    if fields:
        values.append(user["id"])
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(query, tuple(values))
        db.commit()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user["id"],))
    updated_user = dict(cursor.fetchone())
    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        full_name=updated_user["full_name"],
        dob=updated_user.get("dob"),
        gender=updated_user.get("gender"),
        blood_group=updated_user.get("blood_group"),
        preferred_language=updated_user.get("preferred_language", "en"),
        emergency_contact_name=updated_user.get("emergency_contact_name"),
        emergency_contact_phone=updated_user.get("emergency_contact_phone"),
        abha_id=updated_user.get("abha_id"),
        is_demo=bool(updated_user.get("is_demo", 0))
    )
