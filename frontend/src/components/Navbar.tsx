import React, { useState } from "react";
import { Menu, X, User as UserIcon, LogOut, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { HealthLogo } from "./HealthLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuthModal: (mode: "login" | "signup") => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuthModal }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      setCurrentTab("dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentTab(isAuthenticated ? "dashboard" : "landing")}
            className="flex items-center text-left focus:outline-hidden"
          >
            <HealthLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setCurrentTab("landing")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "landing" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navHome")}
                </button>
                <a
                  href="#features"
                  className="text-sm font-medium text-medical-charcoal hover:text-medical-red transition-colors"
                >
                  {t("navFeatures")}
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-medical-charcoal hover:text-medical-red transition-colors"
                >
                  {t("navHowItWorks")}
                </a>
                <button
                  onClick={() => setCurrentTab("evaluation")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "evaluation" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navEvaluation")}
                </button>
                <button
                  onClick={() => setCurrentTab("fhir")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "fhir" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navFHIR")}
                </button>
                <button
                  onClick={() => setCurrentTab("privacy")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "privacy" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navPrivacy")}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "dashboard" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navDashboard")}
                </button>
                <button
                  onClick={() => setCurrentTab("timeline")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "timeline" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navTimeline")}
                </button>
                <button
                  onClick={() => setCurrentTab("labs")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "labs" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navLabs")}
                </button>
                <button
                  onClick={() => setCurrentTab("medications")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "medications" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navMedications")}
                </button>
                <button
                  onClick={() => setCurrentTab("summary")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "summary" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navSummary")}
                </button>
                <button
                  onClick={() => setCurrentTab("abha")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "abha" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navABHA")}
                </button>
                <button
                  onClick={() => setCurrentTab("fhir")}
                  className={`text-sm font-medium transition-colors ${
                    currentTab === "fhir" ? "text-medical-red font-semibold" : "text-medical-charcoal hover:text-medical-red"
                  }`}
                >
                  {t("navFHIR")}
                </button>
              </>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDemoClick}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-medical-red bg-medical-red-blush border border-medical-red/30 rounded-lg hover:bg-medical-red-light transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="px-3.5 py-1.5 text-sm font-medium text-medical-black hover:text-medical-red transition-colors"
                >
                  {t("navSignIn")}
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal("signup")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-medical-red hover:bg-medical-red-hover rounded-lg shadow-xs transition-all hover:shadow-subtle"
                >
                  {t("navSignUp")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab("upload")}
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-medical-red hover:bg-medical-red-hover rounded-lg shadow-xs transition-all"
                >
                  <span>+ {t("quickUploadCTA")}</span>
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
                  <button
                    onClick={() => setCurrentTab("profile")}
                    className="flex items-center gap-2 text-left p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                    title="View Profile Settings"
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                      {user?.full_name?.charAt(0) || "P"}
                    </div>
                    <div className="hidden xl:block">
                      <div className="text-xs font-bold text-medical-black leading-tight truncate max-w-[120px]">
                        {user?.full_name || "Patient"}
                      </div>
                      <div className="text-[10px] text-medical-muted flex items-center gap-1">
                        {user?.is_demo && <span className="text-medical-red font-medium">Demo Patient</span>}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={logout}
                    className="p-1.5 text-medical-muted hover:text-medical-red rounded-lg hover:bg-neutral-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-medical-charcoal hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-4 space-y-1">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => { setCurrentTab("landing"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navHome")}
              </button>
              <button
                onClick={() => { handleDemoClick(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-red hover:bg-medical-red-blush rounded-md"
              >
                🌟 1-Click Demo Mode (Aarav Sharma)
              </button>
              <button
                onClick={() => { setCurrentTab("evaluation"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navEvaluation")}
              </button>
              <button
                onClick={() => { setCurrentTab("fhir"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navFHIR")}
              </button>
              <button
                onClick={() => { setCurrentTab("privacy"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navPrivacy")}
              </button>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => { openAuthModal("login"); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2 text-sm font-medium border border-neutral-300 rounded-lg"
                >
                  {t("navSignIn")}
                </button>
                <button
                  onClick={() => { openAuthModal("signup"); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-white bg-medical-red rounded-lg"
                >
                  {t("navSignUp")}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setCurrentTab("dashboard"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navDashboard")}
              </button>
              <button
                onClick={() => { setCurrentTab("upload"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-red hover:bg-medical-red-blush rounded-md"
              >
                + {t("quickUploadCTA")}
              </button>
              <button
                onClick={() => { setCurrentTab("timeline"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navTimeline")}
              </button>
              <button
                onClick={() => { setCurrentTab("labs"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navLabs")}
              </button>
              <button
                onClick={() => { setCurrentTab("medications"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navMedications")}
              </button>
              <button
                onClick={() => { setCurrentTab("summary"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navSummary")}
              </button>
              <button
                onClick={() => { setCurrentTab("abha"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navABHA")}
              </button>
              <button
                onClick={() => { setCurrentTab("fhir"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navFHIR")}
              </button>
              <button
                onClick={() => { setCurrentTab("evaluation"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navEvaluation")}
              </button>
              <button
                onClick={() => { setCurrentTab("privacy"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navPrivacy")}
              </button>
              <button
                onClick={() => { setCurrentTab("profile"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-black hover:bg-neutral-50 rounded-md"
              >
                {t("navProfile")}
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-medical-red hover:bg-neutral-50 rounded-md"
              >
                {t("navSignOut")}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
