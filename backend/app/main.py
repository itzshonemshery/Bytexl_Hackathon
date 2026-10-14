import os
import json
import sqlite3
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_db
from app.services.sample_generator import generate_all_samples
from app.routers import (
    auth, documents, extraction, summary, timeline,
    medications, abha, fhir, audit, evaluation
)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Personal Health Platform for the Healthcare Hackathon by Altrix Labs",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(extraction.router, prefix=settings.API_V1_STR)
app.include_router(summary.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)
app.include_router(medications.router, prefix=settings.API_V1_STR)
app.include_router(abha.router, prefix=settings.API_V1_STR)
app.include_router(fhir.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(evaluation.router, prefix=settings.API_V1_STR)

def seed_demo_data():
    """Seeds rich synthetic demonstration data for instant hackathon evaluation."""
    conn = sqlite3.connect(settings.DB_PATH)
    cursor = conn.cursor()
    
    demo_id = "demo_user_aarav_sharma"
    demo_email = "aarav.sharma.demo@healthcopilot.local"
    
    # 1. Ensure user exists
    cursor.execute("SELECT id FROM users WHERE id = ?", (demo_id,))
    if not cursor.fetchone():
        hashed_pw = auth.get_password_hash("DemoSecret2026!")
        cursor.execute('''
        INSERT INTO users (id, email, password_hash, full_name, dob, gender, blood_group, preferred_language, emergency_contact_name, emergency_contact_phone, abha_id, is_demo)
        VALUES (?, ?, ?, 'Aarav Sharma', '1983-05-14', 'Male', 'B+', 'en', 'Sunita Sharma (Spouse)', '+91 98765 43210', '91-4521-8890-1234', 1)
        ''', (demo_id, demo_email, hashed_pw))
        conn.commit()

    # 2. Check if documents already exist for demo user
    cursor.execute("SELECT COUNT(*) FROM documents WHERE user_id = ?", (demo_id,))
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Pre-seed 3 rich records
        # Record 1: Historical Lab Report (15-Oct-2025) for trend comparison!
        doc1_id = "doc_hist_lab_2025"
        cursor.execute('''
        INSERT INTO documents (
            id, user_id, original_filename, stored_filename, file_type, file_size,
            file_hash, document_type, classification_confidence, upload_date, status,
            thumbnail_path, raw_text, page_count
        ) VALUES (
            ?, ?, 'Lab_Report_Metropolis_Oct2025.pdf', 'sample_lab_report.pdf', 'pdf',
            45210, 'hash_hist_lab_2025', 'lab_report', 0.97, '2025-10-15 10:30:00', 'reviewed',
            '/api/v1/documents/preview-file/sample_lab_report.pdf', 'Metropolis Lab HbA1c 6.8%', 1
        )
        ''', (doc1_id, demo_id))

        cursor.execute('''
        INSERT INTO extractions (
            id, document_id, user_id, document_type, raw_extracted_json, verified_json,
            is_verified, verified_at, confidence_score, field_confidences_json, ocr_snippets_json, notes
        ) VALUES (
            'ext_hist_lab_2025', ?, ?, 'lab_report',
            ?, ?, 1, '2025-10-15 11:00:00', 0.97, '{"all": 0.97}', '{"date": "15-10-2025"}', 'Pre-seeded baseline'
        )
        ''', (
            doc1_id, demo_id,
            json.dumps({
                "lab_name": "Metropolis Healthcare & Clinical Labs",
                "report_date": "2025-10-15",
                "patient_name": "Aarav Sharma",
                "observations": [
                    {
                        "test_name": "HbA1c (Glycated Hemoglobin)",
                        "result_value": 6.8,
                        "result_text": "6.8",
                        "unit": "%",
                        "reference_range_raw": "4.0 - 5.6 %",
                        "reference_range_low": 4.0,
                        "reference_range_high": 5.6,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH",
                        "interpretation": "Baseline HbA1c recording.",
                        "confidence": 0.98,
                        "source_snippet": "HbA1c: 6.8 % [4.0 - 5.6]"
                    },
                    {
                        "test_name": "Fasting Blood Sugar",
                        "result_value": 122.0,
                        "result_text": "122",
                        "unit": "mg/dL",
                        "reference_range_raw": "70 - 99 mg/dL",
                        "reference_range_low": 70.0,
                        "reference_range_high": 99.0,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH",
                        "interpretation": "Baseline fasting glucose.",
                        "confidence": 0.97,
                        "source_snippet": "FBS: 122 mg/dL"
                    }
                ]
            }),
            json.dumps({
                "lab_name": "Metropolis Healthcare & Clinical Labs",
                "report_date": "2025-10-15",
                "patient_name": "Aarav Sharma",
                "observations": [
                    {
                        "test_name": "HbA1c (Glycated Hemoglobin)",
                        "result_value": 6.8,
                        "result_text": "6.8",
                        "unit": "%",
                        "reference_range_raw": "4.0 - 5.6 %",
                        "reference_range_low": 4.0,
                        "reference_range_high": 5.6,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH"
                    }
                ]
            })
        ))

        # Record 2: Current Lab Report (12-Mar-2026) showing HbA1c 7.4%
        doc2_id = "doc_curr_lab_2026"
        cursor.execute('''
        INSERT INTO documents (
            id, user_id, original_filename, stored_filename, file_type, file_size,
            file_hash, document_type, classification_confidence, upload_date, status,
            thumbnail_path, raw_text, page_count
        ) VALUES (
            ?, ?, 'Lab_Report_Metropolis_BloodWork_Mar2026.pdf', 'sample_lab_report.pdf', 'pdf',
            48910, 'hash_curr_lab_2026', 'lab_report', 0.98, '2026-03-12 09:15:00', 'reviewed',
            '/api/v1/documents/preview-file/sample_lab_report.pdf', 'Metropolis Lab HbA1c 7.4%', 1
        )
        ''', (doc2_id, demo_id))

        cursor.execute('''
        INSERT INTO extractions (
            id, document_id, user_id, document_type, raw_extracted_json, verified_json,
            is_verified, verified_at, confidence_score, field_confidences_json, ocr_snippets_json, notes
        ) VALUES (
            'ext_curr_lab_2026', ?, ?, 'lab_report',
            ?, ?, 1, '2026-03-12 10:00:00', 0.98, '{"all": 0.98}', '{"date": "12-03-2026"}', 'Verified by patient'
        )
        ''', (
            doc2_id, demo_id,
            json.dumps({
                "lab_name": "Metropolis Healthcare & Clinical Labs",
                "report_date": "2026-03-12",
                "patient_name": "Aarav Sharma",
                "observations": [
                    {
                        "test_name": "HbA1c (Glycated Hemoglobin)",
                        "result_value": 7.4,
                        "result_text": "7.4",
                        "unit": "%",
                        "reference_range_raw": "4.0 - 5.6 %",
                        "reference_range_low": 4.0,
                        "reference_range_high": 5.6,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH",
                        "source_snippet": "HbA1c Glycated Hemoglobin: 7.4 % (High)"
                    },
                    {
                        "test_name": "Fasting Blood Sugar",
                        "result_value": 138.0,
                        "result_text": "138",
                        "unit": "mg/dL",
                        "reference_range_raw": "70 - 99 mg/dL",
                        "reference_range_low": 70.0,
                        "reference_range_high": 99.0,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH",
                        "source_snippet": "Glucose Fasting: 138 mg/dL (High)"
                    },
                    {
                        "test_name": "Serum Creatinine",
                        "result_value": 0.95,
                        "result_text": "0.95",
                        "unit": "mg/dL",
                        "reference_range_raw": "0.7 - 1.3 mg/dL",
                        "reference_range_low": 0.7,
                        "reference_range_high": 1.3,
                        "is_abnormal": False,
                        "abnormal_flag": "NORMAL",
                        "source_snippet": "Serum Creatinine: 0.95 mg/dL (Normal)"
                    },
                    {
                        "test_name": "Total Cholesterol",
                        "result_value": 218.0,
                        "result_text": "218",
                        "unit": "mg/dL",
                        "reference_range_raw": "125 - 200 mg/dL",
                        "reference_range_low": 125.0,
                        "reference_range_high": 200.0,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH",
                        "source_snippet": "Total Cholesterol: 218 mg/dL (High)"
                    }
                ]
            }),
            json.dumps({
                "lab_name": "Metropolis Healthcare & Clinical Labs",
                "report_date": "2026-03-12",
                "patient_name": "Aarav Sharma",
                "observations": [
                    {
                        "test_name": "HbA1c (Glycated Hemoglobin)",
                        "result_value": 7.4,
                        "result_text": "7.4",
                        "unit": "%",
                        "reference_range_raw": "4.0 - 5.6 %",
                        "reference_range_low": 4.0,
                        "reference_range_high": 5.6,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH"
                    },
                    {
                        "test_name": "Fasting Blood Sugar",
                        "result_value": 138.0,
                        "result_text": "138",
                        "unit": "mg/dL",
                        "reference_range_raw": "70 - 99 mg/dL",
                        "reference_range_low": 70.0,
                        "reference_range_high": 99.0,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH"
                    },
                    {
                        "test_name": "Serum Creatinine",
                        "result_value": 0.95,
                        "result_text": "0.95",
                        "unit": "mg/dL",
                        "reference_range_raw": "0.7 - 1.3 mg/dL",
                        "reference_range_low": 0.7,
                        "reference_range_high": 1.3,
                        "is_abnormal": False,
                        "abnormal_flag": "NORMAL"
                    },
                    {
                        "test_name": "Total Cholesterol",
                        "result_value": 218.0,
                        "result_text": "218",
                        "unit": "mg/dL",
                        "reference_range_raw": "125 - 200 mg/dL",
                        "reference_range_low": 125.0,
                        "reference_range_high": 200.0,
                        "is_abnormal": True,
                        "abnormal_flag": "HIGH"
                    }
                ]
            })
        ))

        # Insert lab observations into lab_observations table
        for obs in [
            ("HbA1c (Glycated Hemoglobin)", 7.4, "%", "4.0 - 5.6 %", 4.0, 5.6, 1, "HIGH", "12-Mar-2026"),
            ("Fasting Blood Sugar", 138.0, "mg/dL", "70 - 99 mg/dL", 70.0, 99.0, 1, "HIGH", "12-Mar-2026"),
            ("Serum Creatinine", 0.95, "mg/dL", "0.7 - 1.3 mg/dL", 0.7, 1.3, 0, "NORMAL", "12-Mar-2026"),
            ("Total Cholesterol", 218.0, "mg/dL", "125 - 200 mg/dL", 125.0, 200.0, 1, "HIGH", "12-Mar-2026")
        ]:
            cursor.execute('''
            INSERT INTO lab_observations (
                id, user_id, document_id, test_name, result_value, result_text,
                unit, reference_range_raw, reference_range_low, reference_range_high,
                is_abnormal, abnormal_flag, interpretation, report_date, lab_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Metropolis Pathology')
            ''', (
                f"obs_{obs[0].split()[0]}_{doc2_id}", demo_id, doc2_id, obs[0],
                obs[1], str(obs[1]), obs[2], obs[3], obs[4], obs[5], obs[6], obs[7],
                f"Observation {obs[0]} is {obs[7]}", obs[8]
            ))

        # Record 3: Prescription (10-Mar-2026)
        doc3_id = "doc_curr_rx_2026"
        cursor.execute('''
        INSERT INTO documents (
            id, user_id, original_filename, stored_filename, file_type, file_size,
            file_hash, document_type, classification_confidence, upload_date, status,
            thumbnail_path, raw_text, page_count
        ) VALUES (
            ?, ?, 'Prescription_Dr_Seth_Mar2026.pdf', 'sample_prescription.pdf', 'pdf',
            38200, 'hash_curr_rx_2026', 'prescription', 0.98, '2026-03-10 16:45:00', 'reviewed',
            '/api/v1/documents/preview-file/sample_prescription.pdf', 'Apex Care Clinic Dr. Vikram Seth Metformin 500mg Atorvastatin 10mg', 1
        )
        ''', (doc3_id, demo_id))

        cursor.execute('''
        INSERT INTO extractions (
            id, document_id, user_id, document_type, raw_extracted_json, verified_json,
            is_verified, verified_at, confidence_score, field_confidences_json, ocr_snippets_json, notes
        ) VALUES (
            'ext_curr_rx_2026', ?, ?, 'prescription',
            ?, ?, 1, '2026-03-10 17:00:00', 0.96, '{"all": 0.96}', '{"doctor": "Dr. Vikram Seth"}', 'Active prescription'
        )
        ''', (
            doc3_id, demo_id,
            json.dumps({
                "prescriber_name": "Dr. Vikram Seth, MBBS, MD",
                "clinic_or_hospital": "Apex Care Multi-Speciality Clinic",
                "prescription_date": "2026-03-10",
                "patient_name": "Aarav Sharma",
                "medicines": [
                    {
                        "medicine_name": "Metformin Hydrochloride",
                        "strength": "500 mg",
                        "dosage": "1 tablet",
                        "frequency": "BD (Twice daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take after meals",
                        "status": "current"
                    },
                    {
                        "medicine_name": "Atorvastatin",
                        "strength": "10 mg",
                        "dosage": "1 tablet",
                        "frequency": "OD (Once daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take at bedtime",
                        "status": "current"
                    },
                    {
                        "medicine_name": "Telmisartan",
                        "strength": "40 mg",
                        "dosage": "1 tablet",
                        "frequency": "OD (Once daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take in the morning",
                        "status": "current"
                    }
                ]
            }),
            json.dumps({
                "prescriber_name": "Dr. Vikram Seth, MBBS, MD",
                "clinic_or_hospital": "Apex Care Multi-Speciality Clinic",
                "prescription_date": "2026-03-10",
                "patient_name": "Aarav Sharma",
                "medicines": [
                    {
                        "medicine_name": "Metformin Hydrochloride",
                        "strength": "500 mg",
                        "dosage": "1 tablet",
                        "frequency": "BD (Twice daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take after meals",
                        "status": "current"
                    },
                    {
                        "medicine_name": "Atorvastatin",
                        "strength": "10 mg",
                        "dosage": "1 tablet",
                        "frequency": "OD (Once daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take at bedtime",
                        "status": "current"
                    },
                    {
                        "medicine_name": "Telmisartan",
                        "strength": "40 mg",
                        "dosage": "1 tablet",
                        "frequency": "OD (Once daily)",
                        "route": "Oral",
                        "duration": "30 days",
                        "instructions": "Take in the morning",
                        "status": "current"
                    }
                ]
            })
        ))

        # Insert medications into medications table
        cursor.execute('''
        INSERT INTO medications (id, user_id, document_id, medicine_name, strength, dosage, frequency, route, duration, instructions, prescriber, prescription_date, status, is_verified)
        VALUES ('med_met_1', ?, ?, 'Metformin Hydrochloride', '500 mg', '1 tablet', 'BD (Twice daily)', 'Oral', '30 days', 'Take after meals', 'Dr. Vikram Seth', '2026-03-10', 'current', 1)
        ''', (demo_id, doc3_id))
        cursor.execute('''
        INSERT INTO medications (id, user_id, document_id, medicine_name, strength, dosage, frequency, route, duration, instructions, prescriber, prescription_date, status, is_verified)
        VALUES ('med_ato_1', ?, ?, 'Atorvastatin', '10 mg', '1 tablet', 'OD (Once daily)', 'Oral', '30 days', 'Take at bedtime', 'Dr. Vikram Seth', '2026-03-10', 'current', 1)
        ''', (demo_id, doc3_id))
        cursor.execute('''
        INSERT INTO medications (id, user_id, document_id, medicine_name, strength, dosage, frequency, route, duration, instructions, prescriber, prescription_date, status, is_verified)
        VALUES ('med_tel_1', ?, ?, 'Telmisartan', '40 mg', '1 tablet', 'OD (Once daily)', 'Oral', '30 days', 'Take in morning', 'Dr. Vikram Seth', '2026-03-10', 'current', 1)
        ''', (demo_id, doc3_id))

        # Record 4: Historical Discharge Summary (Jan 2026)
        doc4_id = "doc_disch_2026"
        cursor.execute('''
        INSERT INTO documents (
            id, user_id, original_filename, stored_filename, file_type, file_size,
            file_hash, document_type, classification_confidence, upload_date, status,
            thumbnail_path, raw_text, page_count
        ) VALUES (
            ?, ?, 'Discharge_Summary_Fortis_Hospital_Jan2026.pdf', 'sample_discharge_summary.pdf', 'pdf',
            51200, 'hash_disch_2026', 'discharge_summary', 0.98, '2026-01-18 14:00:00', 'reviewed',
            '/api/v1/documents/preview-file/sample_discharge_summary.pdf', 'Fortis Hospital Discharge Gastroenteritis Rifaximin 400mg', 1
        )
        ''', (doc4_id, demo_id))

        cursor.execute('''
        INSERT INTO extractions (
            id, document_id, user_id, document_type, raw_extracted_json, verified_json,
            is_verified, verified_at, confidence_score, field_confidences_json, ocr_snippets_json, notes
        ) VALUES (
            'ext_disch_2026', ?, ?, 'discharge_summary',
            ?, ?, 1, '2026-01-18 15:00:00', 0.97, '{"all": 0.97}', '{"hospital": "Fortis Hospital"}', 'Hospital discharge'
        )
        ''', (
            doc4_id, demo_id,
            json.dumps({
                "hospital_name": "Fortis Memorial Research Institute",
                "admission_date": "2026-01-14",
                "discharge_date": "2026-01-18",
                "primary_diagnosis": "Acute Gastroenteritis with Moderate Dehydration",
                "secondary_diagnoses": ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
                "hospital_course": "Patient admitted with acute vomiting and loose stools. IV fluid rehydration given. Fully stabilized.",
                "discharge_condition": "Stable, afebrile, tolerating oral feeds.",
                "discharge_medications": [
                    {"medicine_name": "Rifaximin", "strength": "400 mg", "frequency": "TDS", "status": "historical"},
                    {"medicine_name": "ORS (Oral Rehydration Solution)", "strength": "1 sachet in 1L", "frequency": "As needed", "status": "historical"}
                ],
                "follow_up_instructions": "Review in OPD after 7 days."
            }),
            json.dumps({
                "hospital_name": "Fortis Memorial Research Institute",
                "admission_date": "2026-01-14",
                "discharge_date": "2026-01-18",
                "primary_diagnosis": "Acute Gastroenteritis with Moderate Dehydration",
                "secondary_diagnoses": ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
                "hospital_course": "Patient admitted with acute vomiting and loose stools. IV fluid rehydration given. Fully stabilized.",
                "discharge_condition": "Stable, afebrile, tolerating oral feeds.",
                "discharge_medications": [
                    {"medicine_name": "Rifaximin", "strength": "400 mg", "frequency": "TDS", "status": "historical"},
                    {"medicine_name": "ORS (Oral Rehydration Solution)", "strength": "1 sachet in 1L", "frequency": "As needed", "status": "historical"}
                ],
                "follow_up_instructions": "Review in OPD after 7 days."
            })
        ))

        # Insert historical medications
        cursor.execute('''
        INSERT INTO medications (id, user_id, document_id, medicine_name, strength, dosage, frequency, route, duration, instructions, prescriber, prescription_date, status, is_verified)
        VALUES ('med_rif_1', ?, ?, 'Rifaximin', '400 mg', '1 tablet', 'TDS (Thrice daily)', 'Oral', '5 days', 'Course completed', 'Fortis Memorial Hospital', '2026-01-18', 'historical', 1)
        ''', (demo_id, doc4_id))

        # Seed ABHA Profile
        cursor.execute('''
        INSERT OR REPLACE INTO abha_profiles (
            id, user_id, abha_number, abha_address, status, consent_granted,
            consent_granted_at, last_sync_at, linked_facilities_json, imported_records_json
        ) VALUES (
            'abha_demo_1', ?, '91-4521-8890-1234', 'aarav.sharma@abdm', 'connected', 1,
            '2026-03-01 10:00:00', '2026-03-12 18:00:00', '[]', '["CC-LAL-2025-4491"]'
        )
        ''', (demo_id,))

        conn.commit()
    conn.close()

@app.on_event("startup")
def startup_event():
    init_db()
    generate_all_samples()
    seed_demo_data()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "llm_mode": settings.LLM_PROVIDER,
        "version": "1.0.0"
    }
