import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Save,
  ArrowLeft,
  Eye,
  ShieldCheck,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { ExtractionData } from "../types";
import { ConfidenceBadge } from "../components/ConfidenceBadge";

interface ReviewPageProps {
  docId: string;
  onConfirmSuccess: () => void;
  onBack: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({ docId, onConfirmSuccess, onBack }) => {
  const { t } = useLanguage();
  const [extraction, setExtraction] = useState<ExtractionData | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getExtraction(docId);
        setExtraction(res);
        setFormData(res.data || {});
      } catch (err: any) {
        setError(err.message || "Failed to load extraction details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [docId]);

  const handleFieldChange = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let curr = copy;
      for (let i = 0; i < path.length - 1; i++) {
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = value;
      return copy;
    });
  };

  const handleSaveAndConfirm = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.reviewExtraction(docId, formData, notes);
      setSaveSuccess(true);
      setTimeout(() => {
        onConfirmSuccess();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save verification.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-medical-muted">
        Loading document evidence and extraction fields...
      </div>
    );
  }

  if (error || !extraction) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700">
        <p className="font-bold">Error loading record: {error}</p>
        <button onClick={onBack} className="mt-3 text-xs text-red-800 underline font-semibold">
          &larr; Back to list
        </button>
      </div>
    );
  }

  const docType = extraction.document_type;
  const previewImgUrl = extraction.thumbnail_path
    ? `http://localhost:8000${extraction.thumbnail_path}`
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="text-xs text-medical-muted hover:text-medical-black font-semibold flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Timeline</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-medical-black tracking-tight">
              {t("reviewTitle")}
            </h1>
            {extraction.is_verified && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-medical-muted">
            {t("reviewSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ConfidenceBadge score={extraction.confidence_score} />
          <button
            onClick={handleSaveAndConfirm}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-medical-red hover:bg-medical-red-hover transition-colors flex items-center gap-1.5 shadow-xs flex-shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : t("saveAndConfirm")}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Extraction successfully confirmed and synchronized to your health timeline!</span>
        </div>
      )}

      {/* Split Side-by-Side Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Original Document Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 shadow-subtle p-4 space-y-3 sticky top-20">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
            <span className="text-xs font-bold text-medical-black flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-medical-red" />
              <span>{t("originalDocumentPreview")}</span>
            </span>
            <span className="text-[10px] text-medical-muted uppercase font-semibold">
              Ground Evidence
            </span>
          </div>

          {previewImgUrl ? (
            <div className="max-h-[580px] overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-100 p-2">
              <img
                src={previewImgUrl}
                alt="Document Evidence Preview"
                className="w-full object-contain rounded-lg shadow-2xs"
              />
            </div>
          ) : (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono whitespace-pre-wrap max-h-[400px] overflow-y-auto text-neutral-700">
              {extraction.raw_text_preview || "No preview image available."}
            </div>
          )}

          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[11px] text-medical-muted leading-relaxed">
            <span className="font-semibold text-medical-black mr-1">Traceability Notice:</span>
            Extracted values are cross-referenced with this document. You can edit any field on the right.
          </div>
        </div>

        {/* Right Column (7 cols): Editable Extracted Fields */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-muted">
              {t("extractedFields")} ({docType.replace("_", " ")})
            </span>
            <span className="text-xs text-medical-red font-medium flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editable by Patient</span>
            </span>
          </div>

          {/* PRESCRIPTION EDITING */}
          {docType === "prescription" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Prescriber Name</label>
                  <input
                    type="text"
                    value={formData.prescriber_name || ""}
                    onChange={(e) => handleFieldChange(["prescriber_name"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-medical-red focus:border-medical-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    value={formData.clinic_or_hospital || ""}
                    onChange={(e) => handleFieldChange(["clinic_or_hospital"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-medical-red focus:border-medical-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Prescription Date</label>
                  <input
                    type="text"
                    value={formData.prescription_date || ""}
                    onChange={(e) => handleFieldChange(["prescription_date"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-medical-red focus:border-medical-red"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patient_name || ""}
                    onChange={(e) => handleFieldChange(["patient_name"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg focus:ring-1 focus:ring-medical-red focus:border-medical-red"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-medical-black mb-2">Prescribed Medicines</div>
                <div className="space-y-3">
                  {(formData.medicines || []).map((med: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Medicine Name</label>
                          <input
                            type="text"
                            value={med.medicine_name || ""}
                            onChange={(e) => handleFieldChange(["medicines", String(idx), "medicine_name"], e.target.value)}
                            className="w-full p-1.5 text-xs font-bold border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Strength</label>
                          <input
                            type="text"
                            value={med.strength || ""}
                            onChange={(e) => handleFieldChange(["medicines", String(idx), "strength"], e.target.value)}
                            className="w-full p-1.5 text-xs border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Frequency</label>
                          <input
                            type="text"
                            value={med.frequency || ""}
                            onChange={(e) => handleFieldChange(["medicines", String(idx), "frequency"], e.target.value)}
                            className="w-full p-1.5 text-xs border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Instructions</label>
                          <input
                            type="text"
                            value={med.instructions || ""}
                            onChange={(e) => handleFieldChange(["medicines", String(idx), "instructions"], e.target.value)}
                            className="w-full p-1.5 text-xs border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAB REPORT EDITING */}
          {docType === "lab_report" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Laboratory Facility</label>
                  <input
                    type="text"
                    value={formData.lab_name || ""}
                    onChange={(e) => handleFieldChange(["lab_name"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Report Date</label>
                  <input
                    type="text"
                    value={formData.report_date || ""}
                    onChange={(e) => handleFieldChange(["report_date"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-medical-black mb-2">Test Observations & Reference Ranges</div>
                <div className="space-y-3">
                  {(formData.observations || []).map((obs: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border space-y-2 ${
                        obs.is_abnormal ? "bg-red-50/40 border-red-200" : "bg-neutral-50 border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">{obs.test_name}</span>
                        {obs.is_abnormal ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                            {obs.abnormal_flag || "HIGH"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                            Normal
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Result Value</label>
                          <input
                            type="text"
                            value={obs.result_text || obs.result_value || ""}
                            onChange={(e) => handleFieldChange(["observations", String(idx), "result_text"], e.target.value)}
                            className="w-full p-1.5 text-xs font-bold border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Unit</label>
                          <input
                            type="text"
                            value={obs.unit || ""}
                            onChange={(e) => handleFieldChange(["observations", String(idx), "unit"], e.target.value)}
                            className="w-full p-1.5 text-xs border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-neutral-500">Reference Range</label>
                          <input
                            type="text"
                            value={obs.reference_range_raw || ""}
                            onChange={(e) => handleFieldChange(["observations", String(idx), "reference_range_raw"], e.target.value)}
                            className="w-full p-1.5 text-xs border border-neutral-300 rounded-md bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISCHARGE SUMMARY EDITING */}
          {docType === "discharge_summary" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={formData.hospital_name || ""}
                    onChange={(e) => handleFieldChange(["hospital_name"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Primary Diagnosis</label>
                  <input
                    type="text"
                    value={formData.primary_diagnosis || ""}
                    onChange={(e) => handleFieldChange(["primary_diagnosis"], e.target.value)}
                    className="w-full p-2 text-xs font-bold text-medical-red border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Admission Date</label>
                  <input
                    type="text"
                    value={formData.admission_date || ""}
                    onChange={(e) => handleFieldChange(["admission_date"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Discharge Date</label>
                  <input
                    type="text"
                    value={formData.discharge_date || ""}
                    onChange={(e) => handleFieldChange(["discharge_date"], e.target.value)}
                    className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Hospital Course & Summary</label>
                <textarea
                  rows={3}
                  value={formData.hospital_course || ""}
                  onChange={(e) => handleFieldChange(["hospital_course"], e.target.value)}
                  className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Follow-up Instructions</label>
                <input
                  type="text"
                  value={formData.follow_up_instructions || ""}
                  onChange={(e) => handleFieldChange(["follow_up_instructions"], e.target.value)}
                  className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Patient Review Notes */}
          <div className="pt-2 border-t border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Patient Verification Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified with printed prescription from Dr. Seth"
              className="w-full p-2 text-xs border border-neutral-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAndConfirm}
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-medical-red hover:bg-medical-red-hover transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : t("saveAndConfirm")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
