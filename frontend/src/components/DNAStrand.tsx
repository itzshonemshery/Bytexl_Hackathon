import React from "react";

interface DNAStrandProps {
  className?: string;
  pairs?: number;
  height?: number;
}

export const DNAStrand: React.FC<DNAStrandProps> = ({
  className = "",
  pairs = 14,
  height = 56,
}) => {
  const nodes = Array.from({ length: pairs }, (_, i) => i);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden py-2 ${className}`} style={{ height }}>
      <div className="flex items-center gap-4 sm:gap-6">
        {nodes.map((index) => {
          // Calculate an animated staggered offset for each base pair
          const delay = (index * 0.18).toFixed(2);
          return (
            <div
              key={index}
              className="relative flex flex-col items-center justify-between"
              style={{
                height: `${height - 12}px`,
                animation: `dna-twist 2.8s ease-in-out infinite`,
                animationDelay: `-${delay}s`,
              }}
            >
              {/* Upper Node (Top Strand) */}
              <div
                className="w-2.5 h-2.5 rounded-full bg-medical-red shadow-sm transition-transform"
                style={{
                  boxShadow: "0 0 8px rgba(215, 25, 32, 0.45)",
                }}
              />

              {/* Hydrogen Bond Connecting Rung */}
              <div
                className="w-[1.5px] bg-gradient-to-b from-medical-red/70 via-neutral-300 to-neutral-800/60 my-0.5 rounded-full"
                style={{
                  height: "100%",
                }}
              />

              {/* Lower Node (Bottom Strand) */}
              <div
                className="w-2.5 h-2.5 rounded-full bg-medical-black shadow-sm transition-transform"
                style={{
                  boxShadow: "0 0 6px rgba(17, 17, 17, 0.3)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
