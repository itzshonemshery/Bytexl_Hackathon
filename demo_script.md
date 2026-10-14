# Health Copilot — Demo Script & Presentation Walkthrough

**Platform:** Health Copilot (AI-Powered Personal Health Platform)  
**Hackathon:** Altrix Labs Healthcare Hackathon  
**Target Audience:** Clinical Judges, Healthcare Product Evaluators & Engineers  

---

## 3-Minute Demo Walkthrough

### Step 1: Landing Page & Healthcare Identity (30 seconds)
- **URL:** `http://localhost:5173/`
- **Visuals:** Showcase the clean clinical red (`#D71920`) and near-black aesthetic inspired by professional healthcare platforms (HealthPlus style). Point out the active ECG heartbeat brand element, high-contrast typography, and patient benefit cards.
- **Bilingual Interface:** Click the **"हिंदी (HI)"** toggle in the header to demonstrate full dictionary translation across headlines, navigation, and clinical descriptions. Switch back to **"EN"**.
- **Action:** Click **"1-Click Demo"** in the header navigation or hero section.

---

### Step 2: Patient Dashboard & Overview (30 seconds)
- **Status:** Instantly logs in as verified synthetic demo patient **Aarav Sharma** (42 Y / Male, UHID: `APX-98214`).
- **Greeting & Overview:** Show the clean overview, category counts (Prescriptions: 1, Lab Reports: 2, Medications: 3, Discharge Summaries: 1).
- **ABHA Sandbox Banner:** Highlight the linked mock ABHA ID (`91-4521-8890-1234`) with active sandbox consent.
- **Recent Records:** Point out the chronological list of records with confidence badges.

---

### Step 3: Document Upload & OCR Extraction (45 seconds)
- **Action:** Click **"Upload Medical Record"** or navigate to **"Upload Records"** in the sidebar.
- **Quick Test:** Click the **"Sample Lab Report (HbA1c & Lipids)"** quick-load button (or drag & drop a PDF from `test_samples/`).
- **Processing:** Observe the real-time processing indicators (PyMuPDF text extraction, high-resolution page rendering, and automatic document classification).
- **Result:** Note the classification confidence (98%), language detection, and schema mapping.
- **Action:** Click **"Proceed to Human Review & Verification Screen"**.

---

### Step 4: Human Review & Verification Screen (45 seconds)
- **Side-by-Side Verification:**
  - **Left side:** High-resolution ground truth preview rendered directly from the original PDF.
  - **Right side:** Editable clinical fields (HbA1c: 7.4%, Fasting Glucose: 138 mg/dL, Total Cholesterol: 218 mg/dL).
- **Source Traceability:** Highlight the confidence indicators and source snippets.
- **Edit & Confirm:** Edit any field (e.g., add a verification note "Reviewed by patient"), then click **"Confirm & Save to Health Records"**.
- **Result:** The record status transitions to verified and synchronizes to the patient timeline.

---

### Step 5: Plain-Language AI Summary & Historical Comparison (30 seconds)
- **Action:** Navigate to **"AI Summary"**.
- **Sections:**
  1. *What the Document Says:* Plain-language explanation of biochemical panels.
  2. *Flagged Laboratory Values:* Highlights HbA1c (7.4%) and Fasting Sugar (138 mg/dL) against printed reference intervals (4.0 - 5.6% and 70 - 99 mg/dL). Explains what the tests measure **without diagnosing**.
  3. *Compatible Historical Comparison:* Compares 15-Oct-2025 HbA1c (6.8%) with 12-Mar-2026 HbA1c (7.4%) to illustrate a 5-month glycemic trend.
  4. *Doctor Conversation Questions:* Curated list of questions to empower patient consultations.
- **Hindi Summary:** Click **"हिंदी (Hindi)"** to view the verified translation with preserved medical biomarkers.

---

### Step 6: Unified Health Timeline & Medications (30 seconds)
- **Timeline:** Filter by category (Prescriptions, Lab Reports, Discharge Summaries) or search for "Metformin" or "Cholesterol".
- **Medications:** Navigate to **"Medications"** to show categorization into *Current Ongoing*, *Historical / Completed* (e.g., completed Rifaximin antibiotic course), and *Status Unknown*.

---

### Step 7: ABHA Connect & FHIR R4 Interoperability (30 seconds)
- **ABHA Connect:**
  - View simulated care contexts from **Max Super Speciality Hospital**, **Apollo Hospitals**, and **Dr. Lal PathLabs**.
  - Demonstrate importing a discoverable care context with 1 click.
  - Show the **"Revoke Consent & Disconnect ABHA"** control.
- **FHIR & Architecture:**
  - View the 8-stage architecture pipeline diagram.
  - Inspect the live, interactive **HL7 FHIR R4 Document Bundle JSON** with serialized `Patient`, `Observation`, `MedicationRequest`, and `DocumentReference` resources.
  - Show the **Accuracy & Benchmark Report** measuring 100% groundedness and zero hallucinations.

---

## Key Talking Points for Judges

1. **Non-Diagnostic Safety First:** Health Copilot strictly organizes records and explains lab ranges; it never pretends to be a doctor or recommends changing medication dosages.
2. **True Full-Stack Implementation:** Real FastAPI backend, PyMuPDF engine, SQLite persistence, JWT authentication, and React 19 + TypeScript frontend.
3. **Zero-Hallucination Grounding:** Every summarized claim cites verifiable line items in the source document.
4. **Interoperability Ready:** Built natively for ABDM with FHIR R4 data models and mock sandbox integration.
