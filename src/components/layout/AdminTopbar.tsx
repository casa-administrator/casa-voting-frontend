import { LogOut, Menu } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useAuth } from "../../auth/useAuth";

import { LanguageSwitcher } from "../ui/LanguageSwitcher";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { t } = useTranslation();

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>

        <div className="admin-topbar-title">
          <strong>{t("common.administrationTitle")}</strong>
        </div>
      </div>

      <div className="admin-topbar-right">
        <LanguageSwitcher />

        <div className="topbar-user">
          <strong>{user?.full_name}</strong>

          <span>{user?.email}</span>
        </div>

        <button
          type="button"
          className="topbar-logout"
          onClick={() => void handleLogout()}
          title={t("common.logout")}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
