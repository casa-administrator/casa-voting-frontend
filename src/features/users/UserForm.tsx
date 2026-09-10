import { UserPlus } from "lucide-react";

import { useState } from "react";

import type { SubmitEventHandler } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { createUser, updateUser } from "../../api/users";

import { Button } from "../../components/ui/Button";

import { FormField } from "../../components/ui/FormField";

import type { User, UserRole } from "../../types/users";

interface UserFormProps {
  user: User | null;

  allowSuperAdmin: boolean;

  onCancel: () => void;

  onSaved: (user: User) => Promise<void>;
}

export function UserForm({
  user,
  allowSuperAdmin,
  onCancel,
  onSaved,
}: UserFormProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user?.full_name ?? "");

  const [email, setEmail] = useState(user?.email ?? "");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState<UserRole>(user?.role ?? "user");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditing = Boolean(user);

  const canShowSuperAdmin = allowSuperAdmin;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = fullName.trim();

    const normalizedEmail = email.trim();

    if (name.length < 2) {
      setErrorMessage(t("users.nameMinimum"));

      return;
    }

    if (!normalizedEmail) {
      setErrorMessage(t("users.emailRequired"));

      return;
    }

    if (!isEditing && password.length < 8) {
      setErrorMessage(t("users.passwordMinimum"));

      return;
    }

    if (password.length > 128) {
      setErrorMessage(t("users.passwordMaximum"));

      return;
    }

    /*
     * Normal Admin must never be able
     * to assign the Super Admin role.
     */
    if (role === "super_admin" && !allowSuperAdmin) {
      setErrorMessage(t("users.superAdminRestricted"));

      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      let response: User;

      if (user) {
        response = await updateUser(user.id, {
          full_name: name,

          email: normalizedEmail,

          role,
        });
      } else {
        response = await createUser({
          full_name: name,

          email: normalizedEmail,

          password,

          role,

          permissions: [],
        });
      }

      await onSaved(response);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : t(isEditing ? "users.updateError" : "users.createError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="user-form-card" onSubmit={handleSubmit}>
      <div className="user-form-heading">
        <div className="user-form-heading-icon">
          <UserPlus size={19} />
        </div>

        <div>
          <h2>{isEditing ? t("users.editUser") : t("users.createUser")}</h2>

          <p>
            {isEditing
              ? t("users.editDescription")
              : t("users.createDescription")}
          </p>
        </div>
      </div>

      <div className="form-grid">
        <FormField label={t("users.fullName")}>
          <input
            type="text"
            required
            minLength={2}
            maxLength={120}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </FormField>

        <FormField label={t("users.email")}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>

        {!isEditing && (
          <FormField label={t("users.password")} help={t("users.passwordHelp")}>
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
        )}

        <FormField label={t("users.role")}>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="user">{t("common.user")}</option>

            <option value="admin">{t("common.admin")}</option>

            {canShowSuperAdmin && (
              <option value="super_admin">{t("common.superAdmin")}</option>
            )}
          </select>
        </FormField>
      </div>

      {!isEditing && (
        <div className="user-permission-note">
          {t("users.permissionLaterNote")}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("common.cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t("users.saving")
            : isEditing
              ? t("users.saveChanges")
              : t("users.createUser")}
        </Button>
      </div>
    </form>
  );
}
