export type AppRole = "OWNER" | "ADMIN" | "STAFF";

export const APP_ROLES: AppRole[] = ["OWNER", "ADMIN", "STAFF"];

// Route access decides whether a role may open a page at all.
export const ADMIN_ROUTE_ACCESS = {
  dashboard: ["OWNER", "ADMIN", "STAFF"],
  clients: ["OWNER", "ADMIN", "STAFF"],
  leads: ["OWNER", "ADMIN", "STAFF"],
  vendors: ["OWNER", "ADMIN", "STAFF"],
  packages: ["OWNER", "ADMIN", "STAFF"],
  schedule: ["OWNER", "ADMIN", "STAFF"],
  documents: ["OWNER", "ADMIN", "STAFF"],
  whatsapp: ["OWNER", "ADMIN", "STAFF"],
  finance: ["OWNER", "ADMIN"],
  content: ["OWNER", "ADMIN"],
  reports: ["OWNER", "ADMIN"],
} satisfies Record<string, AppRole[]>;

// Action access is intentionally stricter than route access:
// a role may be allowed to open a page but still be view-only inside it.
export const ADMIN_ACTION_ACCESS = {
  clientsManage: ["OWNER", "ADMIN"],
  leadsManage: ["OWNER", "ADMIN"],
  vendorsManage: ["OWNER"],
  packagesManage: ["OWNER"],
  scheduleManage: ["OWNER", "ADMIN"],
} satisfies Record<string, AppRole[]>;

export function hasRoleAccess(allowedRoles: readonly AppRole[], role: AppRole) {
  return allowedRoles.includes(role);
}
