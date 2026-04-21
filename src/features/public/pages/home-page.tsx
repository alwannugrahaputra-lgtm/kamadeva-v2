// Penjelasan file: halaman publik untuk website Kamadeva.
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sparkles, Users } from "lucide-react";
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

  return (
    <div className="pb-16">
      <section className="container-shell grid gap-10 py-14 lg:grid-cols-[1fr_1.02fr] lg:items-center lg:py-20">
        <div>
          <Badge tone="brand">
            {site?.tagline ?? "Perfectly Planned, Beautifully Executed"}
          </Badge>
          <h1 className="section-title mt-6 max-w-4xl text-6xl font-semibold leading-none text-[var(--brand-deep)] md:text-7xl">
            {site?.heroTitle ?? "Perencanaan wedding yang rapi, hangat, dan berkelas"}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--muted)]">
            {site?.heroSubtitle ??
              "Dari konsultasi awal hingga hari acara, setiap detail dikelola dalam satu alur yang tenang dan terukur."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/tentang-kami">
              <Button>
                Tentang Kamadeva
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/kontak">
              <Button variant="secondary">Hubungi Kami</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.08fr_0.92fr]">
          <div className="overflow-hidden rounded-[36px] border border-[var(--line)] bg-white shadow-[0_24px_60px_rgba(93,51,38,0.12)]">
            <Image
              src="/portfolio/hadiyan-annisa.jpg"
              alt="Wedding organizer Kamadeva"
              width={1200}
              height={1500}
              className="h-full min-h-[520px] w-full object-cover"
            />
          </div>
          <div className="grid gap-5">
            <div className="glass-card rounded-[32px] p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
                Wedding Planner & Organizer
              </p>
              <h2 className="section-title mt-4 text-4xl font-semibold text-[var(--brand-deep)]">
                Momen yang terasa hangat, terarah, dan berkesan.
              </h2>
              <p className="mt-4 text-sm leading-8 text-[var(--muted)]">
                {site?.about ?? "Wedding Planner & Organizer"}
              </p>
            </div>
            <div className="overflow-hidden rounded-[32px] border border-[var(--line)] bg-white">
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
      </section>

      <section className="container-shell py-10">
        <div className="mb-8 max-w-3xl">
          <Badge>Layanan Kamadeva</Badge>
          <h2 className="section-title mt-4 text-5xl font-semibold text-[var(--brand-deep)]">
            Fokus pada pengalaman yang nyaman untuk pasangan dan keluarga
          </h2>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)]">
            Beranda ini kami buat sebagai pengantar singkat tentang identitas dan
            pendekatan Kamadeva. Detail paket, portfolio, dan informasi lainnya bisa
            dilihat di halaman masing-masing.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="glass-card rounded-[28px] p-6">
              <div className="mb-5 inline-flex rounded-2xl bg-[var(--soft)] p-3 text-[var(--brand)]">
                <item.icon size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--brand-deep)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="konsultasi" className="container-shell py-12">
        <div className="mb-8 max-w-3xl">
          <Badge tone="brand">Konsultasi</Badge>
          <h2 className="section-title mt-4 text-5xl font-semibold text-[var(--brand-deep)]">
            Ceritakan rencana acara Anda kepada tim Kamadeva
          </h2>
          <p className="mt-4 text-sm leading-8 text-[var(--muted)]">
            Setelah mengisi form singkat ini, tim kami akan menghubungi Anda untuk
            konsultasi lanjutan dan membantu mengarahkan kebutuhan acara.
          </p>
        </div>
        <LeadForm />
      </section>
    </div>
  );
}
