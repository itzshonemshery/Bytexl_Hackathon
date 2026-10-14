import React from "react";

interface HeartbeatPulseProps {
  className?: string;
  glow?: boolean;
  bpm?: number;
  height?: number;
}

export const HeartbeatPulse: React.FC<HeartbeatPulseProps> = ({
  className = "",
  glow = true,
  bpm = 72,
  height = 48,
}) => {
  return (
    <div className={`relative flex items-center overflow-hidden ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 600 60"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <defs>
          {glow && (
            <filter id="heartbeat-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
          <linearGradient id="heartbeat-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D71920" stopOpacity="0.05" />
            <stop offset="20%" stopColor="#D71920" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#D71920" stopOpacity="1" />
            <stop offset="80%" stopColor="#D71920" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D71920" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Muted background guide line */}
        <path
          d="M 0 30 L 120 30 L 135 30 L 145 18 L 155 42 L 165 6 L 175 52 L 185 24 L 195 33 L 205 30 L 320 30 L 335 30 L 345 18 L 355 42 L 365 6 L 375 52 L 385 24 L 395 33 L 405 30 L 520 30 L 535 30 L 545 18 L 555 42 L 565 6 L 575 52 L 585 24 L 595 33 L 600 30"
          fill="none"
          stroke="#FEE2E2"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Animated glowing pulse wave */}
        <path
          d="M 0 30 L 120 30 L 135 30 L 145 18 L 155 42 L 165 6 L 175 52 L 185 24 L 195 33 L 205 30 L 320 30 L 335 30 L 345 18 L 355 42 L 365 6 L 375 52 L 385 24 L 395 33 L 405 30 L 520 30 L 535 30 L 545 18 L 555 42 L 565 6 L 575 52 L 585 24 L 595 33 L 600 30"
          fill="none"
          stroke="url(#heartbeat-fade)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={glow ? "url(#heartbeat-glow)" : undefined}
          className="animate-ecg-pulse"
        />
      </svg>
    </div>
  );
};
