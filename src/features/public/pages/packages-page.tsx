// Penjelasan file: halaman publik untuk website Kamadeva.
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/features/public/components/lead-form";
import { PackageSimulator } from "@/features/public/components/package-simulator";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";

export default async function PaketPage() {
  const packages = await prisma.weddingPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  return (
    <section className="container-shell public-page-shell">
      <Badge tone="brand">Paket Wedding</Badge>
      <h1 className="section-title mt-5 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
        Pilihan paket untuk berbagai gaya dan skala acara
      </h1>
      <p className="section-copy mt-5 max-w-3xl text-lg">
        Setiap paket dirancang agar memudahkan Anda memilih layanan yang paling
        sesuai dengan konsep acara, jumlah tamu, dan suasana yang diinginkan.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <article key={pkg.id} className="paper-panel ornament-ring rounded-[32px] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
              {pkg.recommendedVenue ?? "Fleksibel"}
            </p>
            <h2 className="mt-4 section-title text-4xl font-semibold text-[var(--brand-deep)]">
              {pkg.name}
            </h2>
            <p className="mt-3 text-2xl font-semibold text-[var(--brand)]">
              {formatCurrency(pkg.price)}
            </p>
            <p className="section-copy mt-4 text-sm">
              {pkg.description}
            </p>
            <div className="mt-5 rounded-[24px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[var(--muted)]">
              <p className="font-semibold text-[var(--foreground)]">Fasilitas</p>
              <p className="mt-2">{pkg.facilities}</p>
              <p className="mt-4 font-semibold text-[var(--foreground)]">
                Vendor termasuk
              </p>
              <p className="mt-2">{pkg.includedVendors}</p>
              <p className="mt-4 font-semibold text-[var(--foreground)]">Add-on</p>
              <p className="mt-2">{pkg.addOns}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Badge>Simulasi Paket</Badge>
          <h2 className="section-title mt-4 text-5xl font-semibold text-[var(--brand-deep)]">
            Temukan pilihan yang paling mendekati kebutuhan acara Anda
          </h2>
          <p className="section-copy mt-4 max-w-2xl text-sm">
            Gunakan simulasi sederhana ini untuk melihat rekomendasi paket awal.
            Hasilnya bisa menjadi bahan diskusi saat konsultasi dengan tim
            Kamadeva.
          </p>
          <div className="mt-6">
            <PackageSimulator
              packages={packages.map((pkg) => ({
                id: pkg.id,
                name: pkg.name,
                price: pkg.price,
                description: pkg.description,
                facilities: pkg.facilities,
                minGuests: pkg.minGuests,
                maxGuests: pkg.maxGuests,
                recommendedVenue: pkg.recommendedVenue,
              }))}
            />
          </div>
        </div>
        <LeadForm compact />
      </div>
    </section>
  );
}
