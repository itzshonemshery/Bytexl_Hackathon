import React, { useState, useEffect } from "react";
import {
  Pill,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { MedicationItem } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const MedicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<{
    current: MedicationItem[];
    historical: MedicationItem[];
    unknown: MedicationItem[];
    doctor_preparation_questions: string[];
    safety_notice: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMeds() {
      try {
        const res = await api.getMedications();
        setData(res);
      } catch (err) {
        console.error("Error loading medications:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMeds();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-medical-muted">Loading documented medications...</div>;
  }

  const renderMedCard = (med: MedicationItem, statusColor: string) => (
    <div
      key={med.id}
      className="p-4 rounded-xl bg-white border border-neutral-200 shadow-subtle hover:border-neutral-300 transition-all space-y-2.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-medical-black">{med.medicine_name}</h4>
            {med.strength && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                {med.strength}
              </span>
            )}
          </div>
          <div className="text-[11px] text-medical-muted mt-0.5">
            {med.dosage || "1 dose"} • {med.frequency || "As prescribed"} ({med.route || "Oral"})
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
          {med.status}
        </span>
      </div>

      {med.instructions && (
        <div className="p-2 rounded-lg bg-neutral-50 text-[11px] text-neutral-700 border border-neutral-100">
          <span className="font-semibold text-neutral-900">Instructions: </span>
          {med.instructions}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between text-[10px] text-medical-muted pt-1 border-t border-neutral-100">
        <span className="truncate max-w-[200px]">Prescriber: {med.prescriber || "Documented Doctor"}</span>
        <span>Date: {med.prescription_date || "N/A"}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight flex items-center gap-2">
          <Pill className="w-6 h-6 text-medical-red" />
          <span>{t("navMedications")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Medications extracted directly from your verified medical prescriptions and hospital summaries.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Medication Safety Protocol</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          {data?.safety_notice || "Health Copilot organizes only documented medications. Never start, stop, or change doses without consulting your doctor."}
        </p>
      </div>

      {/* 1. Current Ongoing Medications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-medical-black flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{t("currentMeds")}</span>
          </h3>
          <span className="text-xs text-medical-muted font-medium">
            {data?.current.length || 0} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.current || []).map((med) => renderMedCard(med, "bg-emerald-50 text-emerald-800 border border-emerald-200"))}
        </div>
      </div>

      {/* 2. Historical / Completed Medications */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-medical-black flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span>{t("historicalMeds")}</span>
          </h3>
          <span className="text-xs text-medical-muted font-medium">
            {data?.historical.length || 0} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data?.historical || []).map((med) => renderMedCard(med, "bg-neutral-100 text-neutral-700 border border-neutral-200"))}
        </div>
      </div>

      {/* 3. Doctor Preparation Questions */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-medical-black">
          <MessageSquare className="w-4 h-4 text-medical-red" />
          <span>{t("questionsForDoctor")}</span>
        </div>
        <p className="text-xs text-medical-muted">
          Use these suggested questions during your next appointment with your physician:
        </p>
        <ul className="space-y-2">
          {(data?.doctor_preparation_questions || []).map((q, idx) => (
            <li key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-medical-red text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
