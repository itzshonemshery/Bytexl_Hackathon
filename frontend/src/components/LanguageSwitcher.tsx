import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-neutral-100 border border-neutral-200/90 text-xs">
      <Languages className="w-3.5 h-3.5 text-medical-muted ml-1" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
          language === "en"
            ? "bg-white text-medical-black shadow-xs font-semibold"
            : "text-medical-muted hover:text-medical-black"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
          language === "hi"
            ? "bg-medical-red text-white shadow-xs font-semibold"
            : "text-medical-muted hover:text-medical-black"
        }`}
      >
        हिंदी (HI)
      </button>
    </div>
  );
};
