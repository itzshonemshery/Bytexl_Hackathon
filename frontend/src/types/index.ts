export interface User {
  id: string;
  email: string;
  full_name: string;
  dob?: string;
  gender?: string;
  blood_group?: string;
  preferred_language: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  abha_id?: string;
  is_demo: boolean;
}

export interface DocumentItem {
  id: string;
  user_id: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  document_type: string; // prescription, lab_report, discharge_summary, diagnostic_report, unknown
  classification_confidence: number;
  upload_date: string;
  status: string;
  thumbnail_path?: string;
  page_count: number;
  has_verified_extraction: boolean;
}

export interface PrescriptionMedicine {
  medicine_name: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  instructions?: string;
  status?: string;
  confidence?: number;
  source_snippet?: string;
}

export interface LabObservation {
  id?: string;
  test_name: string;
  result_value?: number;
  result_text: string;
  unit?: string;
  reference_range_raw?: string;
  reference_range_low?: number;
  reference_range_high?: number;
  is_abnormal: boolean;
  abnormal_flag?: string;
  interpretation?: string;
  confidence?: number;
  source_snippet?: string;
  report_date?: string;
}

export interface ExtractionData {
  id: string;
  document_id: string;
  document_type: string;
  confidence_score: number;
  is_verified: boolean;
  verified_at?: string;
  data: any;
  raw_extracted_data?: any;
  field_confidences: Record<string, number>;
  ocr_snippets: Record<string, string>;
  raw_text_preview: string;
  thumbnail_path?: string;
}

export interface GroundingSource {
  claim: string;
  source_document: string;
  page_number: number;
  exact_snippet: string;
}

export interface AbnormalFinding {
  test_name: string;
  result: string;
  reference_range: string;
  flag: string;
  what_it_measures: string;
  clinical_context: string;
  source_reference: string;
}

export interface AISummary {
  id?: string;
  document_id?: string;
  language: string;
  summary_type: string;
  title: string;
  what_document_says: string;
  important_results: string[];
  abnormal_findings: AbnormalFinding[];
  historical_comparison?: string;
  questions_for_doctor: string[];
  grounding_sources: GroundingSource[];
  disclaimer: string;
}

export interface MedicationItem {
  id: string;
  document_id?: string;
  document_name?: string;
  medicine_name: string;
  strength?: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  instructions?: string;
  prescriber?: string;
  prescription_date?: string;
  status: string; // current, historical, unknown
  is_verified: boolean;
}

export interface TimelineItem {
  id: string;
  date: string;
  record_type: string;
  title: string;
  facility_or_provider?: string;
  status: string;
  summary_snippet: string;
  document_id: string;
  original_filename: string;
  key_metrics: string[];
}

export interface ABHARecordItem {
  care_context_id: string;
  facility_name: string;
  hip_id: string;
  record_type: string;
  date: string;
  title: string;
  summary: string;
  fhir_bundle_preview: any;
  is_imported: boolean;
}

export interface ABHAProfile {
  abha_number: string;
  abha_address: string;
  status: string;
  consent_granted: boolean;
  consent_granted_at?: string;
  last_sync_at?: string;
  available_records: ABHARecordItem[];
  imported_records_count: number;
}

export interface AuditLog {
  id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  details: string;
  timestamp: string;
}

export interface AccuracyCategory {
  category: string;
  total_fields: number;
  correct_extractions: number;
  accuracy_rate: number;
  missing_fields_properly_handled: number;
  hallucination_count: number;
}

export interface EvaluationReport {
  model_mode: string;
  overall_accuracy: number;
  groundedness_score: number;
  safety_compliance: number;
  categories: AccuracyCategory[];
  verified_test_cases: any[];
}
