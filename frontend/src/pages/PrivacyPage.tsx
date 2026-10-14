import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  FileText,
  Trash2,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { api } from "../services/api";
import { AuditLog } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const PrivacyPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.getAuditLogs();
        setLogs(res);
      } catch (err) {
        console.error("Error loading audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-medical-red flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Patient Privacy & Consent Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight">
          Data Security, Consent & Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Transparent record handling, cryptographic safeguards, and real-time audit logging for patient control.
        </p>
      </div>

      {/* Security Commitments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-medical-black">User Data Isolation</h3>
          <p className="text-xs text-medical-muted leading-relaxed">
            All uploaded clinical files and structured extractions are strictly partitioned by authenticated user ID with bcrypt-hashed passwords.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-medical-black">Zero Unauthorized AI Sharing</h3>
          <p className="text-xs text-medical-muted leading-relaxed">
            Patient health documents are processed strictly through local sandboxed extraction models or grounded deterministic interpreters.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-2">
          <div className="w-9 h-9 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-medical-black">Right to Erasure</h3>
          <p className="text-xs text-medical-muted leading-relaxed">
            You can permanently delete any uploaded document at any time. All associated extractions, thumbnails, and medications are erased.
          </p>
        </div>
      </div>

      {/* Prototype vs Production Scope Disclosure */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
        <h3 className="text-base font-bold text-medical-black flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-medical-red" />
          <span>Prototype Scope vs Production Certification</span>
        </h3>
        <p className="text-xs text-medical-muted leading-relaxed">
          In compliance with hackathon safety requirements, Health Copilot clearly distinguishes functional prototype capabilities from regulatory production certifications:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <div className="font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Implemented Prototype Safeguards</span>
            </div>
            <ul className="space-y-1 text-neutral-600 list-disc list-inside text-[11px]">
              <li>JWT authentication with bcrypt password hashing</li>
              <li>SHA-256 file hashing for duplicate detection</li>
              <li>Per-user database authorization filtering</li>
              <li>FHIR R4-compliant data serialization</li>
              <li>Tamper-evident audit event tracking</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
            <div className="font-bold text-neutral-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-600" />
              <span>Production Requirements (Pre-Deployment)</span>
            </div>
            <ul className="space-y-1 text-neutral-600 list-disc list-inside text-[11px]">
              <li>Independent third-party HIPAA / ISO 27001 audit</li>
              <li>Live ABDM production gateway M1/M2/M3 certification</li>
              <li>Hardware Security Module (HSM) key rotation</li>
              <li>Multi-factor authentication (MFA) enforcement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Tamper-Evident Patient Audit Log */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-medical-black">
              Patient Audit Trail & Event Log
            </h3>
            <p className="text-xs text-medical-muted">
              Live logging of uploads, reviews, corrections, ABHA interactions, and record deletions:
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
            Live Stream
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-medical-muted">Loading audit history...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-medical-muted">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Resource</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 font-semibold">{log.resource_type}</td>
                    <td className="py-2.5 px-3 text-neutral-800 text-[11px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
