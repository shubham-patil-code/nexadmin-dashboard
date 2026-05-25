import { httpRequest } from "./httpClient";

const wait = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));
const useMockApi = process.env.REACT_APP_USE_MOCK_API !== "false";

const MODULE_IDS = [
  "appointments",
  "followups",
  "chatbot",
  "whatsapp",
  "voice-reminders",
  "faq-bot",
  "prescriptions",
  "ocr-scanner",
  "patient-records",
  "claims",
  "billing",
  "revenue-forecast",
  "smart-reports",
  "bed-prediction",
  "demand-forecast",
  "sentiment",
  "insights",
  "configuration",
  "notification-settings",
  "workflow",
  "integrations",
];

const baseMetrics = (seed) => [
  { key: "throughput", title: "AI Actions Today", value: String(120 + seed * 17), trend: "up", trendValue: `${8 + seed}%`, sparkData: [80, 90, 95, 100, 110, 115, 120 + seed * 17] },
  { key: "accuracy", title: "Model Accuracy", value: `${(92 + seed * 0.3).toFixed(1)}%`, trend: "up", trendValue: "1.1%", sparkData: [88, 89, 90, 91, 91.5, 92, 92 + seed * 0.3] },
  { key: "latency", title: "Avg Response", value: `${(1.8 - seed * 0.05).toFixed(1)}s`, trend: "down", trendValue: "0.2s", sparkData: [2.5, 2.2, 2.0, 1.9, 1.85, 1.82, 1.8 - seed * 0.05] },
  { key: "savings", title: "Staff Hours Saved", value: `${14 + seed}h`, trend: "up", trendValue: `${3 + seed}%`, sparkData: [8, 9, 10, 11, 12, 13, 14 + seed] },
];

const chartSeries = (label) =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    value: 40 + i * 8 + label.length * 2,
    secondary: 20 + i * 5,
  }));

const tableRows = (moduleId) =>
  Array.from({ length: 6 }, (_, i) => ({
    id: `${moduleId}-${i + 1}`,
    patient: ["Aarav Sharma", "Priya Patel", "Suresh Kumar", "Anjali Desai", "Rahul Verma", "Meera Iyer"][i],
    detail: `AI-processed record #${1000 + i}`,
    status: ["completed", "processing", "pending", "completed", "warning", "completed"][i],
    confidence: 78 + i * 3,
    linkedModule: ["/patients", "/appointments", "/billing"][i % 3],
    timestamp: `${i + 1}h ago`,
  }));

