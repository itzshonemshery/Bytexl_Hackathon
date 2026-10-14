import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  FileCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  FlaskConical,
  Eye,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { ConfidenceBadge } from "../components/ConfidenceBadge";

interface UploadPageProps {
  onUploadSuccess: (docId: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
      setError("Unsupported format. Please upload PDF, JPG, or PNG files only.");
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError("File exceeds the maximum limit of 25 MB.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    processUpload(selectedFile);
  };

  const processUpload = async (uploadFile: File) => {
    setIsProcessing(true);
    setProcessingStep(t("ocrExtracting"));
    setError(null);

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      // Step simulation for realistic feedback
      setTimeout(() => setProcessingStep(t("schemaValidating")), 700);

      const res = await api.uploadDocument(formData);
      setResult(res);
      setIsProcessing(false);
    } catch (err: any) {
      setError(err.message || "Failed to process medical document.");
      setIsProcessing(false);
    }
  };

  const handleLoadSample = async (sampleType: string) => {
    setIsProcessing(true);
    setProcessingStep("Loading pre-computed synthetic sample record...");
    setError(null);
    try {
      const res = await api.loadSample(sampleType);
      setResult(res);
      setIsProcessing(false);
    } catch (err: any) {
      setError(err.message || "Failed to load sample document.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight">
          {t("navUpload")}
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Upload prescriptions, laboratory blood reports, hospital discharge summaries, or imaging reports.
        </p>
      </div>

      {/* Quick Demo Sample Bar for Hackathon Judges */}
      <div className="p-4 rounded-2xl bg-medical-red-blush border border-medical-red/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-medical-red">
            <Sparkles className="w-4 h-4" />
            <span>Fast Hackathon Demo: Load Synthetic Clinical Records</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-medical-red font-semibold">1-Click Test</span>
        </div>
        <p className="text-[11px] text-neutral-600">
          Click any button below to instantly load and test real clinical PDF records generated directly on this server:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleLoadSample("prescription")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-medical-black border border-neutral-300 hover:border-medical-red hover:text-medical-red transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-medical-red" />
            <span>{t("sampleRx")}</span>
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleLoadSample("lab_report")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-medical-black border border-neutral-300 hover:border-medical-red hover:text-medical-red transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-medical-red" />
            <span>{t("sampleLab")} (HbA1c & Lipids)</span>
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleLoadSample("discharge_summary")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-medical-black border border-neutral-300 hover:border-medical-red hover:text-medical-red transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-medical-red" />
            <span>{t("sampleDischarge")}</span>
          </button>
        </div>
      </div>

      {/* Main Drag-and-Drop Area */}
      {!result && !isProcessing && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-medical-red bg-medical-red-blush scale-[1.01]"
              : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/50"
          } shadow-subtle`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
          />

          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-800 mx-auto flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-medical-red" />
          </div>

          <h3 className="text-base font-bold text-medical-black mb-1">
            {t("dragAndDropPrompt")}
          </h3>
          <p className="text-xs text-medical-muted max-w-md mx-auto">
            {t("uploadSupportFormats")}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-medical-black hover:bg-neutral-800">
            <span>Browse Local Files</span>
          </div>
        </div>
      )}

      {/* Processing State with Animated Progress */}
      {isProcessing && (
        <div className="p-10 rounded-3xl bg-white border border-neutral-200 text-center shadow-subtle space-y-5">
          <div className="w-14 h-14 rounded-full border-4 border-neutral-200 border-t-medical-red animate-spin mx-auto"></div>
          <div>
            <h3 className="text-base font-bold text-medical-black mb-1">
              {t("processingTitle")}
            </h3>
            <p className="text-xs text-medical-muted">{processingStep}</p>
          </div>
          <div className="w-64 h-1.5 bg-neutral-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-medical-red rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Upload Error: </span>
            {error}
          </div>
        </div>
      )}

      {/* Processing Result Preview Screen */}
      {result && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-clinical space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="text-base font-bold text-medical-black">
                  Document Processed & Classified
                </h3>
              </div>
              <p className="text-xs text-medical-muted mt-0.5">
                {result.filename} • {result.page_count} Page(s)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider">
                {result.document_type.replace("_", " ")}
              </span>
              <ConfidenceBadge score={result.classification_confidence} />
            </div>
          </div>

          {result.has_handwriting_warning && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Handwritten or low-contrast fields detected. Human review screen will highlight these for verification.</span>
            </div>
          )}

          {/* Quick Preview of Extracted Fields */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-medical-muted">
              Sample Extracted Schema Values
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              {result.document_type === "prescription" && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Prescriber:</span>
                    <span className="font-bold text-neutral-900">{result.extracted_data?.prescriber_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Documented Medicines:</span>
                    <span className="font-bold text-medical-red">
                      {result.extracted_data?.medicines?.length || 0} medications extracted
                    </span>
                  </div>
                </>
              )}

              {result.document_type === "lab_report" && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Reporting Facility:</span>
                    <span className="font-bold text-neutral-900">{result.extracted_data?.lab_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Observations Extracted:</span>
                    <span className="font-bold text-medical-red">
                      {result.extracted_data?.observations?.length || 0} biochemical tests with reference ranges
                    </span>
                  </div>
                </>
              )}

              {result.document_type === "discharge_summary" && (
                <>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Hospital:</span>
                    <span className="font-bold text-neutral-900">{result.extracted_data?.hospital_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-600">Primary Diagnosis:</span>
                    <span className="font-bold text-medical-red">{result.extracted_data?.primary_diagnosis}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action to Human Verification Screen */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200">
            <button
              onClick={() => setResult(null)}
              className="text-xs text-medical-muted hover:text-medical-black font-semibold"
            >
              &larr; Upload Another Document
            </button>

            <button
              onClick={() => onUploadSuccess(result.document_id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-medical-red hover:bg-medical-red-hover transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Proceed to Human Review & Verification Screen</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
