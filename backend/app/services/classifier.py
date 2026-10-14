import re
from typing import Tuple

class DocumentClassifier:
    KEYWORDS = {
        "prescription": [
            r"\brx\b", r"\bprescri(?:be|ption)\b", r"\btablet\b", r"\btab\b", r"\bcapsule\b", 
            r"\bcap\b", r"\bsyrup\b", r"\bmg\b", r"\bod\b", r"\bbd\b", r"\btds\b", r"\bqid\b",
            r"\bclinic\b", r"\bdoctor\b", r"\bdr\.", r"\bmbbs\b", r"\bmd\b", r"\bdosage\b", r"\bdose\b",
            r"\bpharmacy\b", r"\bafter meals\b", r"\bbefore meals\b", r"\bdays\b"
        ],
        "lab_report": [
            r"\blaboratory\b", r"\blab\b", r"\bpathology\b", r"\breference interval\b", r"\breference range\b",
            r"\bbiological reference\b", r"\bhaemoglobin\b", r"\bhemoglobin\b", r"\bhba1c\b", r"\bplatelet\b",
            r"\bwbc\b", r"\brbc\b", r"\bcreatinine\b", r"\burea\b", r"\bcholesterol\b", r"\btriglycerides\b",
            r"\bserum\b", r"\burine\b", r"\bblood test\b", r"\bresult\b", r"\bflag\b", r"\bnormal range\b"
        ],
        "discharge_summary": [
            r"\bdischarge summary\b", r"\bdate of admission\b", r"\bdate of discharge\b", r"\badmission date\b",
            r"\bdischarge date\b", r"\bhospital course\b", r"\bprimary diagnosis\b", r"\bcondition on discharge\b",
            r"\boperative findings\b", r"\btreatment given\b", r"\bfollow up advice\b", r"\bward\b", r"\bip no\b",
            r"\bin-patient\b"
        ],
        "diagnostic_report": [
            r"\bx-ray\b", r"\bct scan\b", r"\bmri\b", r"\bultrasound\b", r"\bultrasonography\b",
            r"\bfindings\b", r"\bimpression\b", r"\bradiology\b", r"\bradiologist\b", r"\bimaging\b",
            r"\blungs\b", r"\bcostophrenic\b", r"\bcardiomegaly\b", r"\becg\b", r"\bechocardiogram\b"
        ]
    }

    @classmethod
    def classify(cls, text: str, filename: str = "") -> Tuple[str, float]:
        """Classifies document type based on extracted text and filename hints."""
        text_lower = text.lower()
        filename_lower = filename.lower()
        
        # Check filename hints first
        if "prescription" in filename_lower or "rx" in filename_lower:
            return "prescription", 0.95
        if "lab" in filename_lower or "blood" in filename_lower or "test" in filename_lower or "cbc" in filename_lower or "lipid" in filename_lower:
            return "lab_report", 0.95
        if "discharge" in filename_lower or "discharge_summary" in filename_lower:
            return "discharge_summary", 0.96
        if "xray" in filename_lower or "x-ray" in filename_lower or "mri" in filename_lower or "ct" in filename_lower or "ultrasound" in filename_lower:
            return "diagnostic_report", 0.94

        scores = {k: 0 for k in cls.KEYWORDS}
        for category, patterns in cls.KEYWORDS.items():
            for pattern in patterns:
                matches = len(re.findall(pattern, text_lower))
                scores[category] += matches

        best_category = max(scores, key=scores.get)
        best_score = scores[best_category]

        if best_score == 0:
            return "unknown", 0.40

        total_matches = sum(scores.values())
        confidence = min(0.98, max(0.65, round(best_score / (total_matches + 0.1), 2) + 0.15))
        return best_category, confidence
