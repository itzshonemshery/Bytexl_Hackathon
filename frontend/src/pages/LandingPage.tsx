import React, { useState, useEffect } from "react";
import {
  FileText,
  FlaskConical,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  Shield,
  UploadCloud,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Heart,
  Pill,
  Users,
  Compass,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { HeartbeatPulse } from "../components/HeartbeatPulse";
import { DNAStrand } from "../components/DNAStrand";

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

  // Simplified, easily relatable transformation slides
  const slides = [
    {
      id: "lab_tests",
      category: "Blood Test Reports",
      icon: FlaskConical,
      badge: "Laboratory Clarity",
      title: "Clear Answers for Blood Tests & Numbers",
      subtitle: "Understand abnormal flags grounded strictly in lab reference ranges without anxiety or complex jargon.",
      originalSnippet: "HbA1c Glycated Hemoglobin: 7.4 % [Reference 4.0 - 5.6] (HIGH)",
      simpleTranslation: [
        {
          heading: "Average Blood Sugar (HbA1c)",
          meaning: "Your 3-month average glucose is 7.4%, which is above the standard 5.6% target.",
          status: "Upward trend from 6.8% in Oct 2025",
        },
        {
          heading: "Fasting Blood Sugar",
          meaning: "Morning fasting glucose is 138 mg/dL (normal range is 70 - 99 mg/dL).",
          status: "Requires regular review with your doctor",
        },
      ],
      doctorQuestion: "Doctor, given my HbA1c moved to 7.4%, should we review my diet or modify my Metformin dose?",
    },
    {
      id: "prescriptions",
      category: "Doctor Prescriptions",
      icon: Pill,
      badge: "Prescription Schedule",
      title: "Every Medicine, Dose & Timing Decoded",
      subtitle: "Convert rushed doctor handwriting and abbreviations into a crystal-clear daily timetable.",
      originalSnippet: "Tab. Metformin 500mg BD pc x 30d • Tab. Atorvastatin 10mg OD HS",
      simpleTranslation: [
        {
          heading: "Metformin 500 mg",
          meaning: "Take 1 tablet twice daily, right after breakfast and dinner.",
          status: "Daily metabolic support",
        },
        {
          heading: "Atorvastatin 10 mg",
          meaning: "Take 1 tablet once daily at bedtime with a glass of water.",
          status: "Cholesterol balance",
        },
      ],
      doctorQuestion: "Should I take these medicines before or after meals, and are there any food items to avoid?",
    },
    {
      id: "discharge",
      category: "Hospital Discharge",
      icon: Clock,
      badge: "Recovery Checklist",
      title: "Stress-Free Post-Hospital Recovery",
      subtitle: "Extract hospital courses, primary diagnoses, and post-discharge antibiotics into an easy recovery plan.",
      originalSnippet: "Diagnosis: Acute Gastroenteritis c/o dehydration • Tab Rifaximin 400mg TDS x 5d",
      simpleTranslation: [
        {
          heading: "Diagnosis & Condition",
          meaning: "Treated for stomach infection and fluid loss. Stabilized before discharge.",
          status: "Recovery phase at home",
        },
        {
          heading: "Post-Discharge Medication",
          meaning: "Complete the 5-day antibiotic course (Rifaximin 400mg, 3 times a day).",
          status: "Do not stop course early",
        },
      ],
      doctorQuestion: "What warning signs should prompt an immediate hospital visit, and when is my follow-up check?",
    },
    {
      id: "abha",
      category: "ABHA Health ID",
      icon: Activity,
      badge: "One-Click Sync",
      title: "All Hospital Records in One Digital Timeline",
      subtitle: "Connect securely with Ayushman Bharat Digital Mission (ABDM) to organize your lifetime care history.",
      originalSnippet: "ABHA ID: 91-4521-8890-1234 • Facility: Max Healthcare & Fortis Hospital",
      simpleTranslation: [
        {
          heading: "Centralized Government Health ID",
          meaning: "Unified timeline connecting pathology labs, hospital visits, and prescriptions.",
          status: "Consent-protected sandbox",
        },
        {
          heading: "Interoperable & Portable",
          meaning: "Download international FHIR R4 standard summaries whenever you change doctors.",
          status: "Ready for medical consultations",
        },
      ],
      doctorQuestion: "Can I share my complete chronological timeline directly before our consultation?",
    },
  ];

  // Auto-advance slides gently with pause on hover
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection("next");
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setSlideDirection("prev");
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setSlideDirection("next");
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  return (
    <div className="min-h-screen bg-medical-surface text-medical-charcoal selection:bg-medical-red selection:text-white">
      
      {/* 1. Calm, Breathable Editorial Hero Section with Comfort Photo */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column: Human, Reassuring Guidance & Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs text-xs font-semibold text-neutral-800">
                <span className="w-2 h-2 rounded-full bg-medical-red animate-pulse"></span>
                <span>Your Compassionate AI Health Companion</span>
              </div>

              {/* Classic Serif Editorial Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-medical-black leading-[1.18]">
                Healthcare records,{" "}
                <span className="text-medical-red italic font-normal">
                  clearly understood.
                </span>
              </h1>

              {/* Moving Glowing Minimal Heartbeat Line */}
              <div className="w-full max-w-sm py-1" style={{ maxWidth: 360, overflow: "hidden" }}>
                <HeartbeatPulse className="heartbeat-glowing" glow={true} height={38} />
              </div>

              <p className="font-sans text-base sm:text-lg text-medical-muted leading-relaxed max-w-xl">
                Medical papers shouldn't feel like a foreign language. <strong className="text-medical-black font-semibold">HealthieCure</strong> turns confusing prescriptions, blood test results, and hospital summaries into plain, everyday words so you and your family can feel confident.
              </p>

              {/* Actions & Proof */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="px-6 py-3.5 rounded-xl font-sans font-bold text-sm text-white bg-medical-red hover:bg-medical-red-hover shadow-subtle hover:shadow-card-hover transition-all flex items-center gap-2 transform active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try 1-Click Instant Demo</span>
                </button>

                <button
                  type="button"
                  onClick={onGetStarted}
                  className="px-5 py-3.5 rounded-xl font-sans font-bold text-sm text-medical-black bg-white hover:bg-neutral-50 border border-neutral-300 shadow-2xs transition-all flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4 text-medical-red" />
                  <span>Upload a Record</span>
                </button>
              </div>

              {/* Reassuring Clinical Guardrail Badges */}
              <div className="flex flex-wrap items-center gap-5 pt-4 text-xs text-medical-muted border-t border-neutral-200/80">
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Private & Protected</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Shield className="w-4 h-4 text-medical-red flex-shrink-0" />
                  <span>Grounded in Real Doctor Records</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <Heart className="w-4 h-4 text-medical-red flex-shrink-0" />
                  <span>English & हिंदी Support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Welcoming Doctor & Patient Comfort Photograph */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Doctor-Patient Comfort Picture Frame */}
                <div
                  className="relative rounded-3xl overflow-hidden shadow-clinical border border-neutral-200/90 bg-white group"
                  style={{ maxWidth: 460, width: "100%", margin: "0 auto", borderRadius: "1.5rem", overflow: "hidden" }}
                >
                  <img
                    src="/doctor-patient-comfort.png"
                    alt="Doctor attentively consulting and listening to patient in a comforting clinic setting"
                    className="w-full h-[420px] sm:h-[460px] object-cover object-top transition-transform duration-700 group-hover:scale-102"
                    style={{ width: "100%", height: 440, objectFit: "cover", objectPosition: "top", display: "block" }}
                  />

                  {/* Gradient Overlay for Readable Floating Cards */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Reassurance Badge (Top Right) */}
                  <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md text-xs font-semibold text-neutral-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Empathetic, Clear Care</span>
                  </div>

                  {/* Floating Doctor-Patient Dialogue Pill (Bottom Overlap) */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-medical-black">
                        <Stethoscope className="w-3.5 h-3.5 text-medical-red" />
                        <span>Doctor Consultation Ready</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Zero Confusion
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-snug font-sans">
                      Never leave the clinic confused about test numbers or medicine times. HealthieCure prepares exact questions to discuss with your doctor.
                    </p>
                  </div>
                </div>

                {/* Subtle Decorative Ambient Background Glow */}
                <div className="absolute -bottom-6 -right-6 w-52 h-52 bg-medical-red/10 rounded-full blur-3xl pointer-events-none -z-10" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Animated DNA Double Helix & Precision Banner */}
      <section className="py-4 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-neutral-600 font-sans">
            <span className="px-2.5 py-0.5 rounded-full bg-medical-red-blush text-medical-red font-bold text-[10px] uppercase tracking-wider">
              Precision Intelligence
            </span>
            <span className="font-medium">Strict evidence-grounding • No made-up diagnosis • Designed for every family</span>
          </div>
          
          {/* Moving DNA double helix animation */}
          <div className="w-full sm:w-auto">
            <DNAStrand pairs={14} height={42} />
          </div>
        </div>
      </section>

      {/* 3. 3 Simple Steps: Made for Everyone */}
      <section className="py-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
              Simple & Accessible
            </span>
            <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
              How HealthieCure works for you
            </h2>
            <p className="font-sans text-xs sm:text-sm text-medical-muted">
              Three effortless steps from paper medical records to clear, understandable peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-black font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">
                Snap or Upload
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Take a quick photo of your prescription with your phone or upload a lab test PDF. Our system handles digital files and difficult handwriting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200 hover:border-neutral-300 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-black font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">
                Plain-Language Summary
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                See your results translated into plain English or Hindi. Understand normal versus high numbers without worrying about scary internet searches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-medical-red-blush/60 border border-medical-red/20 hover:border-medical-red/40 transition-all space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-medical-red text-white font-serif font-bold flex items-center justify-center text-sm shadow-2xs">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-medical-black">
                Questions for Your Doctor
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Walk into your next consultation with prepared, tailored questions so you get the answers you need regarding diet, dosages, and future tests.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Transformation Carousel: Animated Slide Changes */}
      <section className="py-20 bg-medical-surface border-b border-neutral-200/80 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="space-y-2 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-medical-red" />
                <span>Interactive Document Showcase</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
                See how HealthieCure decodes each report
              </h2>
              <p className="text-xs sm:text-sm text-medical-muted font-sans max-w-xl">
                Switch through the slides below to see real-world medical documents translated into clear, structured guidance.
              </p>
            </div>

            {/* Slide Navigation Controls */}
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
          <div className="flex flex-wrap gap-2 mb-6">
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
              {/* Left Column of Slide: Context & Original Source Evidence */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-medical-red-blush text-medical-red border border-medical-red/20 inline-block">
                  {currentSlide.badge}
                </span>

                <h3 className="font-serif text-2xl font-bold text-medical-black leading-snug">
                  {currentSlide.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">
                  {currentSlide.subtitle}
                </p>

                {/* Raw snippet pill */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-700 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 font-sans tracking-wider">
                    Original Document Printed Line:
                  </div>
                  <div className="truncate font-semibold">{currentSlide.originalSnippet}</div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenDemo}
                    className="inline-flex items-center gap-2 text-xs font-sans font-bold text-medical-red hover:underline"
                  >
                    <span>Open full demo record in app</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column of Slide: Plain-Language Translation */}
              <div className="lg:col-span-7 bg-neutral-50/90 p-5 sm:p-6 rounded-2xl border border-neutral-200 space-y-4 text-left">
                <div className="flex items-center justify-between text-xs font-sans font-bold text-medical-black pb-2 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Plain-Language HealthieCure Summary</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Human-Verified
                  </span>
                </div>

                {/* Translated points */}
                <div className="space-y-3">
                  {currentSlide.simpleTranslation.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-medical-black">{item.heading}</span>
                        <span className="text-[10px] font-semibold text-medical-red bg-medical-red-blush px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 font-sans leading-relaxed">
                        {item.meaning}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Doctor Question Box */}
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-medical-black font-sans">
                    <Stethoscope className="w-3.5 h-3.5 text-medical-red" />
                    <span>Question to Ask Your Doctor</span>
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

      {/* 5. Designed for Everyday People & Families */}
      <section className="py-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
              Care for the Entire Family
            </span>
            <h2 className="font-serif text-3xl font-bold text-medical-black tracking-tight">
              Designed so anyone can use it with ease
            </h2>
            <p className="text-xs sm:text-sm text-medical-muted font-sans">
              Whether managing your own health or caring for aging parents, HealthieCure keeps complexity out of your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Grandparents & Seniors */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                For Seniors & Grandparents
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Large, high-contrast readable fonts, clear morning/night medicine schedules, and full Hindi translation to eliminate confusion.
              </p>
            </div>

            {/* Busy Families */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                For Families & Caregivers
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Keep every doctor prescription, lab report, and vaccine record organized in one clean chronological timeline that never gets lost.
              </p>
            </div>

            {/* Clinic Consultations */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-medical-red flex items-center justify-center shadow-2xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-medical-black">
                For Doctor Appointments
              </h3>
              <p className="font-sans text-xs text-medical-muted leading-relaxed">
                Show your physician a structured overview of all ongoing medicines and previous tests in 10 seconds, leaving more time for actual care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Instant 1-Click Sample Demo Bar */}
      <section className="py-12 bg-neutral-50 border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-medical-black">
              Try HealthieCure instantly with pre-loaded medical records
            </h3>
            <p className="text-xs text-medical-muted">
              Click any sample below to explore the working prototype without creating an account or uploading your own files.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenDemo}
              className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-medical-red text-xs font-bold text-medical-black shadow-2xs transition-all flex items-center gap-2 hover:bg-medical-red-blush"
            >
              <FlaskConical className="w-4 h-4 text-medical-red" />
              <span>🩸 Sample 1: Blood Sugar HbA1c (7.4%)</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-medical-red text-xs font-bold text-medical-black shadow-2xs transition-all flex items-center gap-2 hover:bg-medical-red-blush"
            >
              <Pill className="w-4 h-4 text-medical-red" />
              <span>💊 Sample 2: Diabetic Prescription</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="px-4 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-medical-red text-xs font-bold text-medical-black shadow-2xs transition-all flex items-center gap-2 hover:bg-medical-red-blush"
            >
              <Clock className="w-4 h-4 text-medical-red" />
              <span>🏥 Sample 3: Fortis Discharge Summary</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Safety, Privacy & Hackathon Benchmark */}
      <section className="py-14 bg-white border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-medical-red font-sans">
                Medical Safety Protocol
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-medical-black tracking-tight">
                Designed to support understanding, never to replace your doctor
              </h2>
              <p className="font-sans text-xs sm:text-sm text-medical-muted leading-relaxed">
                HealthieCure strictly organizes medical documents and explains laboratory reference ranges. It never diagnoses diseases independently or recommends altering medicine dosages.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onGoToEvaluation}
                  className="font-sans text-xs font-bold text-medical-red hover:underline inline-flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4" />
                  <span>Inspect Hackathon Extraction Accuracy Benchmark</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black">
                  <Lock className="w-4 h-4 text-medical-red" />
                  <span>Per-User Data Isolation</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">
                  Bcrypt password hashing and secure tokenized sessions with zero data leakage.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-xs text-medical-black">
                  <Shield className="w-4 h-4 text-medical-red" />
                  <span>Simulated ABHA Sandbox</span>
                </div>
                <p className="font-sans text-xs text-medical-muted">
                  Fully transparent sandbox boundary for ABDM and FHIR R4 standard healthcare data.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-neutral-900 text-white pt-12 pb-8 border-t border-neutral-800 text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 font-serif font-bold text-xl tracking-tight">
                <span className="w-2.5 h-2.5 rounded-full bg-medical-red"></span>
                <span>Healthie<span className="text-medical-red italic font-normal">Cure</span></span>
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
            &copy; 2026 HealthieCure. {t("footerRights")}
          </div>
        </div>
      </footer>

    </div>
  );
};
