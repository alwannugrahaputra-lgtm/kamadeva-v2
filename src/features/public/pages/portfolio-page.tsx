// Penjelasan file: halaman publik untuk website Kamadeva.
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getPublicPortfolioItems } from "@/server/services/public-content";
import { formatDate } from "@/shared/lib/format";

export default async function PortfolioPage() {
  const items = await getPublicPortfolioItems();

  return (
    <section className="container-shell public-page-shell">
      <Badge tone="brand">Portfolio</Badge>
      <h1 className="section-title mt-5 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
        Koleksi karya dan momen pilihan Kamadeva
      </h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="paper-panel ornament-ring overflow-hidden rounded-[32px]"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={1200}
              height={900}
              className="h-72 w-full object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-[var(--muted)]">{item.category}</p>
              <h2 className="section-title mt-3 text-3xl font-semibold text-[var(--brand-deep)]">
                {item.title}
              </h2>
              <p className="section-copy mt-3 text-sm">
                {item.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                {formatDate(item.eventDate)} / {item.location}
              </p>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 ? (
        <div className="paper-panel mt-8 rounded-[28px] p-6 text-sm text-[var(--muted)]">
          Portfolio sedang diperbarui. Hubungi tim Kamadeva untuk melihat referensi
          acara terbaru yang sesuai dengan kebutuhan Anda.
        </div>
      ) : null}
    </section>
  );
}
