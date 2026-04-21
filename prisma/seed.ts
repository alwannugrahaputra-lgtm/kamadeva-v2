// Penjelasan file: seed data awal untuk kebutuhan demo dan pengembangan lokal.
import bcrypt from "bcryptjs";
import {
  ClientStatus,
  CommunicationChannel,
  DocumentStatus,
  DocumentType,
  LeadStatus,
  PaymentStatus,
  PaymentType,
  PrismaClient,
  ScheduleStatus,
  ScheduleType,
  TransactionType,
  UserRole,
  VendorCategory,
  VenuePreference,
  WhatsAppDirection,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.whatsAppSync.deleteMany();
  await prisma.document.deleteMany();
  await prisma.financeTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.communicationLog.deleteMany();
  await prisma.client.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.weddingPackage.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("kamadeva123", 10);

  const [owner, admin, staff] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alya Kamadeva",
        email: "owner@kamadeva.test",
        passwordHash,
        phone: "081234567801",
        role: UserRole.OWNER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Nadia Admin",
        email: "admin@kamadeva.test",
        passwordHash,
        phone: "081234567802",
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Raka Operasional",
        email: "staff@kamadeva.test",
        passwordHash,
        phone: "081234567803",
        role: UserRole.STAFF,
      },
    }),
  ]);

  await prisma.siteSetting.create({
    data: {
      businessName: "Kamadeva Wedding Organizer",
      tagline: "Perfectly Planned, Beautifully Executed",
      about: "Wedding Planner & Organizer",
      whatsappNumber: "+62 857 242 48114",
      email: "kamadevaorganize@gmail.com",
      address: "Jl. Padasuka, Sukamaju Kaler, Indihiang, Tasikmalaya",
      instagram: "@kamadevaorganizer",
      tiktok: "@kamadevaorganizer",
      heroTitle: "Perencanaan wedding yang rapi, hangat, dan berkelas",
      heroSubtitle:
        "Dari konsultasi awal hingga hari acara, setiap detail dikelola dalam satu alur yang tenang dan terukur.",
    },
  });

  const weddingPackages = await Promise.all([
    prisma.weddingPackage.create({
      data: {
        name: "Sagara Intimate",
        slug: "sagara-intimate",
        price: 25000000,
        description: "Paket intimate wedding elegan untuk acara hangat dengan koordinasi penuh.",
        facilities: "WO full day, MC, dekor pelaminan, dokumentasi 6 jam, makeup pengantin, rundown acara",
        includedVendors: "Dekorasi, makeup, dokumentasi, MC",
        addOns: "Live music, photobooth, ekstra lighting",
        recommendedVenue: VenuePreference.RUMAH,
        minGuests: 50,
        maxGuests: 200,
        isFeatured: true,
      },
    }),
    prisma.weddingPackage.create({
      data: {
        name: "Arunika Ballroom",
        slug: "arunika-ballroom",
        price: 68000000,
        description: "Paket gedung lengkap untuk pasangan yang ingin pengalaman profesional dan mewah.",
        facilities: "WO all-in, dekor premium, catering 500 pax, fotografi-video, entertainment, bridal, lighting",
        includedVendors: "Dekorasi, catering, hiburan, foto-video, busana, makeup",
        addOns: "LED backdrop, after party, livestreaming",
        recommendedVenue: VenuePreference.GEDUNG,
        minGuests: 250,
        maxGuests: 700,
        isFeatured: true,
      },
    }),
    prisma.weddingPackage.create({
      data: {
        name: "Maheswari Signature",
        slug: "maheswari-signature",
        price: 95000000,
        description: "Paket signature fleksibel dengan kurasi vendor premium dan pendampingan penuh.",
        facilities: "Full planning, venue scouting, vendor management, design concept, premium photo-video, bridal team",
        includedVendors: "All vendor core + konsultasi konsep eksklusif",
        addOns: "Sangjit, engagement, wedding website premium",
        recommendedVenue: VenuePreference.FLEKSIBEL,
        minGuests: 150,
        maxGuests: 600,
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: "Lotus Decoration Studio",
        category: VendorCategory.DEKORASI,
        phone: "081211110001",
        email: "lotus@vendor.test",
        address: "Surabaya",
        priceStart: 12000000,
        rating: 4.8,
        collaborationLog: "12 event bersama Kamadeva sejak 2024",
        performanceNotes: "Respons cepat, hasil dekor konsisten, tim lapangan rapi.",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Rasa Bahagia Catering",
        category: VendorCategory.CATERING,
        phone: "081211110002",
        address: "Sidoarjo",
        priceStart: 35000,
        rating: 4.6,
        collaborationLog: "8 event ballroom dan 4 event rumahan",
        performanceNotes: "Menu stabil dan baik untuk tamu besar.",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Lensa Cerita",
        category: VendorCategory.FOTOGRAFI,
        phone: "081211110003",
        address: "Malang",
        priceStart: 8000000,
        rating: 4.9,
        collaborationLog: "Vendor foto-video andalan untuk paket premium",
        performanceNotes: "Hasil visual kuat dan disiplin deadline.",
      },
    }),
  ]);

  const clientA = await prisma.client.create({
    data: {
      fullName: "Raisa Putri & Dimas Akbar",
      phone: "081355550001",
      email: "raisa.dimas@test.com",
      address: "Jl. Kenanga 12, Surabaya",
      eventDate: new Date("2026-06-28T09:00:00.000Z"),
      eventLocation: "Graha Puspita Ballroom",
      eventType: "Akad & Resepsi",
      budget: 90000000,
      selectedPackageId: weddingPackages[1].id,
      preferredVenue: VenuePreference.GEDUNG,
      guestCount: 500,
      status: ClientStatus.DEAL,
      specialNotes: "Butuh area khusus keluarga lansia dan makanan tanpa seafood.",
    },
  });

  const clientB = await prisma.client.create({
    data: {
      fullName: "Anisa Rahma & Bintang Saputra",
      phone: "081355550002",
      email: "anisa.bintang@test.com",
      address: "Jl. Melati 7, Gresik",
      eventDate: new Date("2026-05-10T08:00:00.000Z"),
      eventLocation: "Rumah mempelai wanita",
      eventType: "Akad Intimate",
      budget: 30000000,
      selectedPackageId: weddingPackages[0].id,
      preferredVenue: VenuePreference.RUMAH,
      guestCount: 120,
      status: ClientStatus.BERJALAN,
      specialNotes: "Ingin nuansa earth tone dan venue semi outdoor.",
    },
  });

  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: "Fira Maharani",
        whatsapp: "081277770001",
        eventDate: new Date("2026-09-12T10:00:00.000Z"),
        location: "Surabaya Barat",
        budget: 45000000,
        preferredVenue: VenuePreference.GEDUNG,
        guestCount: 300,
        neededServices: "WO, dekorasi, catering, dokumentasi",
        notes: "Minta rekomendasi paket gedung dengan konsep modern.",
        status: LeadStatus.PROSPEK,
      },
    }),
    prisma.lead.create({
      data: {
        name: "Naufal Habibi",
        whatsapp: "081277770002",
        eventDate: new Date("2026-11-21T09:00:00.000Z"),
        location: "Sidoarjo",
        budget: 25000000,
        preferredVenue: VenuePreference.RUMAH,
        guestCount: 150,
        neededServices: "WO, makeup, foto-video",
        notes: "Cari paket hemat tapi tetap elegan.",
        status: LeadStatus.LEAD,
      },
    }),
  ]);

  await prisma.communicationLog.createMany({
    data: [
      {
        channel: CommunicationChannel.WHATSAPP,
        summary: "Kirim proposal paket ballroom dan jadwal meeting lanjutan.",
        clientId: clientA.id,
        handledById: admin.id,
      },
      {
        channel: CommunicationChannel.MEETING,
        summary: "Finalisasi konsep intimate outdoor dan susunan rundown.",
        clientId: clientB.id,
        handledById: staff.id,
      },
      {
        channel: CommunicationChannel.WEBSITE,
        summary: "Lead masuk dari form konsultasi paket gedung.",
        leadId: leads[0].id,
        handledById: admin.id,
      },
    ],
  });

  await prisma.scheduleItem.createMany({
    data: [
      {
        title: "Rapat final vendor ballroom",
        type: ScheduleType.MEETING,
        startDate: new Date("2026-04-24T06:00:00.000Z"),
        endDate: new Date("2026-04-24T07:00:00.000Z"),
        location: "Studio Kamadeva",
        status: ScheduleStatus.TERJADWAL,
        clientId: clientA.id,
      },
      {
        title: "Pelunasan tahap 2 Anisa & Bintang",
        type: ScheduleType.PEMBAYARAN,
        startDate: new Date("2026-04-26T02:00:00.000Z"),
        endDate: new Date("2026-04-26T03:00:00.000Z"),
        location: "Transfer bank",
        status: ScheduleStatus.TERJADWAL,
        clientId: clientB.id,
      },
      {
        title: "Follow-up lead Fira Maharani",
        type: ScheduleType.FOLLOW_UP,
        startDate: new Date("2026-04-22T03:00:00.000Z"),
        endDate: new Date("2026-04-22T03:30:00.000Z"),
        status: ScheduleStatus.TERJADWAL,
        leadId: leads[0].id,
      },
      {
        title: "Akad Anisa & Bintang",
        type: ScheduleType.ACARA,
        startDate: new Date("2026-05-10T01:00:00.000Z"),
        endDate: new Date("2026-05-10T08:00:00.000Z"),
        location: "Rumah mempelai wanita",
        status: ScheduleStatus.TERJADWAL,
        clientId: clientB.id,
      },
      {
        title: "Koordinasi dekor Lotus Decoration Studio",
        type: ScheduleType.VENDOR,
        startDate: new Date("2026-04-25T04:00:00.000Z"),
        endDate: new Date("2026-04-25T05:00:00.000Z"),
        location: "Video call",
        status: ScheduleStatus.PROSES,
        vendorId: vendors[0].id,
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        receiptNumber: "INV-KMD-2026-001",
        type: PaymentType.DP,
        status: PaymentStatus.DP,
        description: "DP paket Arunika Ballroom",
        amount: 25000000,
        dueDate: new Date("2026-04-18T00:00:00.000Z"),
        paidAt: new Date("2026-04-17T00:00:00.000Z"),
        clientId: clientA.id,
      },
      {
        receiptNumber: "INV-KMD-2026-002",
        type: PaymentType.PELUNASAN,
        status: PaymentStatus.BELUM_BAYAR,
        description: "Pelunasan tahap 2 paket Sagara Intimate",
        amount: 10000000,
        dueDate: new Date("2026-04-26T00:00:00.000Z"),
        clientId: clientB.id,
      },
    ],
  });

  await prisma.financeTransaction.createMany({
    data: [
      {
        type: TransactionType.CASH_IN,
        title: "DP Raisa & Dimas",
        category: "Pembayaran klien",
        amount: 25000000,
        transactionDate: new Date("2026-04-17T00:00:00.000Z"),
        clientId: clientA.id,
      },
      {
        type: TransactionType.CASH_OUT,
        title: "DP vendor dekorasi",
        category: "Operasional vendor",
        amount: 7000000,
        transactionDate: new Date("2026-04-18T00:00:00.000Z"),
        clientId: clientA.id,
      },
      {
        type: TransactionType.CASH_IN,
        title: "Pembayaran konsultasi premium",
        category: "Layanan konsultasi",
        amount: 1500000,
        transactionDate: new Date("2026-04-19T00:00:00.000Z"),
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      {
        title: "Kontrak kerja Raisa & Dimas",
        type: DocumentType.KONTRAK,
        status: DocumentStatus.DISETUJUI,
        fileUrl: "https://example.com/dokumen/kontrak-raisa-dimas.pdf",
        clientId: clientA.id,
      },
      {
        title: "Brief acara Anisa & Bintang",
        type: DocumentType.BRIEF,
        status: DocumentStatus.DRAFT,
        fileUrl: "https://example.com/dokumen/brief-anisa-bintang.pdf",
        clientId: clientB.id,
      },
      {
        title: "Proposal awal Fira Maharani",
        type: DocumentType.BRIEF,
        status: DocumentStatus.DIKIRIM,
        fileUrl: "https://example.com/dokumen/proposal-fira.pdf",
        leadId: leads[0].id,
      },
    ],
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Wedding of Wanda & Kalam",
        category: "Akad & Resepsi",
        description: "Momen pernikahan yang hangat dengan dokumentasi formal dan alur acara yang rapi.",
        eventDate: new Date("2025-11-15T00:00:00.000Z"),
        location: "Tasikmalaya",
        imageUrl: "/portfolio/wanda-kalam.jpg",
        isFeatured: true,
      },
      {
        title: "Wedding of Hadiyan & Annisa",
        category: "Wedding Reception",
        description: "Resepsi dengan suasana meriah, penyambutan tamu yang hangat, dan visual yang elegan.",
        eventDate: new Date("2026-01-20T00:00:00.000Z"),
        location: "Tasikmalaya",
        imageUrl: "/portfolio/hadiyan-annisa.jpg",
        isFeatured: true,
      },
      {
        title: "Wedding of Tedi & Nisrina",
        category: "Wedding Reception",
        description: "Dekor floral yang penuh detail untuk momen couple portrait yang anggun dan berkelas.",
        eventDate: new Date("2026-02-14T00:00:00.000Z"),
        location: "Tasikmalaya",
        imageUrl: "/portfolio/tedi-nisrina.jpg",
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Rania & Hafiz",
        eventType: "Wedding Ballroom",
        quote: "Kamadeva membuat kami tenang dari awal sampai hari H. Semua vendor terkoordinasi dan keluarga kami merasa sangat terbantu.",
        rating: 5,
        isFeatured: true,
      },
      {
        clientName: "Mira & Yoga",
        eventType: "Intimate Wedding",
        quote: "Form konsultasinya jelas, paketnya mudah dipahami, dan tim admin responsif sekali saat follow-up.",
        rating: 5,
        isFeatured: true,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        category: "Paket",
        question: "Apakah paket bisa disesuaikan dengan budget?",
        answer: "Bisa. Admin dapat menyesuaikan vendor, jumlah tamu, dan tambahan layanan agar rekomendasi tetap realistis sesuai anggaran.",
        sortOrder: 1,
      },
      {
        category: "Teknis",
        question: "Apakah Kamadeva menangani acara di rumah dan gedung?",
        answer: "Ya. Sistem dan tim kami menyiapkan alur berbeda untuk acara rumahan, gedung, maupun konsep hybrid.",
        sortOrder: 2,
      },
      {
        category: "Pembayaran",
        question: "Bagaimana sistem pembayarannya?",
        answer: "Pembayaran dapat dicicil dengan DP, termin, dan pelunasan. Invoice serta kuitansi dapat dipantau dari dashboard admin.",
        sortOrder: 3,
      },
    ],
  });

  await prisma.whatsAppSync.createMany({
    data: [
      {
        direction: WhatsAppDirection.INBOUND,
        preview: "Halo kak, saya tertarik paket gedung untuk 300 tamu.",
        leadId: leads[0].id,
        externalChatId: "wa-demo-001",
      },
      {
        direction: WhatsAppDirection.OUTBOUND,
        preview: "Baik kak, kami kirim rekomendasi paket Arunika Ballroom ya.",
        leadId: leads[0].id,
        externalChatId: "wa-demo-001",
      },
    ],
  });

  console.log("Seed selesai. Akun demo:");
  console.log("owner@kamadeva.test / kamadeva123");
  console.log("admin@kamadeva.test / kamadeva123");
  console.log("staff@kamadeva.test / kamadeva123");
  void owner;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
