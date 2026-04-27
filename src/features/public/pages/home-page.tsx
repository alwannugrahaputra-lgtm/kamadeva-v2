// Penjelasan file: halaman publik untuk website Kamadeva.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/features/public/components/lead-form";
import { prisma } from "@/server/db/prisma";

export default async function HomePage() {
  const site = await prisma.siteSetting.findFirst();

  const values = [
    {
      title: "Pendampingan Hangat",
      description:
        "Setiap pasangan dibimbing dengan komunikasi yang jelas, tenang, dan mudah diikuti.",
      icon: HeartHandshake,
    },
    {
      title: "Perencanaan Rapi",
      description:
        "Detail acara disusun secara terarah agar proses menuju hari spesial terasa lebih ringan.",
      icon: Sparkles,
    },
    {
      title: "Koordinasi Profesional",
      description:
        "Tim Kamadeva membantu menjaga jalannya acara agar pasangan dan keluarga bisa menikmati momen.",
      icon: Users,
    },
  ];

  const highlights = [
    "Konsultasi yang mudah diikuti oleh pasangan dan keluarga.",
    "Timeline kerja rapi dari persiapan awal sampai hari acara.",
    "Koordinasi vendor dan eksekusi yang tetap terasa elegan.",
  ];

  return (
    <div className="pb-18">
      <section className="container-shell public-page-shell">
        <div className="paper-panel public-hero-shell ornament-ring">
          <div className="hero-grid lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="relative z-10">
              <Badge tone="brand">
                {site?.tagline ?? "Perfectly Planned, Beautifully Executed"}
              </Badge>
              <h1 className="section-title mt-7 max-w-4xl text-6xl font-semibold leading-[0.94] text-[var(--brand-deep)] md:text-7xl xl:text-[5.3rem]">
                {site?.heroTitle ??
                  "Perencanaan wedding yang rapi, hangat, dan berkelas"}
              </h1>
              <p className="section-copy mt-7 max-w-2xl text-lg">
                {site?.heroSubtitle ??
                  "Dari konsultasi awal hingga hari acara, setiap detail dikelola dalam satu alur yang tenang dan terukur."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/kontak">
                  <Button>
                    Jadwalkan Konsultasi
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/paket">
                  <Button variant="secondary">Lihat Paket</Button>
                </Link>
              </div>
              <div className="mt-9 grid gap-3 max-w-xl">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-full border border-[rgba(212,175,55,0.18)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--muted)] shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--moss)]" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[34px] border border-[var(--line)] bg-[#111111] shadow-[0_30px_70px_rgba(0,0,0,0.28)]">
                <Image
                  src="/portfolio/hadiyan-annisa.jpg"
                  alt="Wedding organizer Kamadeva"
                  width={1200}
                  height={1500}
                  className="h-full min-h-[520px] w-full object-cover"
                />
              </div>
              <div className="grid gap-5">
                <div className="paper-panel ornament-ring rounded-[30px] p-6">
                  <p className="eyebrow">Wedding Planner & Organizer</p>
                  <h2 className="section-title mt-5 text-4xl font-semibold leading-tight text-[var(--brand-deep)]">
                    Momen yang terasa hangat di depan tamu, tenang di belakang layar.
                  </h2>
                  <p className="section-copy mt-4 text-sm">
                    {site?.about ?? "Wedding Planner & Organizer"}
                  </p>
                </div>
                <div className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-[#111111] shadow-[0_24px_56px_rgba(0,0,0,0.22)]">
                  <Image
                    src="/portfolio/wanda-kalam.jpg"
                    alt="Momen wedding Kamadeva"
                    width={900}
                    height={1200}
                    className="h-[240px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">Pendekatan Kamadeva</p>
          <h2 className="section-title mt-5 text-5xl font-semibold text-[var(--brand-deep)]">
            Pengalaman wedding yang dirancang lebih emosional, rapi, dan mudah diikuti
          </h2>
          <p className="section-copy mt-4 text-sm">
            Kami membawa ritme kerja yang jelas, tanpa membuat pasangan atau keluarga
            merasa terseret ke proses yang ribet. Detail paket, portfolio, dan
            informasi lanjutan tetap tersedia di halaman masing-masing.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="paper-panel ornament-ring rounded-[30px] p-7">
              <div className="mb-6 inline-flex rounded-[20px] border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-3 text-[var(--brand)]">
                <item.icon size={20} />
              </div>
              <h3 className="section-title text-3xl font-semibold leading-tight text-[var(--brand-deep)]">
                {item.title}
              </h3>
              <p className="section-copy mt-4 text-sm">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="konsultasi" className="container-shell py-12">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="paper-panel ornament-ring rounded-[34px] p-7 lg:p-8">
            <p className="eyebrow">Konsultasi Awal</p>
            <h2 className="section-title mt-5 text-5xl font-semibold leading-tight text-[var(--brand-deep)]">
              Ceritakan acara yang Anda bayangkan, kami bantu arahkan dari awal.
            </h2>
            <p className="section-copy mt-5 text-sm">
              Form ini dibuat singkat agar calon klien bisa menjelaskan kebutuhan
              dasar dengan nyaman. Setelah masuk, tim Kamadeva akan menindaklanjuti
              dengan alur konsultasi yang lebih personal.
            </p>
            <div className="mt-8 rounded-[28px] border border-[rgba(212,175,55,0.16)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Cocok untuk
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
                <li>Pasangan yang masih mencari arah paket dan skala acara.</li>
                <li>Keluarga yang ingin proses koordinasi lebih tertata.</li>
                <li>Calon klien yang ingin langsung masuk ke tim internal Kamadeva.</li>
              </ul>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>
    </div>
  );
}
