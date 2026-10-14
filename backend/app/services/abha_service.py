from typing import Dict, Any, List
from datetime import datetime

class ABHAMockService:
    @staticmethod
    def get_sandbox_facilities() -> List[Dict[str, Any]]:
        return [
            {
                "hip_id": "IN070001",
                "facility_name": "Max Super Speciality Hospital, Saket",
                "facility_type": "Hospital",
                "registered_abdm": True
            },
            {
                "hip_id": "IN070002",
                "facility_name": "Apollo Hospitals, New Delhi",
                "facility_type": "Multi-Speciality",
                "registered_abdm": True
            },
            {
                "hip_id": "IN070003",
                "facility_name": "Dr. Lal PathLabs National Reference Lab",
                "facility_type": "Diagnostic Diagnostic Lab",
                "registered_abdm": True
            }
        ]

    @staticmethod
    def get_discoverable_care_contexts(abha_number: str) -> List[Dict[str, Any]]:
        """Returns synthetic discoverable care contexts for demo patient."""
        return [
            {
                "care_context_id": "CC-MAX-2025-8812",
                "facility_name": "Max Super Speciality Hospital, Saket",
                "hip_id": "IN070001",
                "record_type": "discharge_summary",
                "date": "2025-11-20",
                "title": "Hospital Discharge Summary - Viral Pyrexia",
                "summary": "Inpatient admission for 3 days due to acute febrile illness. Full recovery documented upon discharge.",
                "fhir_bundle_preview": {
                    "resourceType": "Bundle",
                    "type": "document",
                    "total": 3,
                    "entryTypes": ["Patient", "Encounter", "Condition", "DocumentReference"]
                },
                "is_imported": False
            },
            {
                "care_context_id": "CC-LAL-2025-4491",
                "facility_name": "Dr. Lal PathLabs National Reference Lab",
                "hip_id": "IN070003",
                "record_type": "lab_report",
                "date": "2025-10-15",
                "title": "Comprehensive Metabolic & Lipid Panel",
                "summary": "HbA1c: 6.8 %, Fasting Sugar: 122 mg/dL, Total Cholesterol: 195 mg/dL.",
                "fhir_bundle_preview": {
                    "resourceType": "Bundle",
                    "type": "diagnostic-report",
                    "total": 4,
                    "entryTypes": ["Patient", "Observation", "DiagnosticReport"]
                },
                "is_imported": True
            },
            {
                "care_context_id": "CC-APO-2026-1102",
                "facility_name": "Apollo Hospitals, New Delhi",
                "hip_id": "IN070002",
                "record_type": "diagnostic_report",
                "date": "2026-01-08",
                "title": "Ultrasound Whole Abdomen",
                "summary": "Normal hepatobiliary scan. Mild Grade 1 hepatic steatosis. Kidneys and bladder normal.",
                "fhir_bundle_preview": {
                    "resourceType": "Bundle",
                    "type": "imaging-study",
                    "total": 2,
                    "entryTypes": ["Patient", "DiagnosticReport"]
                },
                "is_imported": False
            }
        ]
