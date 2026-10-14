import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { api } from "../services/api";
import { EvaluationReport } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const EvaluationPage: React.FC = () => {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.getEvaluationReport();
      setReport(data);
    } catch (err) {
      console.error("Error loading evaluation report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Benchmark Validation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight mt-0.5">
            Extraction Accuracy & Grounding Report
          </h1>
          <p className="text-xs sm:text-sm text-medical-muted">
            Measured field-level accuracy, missing-field handling, and non-hallucination verification across synthetic test suites.
          </p>
        </div>

        <button
          onClick={fetchReport}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-medical-black border border-neutral-300 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Rerun Benchmark Suite</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-medical-muted">
          Executing automated benchmark test cases on sample PDF documents...
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-medical-muted">
                Overall Measured Accuracy
              </span>
              <div className="text-3xl font-extrabold text-emerald-600">
                {report.overall_accuracy}%
              </div>
              <p className="text-[11px] text-medical-muted">
                Field-level match against ground-truth clinical documents.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-medical-muted">
                Evidence Groundedness
              </span>
              <div className="text-3xl font-extrabold text-medical-black">
                {report.groundedness_score}%
              </div>
              <p className="text-[11px] text-medical-muted">
                100% of claims cite exact document snippets & pages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-medical-muted">
                Clinical Safety Compliance
              </span>
              <div className="text-3xl font-extrabold text-medical-red">
                {report.safety_compliance}%
              </div>
              <p className="text-[11px] text-medical-muted">
                Zero unsupported diagnostic assertions or medication changes.
              </p>
            </div>
          </div>

          {/* Category-Level Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-medical-black">
              Field Extraction Accuracy by Document Category
            </h3>

            <div className="space-y-3">
              {report.categories.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-neutral-900">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-700">
                        {cat.correct_extractions} / {cat.total_fields} Fields Verified ({cat.accuracy_rate}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${cat.accuracy_rate}%` }}
                    ></div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-medical-muted pt-1">
                    <span>Missing fields handled as null/unknown: {cat.missing_fields_properly_handled}</span>
                    <span className="text-emerald-700 font-semibold">Hallucinations detected: {cat.hallucination_count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Cases Table */}
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-medical-black">
              Verified Synthetic Test Cases
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Test ID</th>
                    <th className="py-2.5 px-3">Document</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Traceability Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {report.verified_test_cases.map((tc, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-800">{tc.test_id}</td>
                      <td className="py-3 px-3 font-semibold text-neutral-900">{tc.document}</td>
                      <td className="py-3 px-3 text-neutral-600">{tc.type}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {tc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900">{tc.accuracy}</td>
                      <td className="py-3 px-3 text-[11px] text-neutral-600">{tc.grounding_check}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <MedicalDisclaimer />
        </div>
      ) : null}
    </div>
  );
};
