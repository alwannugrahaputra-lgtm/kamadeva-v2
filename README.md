# Kamadeva WO Management System

Aplikasi full-stack untuk **Kamadeva Wedding Organizer** dengan fokus pada digitalisasi proses bisnis, efisiensi operasional, dan peningkatan pelayanan klien.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Prisma ORM
- MySQL / MariaDB lokal via XAMPP
- Auth cookie session sederhana
- Recharts

## Fitur Utama

- Website publik: Beranda, Tentang Kami, Paket, Portfolio, Kontak, form konsultasi
- Dashboard admin
- CRM klien
- Calon klien dari website
- Manajemen vendor
- Paket wedding + simulasi budget
- Jadwal dan deteksi bentrok
- Keuangan dasar
- Dokumen
- CMS konten
- Laporan
- Chatbot pre-sales rule-based
- Placeholder integrasi WhatsApp

## Akun Demo

- `owner@kamadeva.test` / `kamadeva123`
- `admin@kamadeva.test` / `kamadeva123`
- `staff@kamadeva.test` / `kamadeva123`

## Cara Menjalankan

1. Pastikan `Apache` dan `MySQL` XAMPP aktif.
2. Install dependensi:

```bash
npm install
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Push schema ke MySQL:

```bash
npm run db:push
```

5. Isi data awal:

```bash
npm run db:seed
```

6. Jalankan aplikasi:

```bash
npm run dev
```

## Konfigurasi Database

File env aktif ada di [\.env](</C:/Users/Windows/Downloads/kamadeva v2/.env>).

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/kamadeva_wo_management_system"
AUTH_SECRET="kamadeva-dev-secret-2026"
```

Database yang dipakai:

- nama database: `kamadeva_wo_management_system`
- host: `127.0.0.1`
- port: `3306`
- user: `root`
- password: kosong

## Akses phpMyAdmin

- URL: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Login default XAMPP:
  - user: `root`
  - password: kosong

## Struktur Folder

```text
.
|-- prisma/
|   |-- schema.prisma
|   `-- seed.ts
|-- public/
|-- src/
|   |-- app/                  # route Next.js
|   |-- components/ui/        # komponen UI reusable
|   |-- features/
|   |   |-- admin/            # halaman & komponen admin
|   |   `-- public/           # halaman & komponen website publik
|   |-- server/
|   |   |-- auth/             # session & proteksi role
|   |   |-- db/               # prisma runtime
|   |   `-- services/         # query / service backend
|   |-- shared/
|   |   |-- config/           # akses role, navigasi, konstanta
|   |   `-- lib/              # util umum
|   |-- styles/
|   |   `-- globals.css
|   `-- proxy.ts
|-- .env.example
|-- package.json
`-- README.md
```

## Peta Cepat

- Route halaman: `src/app`
- Isi halaman publik: `src/features/public/pages`
- Isi halaman admin: `src/features/admin/pages`
- Komponen publik: `src/features/public/components`
- Komponen admin: `src/features/admin/components`
- Komponen UI umum: `src/components/ui`
- CSS global: `src/styles/globals.css`
- Aturan role dan aksi: `src/shared/config/access.ts`
- Navigasi menu: `src/shared/config/navigation.ts`
- Auth & session: `src/server/auth/session.ts`
- Koneksi database: `src/server/db/prisma.ts`
- Service backend: `src/server/services`
- Schema database: `prisma/schema.prisma`
- Seed data: `prisma/seed.ts`

## Komentar Kode

Komentar sengaja dibuat singkat dan hanya ditempatkan pada bagian yang memang rawan membingungkan:

- `src/shared/config/access.ts`
- `src/server/auth/session.ts`
- `src/features/admin/pages/leads-page.tsx`
- `src/features/admin/pages/schedule-page.tsx`

## Fitur per Role

### OWNER

- akses penuh ke semua modul
- kelola vendor
- kelola paket wedding
- kelola jadwal
- kelola klien dan calon klien
- akses laporan, keuangan, dokumen, CMS, dan WhatsApp

### ADMIN

- kelola klien
- kelola calon klien
- kelola jadwal
- lihat vendor
- lihat paket wedding
- akses laporan, keuangan, dokumen, CMS, dan WhatsApp

### STAFF

- lihat dashboard
- lihat klien
- lihat calon klien
- lihat vendor
- lihat paket wedding
- lihat jadwal
- tidak bisa tambah, edit, atau hapus data utama

## User Flow

1. Calon klien membuka website.
2. Calon klien melihat paket, portfolio, FAQ, dan informasi kontak.
3. Calon klien mengisi form konsultasi.
4. Data masuk ke modul `Calon Klien`.
5. Admin follow-up dari dashboard atau halaman calon klien.
6. Calon klien dapat diubah menjadi klien aktif.
7. Tim operasional mengelola vendor, jadwal, pembayaran, dan dokumen sesuai role.

## API Utama

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET|POST|PUT|DELETE /api/clients`
- `GET|POST|PUT|DELETE /api/vendors`
- `GET|POST|PUT|DELETE /api/packages`
- `GET|POST|PUT|DELETE /api/leads`
- `GET|POST /api/schedule`
- `POST /api/chatbot`
- `POST /api/whatsapp/sync`

## Git / Commit Log

Project ini bisa langsung dipakai dengan git lokal.

Inisialisasi repository:

```bash
git init
git add .
git commit -m "chore: initialize kamadeva wo management system"
```

Melihat riwayat commit:

```bash
git log --oneline
```

## Roadmap

### Fase 1

- login admin
- dashboard
- CRM klien
- vendor
- jadwal
- paket wedding
- website publik
- form konsultasi ke database

### Fase 2

- chatbot lebih kaya
- keuangan lebih detail
- upload dokumen nyata
- portfolio terpusat
- laporan lebih lengkap

### Fase 3

- integrasi WhatsApp API resmi
- automasi follow-up
- AI pre-sales
- analitik conversion lanjutan
