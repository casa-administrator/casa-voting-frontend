import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedAdminRoute } from "./auth/ProtectedAdminRoute";
import { RequirePermission } from "./auth/RequirePermission";
import { RequireSuperAdmin } from "./auth/RequireSuperAdmin";

import { AdminLayout } from "./components/layout/AdminLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

import { CreateElectionPage } from "./pages/admin/CreateElectionPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ElectionsPage } from "./pages/admin/ElectionsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { UnauthorizedPage } from "./pages/auth/UnauthorizedPage";
import { HomePage } from "./pages/public/HomePage";
import { ElectionDetailsPage } from "./pages/admin/ElectionDetailsPage";
import { VotingPage } from "./pages/public/VotingPage";
import { ResultsPage } from "./pages/public/ResultsPage";
import { AdminElectionResultsPage } from "./pages/admin/AdminElectionResultsPage";
import { AdminResultsPage } from "./pages/admin/AdminResultsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AuditLogsPage } from "./pages/admin/AuditLogsPage";
import { SuperAdminCorrectionsPage } from "./pages/admin/SuperAdminCorrectionsPage";

export default function App() {
  return (
    <Routes>
      {/* ==============================
          PUBLIC
          ============================== */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/elections/:electionId/vote" element={<VotingPage />} />
        <Route
          path="/elections/:electionId/results"
          element={<ResultsPage />}
        />
      </Route>

      {/* ==============================
          AUTH
          ============================== */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ==============================
          PROTECTED ADMIN
          ============================== */}

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}

          <Route index element={<DashboardPage />} />

          {/* Elections */}

          <Route
            path="elections"
            element={
              <RequirePermission permission="elections.view">
                <ElectionsPage />
              </RequirePermission>
            }
          />

          <Route
            path="elections/new"
            element={
              <RequirePermission permission="elections.create">
                <CreateElectionPage />
              </RequirePermission>
            }
          />

          <Route
            path="elections/:electionId"
            element={
              <RequirePermission permission="elections.view">
                <ElectionDetailsPage />
              </RequirePermission>
            }
          />

          {/* Results - temporary */}

          <Route
            path="results"
            element={
              <RequirePermission permission="results.view">
                <AdminResultsPage />
              </RequirePermission>
            }
          />

          <Route
            path="results/:electionId"
            element={
              <RequirePermission permission="results.view">
                <AdminElectionResultsPage />
              </RequirePermission>
            }
          />

          {/* Users - temporary */}

          <Route
            path="users"
            element={
              <RequirePermission permission="users.view">
                <UsersPage />
              </RequirePermission>
            }
          />
          <Route
            path="users"
            element={
              <RequirePermission permission="users.view">
                <UsersPage />
              </RequirePermission>
            }
          />

          {/* Audit Logs - temporary */}

          <Route
            path="audit-logs"
            element={
              <RequirePermission permission="audit_logs.view">
                <AuditLogsPage />
              </RequirePermission>
            }
          />

          {/* Super Admin */}

          <Route element={<RequireSuperAdmin />}>
            <Route path="corrections" element={<SuperAdminCorrectionsPage />} />
          </Route>
        </Route>
      </Route>

      {/* ==============================
          FALLBACK
          ============================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
