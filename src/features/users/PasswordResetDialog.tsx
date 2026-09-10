import { KeyRound, X } from "lucide-react";

import { useState } from "react";

import type { SubmitEventHandler } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { resetUserPassword } from "../../api/users";

import { Button } from "../../components/ui/Button";

import { FormField } from "../../components/ui/FormField";

import type { User } from "../../types/users";

export function PasswordResetDialog({
  user,
  onClose,
  onSuccess,
}: {
  user: User;

  onClose: () => void;

  onSuccess: () => void;
}) {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t("users.passwordMinimum"));

      return;
    }

    if (password.length > 128) {
      setErrorMessage(t("users.passwordMaximum"));

      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t("users.passwordMismatch"));

      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      await resetUserPassword(user.id, {
        new_password: password,
      });

      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : t("users.resetPasswordError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="user-password-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
      >
        <div className="user-dialog-header">
          <div className="user-dialog-title">
            <div className="user-dialog-icon">
              <KeyRound size={18} />
            </div>

            <div>
              <h2 id="reset-password-title">{t("users.resetPassword")}</h2>

              <p>{user.full_name}</p>
            </div>
          </div>

          <button
            type="button"
            className="icon-action"
            onClick={onClose}
            aria-label={t("common.cancel")}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="user-dialog-body">
            <FormField
              label={t("users.newPassword")}
              help={t("users.passwordHelp")}
            >
              <input
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>

            <FormField label={t("users.confirmPassword")}>
              <input
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </FormField>

            {errorMessage && (
              <div className="alert alert-error" role="alert">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="user-dialog-footer">
            <Button variant="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("users.resetting") : t("users.resetPassword")}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
