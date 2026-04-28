// Penjelasan file: konfigurasi navigasi publik dan admin.
import {
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  FileText,
  Images,
  LayoutDashboard,
  MessageCircleMore,
  PackageOpen,
  UserRoundSearch,
  Users,
  WalletCards,
} from "lucide-react";
import { ADMIN_ROUTE_ACCESS, type AppRole } from "@/shared/config/access";

export const adminNavigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ADMIN_ROUTE_ACCESS.dashboard,
  },
  {
    href: "/admin/crm-client",
    label: "CRM Client",
    icon: Users,
    allowedRoles: ADMIN_ROUTE_ACCESS.clients,
  },
  {
    href: "/admin/calon-klien",
    label: "Calon Klien",
    icon: UserRoundSearch,
    allowedRoles: ADMIN_ROUTE_ACCESS.leads,
  },
  {
    href: "/admin/vendor",
    label: "Vendor",
    icon: BriefcaseBusiness,
    allowedRoles: ADMIN_ROUTE_ACCESS.vendors,
  },
  {
    href: "/admin/paket-wedding",
    label: "Paket Wedding",
    icon: PackageOpen,
    allowedRoles: ADMIN_ROUTE_ACCESS.packages,
  },
  {
    href: "/admin/jadwal",
    label: "Jadwal",
    icon: CalendarClock,
    allowedRoles: ADMIN_ROUTE_ACCESS.schedule,
  },
  {
    href: "/admin/keuangan",
    label: "Keuangan",
    icon: WalletCards,
    allowedRoles: ADMIN_ROUTE_ACCESS.finance,
  },
  {
    href: "/admin/dokumen",
    label: "Dokumen",
    icon: FileText,
    allowedRoles: ADMIN_ROUTE_ACCESS.documents,
  },
  {
    href: "/admin/konten",
    label: "Konten",
    icon: Images,
    allowedRoles: ADMIN_ROUTE_ACCESS.content,
  },
  {
    href: "/admin/laporan",
    label: "Laporan",
    icon: CircleDollarSign,
    allowedRoles: ADMIN_ROUTE_ACCESS.reports,
  },
  {
    href: "/admin/whatsapp",
    label: "WhatsApp",
    icon: MessageCircleMore,
    allowedRoles: ADMIN_ROUTE_ACCESS.whatsapp,
  },
] satisfies Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  allowedRoles: AppRole[];
}>;

export const publicNavigation = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/paket", label: "Paket Wedding" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/kontak", label: "Kontak" },
];
