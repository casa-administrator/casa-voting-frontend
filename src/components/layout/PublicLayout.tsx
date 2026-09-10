import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogIn } from "lucide-react";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { AppLogo } from "../ui/AppLogo";

export function PublicLayout() {
  const { t } = useTranslation();

  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/" className="public-brand">
            <div className="casa-logo">
              <AppLogo showText={false} />
            </div>

            <div className="brand-text">
              <strong>{t("common.appName")}</strong>

              <span>{t("common.casa")}</span>
            </div>
          </Link>

          <div className="public-header-actions">
            <LanguageSwitcher />

            <Link to="/login" className="public-login-link">
              <LogIn size={16} />

              <span>{t("common.signIn")}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-inner">
          <span>© 2026 CASA</span>

          <span>{t("common.casa")}</span>
        </div>
      </footer>
    </div>
  );
}
