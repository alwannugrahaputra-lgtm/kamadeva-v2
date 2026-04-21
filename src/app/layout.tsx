// Penjelasan file: layout global aplikasi.
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "../styles/globals.css";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kamadeva WO Management System",
  description:
    "Aplikasi wedding organizer terintegrasi untuk CRM, vendor, jadwal, keuangan, dokumen, dan website publik.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
