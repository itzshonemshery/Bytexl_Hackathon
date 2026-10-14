import React from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Clock,
  FlaskConical,
  Pill,
  FileText,
  Sparkles,
  Link2,
  Code2,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { t } = useLanguage();

  const navigationItems = [
    { id: "dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { id: "upload", label: t("navUpload"), icon: UploadCloud, highlight: true },
    { id: "timeline", label: t("navTimeline"), icon: Clock },
    { id: "labs", label: t("navLabs"), icon: FlaskConical },
    { id: "medications", label: t("navMedications"), icon: Pill },
    { id: "summary", label: t("navSummary"), icon: Sparkles },
    { id: "abha", label: t("navABHA"), icon: Link2 },
    { id: "fhir", label: t("navFHIR"), icon: Code2 },
    { id: "evaluation", label: t("navEvaluation"), icon: CheckCircle2 },
    { id: "privacy", label: t("navPrivacy"), icon: ShieldCheck },
    { id: "profile", label: t("navProfile"), icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-medical-muted px-3 mb-2">
            Clinical Navigation
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-medical-red text-white shadow-xs font-semibold"
                      : item.highlight
                      ? "text-medical-red bg-medical-red-blush hover:bg-medical-red-light font-semibold"
                      : "text-medical-charcoal hover:bg-neutral-100 hover:text-medical-black"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : item.highlight ? "text-medical-red" : "text-medical-muted"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Safety & Compliance Badge at bottom */}
      <div className="pt-4 border-t border-neutral-200">
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-medical-black mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ABDM Sandbox Ready</span>
          </div>
          <p className="text-[11px] text-medical-muted leading-tight">
            FHIR R4 JSON schemas active. Grounded non-diagnostic safety boundary enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
