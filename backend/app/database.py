import sqlite3
import json
from app.config import settings

def get_db():
    conn = sqlite3.connect(settings.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(settings.DB_PATH)
    cursor = conn.cursor()
    
    # 1. Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        dob TEXT,
        gender TEXT,
        blood_group TEXT,
        preferred_language TEXT DEFAULT 'en',
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        abha_id TEXT,
        is_demo INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 2. Documents table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        stored_filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_hash TEXT NOT NULL,
        document_type TEXT NOT NULL,
        classification_confidence REAL DEFAULT 0.0,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'uploaded',
        thumbnail_path TEXT,
        raw_text TEXT,
        page_count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')

    # 3. Extractions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS extractions (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        document_type TEXT NOT NULL,
        raw_extracted_json TEXT NOT NULL,
        verified_json TEXT,
        is_verified INTEGER DEFAULT 0,
        verified_at TIMESTAMP,
        confidence_score REAL DEFAULT 0.0,
        field_confidences_json TEXT,
        ocr_snippets_json TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')

    # 4. Medications table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        document_id TEXT,
        medicine_name TEXT NOT NULL,
        strength TEXT,
        dosage TEXT,
        frequency TEXT,
        route TEXT,
        duration TEXT,
        instructions TEXT,
        prescriber TEXT,
        prescription_date TEXT,
        status TEXT DEFAULT 'unknown',
        is_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE SET NULL
    )
    ''')

    # 5. Lab Observations table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS lab_observations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        document_id TEXT,
        test_name TEXT NOT NULL,
        result_value REAL,
        result_text TEXT,
        unit TEXT,
        reference_range_raw TEXT,
        reference_range_low REAL,
        reference_range_high REAL,
        is_abnormal INTEGER DEFAULT 0,
        abnormal_flag TEXT,
        interpretation TEXT,
        report_date TEXT,
        lab_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE SET NULL
    )
    ''')

    # 6. Summaries table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS summaries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        document_id TEXT,
        language TEXT DEFAULT 'en',
        summary_type TEXT DEFAULT 'document_level',
        title TEXT,
        what_document_says TEXT,
        important_results TEXT,
        abnormal_findings TEXT,
        historical_comparison TEXT,
        questions_for_doctor TEXT,
        disclaimer TEXT,
        grounding_sources_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE SET NULL
    )
    ''')

    # 7. ABHA Profiles table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS abha_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        abha_number TEXT NOT NULL,
        abha_address TEXT NOT NULL,
        status TEXT DEFAULT 'connected',
        consent_granted INTEGER DEFAULT 1,
        consent_granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_sync_at TIMESTAMP,
        linked_facilities_json TEXT,
        imported_records_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')

    # 8. Audit logs table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action_type TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        details TEXT,
        ip_address TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')

    conn.commit()
    conn.close()
