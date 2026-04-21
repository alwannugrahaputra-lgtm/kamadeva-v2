# Struktur Project Kamadeva WO Management System

Dokumen ini menjelaskan pembagian folder utama agar pembaca baru lebih cepat memahami project.

## Lapisan Utama

### `src/app`

- Berisi route Next.js
- File di sini sengaja tipis
- Tugas utamanya meneruskan render ke halaman fitur

### `src/features`

- Tempat logika tampilan per domain
- Dibagi menjadi:
  - `admin`
  - `public`
  - `auth`

### `src/server`

- Menyimpan logika backend yang dipanggil dari server
- Dibagi menjadi:
  - `auth`
  - `db`
  - `services`

### `src/shared`

- Menyimpan helper, utilitas, dan konfigurasi bersama
- Contoh:
  - `config/access.ts`
  - `config/navigation.ts`
  - `lib/format.ts`

### `src/components/ui`

- Komponen UI reusable lintas halaman
- Dipakai untuk menjaga konsistensi tampilan

## Aturan Umum yang Dipakai

- Route tipis, logika utama dipindah ke `features`
- Query dan service backend dipusatkan di `server/services`
- Hak akses dipusatkan di `shared/config/access.ts`
- Navigasi dipusatkan di `shared/config/navigation.ts`

## Ringkasan Role

- `OWNER`: akses penuh
- `ADMIN`: operasional inti
- `STAFF`: fokus melihat data operasional

## Catatan

- Komentar file dibuat berbahasa Indonesia agar lebih mudah dipahami saat review lokal
- Riwayat perubahan bisa dilihat dari `git log --oneline`
