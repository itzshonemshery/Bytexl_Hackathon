import uuid
from typing import Dict, Any, List
from datetime import datetime

class FHIRConverter:
    @staticmethod
    def create_patient_resource(user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps user profile to FHIR R4 Patient resource."""
        return {
            "resourceType": "Patient",
            "id": f"pat-{user_data.get('id', 'demo-user')}",
            "identifier": [
                {
                    "system": "https://healthid.ndhm.gov.in",
                    "value": user_data.get("abha_id", "91-4521-8890-1234"),
                    "type": {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                "code": "MR",
                                "display": "Medical Record Number / ABHA ID"
                            }
                        ]
                    }
                }
            ],
            "name": [
                {
                    "use": "official",
                    "text": user_data.get("full_name", "Aarav Sharma")
                }
            ],
            "gender": (user_data.get("gender") or "male").lower(),
            "birthDate": user_data.get("dob", "1983-05-14")
        }

    @staticmethod
    def create_observation_resource(obs: Dict[str, Any], patient_id: str, report_date: str) -> Dict[str, Any]:
        """Maps a lab test result to FHIR R4 Observation resource."""
        obs_id = f"obs-{uuid.uuid4().hex[:8]}"
        res_val = obs.get("result_value")
        unit = obs.get("unit", "")
        
        resource = {
            "resourceType": "Observation",
            "id": obs_id,
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                            "code": "laboratory",
                            "display": "Laboratory"
                        }
                    ]
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "4548-4" if "HbA1c" in obs.get("test_name", "") else "1558-6",
                        "display": obs.get("test_name")
                    }
                ],
                "text": obs.get("test_name")
            },
            "subject": {
                "reference": f"Patient/{patient_id}"
            },
            "effectiveDateTime": report_date or datetime.utcnow().strftime("%Y-%m-%d"),
            "valueQuantity": {
                "value": res_val,
                "unit": unit,
                "system": "http://unitsofmeasure.org",
                "code": "%" if unit == "%" else "mg/dL"
            } if res_val is not None else None,
            "interpretation": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                            "code": "H" if obs.get("abnormal_flag") == "HIGH" else ("L" if obs.get("abnormal_flag") == "LOW" else "N"),
                            "display": obs.get("abnormal_flag", "Normal")
                        }
                    ]
                }
            ] if obs.get("abnormal_flag") else [],
            "referenceRange": [
                {
                    "low": {"value": obs.get("reference_range_low")},
                    "high": {"value": obs.get("reference_range_high")},
                    "text": obs.get("reference_range_raw")
                }
            ] if obs.get("reference_range_raw") else []
        }
        return resource

    @staticmethod
    def create_medication_request_resource(med: Dict[str, Any], patient_id: str, prescriber: str) -> Dict[str, Any]:
        """Maps a prescribed medication to FHIR R4 MedicationRequest."""
        med_id = f"medreq-{uuid.uuid4().hex[:8]}"
        return {
            "resourceType": "MedicationRequest",
            "id": med_id,
            "status": "active" if med.get("status") == "current" else "completed",
            "intent": "order",
            "medicationCodeableConcept": {
                "coding": [
                    {
                        "system": "http://snomed.info/sct",
                        "display": med.get("medicine_name")
                    }
                ],
                "text": f"{med.get('medicine_name')} {med.get('strength', '')}".strip()
            },
            "subject": {
                "reference": f"Patient/{patient_id}"
            },
            "requester": {
                "display": prescriber or "Treating Physician"
            },
            "dosageInstruction": [
                {
                    "text": f"{med.get('dosage', '')} {med.get('frequency', '')} ({med.get('instructions', '')})",
                    "timing": {
                        "code": {
                            "text": med.get("frequency", "OD")
                        }
                    },
                    "route": {
                        "coding": [
                            {
                                "system": "http://snomed.info/sct",
                                "code": "260548002",
                                "display": med.get("route", "Oral")
                            }
                        ]
                    }
                }
            ]
        }

    @staticmethod
    def create_document_reference_resource(doc: Dict[str, Any], patient_id: str) -> Dict[str, Any]:
        """Maps uploaded document to FHIR R4 DocumentReference."""
        return {
            "resourceType": "DocumentReference",
            "id": f"docref-{doc.get('id', uuid.uuid4().hex[:8])}",
            "status": "current",
            "type": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "display": doc.get("document_type", "Clinical Document")
                    }
                ],
                "text": doc.get("original_filename", "Clinical Document")
            },
            "subject": {
                "reference": f"Patient/{patient_id}"
            },
            "date": doc.get("upload_date", datetime.utcnow().isoformat()),
            "content": [
                {
                    "attachment": {
                        "contentType": "application/pdf" if doc.get("file_type") == "pdf" else "image/png",
                        "url": f"/api/v1/documents/preview-file/{doc.get('stored_filename', '')}",
                        "title": doc.get("original_filename")
                    }
                }
            ]
        }

    @classmethod
    def generate_bundle(cls, user_data: Dict[str, Any], document_data: Dict[str, Any], extraction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Constructs an integrated FHIR R4 Document Bundle."""
        patient_res = cls.create_patient_resource(user_data)
        doc_ref = cls.create_document_reference_resource(document_data, patient_res["id"])
        
        entries = [
            {"fullUrl": f"urn:uuid:{patient_res['id']}", "resource": patient_res},
            {"fullUrl": f"urn:uuid:{doc_ref['id']}", "resource": doc_ref}
        ]

        doc_type = document_data.get("document_type")
        raw_data = extraction_data.get("data", {})

        if doc_type == "lab_report":
            for obs in raw_data.get("observations", []):
                obs_res = cls.create_observation_resource(obs, patient_res["id"], raw_data.get("report_date", ""))
                entries.append({"fullUrl": f"urn:uuid:{obs_res['id']}", "resource": obs_res})

        elif doc_type == "prescription":
            prescriber = raw_data.get("prescriber_name", "Doctor")
            for med in raw_data.get("medicines", []):
                med_res = cls.create_medication_request_resource(med, patient_res["id"], prescriber)
                entries.append({"fullUrl": f"urn:uuid:{med_res['id']}", "resource": med_res})

        elif doc_type == "discharge_summary":
            # Condition
            cond_res = {
                "resourceType": "Condition",
                "id": f"cond-{uuid.uuid4().hex[:8]}",
                "clinicalStatus": {
                    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/condition-clinical", "code": "resolved"}]
                },
                "code": {"text": raw_data.get("primary_diagnosis", "Acute Condition")},
                "subject": {"reference": f"Patient/{patient_res['id']}"}
            }
            entries.append({"fullUrl": f"urn:uuid:{cond_res['id']}", "resource": cond_res})

        return {
            "resourceType": "Bundle",
            "id": f"bundle-{uuid.uuid4().hex[:8]}",
            "type": "document",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "entry": entries
        }
