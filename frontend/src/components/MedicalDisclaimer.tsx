import React from "react";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const MedicalDisclaimer: React.FC<{ className?: string; compact?: boolean }> = ({
  className = "",
  compact = false,
}) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100/90 border border-neutral-200 text-xs text-medical-muted ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-medical-red flex-shrink-0" />
        <span className="truncate">
          Health Copilot supports health understanding. It does not provide medical diagnoses or replace a doctor.
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-medical-muted leading-relaxed ${className}`}
    >
      <AlertCircle className="w-4 h-4 text-medical-red flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-medical-black mr-1">Medical Notice:</span>
        {t("medicalDisclaimer")}
      </div>
    </div>
  );
};
