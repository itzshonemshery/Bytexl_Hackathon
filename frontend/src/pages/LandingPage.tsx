import React, { useState, useEffect } from "react";
import {
  FileText,
  FlaskConical,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  Shield,
  FileCheck,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Lock,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Heart,
  Pill,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
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
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Slides data demonstrating real medical document transformations
  const slides = [
    {
      id: "prescriptions",
      category: "Prescriptions",
      icon: Pill,
      badge: "Decoded Prescription",
      title: "Clarity on Every Medication & Dose",
      subtitle: "Turn difficult doctor handwriting and shorthand into structured schedules with food instructions and safety checks.",
      originalSnippet: "Tab. Metformin 500mg BD pc x 30d • Tab. Atorvastatin 10mg OD HS",
      organizedData: [
        { name: "Metformin Hydrochloride", dose: "500 mg • 1 Tablet", freq: "Twice daily (BD)", tip: "Take with breakfast and dinner" },
        { name: "Atorvastatin", dose: "10 mg • 1 Tablet", freq: "Once daily at bedtime (OD HS)", tip: "Take with water before sleep" },
      ],
      doctorQuestion: "Doctor, do I need repeat blood sugar monitoring before adjusting this Metformin dosage?",
    },
    {
      id: "lab_tests",
      category: "Biochemistry & Labs",
      icon: FlaskConical,
      badge: "Laboratory Intelligence",
      title: "Contextualized Blood Indicators",
      subtitle: "Understand abnormal flags grounded strictly in laboratory reference ranges, without anxiety or unsupported self-diagnosis.",
      originalSnippet: "HbA1c Glycated Hemoglobin: 7.4 % [4.0 - 5.6] (High) • Fasting Glucose: 138 mg/dL [70 - 99]",
      organizedData: [
        { name: "HbA1c (3-Month Sugar)", dose: "7.4 % (Elevated)", freq: "Reference: 4.0 - 5.6 %", tip: "Upward trend from 6.8% (Oct 2025)" },
        { name: "Fasting Blood Sugar", dose: "138 mg/dL (Flagged)", freq: "Reference: 70 - 99 mg/dL", tip: "Requires clinical physician review" },
      ],
      doctorQuestion: "Given my HbA1c moved from 6.8% to 7.4% over 5 months, should we review my diet or medication regimen?",
    },
    {
      id: "discharge",
      category: "Hospital Discharge",
      icon: Clock,
      badge: "Discharge & Recovery",
      title: "Structured Post-Hospital Care",
      subtitle: "Extract hospital courses, primary diagnoses, and post-discharge antibiotics into an actionable recovery checklist.",
      originalSnippet: "Fortis Hospital • Diagnosis: Acute Gastroenteritis with Dehydration • Tab Rifaximin 400mg TDS x 5d",
      organizedData: [
        { name: "Primary Diagnosis", dose: "Acute Gastroenteritis", freq: "Inpatient Stay: 4 Days", tip: "Hydration therapy completed" },
        { name: "Rifaximin (Antibiotic)", dose: "400 mg • Thrice daily", freq: "Completed 5-Day Course", tip: "Historical medication archived" },
      ],
      doctorQuestion: "When should I schedule an in-person follow-up consultation with my treating physician?",
    },
    {
      id: "abha_sync",
      category: "ABHA Health ID",
      icon: Activity,
      badge: "ABDM Interoperability",
      title: "Unified Care Context Exchange",
      subtitle: "Connect your simulated ABHA ID to discover and import records from Max Healthcare, Apollo, and Dr. Lal PathLabs with full consent.",
      originalSnippet: "ABHA: 91-4521-8890-1234 • HL7 FHIR R4 Bundle serialized • Explicit patient consent granted",
      organizedData: [
        { name: "Max Super Speciality", dose: "Discharge Summary", freq: "Inpatient Record", tip: "Care Context: CC-MAX-2025" },
        { name: "Dr. Lal PathLabs", dose: "Comprehensive Panel", freq: "Diagnostic Lab", tip: "Care Context: CC-LAL-2025" },
      ],
      doctorQuestion: "Are all historical records properly linked to my digital health profile?",
    },
  ];

  const handleNextSlide = () => {
    setSlideDirection("next");
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setSlideDirection("prev");
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Autoplay slides every 8 seconds for dynamic showcase
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];

  return (
    <div className="min-h-screen bg-medical-surface text-medical-charcoal selection:bg-medical-red selection:text-white">
      {/* 1. Calm, Breathable Editorial Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs font-semibold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-medical-red animate-pulse"></span>
                <span>AI-Powered Personal Health Platform</span>
              </div>

              {/* Classic Serif Editorial Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-medical-black leading-[1.15]">
                Your health records,{" "}
                <span className="text-medical-red italic font-normal">
                  clearly understood.
                </span>
              </h1>

              {/* Heartbeat divider line */}
              <div className="w-full max-w-md py-1">
                <ECGLine height={24} animated={true} />
              </div>

              <p className="font-sans text-base sm:text-lg text-medical-muted leading-relaxed max-w-xl">
                Healthiecure transforms complex prescriptions, dense blood test panels, and hospital discharge summaries into simple, organized, and traceable health records for informed conversations with your doctor.
              </p>

              {/* Actions & Proof */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-xl font-sans font-bold text-sm text-white bg-medical-red hover:bg-medical-red-hover shadow-xs hover:shadow-subtle transition-all flex items-center gap-2"
                >
                  <span>{t("heroCTA")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="px-5 py-3.5 rounded-xl font-sans font-bold text-sm text-medical-black bg-white hover:bg-neutral-50 border border-neutral-300 shadow-2xs transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-medical-red" />
                  <span>{t("heroSecondaryCTA")}</span>
                </button>
              </div>

              {/* Reassuring Clinical Guardrail Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-medical-muted border-t border-neutral-200/80">
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Non-Diagnostic Grounding</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Shield className="w-4 h-4 text-medical-red flex-shrink-0" />
                  <span>ABDM & FHIR R4 Ready</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Heart className="w-4 h-4 text-medical-red flex-shrink-0" />
                  <span>100% Patient Privacy</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Editorial Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Card with Warm Clean Borders */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-clinical space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-medical-red text-white flex items-center justify-center font-bold text-xs">
                        HC
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-medical-black">healthiecure</div>
                        <div className="text-[10px] text-medical-muted uppercase font-sans font-semibold">Active Health Timeline</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Sample Patient: Aarav Sharma
                    </span>
                  </div>

                  {/* Sample Transformation Visual */}
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-medical-muted flex items-center justify-between">
                        <span>Original Laboratory Finding</span>
                        <span className="text-medical-red font-mono font-bold">HIGH</span>
                      </div>
                      <div className="font-serif font-bold text-sm text-medical-black">
                        HbA1c: 7.4 % <span className="font-sans font-normal text-xs text-neutral-500">(Ref: 4.0 - 5.6 %)</span>
                      </div>
                      <div className="text-[11px] text-medical-muted">
                        Measured via HPLC assay at Metropolis Clinical Lab • 12-Mar-2026
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-medical-red-blush border border-medical-red/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-medical-red font-sans">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Plain-Language Healthiecure Summary</span>
                      </div>
                      <p className="text-xs text-neutral-800 leading-relaxed font-sans">
                        Your HbA1c measures average blood sugar over the last 3 months. Compared to your previous test on 15 Oct 2025 (6.8%), this shows an upward trajectory. A flagged value is not a diagnosis, but an important discussion point for your doctor.
                      </p>
                    </div>
                  </div>

                  {/* Doctor Consultation Prompt */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-600">
                      <Stethoscope className="w-3.5 h-3.5 text-medical-red" />
                      <span className="font-sans font-medium">Ready for your next doctor visit</span>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenDemo}
                      className="text-medical-red font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-4 -left-3 bg-white px-3.5 py-2 rounded-2xl border border-neutral-200 shadow-clinical flex items-center gap-2 hidden sm:flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-serif font-bold text-medical-black">ABDM Sandbox Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Three-Step Manageable Journey: Organized & User-Friendly */}
      <section className="py-16 bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
              Simple & Calm Process
            </span>
            <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
              Three steps from paper clutter to medical clarity
            </h2>
            <p className="text-xs sm:text-sm text-medical-muted font-sans">
              Designed to take the anxiety and confusion out of managing medical records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 text-medical-black font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                Snap or Upload Any Report
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Upload prescriptions, blood test sheets, hospital discharge papers, or X-rays in PDF or image format.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 text-medical-black font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                Side-by-Side Verification
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Review extracted medications, dosages, and test values right next to your original document with confidence badges before saving.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-medical-red-blush/60 border border-medical-red/20 hover:border-medical-red/40 transition-all space-y-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-medical-red text-white font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                Plain English & Hindi Guidance
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Understand what values measure, see historical trends, and get a list of prepared questions to discuss with your doctor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Animated Slide Carousel: Live Document Transformations */}
      <section className="py-20 bg-medical-surface overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
                Interactive Transformation Showcase
              </div>
              <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
                See how Healthiecure decodes each report
              </h2>
              <p className="text-xs sm:text-sm text-medical-muted font-sans max-w-xl">
                Switch through the slides below to see how medical records are converted into clear, understandable information with zero guesswork.
              </p>
            </div>

            {/* Carousel Slide Navigation Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-medical-black flex items-center justify-center shadow-2xs transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next slide"
                className="w-10 h-10 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-medical-black flex items-center justify-center shadow-2xs transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Slide Category Selectors */}
          <div className="flex flex-wrap gap-2 mb-8">
            {slides.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeSlide === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSlideDirection(idx > activeSlide ? "next" : "prev");
                    setActiveSlide(idx);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-medical-black text-white shadow-xs scale-102"
                      : "bg-white text-medical-charcoal hover:bg-neutral-100 border border-neutral-200"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-medical-red" : "text-neutral-500"}`} />
                  <span>{s.category}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Slide Content Box */}
          <div className="relative">
            <div
              key={currentSlide.id}
              className={`p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-clinical grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                slideDirection === "next" ? "animate-slide-next" : "animate-slide-prev"
              }`}
            >
              {/* Left Column of Slide */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-medical-red-blush text-medical-red border border-medical-red/20 inline-block">
                  {currentSlide.badge}
                </span>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-medical-black leading-snug">
                  {currentSlide.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                {/* Raw snippet pill */}
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-600 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 font-sans">Source Document Evidence:</div>
                  <div className="truncate">{currentSlide.originalSnippet}</div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenDemo}
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold text-medical-red hover:underline"
                  >
                    <span>Try this in interactive demo mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column of Slide: Decoded Transformation */}
              <div className="lg:col-span-7 bg-neutral-50/80 p-5 sm:p-6 rounded-2xl border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-sans font-bold text-medical-black pb-2 border-b border-neutral-200">
                  <span>Structured & Verified Translation</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Confidence: 98%
                  </span>
                </div>

                {/* Structured records list */}
                <div className="space-y-3">
                  {currentSlide.organizedData.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-medical-black">{item.name}</span>
                        <span className="font-sans font-semibold text-medical-red text-[11px]">{item.dose}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 font-sans">
                        <span className="font-semibold text-neutral-800">Frequency:</span> {item.freq}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-sans italic">
                        Tip: {item.tip}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Doctor Question Box */}
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-medical-black font-sans">
                    <Stethoscope className="w-3.5 h-3.5 text-medical-red" />
                    <span>Curated Question to Ask Your Doctor</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-sans italic">
                    "{currentSlide.doctorQuestion}"
                  </p>
                </div>
              </div>
            </div>

            {/* Slide dots indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setSlideDirection(dotIdx > activeSlide ? "next" : "prev");
                    setActiveSlide(dotIdx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === dotIdx ? "w-8 bg-medical-red" : "w-2 bg-neutral-300"
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Four Core Pillars of Care: Organized & Clean */}
      <section id="features" className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
              Care Architecture
            </span>
            <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
              Clinical intelligence built for everyday patients
            </h2>
            <p className="text-xs sm:text-sm text-medical-muted font-sans">
              Everything required to organize your health records without feeling overwhelmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">{t("feat1Title")}</h3>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">{t("feat1Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">{t("feat2Title")}</h3>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">{t("feat2Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">{t("feat3Title")}</h3>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">{t("feat3Desc")}</p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">{t("feat4Title")}</h3>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">{t("feat4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust, Privacy & Safety Pledges */}
      <section className="py-16 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-3 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
                Patient Protection
              </span>
              <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
                Designed with strict non-diagnostic boundaries
              </h2>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">
                Healthiecure strictly organizes medical documents and explains laboratory reference ranges. It never replaces your doctor, pretends to make diagnoses, or modifies prescriptions.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onGoToEvaluation}
                  className="font-sans text-xs font-bold text-medical-red hover:underline inline-flex items-center gap-1"
                >
                  <span>Review extraction accuracy benchmark report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black mb-1">
                  <Lock className="w-4 h-4 text-medical-red" />
                  <span>{t("trust1Title")}</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">{t("trust1Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black mb-1">
                  <CheckCircle2 className="w-4 h-4 text-medical-red" />
                  <span>{t("trust2Title")}</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">{t("trust2Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black mb-1">
                  <Shield className="w-4 h-4 text-medical-red" />
                  <span>{t("trust3Title")}</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">{t("trust3Desc")}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black mb-1">
                  <HelpCircle className="w-4 h-4 text-medical-red" />
                  <span>{t("trust4Title")}</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">{t("trust4Desc")}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-neutral-900 text-white pt-12 pb-8 border-t border-neutral-800 text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
                <span className="w-2.5 h-2.5 rounded-full bg-medical-red"></span>
                <span>healthie<span className="text-medical-red italic font-normal">cure</span></span>
              </div>
              <div className="text-xs text-neutral-400 mt-1 font-sans">
                Personal Health Platform • Built for Altrix Labs Healthcare Hackathon
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-neutral-400 font-sans">
              <button onClick={onGetStarted} className="hover:text-white transition-colors">
                Home
              </button>
              <button onClick={onGoToEvaluation} className="hover:text-white transition-colors">
                Accuracy Benchmark
              </button>
              <button onClick={onOpenDemo} className="hover:text-white transition-colors">
                1-Click Demo
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-300 leading-relaxed font-sans">
            <span className="font-bold text-white mr-1">Medical Disclaimer:</span>
            {t("medicalDisclaimer")}
          </div>

          <div className="text-center text-[11px] text-neutral-500 font-sans">
            &copy; 2026 Healthiecure. {t("footerRights")}
          </div>
        </div>
      </footer>
    </div>
  );
};
