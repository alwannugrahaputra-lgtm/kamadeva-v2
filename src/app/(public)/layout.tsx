// Penjelasan file: layout utama untuk seluruh halaman publik.
import { PublicFooter } from "@/features/public/components/site-shell";
import { getPublicSiteSetting } from "@/server/services/public-content";

export const revalidate = 300;

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getPublicSiteSetting();

  return (
    <>
      <main className="flex-1">{children}</main>
      <PublicFooter
        businessName={site?.businessName ?? "Kamadeva Wedding Organizer"}
        address={site?.address ?? "Alamat belum diatur"}
        email={site?.email ?? "halo@kamadeva.test"}
        whatsappNumber={site?.whatsappNumber ?? "+62 857 242 48114"}
      />
    </>
  );
}
