import type {
  Permission,
} from "../../types/users";


export interface PermissionDefinition {
  value: Permission;

  labelKey: string;

  descriptionKey: string;
}


export interface PermissionGroup {
  id: string;

  titleKey: string;

  permissions: PermissionDefinition[];
}


export const permissionGroups:
  PermissionGroup[] = [
  {
    id: "dashboard",

    titleKey:
      "permissionGroups.dashboard",

    permissions: [
      {
        value:
          "dashboard.view",

        labelKey:
          "permissionLabels.dashboardView",

        descriptionKey:
          "permissionDescriptions.dashboardView",
      },
    ],
  },

  {
    id: "elections",

    titleKey:
      "permissionGroups.elections",

    permissions: [
      {
        value:
          "elections.view",

        labelKey:
          "permissionLabels.electionsView",

        descriptionKey:
          "permissionDescriptions.electionsView",
      },

      {
        value:
          "elections.create",

        labelKey:
          "permissionLabels.electionsCreate",

        descriptionKey:
          "permissionDescriptions.electionsCreate",
      },

      {
        value:
          "elections.update",

        labelKey:
          "permissionLabels.electionsUpdate",

        descriptionKey:
          "permissionDescriptions.electionsUpdate",
      },

      {
        value:
          "elections.delete",

        labelKey:
          "permissionLabels.electionsDelete",

        descriptionKey:
          "permissionDescriptions.electionsDelete",
      },

      {
        value:
          "elections.schedule",

        labelKey:
          "permissionLabels.electionsSchedule",

        descriptionKey:
          "permissionDescriptions.electionsSchedule",
      },

      {
        value:
          "elections.start",

        labelKey:
          "permissionLabels.electionsStart",

        descriptionKey:
          "permissionDescriptions.electionsStart",
      },

      {
        value:
          "elections.close",

        labelKey:
          "permissionLabels.electionsClose",

        descriptionKey:
          "permissionDescriptions.electionsClose",
      },

      {
        value:
          "elections.emergency_close",

        labelKey:
          "permissionLabels.electionsEmergencyClose",

        descriptionKey:
          "permissionDescriptions.electionsEmergencyClose",
      },

      {
        value:
          "elections.archive",

        labelKey:
          "permissionLabels.electionsArchive",

        descriptionKey:
          "permissionDescriptions.electionsArchive",
      },
    ],
  },

  {
    id: "candidates",

    titleKey:
      "permissionGroups.candidates",

    permissions: [
      {
        value:
          "candidates.view",

        labelKey:
          "permissionLabels.candidatesView",

        descriptionKey:
          "permissionDescriptions.candidatesView",
      },

      {
        value:
          "candidates.create",

        labelKey:
          "permissionLabels.candidatesCreate",

        descriptionKey:
          "permissionDescriptions.candidatesCreate",
      },

      {
        value:
          "candidates.update",

        labelKey:
          "permissionLabels.candidatesUpdate",

        descriptionKey:
          "permissionDescriptions.candidatesUpdate",
      },

      {
        value:
          "candidates.delete",

        labelKey:
          "permissionLabels.candidatesDelete",

        descriptionKey:
          "permissionDescriptions.candidatesDelete",
      },
    ],
  },

  {
    id: "results",

    titleKey:
      "permissionGroups.results",

    permissions: [
      {
        value:
          "results.view",

        labelKey:
          "permissionLabels.resultsView",

        descriptionKey:
          "permissionDescriptions.resultsView",
      },

      {
        value:
          "results.export",

        labelKey:
          "permissionLabels.resultsExport",

        descriptionKey:
          "permissionDescriptions.resultsExport",
      },
    ],
  },

  {
    id: "users",

    titleKey:
      "permissionGroups.users",

    permissions: [
      {
        value:
          "users.view",

        labelKey:
          "permissionLabels.usersView",

        descriptionKey:
          "permissionDescriptions.usersView",
      },

      {
        value:
          "users.create",

        labelKey:
          "permissionLabels.usersCreate",

        descriptionKey:
          "permissionDescriptions.usersCreate",
      },

      {
        value:
          "users.update",

        labelKey:
          "permissionLabels.usersUpdate",

        descriptionKey:
          "permissionDescriptions.usersUpdate",
      },

      {
        value:
          "users.activate",

        labelKey:
          "permissionLabels.usersActivate",

        descriptionKey:
          "permissionDescriptions.usersActivate",
      },

      {
        value:
          "users.deactivate",

        labelKey:
          "permissionLabels.usersDeactivate",

        descriptionKey:
          "permissionDescriptions.usersDeactivate",
      },

      {
        value:
          "users.delete",

        labelKey:
          "permissionLabels.usersDelete",

        descriptionKey:
          "permissionDescriptions.usersDelete",
      },

      {
        value:
          "users.reset_password",

        labelKey:
          "permissionLabels.usersResetPassword",

        descriptionKey:
          "permissionDescriptions.usersResetPassword",
      },
    ],
  },

  {
    id: "system",

    titleKey:
      "permissionGroups.system",

    permissions: [
      {
        value:
          "permissions.manage",

        labelKey:
          "permissionLabels.permissionsManage",

        descriptionKey:
          "permissionDescriptions.permissionsManage",
      },

      {
        value:
          "audit_logs.view",

        labelKey:
          "permissionLabels.auditLogsView",

        descriptionKey:
          "permissionDescriptions.auditLogsView",
      },

      {
        value:
          "reports.export",

        labelKey:
          "permissionLabels.reportsExport",

        descriptionKey:
          "permissionDescriptions.reportsExport",
      },
    ],
  },
];


export const allPermissions:
  Permission[] =
  permissionGroups.flatMap(
    (
      group,
    ) =>
      group.permissions.map(
        (
          permission,
        ) =>
          permission.value,
      ),
  );