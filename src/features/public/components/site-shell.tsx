"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(248,241,234,0.94)] backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between gap-6 py-4 lg:py-5">
          <Link href="/" className="flex min-w-0 items-center gap-3 lg:gap-4">
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--brand-deep)] shadow-[0_16px_36px_rgba(79,43,34,0.14)]">
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
              <p className="hidden text-sm text-[var(--muted)] sm:block">
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
                      ? "border-[rgba(143,90,60,0.22)] bg-[var(--brand-deep)] text-white shadow-[0_18px_40px_rgba(79,43,34,0.18)]"
                      : "border-[var(--line)] bg-white/88 text-[var(--brand-deep)] shadow-[0_10px_24px_rgba(93,51,38,0.05)] hover:-translate-y-0.5 hover:border-[rgba(143,90,60,0.22)] hover:bg-[var(--soft)] hover:shadow-[0_16px_32px_rgba(93,51,38,0.1)]"
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
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-[#1f9d55] px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(31,157,85,0.3)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-105 lg:bottom-7 lg:right-7"
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
    <footer className="mt-16 border-t border-[var(--line)] py-10">
      <div className="container-shell grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--brand-deep)]">
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
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Kontak
          </p>
          <p className="mt-3 text-sm text-[var(--foreground)]">{address}</p>
          <p className="mt-2 text-sm text-[var(--foreground)]">{email}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Media sosial
          </p>
          <div className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
            {instagramHandle ? (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-[var(--brand-deep)]"
              >
                Instagram: @{instagramHandle}
              </a>
            ) : null}
            {tiktokHandle ? (
              <a
                href={`https://tiktok.com/@${tiktokHandle}`}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-[var(--brand-deep)]"
              >
                TikTok: @{tiktokHandle}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
