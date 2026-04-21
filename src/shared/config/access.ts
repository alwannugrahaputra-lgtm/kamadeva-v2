// Penjelasan file: konfigurasi role dan hak akses halaman maupun aksi.
export type AppRole = "OWNER" | "ADMIN" | "STAFF";

export const APP_ROLES: AppRole[] = ["OWNER", "ADMIN", "STAFF"];

// Akses route menentukan apakah sebuah role boleh membuka halaman tertentu.
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

// Akses aksi sengaja dibuat lebih ketat daripada akses halaman:
// sebuah role bisa saja boleh membuka halaman, tetapi tetap hanya mode lihat.
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
