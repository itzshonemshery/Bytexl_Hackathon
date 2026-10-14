import React from "react";

interface HealthLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withSubtitle?: boolean;
}

export const HealthLogo: React.FC<HealthLogoProps> = ({ className = "", size = "md", withSubtitle = true }) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Heart + ECG Clinical Emblem */}
      <div className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-medical-red shadow-sm text-white flex-shrink-0 transition-transform duration-200 hover:scale-105`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M7 10h2l1-3 2 6 1.5-3.5L14.5 10H17" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-serif font-bold tracking-tight text-medical-black ${textSizes[size]}`}>
          healthie<span className="text-medical-red italic font-normal">cure</span>
        </span>
        {withSubtitle && (
          <span className="text-[10px] uppercase tracking-wider text-medical-muted font-sans font-semibold mt-0.5">
            Personal Health Platform
          </span>
        )}
      </div>
    </div>
  );
};
