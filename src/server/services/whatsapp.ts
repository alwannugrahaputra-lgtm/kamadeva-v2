export const whatsappArchitecture = {
  status: "placeholder",
  description:
    "Rancangan integrasi WhatsApp disiapkan untuk menerima webhook, menyimpan preview chat, dan menautkan percakapan ke lead atau client profile.",
  flow: [
    "Website atau admin mengirim CTA ke WhatsApp.",
    "Chat baru diterima webhook atau provider WhatsApp API.",
    "Service normalisasi mencari lead atau client berdasarkan nomor.",
    "Pesan ringkas disimpan ke tabel WhatsAppSync dan CommunicationLog.",
    "Dashboard menampilkan notifikasi follow-up dan histori komunikasi.",
  ],
  nextEndpoints: ["/api/whatsapp/sync", "/api/leads", "/api/clients"],
};
