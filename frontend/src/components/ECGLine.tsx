import React from "react";

interface ECGLineProps {
  className?: string;
  height?: number;
  animated?: boolean;
}

export const ECGLine: React.FC<ECGLineProps> = ({ className = "", height = 32, animated = false }) => {
  return (
    <div className={`overflow-hidden flex items-center ${className}`}>
      <svg
        viewBox="0 0 600 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-${height} ${animated ? "animate-ecg" : ""}`}
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 L150 20 L160 20 L168 8 L176 34 L184 6 L192 28 L200 16 L208 20 L350 20 L360 20 L368 8 L376 34 L384 6 L392 28 L400 16 L408 20 L600 20"
          stroke="#D71920"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};
