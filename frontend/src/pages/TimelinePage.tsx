import React, { useState, useEffect } from "react";
import {
  Clock,
  Filter,
  Search,
  FileText,
  FlaskConical,
  Activity,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Eye,
  CheckCircle2,
  Trash2,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { TimelineItem } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

interface TimelinePageProps {
  onViewDoc: (docId: string) => void;
  onViewSummary: (docId: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ onViewDoc, onViewSummary }) => {
  const { t } = useLanguage();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await api.getTimeline(selectedFilter, searchTerm);
      setItems(data);
    } catch (err) {
      console.error("Error loading timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, [selectedFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTimeline();
  };

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this record from your health history?")) {
      try {
        await api.deleteDocument(docId);
        loadTimeline();
      } catch (err) {
        alert("Failed to delete record.");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-medical-red" />
            <span>{t("navTimeline")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-medical-muted mt-1">
            Chronological, unified medical records across clinics, diagnostics, and hospitals.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search test, doctor, or record..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-medical-red/20 focus:border-medical-red"
          />
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        {[
          { id: "all", label: "All Records" },
          { id: "prescription", label: "Prescriptions" },
          { id: "lab_report", label: "Lab Reports" },
          { id: "discharge_summary", label: "Discharge Summaries" },
          { id: "diagnostic_report", label: "Diagnostic Scans" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === tab.id
                ? "bg-medical-red text-white shadow-xs"
                : "bg-white text-medical-charcoal hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="p-12 text-center text-xs text-medical-muted">Loading health timeline...</div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
          <Clock className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-medical-black">No matching records found</h3>
          <p className="text-xs text-medical-muted mt-1">
            Try adjusting your search terms or filter selection.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-neutral-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Marker Icon */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-medical-red flex items-center justify-center text-medical-red shadow-xs">
                {item.record_type === "prescription" && <FileText className="w-3.5 h-3.5" />}
                {item.record_type === "lab_report" && <FlaskConical className="w-3.5 h-3.5" />}
                {item.record_type === "discharge_summary" && <Clock className="w-3.5 h-3.5" />}
                {item.record_type === "diagnostic_report" && <Activity className="w-3.5 h-3.5" />}
              </div>

              {/* Timeline Card */}
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all shadow-subtle hover:shadow-card-hover space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-800">
                      {item.date}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                      {item.record_type.replace("_", " ")}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-medical-muted font-medium truncate">
                    {item.facility_or_provider}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-medical-black group-hover:text-medical-red transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-medical-muted mt-1 leading-relaxed">
                    {item.summary_snippet}
                  </p>
                </div>

                {/* Key Metrics Chips */}
                {item.key_metrics && item.key_metrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.key_metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-50 text-neutral-800 border border-neutral-200"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                )}

                {/* 3 Explicit Action Buttons as required by user prompt */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Button 1: View Extracted Information */}
                    <button
                      onClick={() => onViewDoc(item.document_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-medical-black transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Extracted Data</span>
                    </button>

                    {/* Button 2: Plain Language Summary */}
                    <button
                      onClick={() => onViewSummary(item.document_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-medical-red-blush hover:bg-medical-red-light text-medical-red transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Plain Language Summary</span>
                    </button>
                  </div>

                  {/* Delete record */}
                  <button
                    onClick={() => handleDelete(item.document_id)}
                    className="p-1.5 text-neutral-400 hover:text-medical-red transition-colors"
                    title="Delete record from timeline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
