import React from "react";
import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface ConfidenceBadgeProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  showLabel?: boolean;
  isUncertain?: boolean;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  score,
  showLabel = true,
  isUncertain = false,
  className = "",
}) => {
  const normalized = score > 1 ? score : Math.round(score * 100);

  if (isUncertain || normalized < 75) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}
        title="Uncertain or handwritten extraction: review suggested"
      >
        <AlertTriangle className="w-3 h-3 text-amber-600" />
        {showLabel && <span>{normalized}% (Needs Review)</span>}
      </span>
    );
  }

  if (normalized >= 90) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}
        title="High extraction confidence verified against document schema"
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        {showLabel && <span>{normalized}% Confident</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200/80 ${className}`}
      title="Standard confidence score"
    >
      <HelpCircle className="w-3 h-3 text-blue-600" />
      {showLabel && <span>{normalized}% Confident</span>}
    </span>
  );
};
