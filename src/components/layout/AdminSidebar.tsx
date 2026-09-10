import {
  BarChart3,
  FileClock,
  LayoutDashboard,
  RefreshCw,
  Users,
  Vote,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useAuth } from "../../auth/useAuth";
import { AppLogo } from "../ui/AppLogo";

interface AdminSidebarProps {
  open: boolean;

  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { t } = useTranslation();

  const { user, hasPermission } = useAuth();

  const items = [
    {
      to: "/admin",

      label: t("common.dashboard"),

      icon: LayoutDashboard,

      end: true,

      visible: hasPermission("dashboard.view"),
    },

    {
      to: "/admin/elections",

      label: t("common.elections"),

      icon: Vote,

      visible: hasPermission("elections.view"),
    },

    {
      to: "/admin/results",

      label: t("common.results"),

      icon: BarChart3,

      visible: hasPermission("results.view"),
    },

    {
      to: "/admin/users",

      label: t("common.users"),

      icon: Users,

      visible: hasPermission("users.view"),
    },

    {
      to: "/admin/audit-logs",

      label: t("common.auditLogs"),

      icon: FileClock,

      visible: hasPermission("audit_logs.view"),
    },

    {
      to: "/admin/corrections",

      label: t("common.corrections"),

      icon: RefreshCw,

      visible: user?.role === "super_admin",
    },
  ];

  return (
    <>
      {open && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside className={open ? "admin-sidebar open" : "admin-sidebar"}>
        <div className="admin-sidebar-brand">
          <div className="casa-logo sidebar-logo">
            <AppLogo showText={false} />
          </div>

          <div className="brand-text sidebar-brand-text">
            <strong>{t("common.appName")}</strong>

            <span>{t("common.casa")}</span>
          </div>
        </div>

        <nav className="sidebar-navigation">
          {items
            .filter((item) => item.visible)
            .map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <Icon size={18} />

                <span>{label}</span>
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-footer">
          <strong>{user?.full_name ?? "CASA"}</strong>

          <span>{formatRole(user?.role, t)}</span>
        </div>
      </aside>
    </>
  );
}

function formatRole(role: string | undefined, t: (key: string) => string) {
  switch (role) {
    case "super_admin":
      return t("common.superAdmin");

    case "admin":
      return t("common.admin");

    default:
      return t("common.user");
  }
}
