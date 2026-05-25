import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { ProtectedRoute, RoleRoute } from "./ProtectedRoute";
import PatientsPage from "../pages/modules/PatientsPage";
import AppointmentsPage from "../pages/modules/AppointmentsPage";
import StaffPage from "../pages/modules/StaffPage";
import BillingPage from "../pages/modules/BillingPage";
import InventoryPage from "../pages/modules/InventoryPage";
import ReportsPage from "../pages/modules/ReportsPage";
import NotificationsPage from "../pages/modules/NotificationsPage";
import AIRoutes from "./AIRoutes";

const unauthorized = () => (
  <div className="card p-8">
    <h1 className="text-base font-bold text-gray-900">Unauthorized</h1>
    <p className="text-xs text-gray-500 mt-2">You do not have access to this module.</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={unauthorized()} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route
          path="/billing"
          element={
            <RoleRoute allowedRoles={["superadmin", "admin"]}>
              <BillingPage />
            </RoleRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <RoleRoute allowedRoles={["superadmin", "admin"]}>
              <InventoryPage />
            </RoleRoute>
          }
        />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route
          path="/ai/*"
          element={
            <RoleRoute allowedRoles={["superadmin", "admin"]}>
              <AIRoutes />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
