import React from "react";
import {
  FileText,
  Activity,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  HelpCircle,
  FileCheck,
  Stethoscope,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { ECGLine } from "../components/ECGLine";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
  onOpenDemo: () => void;
  onGoToEvaluation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreFeatures,
  onOpenDemo,
  onGoToEvaluation,
}) => {
  const { t } = useLanguage();
  const { demoLogin } = useAuth();

  return (
    <div className="min-h-screen bg-white text-medical-charcoal selection:bg-medical-red selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-medical-surface via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medical-red-blush border border-medical-red/20 text-xs font-semibold text-medical-red">
                <span className="w-2 h-2 rounded-full bg-medical-red animate-pulse"></span>
                <span>{t("heroEyebrow")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-medical-black leading-[1.12]">
                Your Healthcare,{" "}
                <span className="text-medical-red relative inline-block">
                  Clearly
                  <span className="absolute bottom-1 left-0 w-full h-1 bg-medical-red/30 rounded-full"></span>
                </span>{" "}
                Understood.
              </h1>

              {/* Integrated subtle ECG line */}
              <div className="py-1">
                <ECGLine height={28} animated={true} />
              </div>

              <p className="text-base sm:text-lg text-medical-muted leading-relaxed max-w-2xl">
                {t("heroSubheadline")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-xl font-semibold text-white bg-medical-red hover:bg-medical-red-hover shadow-sm hover:shadow-subtle transition-all flex items-center gap-2 text-sm"
                >
                  <span>{t("heroCTA")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="px-5 py-3.5 rounded-xl font-semibold text-medical-black bg-white hover:bg-neutral-50 border border-neutral-300 shadow-xs transition-all flex items-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-medical-red" />
                  <span>{t("heroSecondaryCTA")}</span>
                </button>
              </div>

              {/* Three Benefit Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 shadow-subtle">
                  <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                    <FileCheck className="w-4 h-4 text-medical-red" />
                    <span>{t("heroBenefit1")}</span>
                  </div>
                  <p className="text-[11px] text-medical-muted leading-normal">
                    {t("heroBenefit1Desc")}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 shadow-subtle">
                  <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                    <Clock className="w-4 h-4 text-medical-red" />
                    <span>{t("heroBenefit2")}</span>
                  </div>
                  <p className="text-[11px] text-medical-muted leading-normal">
                    {t("heroBenefit2Desc")}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 shadow-subtle">
                  <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                    <Shield className="w-4 h-4 text-medical-red" />
                    <span>{t("heroBenefit3")}</span>
                  </div>
                  <p className="text-[11px] text-medical-muted leading-normal">
                    {t("heroBenefit3Desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Healthcare Imagery & Clinical UI Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border card with soft shadow */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-200/80 bg-white shadow-clinical">
                  {/* Real clinical healthcare photograph */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-100">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                      alt="Doctor reviewing medical laboratory reports with patient"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-medical-red text-[11px] font-semibold mb-1">
                        <span>Clinical Intelligence</span>
                      </div>
                      <div className="text-sm font-bold">Traceable Medical Document Understanding</div>
                      <div className="text-[11px] text-white/80">Every claim grounded directly in laboratory reference intervals</div>
                    </div>
                  </div>

                  {/* Floating clinical report card */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-medical-red-blush text-medical-red flex items-center justify-center font-bold text-xs">
                          Rx
                        </div>
                        <div>
                          <div className="text-xs font-bold text-medical-black">Aarav Sharma (42 Y / M)</div>
                          <div className="text-[10px] text-medical-muted">Metropolis Lab • 12-Mar-2026</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified 98%
                      </span>
                    </div>

                    <div className="space-y-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-neutral-700">HbA1c (Glycated Hemoglobin)</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-medical-red">7.4 %</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-100 text-red-800">HIGH</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-medical-muted">
                        Reference Range: 4.0 - 5.6 % • Prior Value: 6.8 % (Oct 2025)
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-medical-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-medical-red" />
                        <span>Prepared for doctor conversation</span>
                      </div>
                      <span className="text-medical-red font-semibold cursor-pointer hover:underline" onClick={onOpenDemo}>
                        View Demo &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl border border-neutral-200 shadow-clinical flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-medical-black">ABDM & FHIR R4 Ready</div>
                    <div className="text-[10px] text-medical-muted">Simulated Care Context Exchange</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-medical-red">
              Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-medical-black tracking-tight">
              {t("featuresTitle")}
            </h2>
            <p className="text-sm sm:text-base text-medical-muted">
              {t("featuresSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/30 transition-all hover:shadow-card-hover group">
              <div className="w-12 h-12 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-medical-black mb-2">
                {t("feat1Title")}
              </h3>
              <p className="text-xs text-medical-muted leading-relaxed">
                {t("feat1Desc")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/30 transition-all hover:shadow-card-hover group">
              <div className="w-12 h-12 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-medical-black mb-2">
                {t("feat2Title")}
              </h3>
              <p className="text-xs text-medical-muted leading-relaxed">
                {t("feat2Desc")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/30 transition-all hover:shadow-card-hover group">
              <div className="w-12 h-12 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-medical-black mb-2">
                {t("feat3Title")}
              </h3>
              <p className="text-xs text-medical-muted leading-relaxed">
                {t("feat3Desc")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-medical-red/30 transition-all hover:shadow-card-hover group">
              <div className="w-12 h-12 rounded-xl bg-medical-red-blush text-medical-red flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-medical-black mb-2">
                {t("feat4Desc")}
              </h3>
              <p className="text-xs text-medical-muted leading-relaxed">
                {t("feat4Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-medical-surface border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-medical-red">
              Process Flow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-medical-black tracking-tight">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-sm sm:text-base text-medical-muted">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-medical-black">{t("step1Title")}</h4>
              <p className="text-xs text-medical-muted leading-relaxed">{t("step1Desc")}</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-medical-black">{t("step2Title")}</h4>
              <p className="text-xs text-medical-muted leading-relaxed">{t("step2Desc")}</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-medical-black">{t("step3Title")}</h4>
              <p className="text-xs text-medical-muted leading-relaxed">{t("step3Desc")}</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-white border border-neutral-200 shadow-subtle space-y-3">
              <div className="w-8 h-8 rounded-lg bg-medical-red text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h4 className="text-sm font-bold text-medical-black">{t("step4Title")}</h4>
              <p className="text-xs text-medical-muted leading-relaxed">{t("step4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-medical-red">
                Privacy Architecture
              </div>
              <h2 className="text-3xl font-extrabold text-medical-black tracking-tight">
                {t("trustTitle")}
              </h2>
              <p className="text-sm text-medical-muted leading-relaxed">
                {t("trustSubtitle")}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onGoToEvaluation}
                  className="inline-flex items-center gap-2 text-xs font-bold text-medical-red hover:underline"
                >
                  <span>Review Measured Extraction Accuracy & Test Suite</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                  <Lock className="w-4 h-4 text-medical-red" />
                  <span>{t("trust1Title")}</span>
                </div>
                <p className="text-xs text-medical-muted">{t("trust1Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                  <CheckCircle2 className="w-4 h-4 text-medical-red" />
                  <span>{t("trust2Title")}</span>
                </div>
                <p className="text-xs text-medical-muted">{t("trust2Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                  <Shield className="w-4 h-4 text-medical-red" />
                  <span>{t("trust3Title")}</span>
                </div>
                <p className="text-xs text-medical-muted">{t("trust3Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2 font-bold text-xs text-medical-black mb-1">
                  <HelpCircle className="w-4 h-4 text-medical-red" />
                  <span>{t("trust4Title")}</span>
                </div>
                <p className="text-xs text-medical-muted">{t("trust4Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-12 pb-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg">
                <span className="w-3 h-3 rounded-full bg-medical-red"></span>
                <span>Health Copilot</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                AI-Powered Personal Health Platform • Altrix Labs Hackathon
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-neutral-400">
              <button onClick={onGetStarted} className="hover:text-white transition-colors">
                Home
              </button>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <button onClick={onGoToEvaluation} className="hover:text-white transition-colors">
                Accuracy Benchmark
              </button>
              <button onClick={onOpenDemo} className="hover:text-white transition-colors">
                Demo Mode
              </button>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300 leading-relaxed">
            <span className="font-bold text-white mr-1">Medical Disclaimer:</span>
            {t("medicalDisclaimer")}
          </div>

          <div className="text-center text-[11px] text-neutral-500">
            &copy; 2026 Health Copilot. {t("footerRights")}
          </div>
        </div>
      </footer>
    </div>
  );
};
