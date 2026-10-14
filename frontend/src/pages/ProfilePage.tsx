import React, { useState, useEffect } from "react";
import {
  User as UserIcon,
  Save,
  Phone,
  Mail,
  Calendar,
  Languages,
  Shield,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [dob, setDob] = useState(user?.dob || "1983-05-14");
  const [gender, setGender] = useState(user?.gender || "Male");
  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || "B+");
  const [emergencyContactName, setEmergencyContactName] = useState(user?.emergency_contact_name || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user?.emergency_contact_phone || "");
  const [prefLang, setPrefLang] = useState(user?.preferred_language || language);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setDob(user.dob || "1983-05-14");
      setGender(user.gender || "Male");
      setBloodGroup(user.blood_group || "B+");
      setEmergencyContactName(user.emergency_contact_name || "");
      setEmergencyContactPhone(user.emergency_contact_phone || "");
      setPrefLang(user.preferred_language || language);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateUser({
        full_name: fullName,
        dob,
        gender,
        blood_group: bloodGroup,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
        preferred_language: prefLang,
      });
      if (prefLang === "en" || prefLang === "hi") {
        setLanguage(prefLang as "en" | "hi");
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-medical-black tracking-tight flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-medical-red" />
          <span>{t("navProfile")}</span>
        </h1>
        <p className="text-xs sm:text-sm text-medical-muted">
          Manage your demographics, emergency contacts, preferred language, and health privacy settings.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Patient profile settings updated successfully!</span>
        </div>
      )}

      {user?.is_demo && (
        <div className="p-4 rounded-xl bg-medical-red-blush border border-medical-red/20 text-xs text-medical-red flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>
            You are exploring Health Copilot using synthetic patient data (Aarav Sharma). Edits are saved to your test session.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-medical-black pb-2 border-b border-neutral-200">
            Personal & Demographic Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full p-2.5 border border-neutral-200 rounded-xl bg-neutral-100 text-neutral-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 border border-neutral-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xl bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xl bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-medical-black pb-2 border-b border-neutral-200">
            Emergency Medical Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Contact Name & Relationship</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g. Sunita Sharma (Spouse)"
                className="w-full p-2.5 border border-neutral-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Emergency Phone Number</label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 border border-neutral-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-medical-black pb-2 border-b border-neutral-200">
            Language & Interface Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Preferred Language</label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
                className="w-full p-2.5 border border-neutral-300 rounded-xl bg-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-medical-red hover:bg-medical-red-hover transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Profile Settings"}</span>
          </button>
        </div>
      </form>

      <MedicalDisclaimer />
    </div>
  );
};
