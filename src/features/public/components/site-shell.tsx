"use client";


// Penjelasan file: komponen publik untuk tampilan website dan interaksi calon klien.
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { publicNavigation } from "@/shared/config/navigation";
import {
  normalizeSocialHandle,
  normalizeWhatsAppNumber,
} from "@/shared/lib/utils";

export function PublicHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const whatsappLink = `https://wa.me/${normalizeWhatsAppNumber(whatsappNumber)}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(5,5,5,0.82)] backdrop-blur-2xl">
        <div className="container-shell flex items-center justify-between gap-6 py-4 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3 lg:gap-4">
            <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[#0b0b0b] shadow-[0_18px_38px_rgba(0,0,0,0.34)]">
              <Image
                src="/brand/kamadeva-mark.png"
                alt="Kamadeva Wedding Organizer"
                width={56}
                height={56}
                className="h-12 w-12 object-cover lg:h-14 lg:w-14"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[var(--brand-deep)]">
                Kamadeva Wedding Organizer
              </p>
              <p className="hidden text-sm tracking-[0.12em] text-[var(--muted)] sm:block">
                Wedding Planner & Organizer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 text-sm lg:flex">
            {publicNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-2.5 font-medium transition-all duration-300 ease-out ${
                    active
                      ? "border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.92)] text-[#0b0b0b] shadow-[0_18px_40px_rgba(212,175,55,0.18)]"
                      : "border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--brand-deep)] shadow-[0_12px_28px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:border-[rgba(212,175,55,0.32)] hover:bg-[rgba(212,175,55,0.08)] hover:shadow-[0_18px_34px_rgba(212,175,55,0.12)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-[#1f9d55] px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(31,157,85,0.32)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:brightness-105 lg:bottom-7 lg:right-7"
      >
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </a>
    </>
  );
}

export function PublicFooter({
  businessName,
  address,
  email,
  instagram,
  tiktok,
}: {
  businessName: string;
  address: string;
  email: string;
  instagram?: string | null;
  tiktok?: string | null;
}) {
  const instagramHandle = instagram ? normalizeSocialHandle(instagram) : null;
  const tiktokHandle = tiktok ? normalizeSocialHandle(tiktok) : null;

  return (
    <footer className="mt-18 pb-10">
      <div className="container-shell">
        <div className="paper-panel ornament-ring overflow-hidden rounded-[34px] px-6 py-8 lg:px-9 lg:py-10">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.95fr_0.95fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#0b0b0b]">
                  <Image
                    src="/brand/kamadeva-mark.png"
                    alt={businessName}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-cover"
                  />
                </div>
                <div>
                  <h3 className="section-title text-3xl font-semibold">{businessName}</h3>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">
                    Wedding Planner & Organizer
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-8 text-[var(--muted)]">
                Kamadeva dirancang untuk pasangan yang ingin proses wedding terasa
                hangat, rapi, dan tetap elegan dari konsultasi awal hingga hari acara.
              </p>
            </div>
            <div>
              <p className="eyebrow">Kontak</p>
              <div className="mt-5 space-y-3 text-sm leading-8 text-[var(--foreground)]">
                <p>{address}</p>
                <p>{email}</p>
              </div>
            </div>
            <div>
              <p className="eyebrow">Media sosial</p>
              <div className="mt-5 space-y-3 text-sm text-[var(--foreground)]">
                {instagramHandle ? (
                  <a
                    href={`https://instagram.com/${instagramHandle}`}
                    target="_blank"
                    rel="noreferrer"
                  className="flex items-center justify-between rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 transition hover:border-[rgba(212,175,55,0.28)] hover:bg-[rgba(212,175,55,0.08)]"
                  >
                    <span>Instagram</span>
                    <span className="inline-flex items-center gap-2 text-[var(--muted)]">
                      @{instagramHandle}
                      <ArrowUpRight size={15} />
                    </span>
                  </a>
                ) : null}
                {tiktokHandle ? (
                  <a
                    href={`https://tiktok.com/@${tiktokHandle}`}
                    target="_blank"
                    rel="noreferrer"
                  className="flex items-center justify-between rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 transition hover:border-[rgba(212,175,55,0.28)] hover:bg-[rgba(212,175,55,0.08)]"
                  >
                    <span>TikTok</span>
                    <span className="inline-flex items-center gap-2 text-[var(--muted)]">
                      @{tiktokHandle}
                      <ArrowUpRight size={15} />
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