const aiStore = {
  alerts: [
    { id: "AL1", severity: "critical", title: "ICU bed surge predicted", message: "AI forecasts 94% occupancy in 6 hours. Consider elective deferrals.", moduleId: "bed-prediction", timestamp: "5m ago", read: false },
    { id: "AL2", severity: "warning", title: "Follow-up backlog", message: "12 post-discharge follow-ups are overdue across Cardiology.", moduleId: "followups", timestamp: "18m ago", read: false },
    { id: "AL3", severity: "info", title: "WhatsApp template approved", message: "New appointment reminder template is live for OPD.", moduleId: "whatsapp", timestamp: "1h ago", read: true },
    { id: "AL4", severity: "warning", title: "Claim verification queue", message: "7 insurance claims flagged for manual review.", moduleId: "claims", timestamp: "2h ago", read: false },
  ],
  activity: [
    { id: "AC1", type: "booking", message: "AI booked appointment A007 for Aarav Sharma → Dr. Mehta", moduleId: "appointments", timestamp: "2m ago" },
    { id: "AC2", type: "message", message: "WhatsApp auto-reply sent to Priya Patel (lab results)", moduleId: "whatsapp", timestamp: "8m ago" },
    { id: "AC3", type: "scan", message: "OCR extracted prescription for Suresh Kumar", moduleId: "ocr-scanner", timestamp: "15m ago" },
    { id: "AC4", type: "forecast", message: "Revenue forecast updated — May projection +4.2%", moduleId: "revenue-forecast", timestamp: "22m ago" },
    { id: "AC5", type: "insight", message: "Sentiment dip detected in OPD feedback (last 24h)", moduleId: "sentiment", timestamp: "35m ago" },
  ],
  recommendations: [
    { id: "R1", priority: "high", title: "Enable voice reminders for tomorrow's OPD", description: "156 appointments tomorrow; voice reminders can reduce no-shows by ~18%.", moduleId: "voice-reminders", actionLabel: "Configure", actionPath: "/ai/voice-reminders" },
    { id: "R2", priority: "medium", title: "Review flagged insurance claims", description: "7 claims need admin approval before billing cycle closes.", moduleId: "claims", actionLabel: "Open Claims AI", actionPath: "/ai/claims" },
    { id: "R3", priority: "low", title: "Expand FAQ knowledge base", description: "Top unresolved query: insurance coverage for procedures.", moduleId: "faq-bot", actionLabel: "Edit FAQs", actionPath: "/ai/faq-bot" },
  ],
  modules: Object.fromEntries(
    MODULE_IDS.map((id, index) => [
      id,
      {
        id,
        status: index % 7 === 0 ? "processing" : "active",
        metrics: baseMetrics(index % 5),
        chart: chartSeries(id),
        chartType: index % 2 === 0 ? "bar" : "line",
        table: tableRows(id),
        hospitalLinks: [
          { label: "Patients", path: "/patients" },
          { label: "Appointments", path: "/appointments" },
          { label: "Billing", path: "/billing" },
        ],
      },
    ]),
  ),
  realtime: {
    activeSessions: 47,
    eventsPerMinute: 12,
    modelHealth: 98.4,
    lastSync: new Date().toISOString(),
  },
};

const moduleMeta = {
  appointments: { title: "AI Appointment Assistant", section: "Patient Management", description: "Smart booking, rescheduling, and queue optimization." },
  followups: { title: "AI Patient Follow-up Automation", section: "Patient Management", description: "Automated post-discharge and recovery follow-ups." },
  chatbot: { title: "AI Chatbot for Patients", section: "Patient Management", description: "24/7 patient support and triage." },
  whatsapp: { title: "AI WhatsApp Auto Reply", section: "Patient Management", description: "Automated WhatsApp messaging and replies." },
  "voice-reminders": { title: "AI Voice Call Reminder", section: "Patient Management", description: "Outbound voice reminders for appointments." },
  "faq-bot": { title: "AI FAQ Support Bot", section: "Patient Management", description: "Self-service FAQ resolution." },
  prescriptions: { title: "Prescription AI", section: "Clinical Management", description: "AI-assisted prescription drafting and checks." },
  "ocr-scanner": { title: "OCR Scanner", section: "Clinical Management", description: "Document digitization and extraction." },
  "patient-records": { title: "Patient Records AI", section: "Clinical Management", description: "Intelligent record search and summaries." },
  claims: { title: "Claim Verification AI", section: "Clinical Management", description: "Insurance claim validation and fraud flags." },
  billing: { title: "Billing AI", section: "Financial Management", description: "Automated billing suggestions and anomaly detection." },
  "revenue-forecast": { title: "Revenue Forecast", section: "Financial Management", description: "Predictive revenue and occupancy modeling." },
  "smart-reports": { title: "Smart Reports", section: "Financial Management", description: "AI-generated operational and financial reports." },
  "bed-prediction": { title: "Bed Prediction", section: "Ops & Analytics", description: "Inpatient bed demand forecasting." },
  "demand-forecast": { title: "Demand Forecast", section: "Ops & Analytics", description: "OPD and department demand predictions." },
  sentiment: { title: "Patient Sentiment Analysis", section: "Ops & Analytics", description: "Feedback and communication sentiment tracking." },
  insights: { title: "AI Insights Hub", section: "Ops & Analytics", description: "Central analytics, alerts, and cross-module intelligence." },
  configuration: { title: "AI Configuration", section: "AI Settings", description: "Model thresholds, languages, and feature toggles." },
  "notification-settings": { title: "AI Notification Settings", section: "AI Settings", description: "Alert routing and escalation rules." },
  workflow: { title: "AI Workflows", section: "AI Settings", description: "Automation pipelines across hospital modules." },
  integrations: { title: "AI Integrations", section: "AI Settings", description: "EHR, WhatsApp, telephony, and third-party connectors." },
};

