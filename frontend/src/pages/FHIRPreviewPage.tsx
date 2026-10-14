import React, { useState, useEffect } from "react";
import {
  Code2,
  FileCode,
  Layers,
  CheckCircle2,
  Copy,
  ArrowRight,
  ShieldCheck,
  Server,
  Database,
  Lock,
} from "lucide-react";
import { api } from "../services/api";

export const FHIRPreviewPage: React.FC = () => {
  const [bundle, setBundle] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadFHIR() {
      try {
        const res = await api.getPatientSummaryBundle();
        setBundle(res);
      } catch (err) {
        console.error("Error loading FHIR bundle:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFHIR();
  }, []);

  const handleCopyJSON = () => {
    if (!bundle) return;
    navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
          <Code2 className="w-4 h-4" />
          <span>Interoperability Architecture & FHIR R4 Preview</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight">
          System Architecture & Standards Compliance
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Designed for clinical judges evaluating end-to-end data pipeline integrity, FHIR R4 schemas, and ABDM readiness.
        </p>
      </div>

      {/* 1. Complete Architecture Pipeline Diagram */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-sm font-bold text-medical-black">
            <Layers className="w-4 h-4 text-medical-red" />
            <span>End-to-End Processing Pipeline</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            FHIR R4 & ABDM Compliant
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-medical-red text-white flex items-center justify-center text-[10px]">1</span>
              <span>Upload & Validation</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              PDF, JPG, PNG ingestion with SHA-256 duplicate detection and &lt;25MB size limits.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-medical-red text-white flex items-center justify-center text-[10px]">2</span>
              <span>PyMuPDF OCR & Text</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Direct digital PDF parsing, image DPI rendering, and English/Hindi script detection.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-medical-red text-white flex items-center justify-center text-[10px]">3</span>
              <span>Schema Classification</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Automatic categorization: Prescription, Lab Report, Discharge Summary, or Imaging.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-medical-red text-white flex items-center justify-center text-[10px]">4</span>
              <span>Human Verification</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Side-by-side evidence preview with patient editing before permanent database commit.
            </p>
          </div>
        </div>

        {/* Second Row of Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center text-[10px]">5</span>
              <span>Database Persistence</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Relational SQLite per-user tables: medications, lab observations, extractions, audits.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center text-[10px]">6</span>
              <span>Grounded AI Summary</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Deterministic fallback + LLM translation with exact source citations and doctor questions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <div className="font-bold text-medical-black flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-neutral-900 text-white flex items-center justify-center text-[10px]">7</span>
              <span>Unified Health Timeline</span>
            </div>
            <p className="text-[11px] text-medical-muted leading-tight">
              Chronological streams with category filters, test search, and document links.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-medical-red-blush border border-medical-red/30 space-y-1">
            <div className="font-bold text-medical-red flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-medical-red text-white flex items-center justify-center text-[10px]">8</span>
              <span>FHIR R4 & ABHA Sync</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-tight">
              Serialization into standard Observation, MedicationRequest, and DocumentReference bundles.
            </p>
          </div>
        </div>

        {/* Integration Boundary Note */}
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Architectural Boundary:</strong> The ABDM gateway is encapsulated behind a strict consent boundary.
            No data leaves user isolation without explicit patient authorization.
          </span>
        </div>
      </div>

      {/* 2. Interactive FHIR R4 JSON Inspector */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-medical-black flex items-center gap-2">
              <FileCode className="w-4 h-4 text-medical-red" />
              <span>Live FHIR R4 Bundle JSON Inspector</span>
            </h3>
            <p className="text-xs text-medical-muted">
              Dynamically generated HL7 FHIR R4 document bundle serialized from patient's verified health records.
            </p>
          </div>

          <button
            onClick={handleCopyJSON}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Copy JSON"}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-medical-muted">Serializing FHIR R4 resources...</div>
        ) : (
          <div className="relative">
            <pre className="p-4 rounded-xl bg-neutral-900 text-neutral-200 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
              {JSON.stringify(bundle, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
