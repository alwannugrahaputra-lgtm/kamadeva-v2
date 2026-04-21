import { Badge } from "@/components/ui/badge";
import { prisma } from "@/server/db/prisma";

export default async function TentangKamiPage() {
  const site = await prisma.siteSetting.findFirst();

  const values = [
    "Pendampingan yang hangat sejak konsultasi awal hingga hari acara.",
    "Perencanaan yang rapi agar setiap detail terasa tenang dan terarah.",
    "Eksekusi elegan dengan koordinasi tim yang sigap dan profesional.",
  ];

  return (
    <section className="container-shell py-14">
      <Badge tone="brand">Tentang Kami</Badge>
      <h1 className="section-title mt-4 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
        {site?.businessName ?? "Kamadeva Wedding Organizer"}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-9 text-[var(--muted)]">{site?.tagline}</p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[32px] p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Tentang Kamadeva</p>
          <h2 className="section-title mt-3 text-5xl font-semibold text-[var(--brand-deep)]">Perencanaan yang detail, pelayanan yang hangat.</h2>
          <p className="mt-5 text-sm leading-8 text-[var(--muted)]">{site?.about}</p>
        </div>
        <div className="glass-card rounded-[32px] p-7">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">Nilai inti</p>
          <div className="mt-4 space-y-4">
            {values.map((value) => (
              <div key={value} className="rounded-[22px] bg-white p-4 text-sm leading-7 text-[var(--muted)]">
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
