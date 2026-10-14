import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  FlaskConical,
  Pill,
  Clock,
  Sparkles,
  Link2,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { DocumentItem, AISummary } from "../types";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

interface DashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [docsData, summaryData] = await Promise.all([
          api.listDocuments(),
          api.getHolisticSummary(language),
        ]);
        setDocuments(docsData);
        setSummary(summaryData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [language]);

  // Record counts by category
  const rxCount = documents.filter((d) => d.document_type === "prescription").length;
  const labCount = documents.filter((d) => d.document_type === "lab_report").length;
  const dischCount = documents.filter((d) => d.document_type === "discharge_summary").length;
  const diagCount = documents.filter((d) => d.document_type === "diagnostic_report").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Greeting & Health Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-subtle">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
            <span>Patient Portal</span>
            {user?.is_demo && <span className="px-2 py-0.2 rounded-full bg-medical-red-blush text-medical-red text-[10px]">Verified Demo Profile</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight">
            {t("welcomeBack")}, {user?.full_name || "Aarav Sharma"}
          </h1>
          <p className="text-xs sm:text-sm text-medical-muted">
            UHID: APX-98214 • Blood Group: {user?.blood_group || "B+"} • Gender: {user?.gender || "Male"} • DOB: {user?.dob || "1983-05-14"}
          </p>
        </div>

        {/* Prominent Upload Action */}
        <button
          onClick={() => onNavigate("upload")}
          className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-medical-red hover:bg-medical-red-hover shadow-xs transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t("quickUploadCTA")}</span>
        </button>
      </div>

      {/* 2. Compact Summary Cards of Record Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate("timeline", { filter: "prescription" })}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/40 transition-all text-left group shadow-subtle"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-medical-red-blush text-neutral-800 group-hover:text-medical-red flex items-center justify-center transition-colors">
              <FileText className="w-5 h-5" />
            </span>
            <span className="text-2xl font-extrabold text-medical-black">{rxCount}</span>
          </div>
          <div className="text-xs font-bold text-medical-black">Prescriptions</div>
          <div className="text-[11px] text-medical-muted mt-0.5">Active & past doctor scripts</div>
        </button>

        <button
          onClick={() => onNavigate("labs")}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/40 transition-all text-left group shadow-subtle"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-medical-red-blush text-neutral-800 group-hover:text-medical-red flex items-center justify-center transition-colors">
              <FlaskConical className="w-5 h-5" />
            </span>
            <span className="text-2xl font-extrabold text-medical-red">{labCount}</span>
          </div>
          <div className="text-xs font-bold text-medical-black">Lab Reports</div>
          <div className="text-[11px] text-medical-muted mt-0.5">Biochemistry & blood tests</div>
        </button>

        <button
          onClick={() => onNavigate("medications")}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/40 transition-all text-left group shadow-subtle"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-medical-red-blush text-neutral-800 group-hover:text-medical-red flex items-center justify-center transition-colors">
              <Pill className="w-5 h-5" />
            </span>
            <span className="text-2xl font-extrabold text-medical-black">3</span>
          </div>
          <div className="text-xs font-bold text-medical-black">Medications</div>
          <div className="text-[11px] text-medical-muted mt-0.5">Current therapeutic regimen</div>
        </button>

        <button
          onClick={() => onNavigate("timeline", { filter: "discharge_summary" })}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/40 transition-all text-left group shadow-subtle"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-medical-red-blush text-neutral-800 group-hover:text-medical-red flex items-center justify-center transition-colors">
              <Clock className="w-5 h-5" />
            </span>
            <span className="text-2xl font-extrabold text-medical-black">{dischCount + diagCount}</span>
          </div>
          <div className="text-xs font-bold text-medical-black">Discharge & Scans</div>
          <div className="text-[11px] text-medical-muted mt-0.5">Hospital stays & imaging</div>
        </button>
      </div>

      {/* 3. Visible ABHA Connect Entry Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-clinical">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-medical-red flex items-center justify-center text-white flex-shrink-0 mt-0.5">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">ABHA Sandbox Connect</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
              Linked ID: <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200">91-4521-8890-1234</code>.
              Import discoverable care contexts from Max Healthcare, Apollo Hospitals, and Dr. Lal PathLabs.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("abha")}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-medical-red hover:bg-medical-red-hover transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <span>Manage ABHA & Consent</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Split Section: Recent Health Records & Small AI Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Recent Records */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-medical-black flex items-center gap-2">
              <Clock className="w-4 h-4 text-medical-red" />
              <span>{t("recentRecords")}</span>
            </h2>
            <button
              onClick={() => onNavigate("timeline")}
              className="text-xs font-bold text-medical-red hover:underline flex items-center gap-1"
            >
              <span>View full timeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
                <FileText className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs text-medical-muted">No medical records uploaded yet.</p>
                <button
                  onClick={() => onNavigate("upload")}
                  className="mt-3 px-4 py-2 text-xs font-bold text-white bg-medical-red rounded-lg"
                >
                  Upload First Document
                </button>
              </div>
            ) : (
              documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigate("review", { docId: doc.id })}
                  className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all flex items-center justify-between gap-4 cursor-pointer hover:shadow-subtle group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-medical-surface border border-neutral-200 flex items-center justify-center text-medical-red font-bold text-xs flex-shrink-0">
                      {doc.document_type === "prescription" && <FileText className="w-5 h-5 text-neutral-700" />}
                      {doc.document_type === "lab_report" && <FlaskConical className="w-5 h-5 text-medical-red" />}
                      {doc.document_type === "discharge_summary" && <Clock className="w-5 h-5 text-neutral-700" />}
                      {doc.document_type === "diagnostic_report" && <TrendingUp className="w-5 h-5 text-neutral-700" />}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-medical-black group-hover:text-medical-red transition-colors truncate">
                        {doc.original_filename}
                      </div>
                      <div className="text-[11px] text-medical-muted flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{doc.document_type.replace("_", " ")}</span>
                        <span>•</span>
                        <span>{doc.upload_date.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <ConfidenceBadge score={doc.classification_confidence} />
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-medical-red transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Small AI Summary Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-medical-black flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-medical-red" />
              <span>AI Health Summary</span>
            </h2>
            <button
              onClick={() => onNavigate("summary")}
              className="text-xs font-bold text-medical-red hover:underline flex items-center gap-1"
            >
              <span>Full summary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
            {summary ? (
              <>
                <div>
                  <div className="text-xs font-bold text-medical-black mb-1">
                    {summary.title}
                  </div>
                  <p className="text-xs text-medical-muted leading-relaxed line-clamp-3">
                    {summary.what_document_says}
                  </p>
                </div>

                {summary.abnormal_findings.length > 0 && (
                  <div className="p-3 rounded-xl bg-medical-red-blush border border-medical-red/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-medical-red">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flagged Lab Indicators</span>
                    </div>
                    {summary.abnormal_findings.slice(0, 2).map((abn, idx) => (
                      <div key={idx} className="text-[11px] text-neutral-700 flex justify-between">
                        <span className="font-medium truncate mr-2">{abn.test_name}</span>
                        <span className="font-bold text-medical-red flex-shrink-0">{abn.result}</span>
                      </div>
                    ))}
                  </div>
                )}

                {summary.historical_comparison && (
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                    <div className="font-semibold text-medical-black text-[11px] mb-1">
                      Historical Comparison:
                    </div>
                    <p className="text-[11px] text-medical-muted leading-relaxed">
                      {summary.historical_comparison}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => onNavigate("summary")}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-medical-black bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-medical-red" />
                  <span>Review Plain-Language Explanation</span>
                </button>
              </>
            ) : (
              <div className="text-xs text-medical-muted">Loading clinical insights...</div>
            )}
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
