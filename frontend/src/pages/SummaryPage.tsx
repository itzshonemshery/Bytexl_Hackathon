import React, { useState, useEffect } from "react";
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Languages,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { AISummary } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

interface SummaryPageProps {
  docId?: string;
}

export const SummaryPage: React.FC<SummaryPageProps> = ({ docId }) => {
  const { language, setLanguage } = useLanguage();
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<string>(language);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      try {
        let res: AISummary;
        if (docId) {
          res = await api.getDocumentSummary(docId, selectedLang);
        } else {
          res = await api.getHolisticSummary(selectedLang);
        }
        setSummary(res);
      } catch (err) {
        console.error("Error loading summary:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, [docId, selectedLang]);

  const toggleLanguage = (lang: "en" | "hi") => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header with Bilingual Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>AI Health Summary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight mt-0.5">
            {selectedLang === "hi" ? "सरल भाषा में स्वास्थ्य रिपोर्ट सारांश" : "Plain-Language Health Intelligence"}
          </h1>
          <p className="text-xs sm:text-sm text-medical-muted mt-1">
            {selectedLang === "hi"
              ? "जटिल मेडिकल रिपोर्ट को बिना किसी भ्रम के समझें।"
              : "Translating complex clinical terminology into clear, understandable insights."}
          </p>
        </div>

        {/* In-page Language Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 border border-neutral-200 text-xs self-start sm:self-auto">
          <Languages className="w-4 h-4 text-medical-muted ml-2" />
          <button
            onClick={() => toggleLanguage("en")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedLang === "en" ? "bg-white text-medical-black shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            English
          </button>
          <button
            onClick={() => toggleLanguage("hi")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedLang === "hi" ? "bg-medical-red text-white shadow-xs" : "text-neutral-600 hover:text-black"
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-medical-muted">
          Generating verified plain-language interpretation...
        </div>
      ) : summary ? (
        <div className="space-y-6">
          {/* 1. What the document says */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-medical-red">
              {selectedLang === "hi" ? "दस्तावेज़ में क्या दर्ज है" : "What The Document Says"}
            </h3>
            <h2 className="text-lg font-bold text-medical-black">{summary.title}</h2>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed pt-1">
              {summary.what_document_says}
            </p>
          </div>

          {/* 2. Important Results */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-medical-black">
              {selectedLang === "hi" ? "मुख्य क्लिनिकल परिणाम" : "Important Results & Observations"}
            </h3>
            <div className="space-y-2">
              {summary.important_results.map((res, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Values Flagged by Reporting Lab */}
          {summary.abnormal_findings.length > 0 && (
            <div className="p-6 rounded-2xl bg-red-50/40 border border-red-200 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-medical-red">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>
                  {selectedLang === "hi" ? "प्रयोगशाला द्वारा चिह्नित मूल्य (Flagged Values)" : "Values Flagged by Reporting Laboratory"}
                </span>
              </div>
              <p className="text-xs text-neutral-600">
                {selectedLang === "hi"
                  ? "ये परीक्षण रिपोर्टिंग लैब की सामान्य सीमा (Reference Range) से बाहर दर्ज हुए हैं:"
                  : "These biomarkers fall outside the specific reference range printed on your test report:"}
              </p>

              <div className="space-y-3">
                {summary.abnormal_findings.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-red-100 shadow-2xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-neutral-100">
                      <span className="text-xs font-bold text-neutral-900">{item.test_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-medical-red">{item.result}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          {item.flag}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      <span className="font-semibold text-neutral-800">Printed Reference Range: </span>
                      <code className="bg-neutral-100 px-1 py-0.5 rounded">{item.reference_range}</code>
                    </div>
                    <div className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-2.5 rounded-lg">
                      <span className="font-semibold text-neutral-900">What it measures: </span>
                      {item.what_it_measures}
                    </div>
                    <div className="text-[11px] text-neutral-500 italic">
                      {item.clinical_context}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Historical Comparisons */}
          {summary.historical_comparison && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-medical-black">
                <TrendingUp className="w-4 h-4 text-medical-red" />
                <span>
                  {selectedLang === "hi" ? "पिछली रिपोर्ट से तुलना (Historical Comparison)" : "Compatible Historical Comparison"}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                {summary.historical_comparison}
              </p>
            </div>
          )}

          {/* 5. Questions for Doctor */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-medical-black">
              <MessageSquare className="w-4 h-4 text-medical-red" />
              <span>
                {selectedLang === "hi" ? "डॉक्टर से पूछने योग्य प्रश्न" : "Questions to Ask Your Doctor"}
              </span>
            </div>
            <p className="text-xs text-medical-muted">
              {selectedLang === "hi"
                ? "अपनी अगली डॉक्टर मुलाकात में इन बिंदुओं पर चर्चा करें:"
                : "Bring these curated questions to your upcoming clinical consultation:"}
            </p>
            <ul className="space-y-2">
              {summary.questions_for_doctor.map((q, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-medical-black text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grounding & Evidence Traceability List */}
          {summary.grounding_sources && summary.grounding_sources.length > 0 && (
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Source Grounding & Evidence Traceability</span>
              </div>
              <div className="space-y-1.5">
                {summary.grounding_sources.map((src, i) => (
                  <div key={i} className="text-[11px] text-neutral-600 flex items-start gap-2">
                    <span className="text-neutral-400">•</span>
                    <span>
                      <strong>{src.claim}</strong> &rarr; grounded in <em>"{src.exact_snippet}"</em> ({src.source_document})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MedicalDisclaimer />
        </div>
      ) : null}
    </div>
  );
};
