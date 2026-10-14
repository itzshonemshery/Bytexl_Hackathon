import React, { useState } from "react";
import {
  FlaskConical,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calendar,
  FileText,
  Info,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const LabReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>("hba1c");

  // Historical compatible trends dataset for demo patient Aarav Sharma
  const historicalTrends = [
    {
      id: "hba1c",
      testName: "HbA1c (Glycated Hemoglobin)",
      unit: "%",
      referenceRange: "4.0 - 5.6 %",
      normalThreshold: 5.6,
      readings: [
        { date: "15-Oct-2025", value: 6.8, flag: "HIGH", lab: "Dr. Lal PathLabs" },
        { date: "12-Mar-2026", value: 7.4, flag: "HIGH", lab: "Metropolis Clinical Lab" },
      ],
      change: "+0.6 % upward trajectory over 5 months",
      explanation: "HbA1c measures the percentage of your hemoglobin that is glycated (coated with sugar), representing average blood glucose levels over the prior 2 to 3 months.",
      nonDiagnosticNotice: "A rising HbA1c number reflects glycemic trends; it does not constitute an acute emergency or immediate diagnosis without clinical doctor correlation."
    },
    {
      id: "fbs",
      testName: "Fasting Blood Sugar (Glucose)",
      unit: "mg/dL",
      referenceRange: "70 - 99 mg/dL",
      normalThreshold: 99.0,
      readings: [
        { date: "15-Oct-2025", value: 122.0, flag: "HIGH", lab: "Dr. Lal PathLabs" },
        { date: "12-Mar-2026", value: 138.0, flag: "HIGH", lab: "Metropolis Clinical Lab" },
      ],
      change: "+16 mg/dL higher fasting glucose",
      explanation: "Fasting Blood Sugar measures blood glucose after an overnight fast (minimum 8 to 10 hours) to evaluate basal pancreatic insulin regulation.",
      nonDiagnosticNotice: "Fasting sugar can be temporarily influenced by prior evening meal composition, stress, or sleep duration. Repeat measurements are evaluated by physicians."
    },
    {
      id: "cholesterol",
      testName: "Total Cholesterol",
      unit: "mg/dL",
      referenceRange: "125 - 200 mg/dL",
      normalThreshold: 200.0,
      readings: [
        { date: "15-Oct-2025", value: 195.0, flag: "NORMAL", lab: "Dr. Lal PathLabs" },
        { date: "12-Mar-2026", value: 218.0, flag: "HIGH", lab: "Metropolis Clinical Lab" },
      ],
      change: "+23 mg/dL (crossed 200 mg/dL reference boundary)",
      explanation: "Total Cholesterol reflects the total amount of circulating fats, including LDL and HDL particles in your bloodstream.",
      nonDiagnosticNotice: "Lipid numbers fluctuate with diet and metabolism. Your doctor evaluates this in combination with cardiovascular risk calculators."
    },
    {
      id: "creatinine",
      testName: "Serum Creatinine",
      unit: "mg/dL",
      referenceRange: "0.7 - 1.3 mg/dL",
      normalThreshold: 1.3,
      readings: [
        { date: "15-Oct-2025", value: 0.92, flag: "NORMAL", lab: "Dr. Lal PathLabs" },
        { date: "12-Mar-2026", value: 0.95, flag: "NORMAL", lab: "Metropolis Clinical Lab" },
      ],
      change: "Stable kidney filtration marker (+0.03 mg/dL)",
      explanation: "Creatinine is a physiological byproduct of muscle breakdown that healthy kidneys filter out. Stable normal values indicate preserved renal function.",
      nonDiagnosticNotice: "Within normal limits across all historical checkpoints."
    }
  ];

  const activeTrend = historicalTrends.find((t) => t.id === selectedBiomarker) || historicalTrends[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-medical-red" />
          <span>{t("navLabs")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Laboratory observations with printed reference intervals and compatible historical trend comparisons.
        </p>
      </div>

      {/* Historical Trend Comparison Explorer */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Compatible Historical Trend Analysis</span>
            </div>
            <h2 className="text-lg font-bold text-medical-black mt-0.5">
              Tracking Biomarkers Over Time
            </h2>
          </div>

          {/* Biomarker Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {historicalTrends.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedBiomarker(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedBiomarker === t.id
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {t.testName.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Biomarker Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Trend Cards */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-medical-black">{activeTrend.testName}</span>
              <span className="text-xs text-medical-muted">Standard Unit: <strong className="text-medical-black">{activeTrend.unit}</strong></span>
            </div>

            {/* Visual Timeline Comparison Bar */}
            <div className="grid grid-cols-2 gap-4">
              {activeTrend.readings.map((r, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border space-y-2 ${
                    r.flag === "HIGH" ? "bg-red-50/50 border-red-200" : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{r.date}</span>
                  </div>
                  <div className="text-2xl font-extrabold text-medical-black flex items-baseline gap-1">
                    <span>{r.value}</span>
                    <span className="text-xs font-normal text-neutral-500">{activeTrend.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-neutral-500 truncate mr-1">{r.lab}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${r.flag === "HIGH" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {r.flag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-medical-red flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-medical-black">Trend Trajectory: </span>
                <span className="text-neutral-700">{activeTrend.change}</span>
                <div className="text-[11px] text-medical-muted mt-0.5">
                  Reference Range: {activeTrend.referenceRange} (Printed on reporting laboratory assays)
                </div>
              </div>
            </div>
          </div>

          {/* Educational Clinical Explanation */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-medical-black">
              <Info className="w-4 h-4 text-medical-red" />
              <span>What this test measures</span>
            </div>
            <p className="text-xs text-medical-muted leading-relaxed">
              {activeTrend.explanation}
            </p>
            <div className="pt-2 border-t border-neutral-200/80 text-[11px] text-neutral-600">
              <span className="font-semibold text-neutral-800 mr-1">Clinical Context:</span>
              {activeTrend.nonDiagnosticNotice}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Observation Table (Mar 2026 Report) */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-medical-black">
              Latest Comprehensive Laboratory Panel
            </h3>
            <p className="text-xs text-medical-muted">
              Source: Metropolis Clinical Laboratories • Report Date: 12-Mar-2026
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Verified Record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">{t("labTestName")}</th>
                <th className="py-3 px-4">{t("labResult")}</th>
                <th className="py-3 px-4">{t("labUnit")}</th>
                <th className="py-3 px-4">{t("labRefRange")}</th>
                <th className="py-3 px-4">{t("labFlag")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { name: "HbA1c (Glycated Hemoglobin)", val: "7.4", unit: "%", ref: "4.0 - 5.6 %", flag: "HIGH", isAbn: true },
                { name: "Estimated Average Glucose (eAG)", val: "166", unit: "mg/dL", ref: "70 - 126 mg/dL", flag: "HIGH", isAbn: true },
                { name: "Fasting Blood Sugar (Glucose)", val: "138", unit: "mg/dL", ref: "70 - 99 mg/dL", flag: "HIGH", isAbn: true },
                { name: "Serum Creatinine", val: "0.95", unit: "mg/dL", ref: "0.7 - 1.3 mg/dL", flag: "NORMAL", isAbn: false },
                { name: "Blood Urea Nitrogen (BUN)", val: "14.2", unit: "mg/dL", ref: "8.0 - 20.0 mg/dL", flag: "NORMAL", isAbn: false },
                { name: "Total Cholesterol", val: "218", unit: "mg/dL", ref: "125 - 200 mg/dL", flag: "HIGH", isAbn: true },
                { name: "Triglycerides", val: "185", unit: "mg/dL", ref: "50 - 150 mg/dL", flag: "HIGH", isAbn: true },
                { name: "HDL Cholesterol", val: "44", unit: "mg/dL", ref: "40 - 60 mg/dL", flag: "NORMAL", isAbn: false },
                { name: "LDL Cholesterol", val: "137", unit: "mg/dL", ref: "50 - 100 mg/dL", flag: "HIGH", isAbn: true },
              ].map((row, idx) => (
                <tr key={idx} className={row.isAbn ? "bg-red-50/20" : "hover:bg-neutral-50/50"}>
                  <td className="py-3 px-4 font-bold text-neutral-900">{row.name}</td>
                  <td className={`py-3 px-4 font-bold ${row.isAbn ? "text-medical-red" : "text-neutral-800"}`}>
                    {row.val}
                  </td>
                  <td className="py-3 px-4 text-neutral-500">{row.unit}</td>
                  <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">{row.ref}</td>
                  <td className="py-3 px-4">
                    {row.isAbn ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        {row.flag}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-600">
                        {row.flag}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
