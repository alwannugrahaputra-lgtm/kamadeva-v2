// Penjelasan file: halaman publik untuk website Kamadeva.
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCheck, ClipboardPenLine, HandHeart, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/features/public/components/site-shell";
import { getPublicSiteSetting } from "@/server/services/public-content";

export default async function HomePage() {
  const site = await getPublicSiteSetting();

  const reasons = [
    {
      title: "Perencanaan Matang",
      description: "Setiap detail direncanakan dengan teliti sesuai keinginan Anda.",
      icon: ClipboardPenLine,
    },
    {
      title: "Tim Profesional",
      description: "Berpengalaman, kreatif, dan siap memberikan yang terbaik.",
      icon: Users,
    },
    {
      title: "Konsep Personal",
      description: "Konsep pernikahan unik yang mencerminkan cerita cinta Anda.",
      icon: HandHeart,
    },
    {
      title: "Vendor Terpercaya",
      description: "Bekerja sama dengan vendor pilihan yang berkualitas.",
      icon: Store,
    },
    {
      title: "Manajemen Teratur",
      description: "Jadwal, anggaran, hingga hari-H terkelola dengan rapi.",
      icon: CalendarClock,
    },
    {
      title: "Hemat Waktu & Tenaga",
      description: "Anda fokus menikmati momen, kami yang menangani sisanya.",
      icon: CheckCheck,
    },
  ];

  return (
    <div className="landing-shell">
      <div className="container-shell">
        <PublicHeader whatsappNumber={site.whatsappNumber} />
      </div>
      <section className="landing-hero">
        <div className="container-shell">
          <div className="landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="eyebrow">Wujudkan momen terbaik Anda</p>
              <h1 className="section-title mt-6 font-semibold">
                Pernikahan Impian,
                <br />
                Berjalan <span className="accent">Sempurna</span>
              </h1>
              <p className="section-copy mt-6 max-w-lg text-lg">
                {site.businessName} siap membantu Anda merencanakan pernikahan yang
                berkesan, elegan, dan tak terlupakan.
              </p>
              <div className="landing-actions">
                <Link href="/kontak#konsultasi">
                  <Button>
                    Konsultasi Gratis
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/paket">
                  <Button variant="secondary">Lihat Paket</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="landing-section-heading">
          <p className="eyebrow">Kenapa memilih Kamadeva?</p>
          <h2 className="section-title mt-5 text-5xl font-semibold">
            Kami Mengatur, Anda Menikmati
          </h2>
        </div>
        <div className="why-grid">
          {reasons.map((item) => (
            <article key={item.title} className="why-card">
              <item.icon className="why-icon" size={34} />
              <h3 className="text-lg font-semibold text-[var(--brand-deep)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
