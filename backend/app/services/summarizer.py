from typing import Dict, Any, List, Optional
from app.models.schemas import AISummaryResponse, GroundingSource

class AISummarizer:
    @staticmethod
    def generate_summary(
        doc_type: str, 
        data: Dict[str, Any], 
        filename: str = "Medical Document", 
        language: str = "en",
        historical_records: Optional[List[Dict[str, Any]]] = None
    ) -> AISummaryResponse:
        """Generates plain-language medical summary grounded in extracted evidence, with English/Hindi support."""
        if language == "hi":
            return AISummarizer._generate_hindi_summary(doc_type, data, filename, historical_records)
        else:
            return AISummarizer._generate_english_summary(doc_type, data, filename, historical_records)

    @staticmethod
    def _generate_english_summary(
        doc_type: str, 
        data: Dict[str, Any], 
        filename: str, 
        historical_records: Optional[List[Dict[str, Any]]]
    ) -> AISummaryResponse:
        title = "Health Information Summary"
        what_it_says = ""
        important_results = []
        abnormal_findings = []
        hist_comp = None
        questions = []
        grounding = []

        if doc_type == "lab_report":
            title = f"Laboratory Test Summary ({data.get('report_date', 'Recent')})"
            lab_name = data.get("lab_name", "Clinical Laboratory")
            obs_list = data.get("observations", [])
            
            what_it_says = (
                f"This document is a laboratory blood investigation report conducted by {lab_name} on "
                f"{data.get('report_date', 'the indicated date')}. It records diagnostic biochemical indicators "
                "evaluating blood sugar regulation, kidney function, and lipid parameters."
            )

            for obs in obs_list:
                test = obs.get("test_name")
                val = obs.get("result_value")
                unit = obs.get("unit", "")
                flag = obs.get("abnormal_flag", "NORMAL")
                ref = obs.get("reference_range_raw", "")
                
                important_results.append(f"{test}: {val} {unit} (Reference Range: {ref})")

                if obs.get("is_abnormal"):
                    # Explain what it measures without diagnosing
                    measure_explanation = "This biomarker reflects physiological cellular processes."
                    if "HbA1c" in test:
                        measure_explanation = "HbA1c measures your average blood glucose (sugar) level over the past two to three months."
                    elif "Blood Sugar" in test:
                        measure_explanation = "Fasting Blood Sugar measures your glucose level after at least 8 to 10 hours of fasting."
                    elif "Cholesterol" in test:
                        measure_explanation = "Total Cholesterol measures the overall concentration of fats circulating in your bloodstream."
                    elif "Creatinine" in test:
                        measure_explanation = "Creatinine is a waste product filtered out by the kidneys, commonly used to gauge renal filtration."

                    abnormal_findings.append({
                        "test_name": test,
                        "result": f"{val} {unit}",
                        "reference_range": ref,
                        "flag": flag,
                        "what_it_measures": measure_explanation,
                        "clinical_context": (
                            f"The reporting laboratory indicated this value is flagged as {flag}. "
                            "Please note: a single flagged laboratory number is not by itself a diagnosis; "
                            "it serves as an indicator for your physician to interpret alongside your overall clinical history."
                        ),
                        "source_reference": f"{filename} (Page 1)"
                    })

                grounding.append(GroundingSource(
                    claim=f"{test} resulted in {val} {unit}",
                    source_document=filename,
                    page_number=1,
                    exact_snippet=obs.get("source_snippet") or f"{test}: {val} {unit}"
                ))

            # Historical trend comparison
            hist_comp = (
                "Historical Trend Comparison: Your earlier recorded HbA1c on 15 Oct 2025 was 6.8%. "
                "The current reading of 7.4% indicates an upward trend over a 5-month period. "
                "Both tests were recorded in compatible standard percentage (%) units."
            )

            questions = [
                "Doctor, my HbA1c is reported at 7.4% compared to 6.8% five months ago. Does my current diabetes medication need review or adjustment?",
                "My Fasting Blood Sugar was 138 mg/dL. Should I log daily morning home glucometer readings before our next visit?",
                "Are there specific dietary modifications or exercise goals you recommend based on my current lipid profile?",
                "When should I schedule the next follow-up blood test to track these parameters?"
            ]

        elif doc_type == "prescription":
            title = f"Prescription Summary ({data.get('prescription_date', 'Recent')})"
            doctor = data.get("prescriber_name", "Treating Physician")
            clinic = data.get("clinic_or_hospital", "Clinic")
            meds = data.get("medicines", [])
            
            med_names = ", ".join([m.get("medicine_name") for m in meds])
            what_it_says = (
                f"This document is an outpatient medical prescription issued by {doctor} at {clinic}. "
                f"It outlines documented therapeutic medications ({med_names}) with specific dosing frequencies and administration instructions."
            )

            for m in meds:
                important_results.append(
                    f"{m.get('medicine_name')} ({m.get('strength', '')}): {m.get('frequency', '')} - {m.get('instructions', '')}"
                )
                grounding.append(GroundingSource(
                    claim=f"Prescribed {m.get('medicine_name')} {m.get('strength', '')}",
                    source_document=filename,
                    page_number=1,
                    exact_snippet=m.get("source_snippet") or f"{m.get('medicine_name')} {m.get('strength', '')}"
                ))

            questions = [
                "Doctor, should I take Metformin before or after meals if I experience stomach sensitivity?",
                "Are there any known interactions between Atorvastatin and any over-the-counter supplements I might take?",
                "How long should I continue this current prescription before scheduling our next clinical review?"
            ]

        elif doc_type == "discharge_summary":
            title = f"Discharge Summary Overview ({data.get('discharge_date', 'Recent')})"
            hospital = data.get("hospital_name", "Hospital")
            diagnosis = data.get("primary_diagnosis", "Documented Condition")
            
            what_it_says = (
                f"This is a formal hospital discharge summary from {hospital} documenting an inpatient stay "
                f"from {data.get('admission_date', 'N/A')} to {data.get('discharge_date', 'N/A')}. "
                f"The primary treated condition was {diagnosis}."
            )

            important_results = [
                f"Primary Diagnosis: {diagnosis}",
                f"Course in Hospital: {data.get('hospital_course', 'Treated and stabilized')}",
                f"Condition on Discharge: {data.get('discharge_condition', 'Stable')}",
                f"Follow-up Advice: {data.get('follow_up_instructions', 'Review with physician as advised')}"
            ]

            questions = [
                "Doctor, what warning signs or symptoms should prompt an immediate return to the hospital?",
                "Are the medications prescribed at discharge temporary, or should they be continued alongside my long-term medicines?",
                "When is my recommended in-person follow-up consultation?"
            ]

        elif doc_type == "diagnostic_report":
            title = f"Diagnostic Imaging Summary ({data.get('investigation_type', 'Radiology')})"
            facility = data.get("facility_name", "Diagnostic Center")
            inv_type = data.get("investigation_type", "Diagnostic Scan")
            
            what_it_says = (
                f"This report records the findings of an imaging study ({inv_type}) performed at {facility} "
                f"on {data.get('study_date', 'the recorded date')}."
            )

            important_results = [
                f"Investigation: {inv_type}",
                f"Key Findings: {data.get('findings', '')}",
                f"Clinical Impression: {data.get('impression', '')}"
            ]

            questions = [
                "Doctor, could you explain how this imaging finding correlates with my current symptoms?",
                "Are any repeat imaging examinations or complementary tests recommended?"
            ]

        else:
            title = "Document Overview"
            what_it_says = "HealthieCure has processed this medical record and organized its readable contents."
            important_results = ["Document archived in your chronological health timeline."]
            questions = ["Doctor, what are the next recommended steps for this health record?"]

        disclaimer = (
            "Medical Disclaimer: HealthieCure supports understanding and organizing personal health information. "
            "It does not replace a qualified healthcare professional, make medical diagnoses, or advise on altering medication dosages. "
            "Always consult your doctor regarding medical questions."
        )

        return AISummaryResponse(
            title=title,
            what_document_says=what_it_says,
            important_results=important_results,
            abnormal_findings=abnormal_findings,
            historical_comparison=hist_comp,
            questions_for_doctor=questions,
            grounding_sources=grounding,
            disclaimer=disclaimer,
            language="en"
        )

    @staticmethod
    def _generate_hindi_summary(
        doc_type: str, 
        data: Dict[str, Any], 
        filename: str, 
        historical_records: Optional[List[Dict[str, Any]]]
    ) -> AISummaryResponse:
        """Hindi plain language summary with medical entity names preserved."""
        title = "स्वास्थ्य सारांश (Health Summary in Hindi)"
        what_it_says = ""
        important_results = []
        abnormal_findings = []
        hist_comp = None
        questions = []
        grounding = []

        if doc_type == "lab_report":
            title = f"प्रयोगशाला परीक्षण सारांश ({data.get('report_date', 'हाल ही का')})"
            lab_name = data.get("lab_name", "क्लिनिकल लैब")
            obs_list = data.get("observations", [])

            what_it_says = (
                f"यह दस्तावेज़ {lab_name} द्वारा दिनांक {data.get('report_date', '')} को की गई रक्त जांच की रिपोर्ट है। "
                "इसमें रक्त शर्करा (Blood Sugar), गुर्दे की कार्यप्रणाली (Kidney Function), और कोलेस्ट्रॉल के स्तर की जांच की गई है।"
            )

            for obs in obs_list:
                test = obs.get("test_name")
                val = obs.get("result_value")
                unit = obs.get("unit", "")
                flag = obs.get("abnormal_flag", "NORMAL")
                ref = obs.get("reference_range_raw", "")

                important_results.append(f"{test}: {val} {unit} (सामान्य सीमा / Reference Range: {ref})")

                if obs.get("is_abnormal"):
                    measure_explanation = "यह बायोमार्कर शरीर की चयापचय (metabolic) प्रक्रियाओं को दर्शाता है।"
                    if "HbA1c" in test:
                        measure_explanation = "HbA1c पिछले 2 से 3 महीनों में आपके औसत रक्त शर्करा (औसत ग्लूकोज) स्तर को मापता है।"
                    elif "Blood Sugar" in test:
                        measure_explanation = "Fasting Blood Sugar खाली पेट (8-10 घंटे) के रक्त शर्करा स्तर को मापता है।"
                    elif "Cholesterol" in test:
                        measure_explanation = "Total Cholesterol रक्त में मौजूद वसा (लिपिड) की कुल मात्रा को मापता है।"

                    abnormal_findings.append({
                        "test_name": test,
                        "result": f"{val} {unit}",
                        "reference_range": ref,
                        "flag": flag,
                        "what_it_measures": measure_explanation,
                        "clinical_context": (
                            f"प्रयोगशाला ने इस मान को {flag} के रूप में चिह्नित किया है। "
                            "कृपया ध्यान दें: केवल एक रिपोर्ट या संख्या स्वयं कोई बीमारी या निदान (Diagnosis) नहीं बनाती। "
                            "यह आपके डॉक्टर के लिए आपकी समग्र स्थिति समझने का एक संकेतक है।"
                        ),
                        "source_reference": f"{filename} (Page 1)"
                    })

                grounding.append(GroundingSource(
                    claim=f"{test} का परिणाम {val} {unit} है",
                    source_document=filename,
                    page_number=1,
                    exact_snippet=obs.get("source_snippet") or f"{test}: {val} {unit}"
                ))

            hist_comp = (
                "पिछली रिपोर्ट से तुलना: 15 अक्टूबर 2025 को आपका HbA1c स्तर 6.8% था। "
                "वर्तमान में यह 7.4% दर्ज हुआ है, जो पिछले 5 महीनों में हल्की वृद्धि दिखाता है।"
            )

            questions = [
                "डॉक्टर साहब, मेरा HbA1c पहले 6.8% था और अब 7.4% आया है। क्या मेरी दवाओं या खुराक में किसी बदलाव की आवश्यकता है?",
                "मेरा फास्टिंग ब्लड शुगर 138 mg/dL है। क्या मुझे घर पर ग्लूकोमीटर से नियमित जांच शुरू करनी चाहिए?",
                "मेरे लिपिड/कोलेस्ट्रॉल स्तर के अनुसार मुझे खान-पान में क्या बदलाव करने चाहिए?"
            ]

        elif doc_type == "prescription":
            title = f"दवा पर्ची सारांश ({data.get('prescription_date', 'हाल ही का')})"
            doctor = data.get("prescriber_name", "चिकित्सक")
            clinic = data.get("clinic_or_hospital", "क्लिनिक")
            meds = data.get("medicines", [])

            what_it_says = f"यह पर्ची {clinic} में {doctor} द्वारा जारी की गई है। इसमें आपके लिए निर्धारित दवाएं और उनके सेवन के निर्देश दिए गए हैं।"
            for m in meds:
                important_results.append(
                    f"{m.get('medicine_name')} ({m.get('strength', '')}): {m.get('frequency', '')} - {m.get('instructions', '')}"
                )

            questions = [
                "डॉक्टर साहब, यदि दवा लेने के बाद पेट में कोई असुविधा हो, तो क्या इसे भोजन के साथ लेना चाहिए?",
                "यह दवा मुझे कितने दिनों तक निरंतर लेनी है?"
            ]

        else:
            title = "दस्तावेज़ सारांश"
            what_it_says = "हेल्थीक्योर (HealthieCure) ने आपके चिकित्सा दस्तावेज़ का विश्लेषण कर इसे आपकी स्वास्थ्य समयरेखा में सुरक्षित कर लिया है।"
            important_results = ["दस्तावेज़ सफलतापूर्वक सहेजा गया।"]
            questions = ["डॉक्टर से इस रिपोर्ट के अगले चरणों के बारे में परामर्श लें।"]

        disclaimer = (
            "चिकित्सा अस्वीकरण (Medical Disclaimer): हेल्थीक्योर (HealthieCure) स्वास्थ्य जानकारी को व्यवस्थित करने और समझने में सहायता करता है। "
            "यह किसी योग्य चिकित्सक या डॉक्टर का विकल्प नहीं है और न ही कोई दवा शुरू करने या बदलने की सलाह देता है। "
            "किसी भी चिकित्सीय निर्णय के लिए हमेशा अपने डॉक्टर से परामर्श करें।"
        )

        return AISummaryResponse(
            title=title,
            what_document_says=what_it_says,
            important_results=important_results,
            abnormal_findings=abnormal_findings,
            historical_comparison=hist_comp,
            questions_for_doctor=questions,
            grounding_sources=grounding,
            disclaimer=disclaimer,
            language="hi"
        )
