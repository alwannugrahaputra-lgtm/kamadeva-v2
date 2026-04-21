// Penjelasan file: layout utama untuk seluruh halaman publik.
import { PublicFooter, PublicHeader } from "@/features/public/components/site-shell";
import { prisma } from "@/server/db/prisma";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await prisma.siteSetting.findFirst();

  return (
    <>
      <PublicHeader whatsappNumber={site?.whatsappNumber ?? "6281234567890"} />
      <main className="flex-1">{children}</main>
      <PublicFooter
        businessName={site?.businessName ?? "Kamadeva Wedding Organizer"}
        address={site?.address ?? "Alamat belum diatur"}
        email={site?.email ?? "halo@kamadeva.test"}
        instagram={site?.instagram}
        tiktok={site?.tiktok}
      />
    </>
  );
}
