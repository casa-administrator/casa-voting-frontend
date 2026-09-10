import { Check, ShieldCheck, X } from "lucide-react";

import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { updateUserPermissions } from "../../api/users";

import { Button } from "../../components/ui/Button";

import type { Permission, User } from "../../types/users";

import { allPermissions, permissionGroups } from "./permissions";

export function PermissionManager({
  user,
  onClose,
  onSaved,
}: {
  user: User;

  onClose: () => void;

  onSaved: (user: User) => Promise<void>;
}) {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Permission[]>(user.permissions);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const allSelected = selected.length === allPermissions.length;

  function togglePermission(permission: Permission) {
    setSelected((current) => {
      if (current.includes(permission)) {
        return current.filter((item) => item !== permission);
      }

      return [...current, permission];
    });
  }

  function toggleGroup(permissions: Permission[]) {
    const groupSelected = permissions.every((permission) =>
      selectedSet.has(permission),
    );

    setSelected((current) => {
      if (groupSelected) {
        return current.filter(
          (permission) => !permissions.includes(permission),
        );
      }

      return Array.from(new Set([...current, ...permissions]));
    });
  }

  function selectAll() {
    setSelected(allPermissions);
  }

  function clearAll() {
    setSelected([]);
  }

  async function handleSave() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      const response = await updateUserPermissions(user.id, {
        permissions: selected,
      });

      await onSaved(response.user);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("permissions.saveError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user.role === "super_admin") {
    return (
      <div className="modal-backdrop">
        <section className="permission-dialog">
          <div className="permission-dialog-header">
            <div className="permission-dialog-title">
              <div className="permission-dialog-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2>{t("permissions.title")}</h2>

                <p>{user.full_name}</p>
              </div>
            </div>

            <button type="button" className="icon-action" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="permission-super-admin">
            <ShieldCheck size={28} />

            <h3>{t("permissions.superAdminTitle")}</h3>

            <p>{t("permissions.superAdminDescription")}</p>

            <Button variant="secondary" onClick={onClose}>
              {t("common.back")}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="permission-dialog" role="dialog" aria-modal="true">
        <div className="permission-dialog-header">
          <div className="permission-dialog-title">
            <div className="permission-dialog-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h2>{t("permissions.title")}</h2>

              <p>
                {user.full_name}
                {" · "}
                {user.email}
              </p>
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

        <div className="permission-toolbar">
          <div>
            <strong>
              {t("permissions.selectedCount", {
                selected: selected.length,

                total: allPermissions.length,
              })}
            </strong>

            <span>{t("permissions.description")}</span>
          </div>

          <div className="permission-toolbar-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={selectAll}
              disabled={allSelected}
            >
              {t("permissions.selectAll")}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={clearAll}
              disabled={selected.length === 0}
            >
              {t("permissions.clearAll")}
            </Button>
          </div>
        </div>

        <div className="permission-dialog-body">
          {permissionGroups.map((group) => {
            const values = group.permissions.map(
              (permission) => permission.value,
            );

            const groupSelected = values.every((permission) =>
              selectedSet.has(permission),
            );

            const selectedCount = values.filter((permission) =>
              selectedSet.has(permission),
            ).length;

            return (
              <section className="permission-group" key={group.id}>
                <div className="permission-group-header">
                  <div>
                    <h3>{t(group.titleKey)}</h3>

                    <span>
                      {t("permissions.groupCount", {
                        selected: selectedCount,

                        total: values.length,
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={
                      groupSelected
                        ? "permission-group-toggle selected"
                        : "permission-group-toggle"
                    }
                    onClick={() => toggleGroup(values)}
                  >
                    {groupSelected && <Check size={13} />}

                    {groupSelected
                      ? t("permissions.groupSelected")
                      : t("permissions.selectGroup")}
                  </button>
                </div>

                <div className="permission-grid">
                  {group.permissions.map((permission) => {
                    const checked = selectedSet.has(permission.value);

                    return (
                      <label
                        className={
                          checked
                            ? "permission-item selected"
                            : "permission-item"
                        }
                        key={permission.value}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(permission.value)}
                        />

                        <div>
                          <strong>{t(permission.labelKey)}</strong>

                          <span>{t(permission.descriptionKey)}</span>

                          <code>{permission.value}</code>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {errorMessage && (
          <div className="permission-error-wrapper">
            <div className="alert alert-error" role="alert">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="permission-dialog-footer">
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>

          <Button onClick={() => void handleSave()} disabled={isSubmitting}>
            <ShieldCheck size={16} />

            {isSubmitting ? t("permissions.saving") : t("permissions.save")}
          </Button>
        </div>
      </section>
    </div>
  );
}
