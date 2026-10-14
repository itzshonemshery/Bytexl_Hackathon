import os
import pymupdf
from PIL import Image, ImageDraw, ImageFont
from app.config import settings

def generate_sample_prescription_pdf(output_path: str):
    """Generates a realistic clinical prescription PDF with doctor details, Rx symbol, and medications."""
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842) # A4 size
    
    # Header Clinic banner
    rect_header = pymupdf.Rect(40, 40, 555, 120)
    page.draw_rect(rect_header, color=(0.84, 0.1, 0.13), width=1.5)
    page.insert_text((55, 65), "APEX CARE MULTI-SPECIALITY CLINIC", fontsize=16, fontname="hebo", color=(0.84, 0.1, 0.13))
    page.insert_text((55, 85), "Dr. Vikram Seth, MBBS, MD (Internal Medicine) | Reg No: DMC/R/48291", fontsize=10, fontname="helv", color=(0.1, 0.1, 0.1))
    page.insert_text((55, 102), "Address: Suite 402, Ring Road, New Delhi 110029 | Ph: +91 11 4982 7700", fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
    
    # Patient Info bar
    page.draw_line((40, 140), (555, 140), color=(0.8, 0.8, 0.8), width=1)
    page.insert_text((45, 160), "Patient Name: Aarav Sharma", fontsize=11, fontname="helv")
    page.insert_text((240, 160), "Age/Sex: 42 Y / Male", fontsize=11, fontname="helv")
    page.insert_text((380, 160), "Date: 10-Mar-2026", fontsize=11, fontname="helv")
    page.insert_text((45, 180), "UHID: APX-98214", fontsize=10, fontname="helv", color=(0.3, 0.3, 0.3))
    page.insert_text((240, 180), "BP: 130/84 mmHg | Pulse: 74 bpm", fontsize=10, fontname="helv", color=(0.3, 0.3, 0.3))
    page.draw_line((40, 195), (555, 195), color=(0.8, 0.8, 0.8), width=1)

    # Rx Symbol
    page.insert_text((45, 235), "Rx", fontsize=28, fontname="tibo", color=(0.84, 0.1, 0.13))
    
    # Medications
    meds = [
        ("1. Tab. Metformin Hydrochloride 500mg", "Dosage: 1 Tablet  |  Frequency: BD (Twice daily, after meals)", "Duration: 30 days  |  Instructions: Take with morning and evening meals"),
        ("2. Tab. Atorvastatin 10mg", "Dosage: 1 Tablet  |  Frequency: OD (Once daily, at bedtime)", "Duration: 30 days  |  Instructions: Take with water before sleep"),
        ("3. Tab. Telmisartan 40mg", "Dosage: 1 Tablet  |  Frequency: OD (Once daily, morning)", "Duration: 30 days  |  Instructions: Take after breakfast regularly")
    ]
    
    y = 270
    for title, dose, inst in meds:
        page.insert_text((60, y), title, fontsize=12, fontname="hebo", color=(0.1, 0.1, 0.1))
        page.insert_text((75, y + 18), dose, fontsize=10, fontname="helv", color=(0.2, 0.2, 0.2))
        page.insert_text((75, y + 34), inst, fontsize=9.5, fontname="helv", color=(0.4, 0.4, 0.4))
        y += 60

    # Clinical Advice & Follow-up
    page.draw_line((40, y + 20), (555, y + 20), color=(0.85, 0.85, 0.85), width=1)
    page.insert_text((45, y + 45), "Advice & Follow-Up:", fontsize=11, fontname="hebo")
    page.insert_text((45, y + 65), "- Maintain low-glycemic, low-sodium dietary regimen. 30 mins brisk walking daily.", fontsize=10, fontname="helv")
    page.insert_text((45, y + 85), "- Repeat HbA1c and Serum Creatinine prior to next appointment.", fontsize=10, fontname="helv")
    page.insert_text((45, y + 105), "- Review in OPD after 4 weeks or SOS in case of discomfort.", fontsize=10, fontname="helv")

    # Doctor Signature stamp
    page.insert_text((400, 750), "Dr. Vikram Seth", fontsize=12, fontname="hebo")
    page.insert_text((400, 765), "Reg DMC-48291 (Delhi)", fontsize=9, fontname="helv", color=(0.4, 0.4, 0.4))
    page.draw_line((390, 740), (520, 740), color=(0.2, 0.2, 0.2), width=1)

    doc.save(output_path)
    doc.close()


def generate_sample_lab_report_pdf(output_path: str):
    """Generates a realistic clinical biochemistry laboratory report PDF."""
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)

    # Header
    page.draw_rect(pymupdf.Rect(40, 40, 555, 110), color=(0.1, 0.1, 0.1), width=1)
    page.insert_text((55, 65), "METROPOLIS CLINICAL PATHOLOGY LABORATORIES", fontsize=15, fontname="hebo", color=(0.84, 0.1, 0.13))
    page.insert_text((55, 83), "NABL Accredited Medical Testing Laboratory | ISO 15189:2022 Certified", fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
    page.insert_text((55, 98), "Central Processing Lab: Plot 18, Okhla Industrial Area, New Delhi | Tel: 1800-209-1234", fontsize=8.5, fontname="helv", color=(0.4, 0.4, 0.4))

    # Patient Details Bar
    page.draw_rect(pymupdf.Rect(40, 125, 555, 175), color=(0.9, 0.9, 0.9), fill=(0.96, 0.96, 0.97))
    page.insert_text((50, 142), "Patient: Aarav Sharma", fontsize=10, fontname="hebo")
    page.insert_text((230, 142), "Ref By: Dr. Vikram Seth", fontsize=10, fontname="helv")
    page.insert_text((420, 142), "Sample Date: 12-Mar-2026", fontsize=10, fontname="helv")
    page.insert_text((50, 162), "Age / Gender: 42 Y / Male", fontsize=10, fontname="helv")
    page.insert_text((230, 162), "Sample Type: Fluoride & Serum", fontsize=10, fontname="helv")
    page.insert_text((420, 162), "Report Date: 12-Mar-2026", fontsize=10, fontname="helv")

    # Table Header
    y_table = 200
    page.draw_rect(pymupdf.Rect(40, y_table, 555, y_table + 24), fill=(0.9, 0.92, 0.94))
    page.insert_text((48, y_table + 16), "INVESTIGATION", fontsize=9.5, fontname="hebo")
    page.insert_text((240, y_table + 16), "RESULT", fontsize=9.5, fontname="hebo")
    page.insert_text((320, y_table + 16), "UNIT", fontsize=9.5, fontname="hebo")
    page.insert_text((390, y_table + 16), "REFERENCE INTERVAL", fontsize=9.5, fontname="hebo")
    page.insert_text((515, y_table + 16), "FLAG", fontsize=9.5, fontname="hebo")

    tests = [
        ("HbA1c (Glycated Hemoglobin)", "7.4", "%", "4.0 - 5.6", "HIGH", True),
        ("Estimated Average Glucose (eAG)", "166", "mg/dL", "70 - 126", "HIGH", True),
        ("Fasting Blood Sugar (Glucose)", "138", "mg/dL", "70 - 99", "HIGH", True),
        ("Serum Creatinine", "0.95", "mg/dL", "0.7 - 1.3", "NORMAL", False),
        ("Blood Urea Nitrogen (BUN)", "14.2", "mg/dL", "8.0 - 20.0", "NORMAL", False),
        ("Total Cholesterol", "218", "mg/dL", "125 - 200", "HIGH", True),
        ("Triglycerides", "185", "mg/dL", "50 - 150", "HIGH", True),
        ("HDL Cholesterol (Good)", "44", "mg/dL", "40 - 60", "NORMAL", False),
        ("LDL Cholesterol (Calculated)", "137", "mg/dL", "50 - 100", "HIGH", True),
        ("Total Leucocyte Count (WBC)", "6800", "cells/uL", "4000 - 11000", "NORMAL", False),
        ("Hemoglobin", "14.8", "g/dL", "13.0 - 17.0", "NORMAL", False),
        ("Platelet Count", "240", "thou/uL", "150 - 450", "NORMAL", False)
    ]

    curr_y = y_table + 45
    for name, res, unit, ref, flag, is_abn in tests:
        color = (0.84, 0.1, 0.13) if is_abn else (0.1, 0.1, 0.1)
        font = "hebo" if is_abn else "helv"
        
        page.insert_text((48, curr_y), name, fontsize=9, fontname="helv")
        page.insert_text((240, curr_y), res, fontsize=9.5, fontname=font, color=color)
        page.insert_text((320, curr_y), unit, fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
        page.insert_text((390, curr_y), ref, fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))
        if is_abn:
            page.draw_rect(pymupdf.Rect(510, curr_y - 10, 545, curr_y + 3), fill=(1.0, 0.9, 0.9))
            page.insert_text((515, curr_y), flag, fontsize=8, fontname="hebo", color=(0.84, 0.1, 0.13))
        else:
            page.insert_text((515, curr_y), flag, fontsize=8, fontname="helv", color=(0.4, 0.4, 0.4))
            
        page.draw_line((40, curr_y + 6), (555, curr_y + 6), color=(0.94, 0.94, 0.94), width=0.5)
        curr_y += 24

    # Interpretation footer
    page.insert_text((45, 680), "Interpretation & Clinical Note:", fontsize=10, fontname="hebo")
    page.insert_text((45, 698), "Glycated hemoglobin (HbA1c) reflects glycemic control over the preceding 60 to 90 days.", fontsize=8.5, fontname="helv")
    page.insert_text((45, 712), "Values >= 6.5% indicate diabetes according to ADA criteria. Clinical correlation advised.", fontsize=8.5, fontname="helv")
    
    page.draw_line((40, 740), (555, 740), color=(0.8, 0.8, 0.8), width=1)
    page.insert_text((45, 760), "Dr. Ananya Roy, MD", fontsize=10, fontname="hebo")
    page.insert_text((45, 772), "Chief Pathologist & Lab Director", fontsize=8.5, fontname="helv", color=(0.4, 0.4, 0.4))
    page.insert_text((380, 760), "*** End of Metropolis Laboratory Report ***", fontsize=8.5, fontname="helv", color=(0.4, 0.4, 0.4))

    doc.save(output_path)
    doc.close()


def generate_sample_discharge_summary_pdf(output_path: str):
    """Generates a realistic inpatient discharge summary PDF."""
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)

    # Header
    page.draw_rect(pymupdf.Rect(40, 40, 555, 115), color=(0.84, 0.1, 0.13), width=1)
    page.insert_text((55, 65), "FORTIS MEMORIAL RESEARCH INSTITUTE", fontsize=15, fontname="hebo", color=(0.84, 0.1, 0.13))
    page.insert_text((55, 83), "Department of Internal Medicine & Critical Care", fontsize=10, fontname="helv")
    page.insert_text((55, 100), "Sector 44, Gurugram, Haryana 122002 | NABH & JCI Accredited", fontsize=9, fontname="helv", color=(0.4, 0.4, 0.4))

    # Details
    page.insert_text((45, 145), "INPATIENT DISCHARGE SUMMARY", fontsize=13, fontname="hebo", color=(0.1, 0.1, 0.1))
    page.draw_line((40, 155), (555, 155), color=(0.8, 0.8, 0.8), width=1)

    page.insert_text((45, 175), "Patient Name: Aarav Sharma", fontsize=10, fontname="helv")
    page.insert_text((240, 175), "IP No: FMRI-IP-2026-9901", fontsize=10, fontname="helv")
    page.insert_text((420, 175), "UHID: FM-882194", fontsize=10, fontname="helv")

    page.insert_text((45, 195), "Admission Date: 14-Jan-2026", fontsize=10, fontname="hebo")
    page.insert_text((240, 195), "Discharge Date: 18-Jan-2026", fontsize=10, fontname="hebo")
    page.insert_text((420, 195), "Ward/Bed: 4th Floor / 412", fontsize=10, fontname="helv")
    page.draw_line((40, 208), (555, 208), color=(0.8, 0.8, 0.8), width=1)

    # Diagnoses
    page.insert_text((45, 230), "PRIMARY DIAGNOSIS:", fontsize=11, fontname="hebo", color=(0.84, 0.1, 0.13))
    page.insert_text((180, 230), "Acute Gastroenteritis with Moderate Dehydration", fontsize=11, fontname="helv")

    page.insert_text((45, 252), "SECONDARY DIAGNOSES:", fontsize=10, fontname="hebo")
    page.insert_text((180, 252), "Type 2 Diabetes Mellitus, Essential Hypertension", fontsize=10, fontname="helv")

    page.insert_text((45, 280), "HOSPITAL COURSE & SUMMARY:", fontsize=10, fontname="hebo")
    course = (
        "Patient presented with multiple episodes of vomiting and loose watery stools associated with mild abdominal cramping "
        "and malaise for 24 hours prior to admission. Baseline labs revealed hemoconcentration with normal electrolyte levels. "
        "IV fluid rehydration initiated immediately. Patient responded satisfactorily to hydration, antiemetics, and short antibiotic therapy. "
        "Tolerated oral feeds well by Day 3. Blood sugar remained controlled on regular basal therapy. Afebrile for 48 hours prior to discharge."
    )
    # Split text into lines
    y = 300
    for chunk in [course[:95], course[95:190], course[190:285], course[285:]]:
        page.insert_text((45, y), chunk.strip(), fontsize=9.5, fontname="helv")
        y += 16

    # Discharge Medications
    y += 15
    page.insert_text((45, y), "DISCHARGE MEDICATIONS:", fontsize=10, fontname="hebo")
    y += 20
    disch_meds = [
        "1. Tab Rifaximin 400 mg - TDS (Thrice daily) for 5 days post meals.",
        "2. Sachet ORS in 1 Liter clean water - As needed to maintain hydration.",
        "3. Tab Pantoprazole 40 mg - OD (Once daily) empty stomach for 7 days.",
        "4. Continue baseline antidiabetic medications (Metformin 500mg BD) as previously prescribed."
    ]
    for dm in disch_meds:
        page.insert_text((55, y), dm, fontsize=9.5, fontname="helv")
        y += 18

    # Follow-up
    y += 15
    page.insert_text((45, y), "FOLLOW-UP INSTRUCTIONS:", fontsize=10, fontname="hebo")
    y += 18
    page.insert_text((55, y), "- Review in OPD with Dr. R. K. Singhal on 25-Jan-2026 or immediately SOS if vomiting recurs.", fontsize=9.5, fontname="helv")
    y += 16
    page.insert_text((55, y), "- Soft light diet for next 5 days. Avoid oily, spicy food and outside water.", fontsize=9.5, fontname="helv")

    # Signatures
    page.draw_line((40, 740), (555, 740), color=(0.8, 0.8, 0.8), width=1)
    page.insert_text((45, 760), "Dr. R. K. Singhal, MD", fontsize=10, fontname="hebo")
    page.insert_text((45, 772), "Senior Consultant, Internal Medicine", fontsize=8.5, fontname="helv", color=(0.4, 0.4, 0.4))
    page.insert_text((390, 760), "Fortis Hospital - Discharge Desk", fontsize=9, fontname="helv", color=(0.4, 0.4, 0.4))

    doc.save(output_path)
    doc.close()


def generate_all_samples():
    """Generates all synthetic PDF test files on disk for demonstration and testing."""
    os.makedirs(settings.SAMPLES_DIR, exist_ok=True)
    os.makedirs("test_samples", exist_ok=True)
    
    rx_path = os.path.join(settings.SAMPLES_DIR, "sample_prescription.pdf")
    lab_path = os.path.join(settings.SAMPLES_DIR, "sample_lab_report.pdf")
    disch_path = os.path.join(settings.SAMPLES_DIR, "sample_discharge_summary.pdf")

    generate_sample_prescription_pdf(rx_path)
    generate_sample_lab_report_pdf(lab_path)
    generate_sample_discharge_summary_pdf(disch_path)

    # Also copy to root test_samples for easy testing
    import shutil
    shutil.copy(rx_path, os.path.join("test_samples", "sample_prescription.pdf"))
    shutil.copy(lab_path, os.path.join("test_samples", "sample_lab_report.pdf"))
    shutil.copy(disch_path, os.path.join("test_samples", "sample_discharge_summary.pdf"))
