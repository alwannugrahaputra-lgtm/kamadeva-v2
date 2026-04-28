// Penjelasan file: halaman publik untuk website Kamadeva.
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/features/public/components/scroll-reveal";
import { PublicHeader } from "@/features/public/components/site-shell";
import { getPublicPortfolioItems, getPublicSiteSetting } from "@/server/services/public-content";
import { formatDate } from "@/shared/lib/format";

export default async function PortfolioPage() {
  const [site, items] = await Promise.all([
    getPublicSiteSetting(),
    getPublicPortfolioItems(),
  ]);

  return (
    <section className="container-shell public-page-shell">
      <PublicHeader whatsappNumber={site?.whatsappNumber ?? "6281234567890"} />
      <ScrollReveal>
        <>
          <Badge tone="brand">Portfolio</Badge>
          <h1 className="section-title mt-5 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
            Koleksi karya dan momen pilihan Kamadeva
          </h1>
        </>
      </ScrollReveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {items.map((item, index) => (
          <ScrollReveal
            key={item.id}
            variant={index % 3 === 0 ? "left" : index % 3 === 1 ? "up" : "right"}
            delay={0.06 * index}
          >
            <article className="paper-panel ornament-ring portfolio-motion overflow-hidden rounded-[32px]">
              <div className="portfolio-motion-media">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={1200}
                  height={900}
                  className="h-72 w-full object-cover"
                />
              </div>
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
          </ScrollReveal>
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
