import { Navigate, Route, Routes } from "react-router-dom";
import { RoleRoute } from "./ProtectedRoute";
import AIInsightsHub from "../pages/modules/ai/AIInsightsHub";
import AIModulePage from "../pages/modules/ai/AIModulePage";
import AIAppointmentAssistant from "../pages/modules/ai/AIAppointmentAssistant";
import AIFollowUpAutomation from "../pages/modules/ai/AIFollowUpAutomation";
import AIChatbot from "../pages/modules/ai/AIChatbot";
import AIWhatsAppAutoReply from "../pages/modules/ai/AIWhatsAppAutoReply";
import AIVoiceCallReminder from "../pages/modules/ai/AIVoiceCallReminder";
import AIFAQBot from "../pages/modules/ai/AIFAQBot";

const AI_ROLE_GUARD = ["superadmin", "admin"];

function withAIRole(element) {
  return <RoleRoute allowedRoles={AI_ROLE_GUARD}>{element}</RoleRoute>;
}

export default function AIRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ai/insights" replace />} />

      <Route path="insights" element={withAIRole(<AIInsightsHub />)} />

      {/* Patient Management — dedicated UIs */}
      <Route path="appointments" element={withAIRole(<AIAppointmentAssistant />)} />
      <Route path="followups" element={withAIRole(<AIFollowUpAutomation />)} />
      <Route path="chatbot" element={withAIRole(<AIChatbot />)} />
      <Route path="whatsapp" element={withAIRole(<AIWhatsAppAutoReply />)} />
      <Route path="voice-reminders" element={withAIRole(<AIVoiceCallReminder />)} />
      <Route path="faq-bot" element={withAIRole(<AIFAQBot />)} />

      {/* Clinical Management */}
      <Route path="prescriptions" element={withAIRole(<AIModulePage moduleId="prescriptions" />)} />
      <Route path="ocr-scanner" element={withAIRole(<AIModulePage moduleId="ocr-scanner" />)} />
      <Route path="patient-records" element={withAIRole(<AIModulePage moduleId="patient-records" />)} />
      <Route path="claims" element={withAIRole(<AIModulePage moduleId="claims" />)} />

      {/* Financial Management */}
      <Route path="billing" element={withAIRole(<AIModulePage moduleId="billing" />)} />
      <Route path="revenue-forecast" element={withAIRole(<AIModulePage moduleId="revenue-forecast" />)} />
      <Route path="smart-reports" element={withAIRole(<AIModulePage moduleId="smart-reports" />)} />

      {/* Ops & Analytics */}
      <Route path="bed-prediction" element={withAIRole(<AIModulePage moduleId="bed-prediction" />)} />
      <Route path="demand-forecast" element={withAIRole(<AIModulePage moduleId="demand-forecast" />)} />
      <Route path="sentiment" element={withAIRole(<AIModulePage moduleId="sentiment" />)} />

      {/* AI Settings */}
      <Route path="configuration" element={withAIRole(<AIModulePage moduleId="configuration" />)} />
      <Route path="notification-settings" element={withAIRole(<AIModulePage moduleId="notification-settings" />)} />
      <Route path="workflow" element={withAIRole(<AIModulePage moduleId="workflow" />)} />
      <Route path="integrations" element={withAIRole(<AIModulePage moduleId="integrations" />)} />

      <Route path="*" element={<Navigate to="/ai/insights" replace />} />
    </Routes>
  );
}
