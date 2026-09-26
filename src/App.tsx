import { Route, Routes } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import DashboardLayout from "./components/shared/DashboardLayout";
import OverviewPage from "./components/user/OverviewPage";
import UserTicketsPage from "./components/user/UserTicketsPage";
import TicketForm from "./components/user/TicketForm";
import MyAssetsPage from "./components/user/MyAssetsPage";
import UserAppointmentsPage from "./components/user/UserAppointmentsPage";
import AdminTicketsQueue from "./components/admin/AdminTicketsQueue";
import AdminAssetsInventory from "./components/admin/AssetsComponents/AdminAssetsInventory";
import AdminAppointmentsPage from "./components/admin/AppointmentComponents/AdminAppointmentsPage";
import AdminMetricsPage from "./components/admin/AdminMetricsPage";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import ChatLayout from "./components/shared/chat/ChatLayout";
import TicketDetailsPage from "./components/shared/TicketDetailsPage";
import NotFoundPage from "./components/shared/NotFoundPage";
import ProfilePage from "./components/shared/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/forgot-password" element={<AuthPage />} />

      {/* Protected area — only reachable when logged in. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Shared profile — any logged-in user/admin. */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* User area */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/tickets" element={<UserTicketsPage />} />
            <Route path="/dashboard/tickets/new" element={<TicketForm />} />
            <Route
              path="/dashboard/tickets/:id"
              element={<TicketDetailsPage />}
            />
            <Route path="/dashboard/assets" element={<MyAssetsPage />} />
            <Route
              path="/dashboard/appointments"
              element={<UserAppointmentsPage />}
            />
            <Route path="/dashboard/messages" element={<ChatLayout />} />
          </Route>

          {/* Admin area */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminTicketsQueue />} />
            <Route path="/admin/tickets/:id" element={<TicketDetailsPage />} />
            <Route path="/admin/assets" element={<AdminAssetsInventory />} />
            <Route
              path="/admin/appointments"
              element={<AdminAppointmentsPage />}
            />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/messages" element={<ChatLayout />} />
            <Route path="/admin/metrics" element={<AdminMetricsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