async function mockRequest(handler, delay = 280) {
  await wait(delay);
  return handler();
}

function pathToModuleId(path) {
  const segment = path.replace(/^\/ai\/?/, "").split("/")[0];
  return segment || "insights";
}

export const aiService = {
  pathToModuleId,
  getModuleMeta: (moduleId) => moduleMeta[moduleId] || moduleMeta.insights,

  async getModuleData(moduleId, { simulateEmpty = false, simulateError = false } = {}) {
    if (!useMockApi) {
      return httpRequest(`/api/ai/modules/${moduleId}`);
    }
    return mockRequest(() => {
      if (simulateError) throw new Error("Failed to load AI module data");
      const data = aiStore.modules[moduleId];
      if (!data) throw new Error(`Unknown AI module: ${moduleId}`);
      if (simulateEmpty) {
        return { ...data, metrics: data.metrics.map((m) => ({ ...m, value: "0" })), table: [], chart: [] };
      }
      return { ...data, meta: moduleMeta[moduleId] };
    });
  },

  async getInsightsDashboard() {
    if (!useMockApi) return httpRequest("/api/ai/insights");
    return mockRequest(() => ({
      realtime: aiStore.realtime,
      alerts: aiStore.alerts,
      activity: aiStore.activity,
      recommendations: aiStore.recommendations,
      moduleHealth: MODULE_IDS.map((id) => ({
        id,
        name: moduleMeta[id]?.title || id,
        status: aiStore.modules[id]?.status || "active",
        uptime: 97 + (id.length % 3),
      })),
      analytics: {
        automationRate: 78.4,
        costSavings: 124000,
        patientTouchpoints: 1842,
        escalationRate: 4.2,
        weeklyTrend: chartSeries("insights"),
      },
    }));
  },

  async getAlerts() {
    if (!useMockApi) return httpRequest("/api/ai/alerts");
    return mockRequest(() => [...aiStore.alerts]);
  },

  async getActivity(limit = 20) {
    if (!useMockApi) return httpRequest(`/api/ai/activity?limit=${limit}`);
    return mockRequest(() => aiStore.activity.slice(0, limit));
  },

  async getRecommendations(moduleId) {
    if (!useMockApi) return httpRequest(`/api/ai/recommendations${moduleId ? `?module=${moduleId}` : ""}`);
    return mockRequest(() =>
      moduleId
        ? aiStore.recommendations.filter((r) => r.moduleId === moduleId)
        : [...aiStore.recommendations],
    );
  },

  async dismissAlert(alertId) {
    if (!useMockApi) return httpRequest(`/api/ai/alerts/${alertId}`, { method: "PATCH", body: JSON.stringify({ read: true }) });
    return mockRequest(() => {
      const alert = aiStore.alerts.find((a) => a.id === alertId);
      if (alert) alert.read = true;
      return alert;
    }, 120);
  },

  async refreshRealtime() {
    if (!useMockApi) return httpRequest("/api/ai/realtime");
    return mockRequest(() => {
      aiStore.realtime = {
        activeSessions: 40 + Math.floor(Math.random() * 20),
        eventsPerMinute: 8 + Math.floor(Math.random() * 10),
        modelHealth: 96 + Math.random() * 3,
        lastSync: new Date().toISOString(),
      };
      return aiStore.realtime;
    }, 150);
  },
};

export { MODULE_IDS, moduleMeta };
