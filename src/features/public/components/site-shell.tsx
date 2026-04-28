"use client";

// Penjelasan file: komponen publik untuk tampilan website dan interaksi calon klien.
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { publicNavigation } from "@/shared/config/navigation";
import { normalizeWhatsAppNumber } from "@/shared/lib/utils";

export function PublicHeader({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const whatsappLink = `https://wa.me/${normalizeWhatsAppNumber(whatsappNumber)}`;

  return (
    <header className="landing-nav">
      <Link href="/" className="landing-logo">
        <Image
          src="/brand/kamadeva-mark.png"
          alt="Kamadeva Wedding Organizer"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="landing-logo-copy">
          <p>Kamadeva</p>
          <p>Wedding Organizer</p>
        </div>
      </Link>

      <div className="landing-nav-links">
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
              className="landing-nav-link"
            >
              {item.label.replace(" Wedding", "")}
            </Link>
          );
        })}
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#5c4635] shadow-[0_16px_28px_rgba(113,88,61,0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_32px_rgba(113,88,61,0.16)]"
      >
        <MessageCircle size={16} className="text-[var(--brand)]" />
        Konsultasi Gratis
      </a>
    </header>
  );
}

export function PublicFooter({
  businessName,
  address,
  email,
  whatsappNumber,
}: {
  businessName: string;
  address: string;
  email: string;
  whatsappNumber: string;
}) {
  const whatsappLink = `https://wa.me/${normalizeWhatsAppNumber(whatsappNumber)}`;

  return (
    <footer className="public-footer">
      <div className="container-shell px-2 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.85fr_0.9fr_0.95fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/kamadeva-mark.png"
                alt={businessName}
                width={54}
                height={54}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <h3 className="section-title text-3xl font-semibold">{businessName}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.24em]">Wedding Organizer</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7">
              Kami hadir untuk mewujudkan pernikahan impian Anda dengan momen yang
              indah, terarah, dan tak terlupakan.
            </p>
          </div>

          <div>
            <p className="eyebrow">Menu</p>
            <div className="mt-5 grid gap-3 text-sm">
              {publicNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label.replace(" Wedding", "")}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Layanan</p>
            <div className="mt-5 grid gap-3 text-sm">
              <p>Wedding Planner</p>
              <p>Full Planning</p>
              <p>Day Organizer</p>
              <p>Dekorasi</p>
              <p>Vendor Management</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Hubungi Kami</p>
            <div className="mt-5 grid gap-3 text-sm">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                <Phone size={15} />
                {whatsappNumber}
              </a>
              <p>{email}</p>
              <p>{address}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/12 pt-5 text-center text-sm text-[rgba(255,245,234,0.65)]">
          Copyright 2026 Kamadeva Wedding Organizer. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
