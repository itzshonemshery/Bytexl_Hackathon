import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AuthModal } from "./components/AuthModal";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { UploadPage } from "./pages/UploadPage";
import { ReviewPage } from "./pages/ReviewPage";
import { TimelinePage } from "./pages/TimelinePage";
import { LabReportsPage } from "./pages/LabReportsPage";
import { MedicationsPage } from "./pages/MedicationsPage";
import { SummaryPage } from "./pages/SummaryPage";
import { ABHAPage } from "./pages/ABHAPage";
import { FHIRPreviewPage } from "./pages/FHIRPreviewPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ProfilePage } from "./pages/ProfilePage";

const AppContent: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [activeDocId, setActiveDocId] = useState<string>("doc_curr_lab_2026");
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Automatically switch to dashboard once authenticated if currently on landing
  React.useEffect(() => {
    if (isAuthenticated && currentTab === "landing") {
      setCurrentTab("dashboard");
    } else if (!isAuthenticated && !["landing", "evaluation", "fhir", "privacy"].includes(currentTab)) {
      setCurrentTab("landing");
    }
  }, [isAuthenticated]);

  const handleOpenAuth = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleNavigate = (tab: string, meta?: any) => {
    if (meta?.docId) {
      setActiveDocId(meta.docId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickDemo = async () => {
    try {
      await demoLogin();
      setCurrentTab("dashboard");
    } catch (err) {
      console.error("Demo login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-medical-surface text-medical-charcoal flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        openAuthModal={handleOpenAuth}
      />

      {/* Main Layout Area with Slide Transition Animation */}
      {!isAuthenticated || currentTab === "landing" ? (
        <main className="flex-1">
          <div key={currentTab} className="page-enter">
            {currentTab === "landing" && (
              <LandingPage
                onGetStarted={() => handleOpenAuth("signup")}
                onExploreFeatures={() => {
                  const featEl = document.getElementById("features");
                  featEl?.scrollIntoView({ behavior: "smooth" });
                }}
                onOpenDemo={handleQuickDemo}
                onGoToEvaluation={() => handleNavigate("evaluation")}
              />
            )}
            {currentTab === "evaluation" && (
              <div className="p-4 sm:p-8">
                <EvaluationPage />
              </div>
            )}
            {currentTab === "fhir" && (
              <div className="p-4 sm:p-8">
                <FHIRPreviewPage />
              </div>
            )}
            {currentTab === "privacy" && (
              <div className="p-4 sm:p-8">
                <PrivacyPage />
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Restrained Clinical Sidebar for desktop */}
          <div className="hidden lg:block">
            <Sidebar currentTab={currentTab} setCurrentTab={handleNavigate} />
          </div>

          {/* Dynamic Content Pane with Smooth View/Slide Transition Animation */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <div key={currentTab} className="page-enter">
              {currentTab === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
              {currentTab === "upload" && (
                <UploadPage
                  onUploadSuccess={(docId) => {
                    setActiveDocId(docId);
                    setCurrentTab("review");
                  }}
                />
              )}
              {currentTab === "review" && (
                <ReviewPage
                  docId={activeDocId}
                  onConfirmSuccess={() => setCurrentTab("timeline")}
                  onBack={() => setCurrentTab("timeline")}
                />
              )}
              {currentTab === "timeline" && (
                <TimelinePage
                  onViewDoc={(docId) => {
                    setActiveDocId(docId);
                    setCurrentTab("review");
                  }}
                  onViewSummary={(docId) => {
                    setActiveDocId(docId);
                    setCurrentTab("summary");
                  }}
                />
              )}
              {currentTab === "labs" && <LabReportsPage />}
              {currentTab === "medications" && <MedicationsPage />}
              {currentTab === "summary" && <SummaryPage docId={activeDocId} />}
              {currentTab === "abha" && <ABHAPage />}
              {currentTab === "fhir" && <FHIRPreviewPage />}
              {currentTab === "evaluation" && <EvaluationPage />}
              {currentTab === "privacy" && <PrivacyPage />}
              {currentTab === "profile" && <ProfilePage />}
            </div>
          </main>
        </div>
      )}

      {/* Authentication & Demo Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setCurrentTab("dashboard")}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
