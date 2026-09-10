import {
  KeyRound,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../api/client";
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getAllUsers,
} from "../../api/users";
import { useAuth } from "../../auth/useAuth";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { PasswordResetDialog } from "../../features/users/PasswordResetDialog";
import { UserForm } from "../../features/users/UserForm";
import type { User, UserRole } from "../../types/users";
import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";
import { PermissionManager } from "../../features/users/PermissionManager";

type StatusFilter = "all" | "active" | "inactive";

type RoleFilter = "all" | UserRole;

export function UsersPage() {
  const { t, i18n } = useTranslation();

  const {
    user: currentUser,

    hasPermission,
  } = useAuth();

  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [resettingUser, setResettingUser] = useState<User | null>(null);

  const language = normalizeLanguage(i18n.language);

  const [permissionUser, setPermissionUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAllUsers();

      setUsers(response);

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("users.loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((account) => {
      if (
        currentUser?.role !== "super_admin" &&
        account.role === "super_admin"
      ) {
        return false;
      }

      if (roleFilter !== "all" && account.role !== roleFilter) {
        return false;
      }

      if (statusFilter === "active" && !account.is_active) {
        return false;
      }

      if (statusFilter === "inactive" && account.is_active) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        account.full_name.toLowerCase().includes(normalizedSearch) ||
        account.email.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  function openCreate() {
    setEditingUser(null);

    setFormOpen(true);

    setSuccessMessage(null);
  }

  function openEdit(account: User) {
    setEditingUser(account);

    setFormOpen(true);

    setSuccessMessage(null);
  }

  function closeForm() {
    setFormOpen(false);

    setEditingUser(null);
  }

  async function handleSaved(account: User) {
    const wasEditing = Boolean(editingUser);

    closeForm();

    setSuccessMessage(
      t(wasEditing ? "users.updateSuccess" : "users.createSuccess", {
        name: account.full_name,
      }),
    );

    await loadUsers();
  }

  async function handleActivate(account: User) {
    clearMessages();

    try {
      await activateUser(account.id);

      setSuccessMessage(
        t("users.activateSuccess", {
          name: account.full_name,
        }),
      );

      await loadUsers();
    } catch (error) {
      showActionError(error);
    }
  }

  async function handleDeactivate(account: User) {
    clearMessages();

    if (account.id === currentUser?.id) {
      setErrorMessage(t("users.cannotDeactivateSelf"));

      return;
    }

    const confirmed = window.confirm(
      t("users.deactivateConfirm", {
        name: account.full_name,
      }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deactivateUser(account.id);

      setSuccessMessage(
        t("users.deactivateSuccess", {
          name: account.full_name,
        }),
      );

      await loadUsers();
    } catch (error) {
      showActionError(error);
    }
  }

  async function handleDelete(account: User) {
    clearMessages();

    if (account.id === currentUser?.id) {
      setErrorMessage(t("users.cannotDeleteSelf"));

      return;
    }

    const confirmed = window.confirm(
      t("users.deleteConfirm", {
        name: account.full_name,
      }),
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(account.id);

      setSuccessMessage(
        t("users.deleteSuccess", {
          name: account.full_name,
        }),
      );

      await loadUsers();
    } catch (error) {
      showActionError(error);
    }
  }

  function clearMessages() {
    setErrorMessage(null);

    setSuccessMessage(null);
  }

  function showActionError(error: unknown) {
    setErrorMessage(
      error instanceof ApiError ? error.message : t("users.actionError"),
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow={t("users.management")}
        title={t("users.title")}
        description={t("users.description")}
        actions={
          hasPermission("users.create") ? (
            <Button onClick={openCreate}>
              <Plus size={16} />

              {t("users.createUser")}
            </Button>
          ) : undefined
        }
      />

      {successMessage && (
        <div className="alert alert-success users-page-message" role="status">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error users-page-message" role="alert">
          {errorMessage}
        </div>
      )}

      {formOpen && (
        <div className="users-form-section">
          <UserForm
            key={editingUser?.id ?? "new-user"}
            user={editingUser}
            allowSuperAdmin={currentUser?.role === "super_admin"}
            onCancel={closeForm}
            onSaved={handleSaved}
          />
        </div>
      )}

      <Card>
        <CardBody>
          <div className="users-toolbar">
            <div className="users-search">
              <Search size={16} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("users.searchPlaceholder")}
              />
            </div>

            <label className="users-filter">
              <span>{t("users.role")}</span>

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value as RoleFilter)
                }
              >
                <option value="all">{t("common.all")}</option>

                <option value="user">{t("common.user")}</option>

                <option value="admin">{t("common.admin")}</option>

                {currentUser?.role === "super_admin" && (
                  <option value="super_admin">{t("common.superAdmin")}</option>
                )}
              </select>
            </label>

            <label className="users-filter">
              <span>{t("common.status")}</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
              >
                <option value="all">{t("common.all")}</option>

                <option value="active">{t("common.active")}</option>

                <option value="inactive">{t("common.inactive")}</option>
              </select>
            </label>

            <span className="users-result-count">
              {t("users.resultCount", {
                filtered: filteredUsers.length,

                total: users.length,
              })}
            </span>
          </div>
        </CardBody>
      </Card>

      <div className="users-table-section">
        {isLoading ? (
          <div className="users-loading">{t("users.loading")}</div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            title={t("users.noUsers")}
            description={t("users.noUsersDescription")}
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>{t("users.account")}</th>

                <th>{t("users.role")}</th>

                <th>{t("common.status")}</th>

                <th>{t("users.permissions")}</th>

                <th>{t("users.lastLogin")}</th>

                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((account) => (
                <tr key={account.id}>
                  <td>
                    <div className="user-account-cell">
                      <div className="user-avatar">
                        <Users size={16} />
                      </div>

                      <div>
                        <strong>{account.full_name}</strong>

                        <span>{account.email}</span>

                        {account.id === currentUser?.id && (
                          <small>{t("users.currentAccount")}</small>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <RoleBadge role={account.role} />
                  </td>

                  <td>
                    <StatusBadge
                      tone={account.is_active ? "success" : "neutral"}
                    >
                      {account.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </StatusBadge>
                  </td>

                  <td>
                    <div className="user-permission-count">
                      <ShieldCheck size={14} />

                      <span>
                        {account.role === "super_admin"
                          ? t("users.allPermissions")
                          : t("users.permissionCount", {
                              count: account.permissions.length,
                            })}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="user-last-login">
                      {account.last_login_at
                        ? formatDateTime(account.last_login_at, language)
                        : t("users.neverLoggedIn")}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      {hasPermission("users.update") && (
                        <button
                          type="button"
                          className="icon-action"
                          title={t("common.edit")}
                          onClick={() => openEdit(account)}
                        >
                          <Pencil size={15} />
                        </button>
                      )}

                      {account.is_active
                        ? hasPermission("users.deactivate") && (
                            <button
                              type="button"
                              className="icon-action"
                              title={t("users.deactivate")}
                              disabled={account.id === currentUser?.id}
                              onClick={() => void handleDeactivate(account)}
                            >
                              <PowerOff size={15} />
                            </button>
                          )
                        : hasPermission("users.activate") && (
                            <button
                              type="button"
                              className="icon-action"
                              title={t("users.activate")}
                              onClick={() => void handleActivate(account)}
                            >
                              <Power size={15} />
                            </button>
                          )}

                      {hasPermission("permissions.manage") && (
                        <button
                          type="button"
                          className="icon-action"
                          title={t("permissions.manage")}
                          onClick={() => setPermissionUser(account)}
                        >
                          <ShieldCheck size={15} />
                        </button>
                      )}

                      {hasPermission("users.reset_password") && (
                        <button
                          type="button"
                          className="icon-action"
                          title={t("users.resetPassword")}
                          onClick={() => setResettingUser(account)}
                        >
                          <KeyRound size={15} />
                        </button>
                      )}

                      {hasPermission("users.delete") && (
                        <button
                          type="button"
                          className="icon-action icon-action-danger"
                          title={t("common.delete")}
                          disabled={account.id === currentUser?.id}
                          onClick={() => void handleDelete(account)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      {resettingUser && (
        <PasswordResetDialog
          user={resettingUser}
          onClose={() => setResettingUser(null)}
          onSuccess={() => {
            setSuccessMessage(
              t("users.resetPasswordSuccess", {
                name: resettingUser.full_name,
              }),
            );

            setResettingUser(null);
          }}
        />
      )}

      {permissionUser && (
        <PermissionManager
          user={permissionUser}
          onClose={() => setPermissionUser(null)}
          onSaved={async (updatedUser) => {
            setSuccessMessage(
              t("permissions.saveSuccess", {
                name: updatedUser.full_name,
              }),
            );

            setPermissionUser(null);

            await loadUsers();
          }}
        />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const { t } = useTranslation();

  switch (role) {
    case "super_admin":
      return <StatusBadge tone="info">{t("common.superAdmin")}</StatusBadge>;

    case "admin":
      return <StatusBadge tone="warning">{t("common.admin")}</StatusBadge>;

    default:
      return <StatusBadge tone="neutral">{t("common.user")}</StatusBadge>;
  }
}
