// Penjelasan file: halaman publik untuk website Kamadeva.
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/shared/lib/format";

export default async function PortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: { eventDate: "desc" },
  });

  return (
    <section className="container-shell py-14">
      <Badge tone="brand">Portfolio</Badge>
      <h1 className="section-title mt-4 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
        Koleksi karya dan momen pilihan Kamadeva
      </h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-white"
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
              <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                {formatDate(item.eventDate)} / {item.location}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
