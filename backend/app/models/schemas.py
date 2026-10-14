from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Authentication & User
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    dob: Optional[str] = "1983-05-14"
    gender: Optional[str] = "Male"
    blood_group: Optional[str] = "B+"
    preferred_language: Optional[str] = "en"
    emergency_contact_name: Optional[str] = "Sunita Sharma (Spouse)"
    emergency_contact_phone: Optional[str] = "+91 98765 43210"

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    preferred_language: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    abha_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    preferred_language: str = "en"
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    abha_id: Optional[str] = None
    is_demo: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Document Models
class DocumentResponse(BaseModel):
    id: str
    user_id: str
    original_filename: str
    file_type: str
    file_size: int
    document_type: str # prescription, lab_report, discharge_summary, diagnostic_report, unknown
    classification_confidence: float
    upload_date: str
    status: str # uploaded, processed, reviewed, failed
    thumbnail_path: Optional[str] = None
    page_count: int = 1
    has_verified_extraction: bool = False

# Extraction Models
class FieldProvenance(BaseModel):
    field_name: str
    value: Any
    confidence: float = 0.95
    source_snippet: Optional[str] = None
    page_number: int = 1
    is_uncertain: bool = False

class PrescriptionMedicine(BaseModel):
    medicine_name: str
    strength: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    route: Optional[str] = "Oral"
    duration: Optional[str] = None
    instructions: Optional[str] = None
    status: str = "current" # current, historical, unknown
    confidence: float = 0.95
    source_snippet: Optional[str] = None

class PrescriptionData(BaseModel):
    prescriber_name: Optional[str] = None
    clinic_or_hospital: Optional[str] = None
    prescription_date: Optional[str] = None
    patient_name: Optional[str] = None
    medicines: List[PrescriptionMedicine] = []
    clinical_notes: Optional[str] = None

class LabObservationItem(BaseModel):
    test_name: str
    result_value: Optional[float] = None
    result_text: str
    unit: Optional[str] = None
    reference_range_raw: Optional[str] = None
    reference_range_low: Optional[float] = None
    reference_range_high: Optional[float] = None
    is_abnormal: bool = False
    abnormal_flag: Optional[str] = None # HIGH, LOW, NORMAL
    interpretation: Optional[str] = None
    confidence: float = 0.95
    source_snippet: Optional[str] = None

class LabReportData(BaseModel):
    lab_name: Optional[str] = None
    report_date: Optional[str] = None
    patient_name: Optional[str] = None
    observations: List[LabObservationItem] = []
    summary_remarks: Optional[str] = None

class DischargeSummaryData(BaseModel):
    hospital_name: Optional[str] = None
    admission_date: Optional[str] = None
    discharge_date: Optional[str] = None
    primary_diagnosis: Optional[str] = None
    secondary_diagnoses: List[str] = []
    procedures_performed: List[str] = []
    hospital_course: Optional[str] = None
    discharge_condition: Optional[str] = None
    discharge_medications: List[PrescriptionMedicine] = []
    follow_up_instructions: Optional[str] = None

class DiagnosticReportData(BaseModel):
    facility_name: Optional[str] = None
    investigation_type: str # X-Ray, CT Scan, MRI, Ultrasound, ECG
    study_date: Optional[str] = None
    findings: str
    impression: str
    radiologist_or_doctor: Optional[str] = None

class ExtractionResponse(BaseModel):
    id: str
    document_id: str
    document_type: str
    confidence_score: float
    is_verified: bool
    verified_at: Optional[str] = None
    data: Dict[str, Any]
    field_confidences: Dict[str, float]
    ocr_snippets: Dict[str, str]
    raw_text_preview: str

class ExtractionReviewRequest(BaseModel):
    data: Dict[str, Any]
    notes: Optional[str] = None

# AI Summary
class GroundingSource(BaseModel):
    claim: str
    source_document: str
    page_number: int = 1
    exact_snippet: str

class AISummaryResponse(BaseModel):
    id: Optional[str] = None
    document_id: Optional[str] = None
    language: str = "en"
    summary_type: str = "document_level"
    title: str
    what_document_says: str
    important_results: List[str] = []
    abnormal_findings: List[Dict[str, Any]] = []
    historical_comparison: Optional[str] = None
    questions_for_doctor: List[str] = []
    grounding_sources: List[GroundingSource] = []
    disclaimer: str

# Medications
class MedicationResponse(BaseModel):
    id: str
    document_id: Optional[str] = None
    document_name: Optional[str] = None
    medicine_name: str
    strength: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    route: Optional[str] = "Oral"
    duration: Optional[str] = None
    instructions: Optional[str] = None
    prescriber: Optional[str] = None
    prescription_date: Optional[str] = None
    status: str # current, historical, unknown
    is_verified: bool = False

# Timeline
class TimelineItem(BaseModel):
    id: str
    date: str
    record_type: str # prescription, lab_report, discharge_summary, diagnostic_report
    title: str
    facility_or_provider: Optional[str] = None
    status: str
    summary_snippet: str
    document_id: str
    original_filename: str
    key_metrics: List[str] = []

# ABHA Models
class ABHAConnectRequest(BaseModel):
    abha_id: str = "91-4521-8890-1234" # Mock ABHA number
    abha_address: str = "aarav.sharma@abdm"
    otp: Optional[str] = "123456"

class ABHARecordItem(BaseModel):
    care_context_id: str
    facility_name: str
    hip_id: str # Health Information Provider ID
    record_type: str
    date: str
    title: str
    summary: str
    fhir_bundle_preview: Dict[str, Any]
    is_imported: bool = False

class ABHAProfileResponse(BaseModel):
    abha_number: str
    abha_address: str
    status: str # connected, disconnected
    consent_granted: bool
    consent_granted_at: Optional[str] = None
    last_sync_at: Optional[str] = None
    available_records: List[ABHARecordItem] = []
    imported_records_count: int = 0

class ABHAImportRequest(BaseModel):
    care_context_ids: List[str]

# Audit & Evaluation
class AuditLogItem(BaseModel):
    id: str
    action_type: str
    resource_type: str
    resource_id: Optional[str] = None
    details: str
    timestamp: str

class AccuracyMetricItem(BaseModel):
    category: str
    total_fields: int
    correct_extractions: int
    accuracy_rate: float
    missing_fields_properly_handled: int
    hallucination_count: int = 0

class EvaluationReportResponse(BaseModel):
    model_mode: str
    overall_accuracy: float
    groundedness_score: float
    safety_compliance: float
    categories: List[AccuracyMetricItem]
    verified_test_cases: List[Dict[str, Any]]
