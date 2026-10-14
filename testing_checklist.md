# Health Copilot — Testing & Verification Checklist

This checklist verifies the functionality, security, and clinical safety compliance of **Health Copilot** for the Altrix Labs Healthcare Hackathon.

---

## 1. Authentication & Session Management
- [x] **Local Registration:** Users can sign up with email, password, full name, and demographics. Password hashed with bcrypt (no plaintext storage).
- [x] **Local Login:** Existing accounts authenticate and receive signed HS256 JWT tokens with 7-day expiration.
- [x] **1-Click Demo Login:** Evaluators can click "1-Click Demo" to log into synthetic demo patient **Aarav Sharma** with pre-seeded clinical history.
- [x] **Profile Updates:** Patients can modify blood group, date of birth, emergency contacts, and preferred languages.
- [x] **Sign Out:** Tokens are purged from client storage; unauthenticated users are redirected to the landing page.

---

## 2. Document Ingestion & Validation
- [x] **Format Validation:** Accepts PDF, JPG, JPEG, and PNG. Rejects unsupported extensions with user-friendly errors.
- [x] **Size Constraint:** Validates file size against a 25 MB upper limit.
- [x] **Duplicate Detection:** Computes SHA-256 file hashes to detect repeated uploads of identical documents.
- [x] **Drag-and-Drop & File Picker:** Both desktop drag-and-drop and OS native file selection work smoothly.
- [x] **Fast Sample Ingestion:** 1-click loading of synthetic prescription, laboratory report, and discharge summary directly from server sample files.

---

## 3. OCR, Classification & Structured Extraction
- [x] **PyMuPDF Extraction:** Direct text extraction for digitally generated PDFs; high-resolution PNG page preview generation.
- [x] **Automatic Classification:** Keyword and schema classifier tags records as `prescription`, `lab_report`, `discharge_summary`, or `diagnostic_report`.
- [x] **Field Provenance:** Each extracted field retains its confidence score, source snippet, and page number.
- [x] **Prescription Extraction:** Identifies medicines, strengths (500mg, 10mg), dosages, frequencies (OD, BD), routes, and instructions.
- [x] **Laboratory Extraction:** Captures test names, numeric results, units, biological reference intervals, and printed abnormal flags (HIGH, LOW, NORMAL).
- [x] **Discharge Summary Extraction:** Extracts hospital, admission date, discharge date, primary diagnosis, hospital course, and discharge medications.
- [x] **Missing Field Handling:** Missing values are represented as `null` or `unknown` rather than fabricated or hallucinated.

---

## 4. Human Review & Verification Screen
- [x] **Side-by-Side Verification:** Original document page preview rendered alongside editable structured fields.
- [x] **Field Editing:** Users can edit medications, dosages, frequencies, lab values, and diagnoses.
- [x] **Audit Preservation:** Original raw extraction is preserved in `raw_extracted_json`; user corrections saved in `verified_json`.
- [x] **Confirm & Save:** Marking record as verified updates the status, updates active medications and observations, and logs a tamper-evident audit event.

---

## 5. Grounded AI Summary
- [x] **Plain-Language Translation:** Translates complex laboratory parameters and prescription instructions into simple, readable text.
- [x] **Printed Reference Range Anchoring:** Abnormal results are anchored strictly to the reference ranges printed on that report.
- [x] **Non-Diagnostic Framing:** Explains what biomarkers measure without claiming an independent diagnosis or severity score.
- [x] **Compatible Historical Comparisons:** Evaluates compatible tests across dates (e.g., HbA1c 6.8% in Oct 2025 vs 7.4% in Mar 2026).
- [x] **Doctor Questions:** Automatically curates relevant questions for patient consultation.
- [x] **Deterministic Fallback:** Operates with high fidelity and zero hallucinations even when external LLM API keys are unconfigured.

---

## 6. Bilingual User Experience (English & Hindi)
- [x] **Dictionary Completeness:** Full translation dictionary for navigation, buttons, status indicators, upload prompts, and disclaimers.
- [x] **State Persistence:** Users can switch between English and Hindi without page refreshes or losing entered data.
- [x] **Medical Term Integrity:** Original medicine names (Metformin, Atorvastatin), numerical values (7.4), and units (%) remain uncorrupted in Hindi mode.

---

## 7. Unified Health Timeline & Medication Management
- [x] **Chronological Timeline:** Combines all records with descending date sorting.
- [x] **Category Filtering:** Filter tabs for Prescriptions, Lab Reports, Discharge Summaries, and Diagnostics.
- [x] **Search:** Real-time search across record titles, doctors, facilities, and key metrics.
- [x] **Medication Classification:** Categorizes medicines into *Current Ongoing*, *Historical / Completed*, and *Status Unknown*.
- [x] **Non-Prescribing Boundary:** Does not recommend starting, stopping, or altering medications independently.

---

## 8. ABHA Sandbox & FHIR R4 Interoperability
- [x] **Demo ABHA Connection:** Clearly labeled mock ABHA identifier (`91-4521-8890-1234`) with explicit consent controls.
- [x] **Care Context Discovery:** Simulates discoverable records from registered facilities (Max Healthcare, Apollo Hospitals, Dr. Lal PathLabs).
- [x] **Care Context Import:** Selected care contexts can be imported into the patient's timeline with 1 click.
- [x] **Consent Revocation:** Disconnect button revokes consent and disconnects the mock ABHA identifier.
- [x] **FHIR R4 Serialization:** Interactive preview inspector renders valid HL7 FHIR R4 document bundles with `Patient`, `Observation`, `MedicationRequest`, and `DocumentReference` resources.

---

## 9. Security, Privacy & Compliance
- [x] **Per-User Isolation:** Database queries strictly filter by authenticated user ID.
- [x] **Safe Secrets:** No API keys or database secrets exposed in the frontend client.
- [x] **Deletion Workflow:** Users can permanently delete documents and cascading extractions.
- [x] **Audit Trail:** Logs upload, review, import, sharing, and deletion events in real time.
- [x] **Persistent Disclaimer:** Persistent medical disclaimer visibly displayed across the platform.
