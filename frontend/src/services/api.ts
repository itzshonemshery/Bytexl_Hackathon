const API_BASE = "http://localhost:8000/api/v1";

export function getAuthToken(): string | null {
  return localStorage.getItem("health_copilot_token");
}

export function setAuthToken(token: string) {
  localStorage.setItem("health_copilot_token", token);
}

export function clearAuthToken() {
  localStorage.removeItem("health_copilot_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  signup: (data: any) => request<any>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  demoLogin: () => request<any>("/auth/demo-login", { method: "POST" }),
  getMe: () => request<any>("/auth/me"),
  updateProfile: (data: any) => request<any>("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Documents
  uploadDocument: (formData: FormData) => request<any>("/documents/upload", { method: "POST", body: formData }),
  loadSample: (sampleType: string) => request<any>(`/documents/load-sample/${sampleType}`, { method: "POST" }),
  listDocuments: () => request<any[]>("/documents"),
  deleteDocument: (docId: string) => request<any>(`/documents/${docId}`, { method: "DELETE" }),

  // Extraction & Human Review
  getExtraction: (docId: string) => request<any>(`/extraction/${docId}`),
  reviewExtraction: (docId: string, data: any, notes?: string) =>
    request<any>(`/extraction/${docId}/review`, {
      method: "POST",
      body: JSON.stringify({ data, notes }),
    }),

  // AI Summary
  getDocumentSummary: (docId: string, lang = "en") => request<any>(`/summary/document/${docId}?lang=${lang}`),
  getHolisticSummary: (lang = "en") => request<any>(`/summary/holistic?lang=${lang}`),

  // Timeline & Medications
  getTimeline: (recordType?: string, search?: string) => {
    let url = "/timeline";
    const params = new URLSearchParams();
    if (recordType && recordType !== "all") params.append("record_type", recordType);
    if (search) params.append("search", search);
    const queryString = params.toString();
    return request<any[]>(queryString ? `${url}?${queryString}` : url);
  },
  getMedications: () => request<any>("/medications"),

  // ABHA Connect
  getABHAStatus: () => request<any>("/abha/status"),
  connectABHA: (data: { abha_id: string; abha_address: string; otp?: string }) =>
    request<any>("/abha/connect", { method: "POST", body: JSON.stringify(data) }),
  importCareContexts: (care_context_ids: string[]) =>
    request<any>("/abha/import", { method: "POST", body: JSON.stringify({ care_context_ids }) }),
  disconnectABHA: () => request<any>("/abha/disconnect", { method: "POST" }),

  // FHIR Interoperability
  getFHIRBundle: (docId: string) => request<any>(`/fhir/bundle/${docId}`),
  getPatientSummaryBundle: () => request<any>("/fhir/patient-summary-bundle"),

  // Audit & Evaluation
  getAuditLogs: () => request<any[]>("/audit/logs"),
  getEvaluationReport: () => request<any>("/evaluation/report"),
};
