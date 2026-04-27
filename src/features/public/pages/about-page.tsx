// Penjelasan file: halaman publik untuk website Kamadeva.
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
    <section className="container-shell public-page-shell">
      <div className="paper-panel ornament-ring rounded-[36px] p-7 lg:p-9">
        <Badge tone="brand">Tentang Kami</Badge>
        <h1 className="section-title mt-5 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
          {site?.businessName ?? "Kamadeva Wedding Organizer"}
        </h1>
        <p className="section-copy mt-5 max-w-3xl text-lg">{site?.tagline}</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-[rgba(212,175,55,0.16)] bg-[rgba(255,255,255,0.03)] p-7">
            <p className="eyebrow">Tentang Kamadeva</p>
            <h2 className="section-title mt-5 text-5xl font-semibold text-[var(--brand-deep)]">
              Perencanaan yang detail, pelayanan yang hangat.
            </h2>
            <p className="section-copy mt-5 text-sm">{site?.about}</p>
          </div>
          <div className="rounded-[32px] border border-[rgba(212,175,55,0.16)] bg-[rgba(255,255,255,0.03)] p-7">
            <p className="eyebrow">Nilai inti</p>
            <div className="mt-5 space-y-4">
              {values.map((value) => (
                <div
                  key={value}
                  className="rounded-[24px] border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.06)] p-4 text-sm leading-7 text-[var(--muted)]"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
