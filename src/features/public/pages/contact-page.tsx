// Penjelasan file: halaman publik untuk website Kamadeva.
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/features/public/components/lead-form";
import { getPublicSiteSetting } from "@/server/services/public-content";
import {
  normalizeSocialHandle,
  normalizeWhatsAppNumber,
} from "@/shared/lib/utils";

export default async function KontakPage() {
  const site = await getPublicSiteSetting();
  const whatsappLink = site?.whatsappNumber
    ? `https://wa.me/${normalizeWhatsAppNumber(site.whatsappNumber)}`
    : null;
  const instagramHandle = site?.instagram
    ? normalizeSocialHandle(site.instagram)
    : null;
  const tiktokHandle = site?.tiktok ? normalizeSocialHandle(site.tiktok) : null;

  return (
    <section className="container-shell public-page-shell">
      <Badge tone="brand">Kontak & CTA</Badge>
      <h1 className="section-title mt-5 max-w-4xl text-6xl font-semibold text-[var(--brand-deep)]">
        Hubungi tim Kamadeva
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="paper-panel ornament-ring rounded-[32px] p-6">
          <p className="eyebrow">Informasi bisnis</p>
          <div className="mt-5 space-y-5 text-sm leading-7 text-[var(--muted)]">
            <div>
              <p className="font-semibold text-[var(--foreground)]">WhatsApp</p>
              {whatsappLink ? (
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--accent)]"
                >
                  {site?.whatsappNumber}
                </Link>
              ) : null}
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">Email</p>
              <p>{site?.email}</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">Alamat</p>
              <p>{site?.address}</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">Instagram</p>
              {instagramHandle ? (
                <Link
                  href={`https://instagram.com/${instagramHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--accent)]"
                >
                  @{instagramHandle}
                </Link>
              ) : null}
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">TikTok</p>
              {tiktokHandle ? (
                <Link
                  href={`https://tiktok.com/@${tiktokHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-[var(--accent)]"
                >
                  @{tiktokHandle}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
