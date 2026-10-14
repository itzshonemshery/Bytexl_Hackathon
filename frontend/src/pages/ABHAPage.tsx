import React, { useState, useEffect } from "react";
import {
  Link2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building2,
  Calendar,
  FileText,
  Lock,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { ABHAProfile, ABHARecordItem } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const ABHAPage: React.FC = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ABHAProfile | null>(null);
  const [abhaInput, setAbhaInput] = useState<string>("91-4521-8890-1234");
  const [abhaAddress, setAbhaAddress] = useState<string>("aarav.sharma@abdm");
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await api.getABHAStatus();
      setProfile(res);
      setAbhaInput(res.abha_number || "91-4521-8890-1234");
      setAbhaAddress(res.abha_address || "aarav.sharma@abdm");
    } catch (err) {
      console.error("Error loading ABHA status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setStatusMessage(null);
    try {
      const res = await api.connectABHA({ abha_id: abhaInput, abha_address: abhaAddress });
      setStatusMessage(res.message);
      loadStatus();
    } catch (err: any) {
      alert(err.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm("Revoke consent and disconnect simulated ABHA health ID?")) {
      try {
        await api.disconnectABHA();
        loadStatus();
      } catch (err) {
        alert("Failed to disconnect.");
      }
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedContexts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImportSelected = async () => {
    if (selectedContexts.length === 0) return;
    setImporting(true);
    try {
      const res = await api.importCareContexts(selectedContexts);
      setStatusMessage(res.message);
      setSelectedContexts([]);
      loadStatus();
    } catch (err: any) {
      alert(err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const isConnected = profile?.status === "connected" && profile?.consent_granted;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
          <Link2 className="w-4 h-4" />
          <span>Ayushman Bharat Digital Mission (ABDM) Integration Layer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight">
          Demo ABHA Health ID Connection
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Simulated sandbox gateway demonstrating consent-driven care context discovery and FHIR R4 interoperability.
        </p>
      </div>

      {/* Critical Hackathon Transparency Banner */}
      <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-300 text-xs text-neutral-800 space-y-1.5">
        <div className="font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-medical-red" />
          <span>Hackathon Sandbox Boundary Disclosure</span>
        </div>
        <p className="text-[11px] leading-relaxed text-neutral-600">
          This integration operates in a sandboxed demonstration environment. The mock ABHA identifier (<code>91-4521-8890-1234</code>)
          interacts with simulated Health Information Providers (HIPs). It does not retrieve live confidential hospital databases or store actual government credentials.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Connection & Consent Card */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-medical-black">
              ABHA Profile Status
            </h3>
            <p className="text-xs text-medical-muted">
              {isConnected ? "Linked to simulated ABDM Sandbox with explicit patient consent." : "Not connected to any ABHA identifier."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Connection</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                Disconnected
              </span>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">ABHA Number</span>
                <span className="font-bold text-neutral-900 font-mono text-sm">{profile?.abha_number}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">ABHA Address</span>
                <span className="font-bold text-neutral-900">{profile?.abha_address}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Consent Status</span>
                <span className="font-bold text-emerald-700">Explicit Patient Consent Granted</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-bold text-medical-red hover:bg-medical-red-blush border border-medical-red/30 transition-colors flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Revoke Consent & Disconnect ABHA</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Demo ABHA Number (14 Digits)
                </label>
                <input
                  type="text"
                  required
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono border border-neutral-300 rounded-xl"
                  placeholder="91-4521-8890-1234"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ABHA Address (@abdm)
                </label>
                <input
                  type="text"
                  required
                  value={abhaAddress}
                  onChange={(e) => setAbhaAddress(e.target.value)}
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded-xl"
                  placeholder="aarav.sharma@abdm"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-medical-red flex-shrink-0 mt-0.5" />
              <span>
                By connecting, you grant explicit consent for HealthieCure to discover and fetch simulated care contexts from registered ABDM facilities.
              </span>
            </div>

            <button
              type="submit"
              disabled={connecting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-medical-red hover:bg-medical-red-hover transition-colors shadow-xs"
            >
              {connecting ? "Connecting..." : "Connect & Grant Consent (Demo Mode)"}
            </button>
          </form>
        )}
      </div>

      {/* Discoverable Care Contexts Table */}
      {isConnected && (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <h3 className="text-base font-bold text-medical-black">
                Discoverable Care Contexts from Simulated Hospitals
              </h3>
              <p className="text-xs text-medical-muted">
                Select clinical records to pull into your HealthieCure unified timeline:
              </p>
            </div>

            <button
              onClick={handleImportSelected}
              disabled={selectedContexts.length === 0 || importing}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-medical-black hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Import Selected ({selectedContexts.length})</span>
            </button>
          </div>

          <div className="space-y-3">
            {(profile?.available_records || []).map((rec) => (
              <div
                key={rec.care_context_id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  rec.is_imported
                    ? "bg-emerald-50/30 border-emerald-200"
                    : selectedContexts.includes(rec.care_context_id)
                    ? "bg-medical-red-blush border-medical-red/40"
                    : "bg-white border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {!rec.is_imported ? (
                    <input
                      type="checkbox"
                      checked={selectedContexts.includes(rec.care_context_id)}
                      onChange={() => handleToggleSelect(rec.care_context_id)}
                      className="mt-1 w-4 h-4 text-medical-red rounded border-neutral-300 focus:ring-medical-red"
                    />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-medical-black truncate">{rec.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                        {rec.record_type.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-[11px] text-medical-muted flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3 h-3 text-neutral-400" />
                      <span>{rec.facility_name} (HIP: {rec.hip_id})</span>
                      <span>•</span>
                      <span>{rec.date}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-normal">
                      {rec.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {rec.is_imported ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Imported to Timeline
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToggleSelect(rec.care_context_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                    >
                      {selectedContexts.includes(rec.care_context_id) ? "Selected" : "Select for Import"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};
