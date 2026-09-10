import { useState } from "react";
import type { SubmitEventHandler } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LockKeyhole, Mail } from "lucide-react";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/useAuth";
import { LanguageSwitcher } from "../../components/ui/LanguageSwitcher";
import { AppLogo } from "../../components/ui/AppLogo";

export function LoginPage() {
  const { t } = useTranslation();

  const { user, isLoading, login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading) {
    return <div className="route-loading">CASA</div>;
  }

  if (user?.role === "admin" || user?.role === "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);

    setIsSubmitting(true);

    try {
      const currentUser = await login(email.trim(), password);

      if (currentUser.role !== "admin" && currentUser.role !== "super_admin") {
        navigate("/unauthorized", {
          replace: true,
        });

        return;
      }

      const state = location.state as {
        from?: string;
      } | null;

      navigate(state?.from || "/admin", {
        replace: true,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(translateLoginError(error, t));
      } else {
        setErrorMessage(t("auth.loginError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-language">
        <LanguageSwitcher />
      </div>

      <div className="auth-container">
        <section className="auth-brand-panel">
          <div className="auth-brand-logo">
            <AppLogo showText={false} />
          </div>

          <div>
            <span className="auth-eyebrow">CASA</span>

            <h1>{t("common.appName")}</h1>

            <p>{t("common.casa")}</p>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="page-eyebrow">{t("auth.administration")}</span>

            <h2>{t("auth.title")}</h2>

            <p>{t("auth.description")}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>{t("auth.email")}</span>

              <div className="auth-input">
                <Mail size={17} />

                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                />
              </div>
            </label>

            <label className="auth-field">
              <span>{t("auth.password")}</span>

              <div className="auth-input">
                <LockKeyhole size={17} />

                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                />
              </div>
            </label>

            {errorMessage && (
              <div className="alert alert-error" role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("auth.signingIn") : t("auth.title")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function translateLoginError(error: ApiError, t: (key: string) => string) {
  const message = error.message.toLowerCase();

  if (
    message.includes("invalid") ||
    message.includes("incorrect") ||
    message.includes("credentials")
  ) {
    return t("auth.invalidCredentials");
  }

  if (message.includes("locked")) {
    return t("auth.accountLocked");
  }

  if (message.includes("inactive") || message.includes("disabled")) {
    return t("auth.accountInactive");
  }

  return error.message;
}
