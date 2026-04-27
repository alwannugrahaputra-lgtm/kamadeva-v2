// Penjelasan file: fallback aman untuk konten publik saat database cloud lambat atau tidak tersedia.
import type { PortfolioItem, SiteSetting, WeddingPackage } from "@prisma/client";
import { VenuePreference } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/server/db/prisma";

const PUBLIC_DB_TIMEOUT_MS = 1200;
const PUBLIC_CACHE_REVALIDATE_SECONDS = 300;

const defaultSiteSetting: SiteSetting = {
  id: "fallback-site-setting",
  businessName: "Kamadeva Wedding Organizer",
  tagline: "Perfectly Planned, Beautifully Executed",
  about: "Wedding Planner & Organizer",
  whatsappNumber: "+62 857 242 48114",
  email: "kamadevaorganize@gmail.com",
  address: "Jl. Padasuka, Sukamaju Kaler, Indihiang, Tasikmalaya",
  instagram: "@kamadevaorganizer",
  tiktok: "@kamadevaorganizer",
  heroTitle: "Perencanaan wedding yang rapi, hangat, dan berkelas",
  heroSubtitle:
    "Dari konsultasi awal hingga hari acara, setiap detail dikelola dalam satu alur yang tenang dan terukur.",
  createdAt: new Date(0),
  updatedAt: new Date(0),
};

const defaultPackages: WeddingPackage[] = [
  {
    id: "fallback-package-intimate",
    name: "Kamadeva Intimate",
    slug: "kamadeva-intimate",
    price: 25000000,
    description: "Pilihan elegan untuk acara intimate dengan alur persiapan yang ringkas.",
    facilities: "Koordinasi hari H, bridal assistant, rundown acara, dan support keluarga inti.",
    includedVendors: "MC, dokumentasi dasar, liaison vendor, dan tim koordinasi lapangan.",
    addOns: "Dekorasi tambahan, live music, makeup keluarga, dan sesi foto ekstra.",
    recommendedVenue: VenuePreference.RUMAH,
    minGuests: 80,
    maxGuests: 200,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "fallback-package-signature",
    name: "Kamadeva Signature",
    slug: "kamadeva-signature",
    price: 45000000,
    description: "Paket fleksibel untuk resepsi yang membutuhkan koordinasi vendor lebih lengkap.",
    facilities: "Perencanaan teknis, koordinasi vendor, timeline detail, dan tim operasional acara.",
    includedVendors: "Koordinator acara, dokumentasi, MC, dan support komunikasi vendor.",
    addOns: "Entertainment, dekorasi premium, photobooth, dan family handling.",
    recommendedVenue: VenuePreference.FLEKSIBEL,
    minGuests: 200,
    maxGuests: 500,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    id: "fallback-package-ballroom",
    name: "Kamadeva Ballroom",
    slug: "kamadeva-ballroom",
    price: 65000000,
    description: "Dirancang untuk skala ballroom dengan ritme kerja yang lebih kompleks dan formal.",
    facilities: "Manajemen acara penuh, koordinasi vendor multi-tim, dan pendampingan menyeluruh.",
    includedVendors: "Koordinator utama, dokumentasi lengkap, MC, crew teknis, dan vendor handling.",
    addOns: "After party, entertainment premium, dekorasi custom, dan VIP guest management.",
    recommendedVenue: VenuePreference.GEDUNG,
    minGuests: 400,
    maxGuests: 1200,
    isFeatured: true,
    isActive: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: "fallback-portfolio-1",
    title: "Wedding Intimate Tasikmalaya",
    category: "Intimate Wedding",
    description: "Rangkaian acara hangat dengan detail yang tertata rapi dan suasana yang personal.",
    eventDate: new Date("2026-02-14"),
    location: "Tasikmalaya",
    imageUrl: "/portfolio/hadiyan-annisa.jpg",
    isFeatured: true,
    createdAt: new Date(0),
  },
  {
    id: "fallback-portfolio-2",
    title: "Akad & Resepsi Keluarga",
    category: "Wedding Organizer",
    description: "Koordinasi vendor dan keluarga dibuat tenang agar momen utama terasa lebih lepas.",
    eventDate: new Date("2026-03-21"),
    location: "Tasikmalaya",
    imageUrl: "/portfolio/wanda-kalam.jpg",
    isFeatured: true,
    createdAt: new Date(0),
  },
];

async function withPublicFallback<T>(
  label: string,
  query: Promise<T>,
  fallback: T,
): Promise<T> {
  const guardedQuery = query.catch((error) => {
    console.error(`[public-content] ${label} failed`, error);
    return fallback;
  });

  const timeout = new Promise<T>((resolve) => {
    setTimeout(() => {
      console.error(
        `[public-content] ${label} timed out after ${PUBLIC_DB_TIMEOUT_MS}ms. Using fallback content.`,
      );
      resolve(fallback);
    }, PUBLIC_DB_TIMEOUT_MS);
  });

  return Promise.race([guardedQuery, timeout]);
}

const getCachedPublicSiteSetting = unstable_cache(
  async () =>
    withPublicFallback(
      "site-setting",
      prisma.siteSetting.findFirst().then((site) => site ?? defaultSiteSetting),
      defaultSiteSetting,
    ),
  ["public-site-setting"],
  { revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS },
);

const getCachedPublicWeddingPackages = unstable_cache(
  async () =>
    withPublicFallback(
      "wedding-packages",
      prisma.weddingPackage.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      }),
      defaultPackages,
    ),
  ["public-wedding-packages"],
  { revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS },
);

const getCachedPublicPortfolioItems = unstable_cache(
  async () =>
    withPublicFallback(
      "portfolio-items",
      prisma.portfolioItem.findMany({
        orderBy: { eventDate: "desc" },
      }),
      defaultPortfolioItems,
    ),
  ["public-portfolio-items"],
  { revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS },
);

export async function getPublicSiteSetting() {
  return getCachedPublicSiteSetting();
}

export async function getPublicWeddingPackages() {
  return getCachedPublicWeddingPackages();
}

export async function getPublicPortfolioItems() {
  return getCachedPublicPortfolioItems();
}
