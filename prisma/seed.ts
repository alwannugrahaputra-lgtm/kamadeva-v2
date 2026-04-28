// Penjelasan file: seed data admin disamakan dengan nama dan alur pada mockup.
import bcrypt from "bcryptjs";
import {
  ClientStatus,
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

  await Promise.all([
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
        name: "Admin Kamadeva",
        email: "admin@kamadeva.test",
        passwordHash,
        phone: "081234567802",
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Staff Kamadeva",
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
      heroSubtitle: "Dari konsultasi awal hingga hari acara, setiap detail dikelola dalam satu alur yang tenang dan terukur.",
    },
  });

  const [intimatePkg, elegantPkg, luxuryPkg] = await Promise.all([
    prisma.weddingPackage.create({
      data: {
        name: "Intimate",
        slug: "intimate",
        price: 25000000,
        description: "Paket intimate untuk pernikahan hangat dan tertata.",
        facilities: "Untuk 100 Pax, Dekorasi Standard, WO Team, Dokumentasi, MC",
        includedVendors: "Dekorasi, WO Team, Dokumentasi, MC",
        addOns: "Live music, photobooth",
        recommendedVenue: VenuePreference.RUMAH,
        minGuests: 80,
        maxGuests: 100,
        isActive: true,
      },
    }),
    prisma.weddingPackage.create({
      data: {
        name: "Elegant",
        slug: "elegant",
        price: 45000000,
        description: "Paket wedding elegan untuk acara menengah dengan dukungan vendor lengkap.",
        facilities: "Untuk 200 Pax, Dekorasi Premium, WO Team, Dokumentasi, MC, Entertainment",
        includedVendors: "Dekorasi, WO Team, Dokumentasi, MC, Entertainment",
        addOns: "Bridesmaid dressing room, live streaming",
        recommendedVenue: VenuePreference.GEDUNG,
        minGuests: 150,
        maxGuests: 200,
        isFeatured: true,
        isActive: true,
      },
    }),
    prisma.weddingPackage.create({
      data: {
        name: "Luxury",
        slug: "luxury",
        price: 75000000,
        description: "Paket premium untuk resepsi besar dengan konsep lebih mewah.",
        facilities: "Untuk 300 Pax, Dekorasi Luxury, WO Team, Dokumentasi, MC, Entertainment, Custom Needs",
        includedVendors: "Dekorasi, WO Team, Dokumentasi, MC, Entertainment",
        addOns: "Custom gate, VIP lounge, LED backdrop",
        recommendedVenue: VenuePreference.GEDUNG,
        minGuests: 250,
        maxGuests: 300,
        isActive: true,
      },
    }),
  ]);

  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: "Dekorasi Indah",
        category: VendorCategory.DEKORASI,
        phone: "0812-3456-7890",
        priceStart: 12000000,
        rating: 4.8,
        address: "Bandung",
        collaborationLog: "Vendor dekor utama untuk ballroom dan outdoor.",
        performanceNotes: "Rapih, cepat, dan konsisten sesuai brief.",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Catering Lezat",
        category: VendorCategory.CATERING,
        phone: "0813-2345-6789",
        priceStart: 35000000,
        rating: 4.6,
        address: "Jakarta",
        collaborationLog: "Sering dipakai untuk acara 200-500 pax.",
        performanceNotes: "Menu aman dan cepat saat service.",
      },
    }),
    prisma.vendor.create({
      data: {
        name: "Foto Bahagia",
        category: VendorCategory.FOTOGRAFI,
        phone: "0814-5678-9101",
        priceStart: 8000000,
        rating: 4.9,
        address: "Bogor",
        collaborationLog: "Tim dokumentasi utama paket premium.",
        performanceNotes: "Komunikasi rapi dan hasil konsisten.",
      },
    }),
  ]);

  const [clientA, clientB, clientC] = await Promise.all([
    prisma.client.create({
      data: {
        fullName: "Ana & Dimas",
        phone: "081355550001",
        email: "ana.dimas@test.com",
        address: "Bandung",
        eventDate: new Date("2026-05-20T10:00:00.000Z"),
        eventLocation: "Bandung",
        eventType: "Wedding Reception",
        budget: 250000000,
        selectedPackageId: elegantPkg.id,
        preferredVenue: VenuePreference.GEDUNG,
        guestCount: 200,
        status: ClientStatus.BERJALAN,
      },
    }),
    prisma.client.create({
      data: {
        fullName: "Rina & Fajar",
        phone: "081355550002",
        email: "rina.fajar@test.com",
        address: "Jakarta",
        eventDate: new Date("2026-06-10T09:00:00.000Z"),
        eventLocation: "Jakarta",
        eventType: "Akad & Resepsi",
        budget: 180000000,
        selectedPackageId: intimatePkg.id,
        preferredVenue: VenuePreference.RUMAH,
        guestCount: 100,
        status: ClientStatus.BERJALAN,
      },
    }),
    prisma.client.create({
      data: {
        fullName: "Siska & Andi",
        phone: "081355550003",
        email: "siska.andi@test.com",
        address: "Bogor",
        eventDate: new Date("2026-07-05T08:00:00.000Z"),
        eventLocation: "Bogor",
        eventType: "Wedding Day",
        budget: 150000000,
        selectedPackageId: luxuryPkg.id,
        preferredVenue: VenuePreference.GEDUNG,
        guestCount: 300,
        status: ClientStatus.BERJALAN,
      },
    }),
  ]);

  const [leadA, leadB, leadC] = await Promise.all([
    prisma.lead.create({
      data: {
        name: "Nina & Budi",
        whatsapp: "081277770001",
        eventDate: new Date("2026-04-20T00:00:00.000Z"),
        location: "Website",
        budget: 85000000,
        preferredVenue: VenuePreference.GEDUNG,
        guestCount: 250,
        neededServices: "WO, dekorasi, dokumentasi",
        notes: "Lead dari website",
        source: "Website",
        status: LeadStatus.LEAD,
      },
    }),
    prisma.lead.create({
      data: {
        name: "Dewi & Ricky",
        whatsapp: "081277770002",
        eventDate: new Date("2026-04-21T00:00:00.000Z"),
        location: "Instagram",
        budget: 95000000,
        preferredVenue: VenuePreference.GEDUNG,
        guestCount: 300,
        neededServices: "WO, catering, venue management",
        notes: "Lead dari Instagram",
        source: "Instagram",
        status: LeadStatus.PROSPEK,
      },
    }),
    prisma.lead.create({
      data: {
        name: "Toni & Putri",
        whatsapp: "081277770003",
        eventDate: new Date("2026-04-22T00:00:00.000Z"),
        location: "WhatsApp",
        budget: 65000000,
        preferredVenue: VenuePreference.RUMAH,
        guestCount: 180,
        neededServices: "WO, makeup, dokumentasi",
        notes: "Lead dari WhatsApp",
        source: "WhatsApp",
        status: LeadStatus.PROSPEK,
      },
    }),
  ]);

  await prisma.scheduleItem.createMany({
    data: [
      {
        title: "Meeting Ana & Dimas",
        type: ScheduleType.MEETING,
        startDate: new Date("2026-05-07T10:00:00.000Z"),
        endDate: new Date("2026-05-07T11:00:00.000Z"),
        status: ScheduleStatus.TERJADWAL,
        clientId: clientA.id,
      },
      {
        title: "Follow-up Rina & Fajar",
        type: ScheduleType.FOLLOW_UP,
        startDate: new Date("2026-05-10T14:00:00.000Z"),
        endDate: new Date("2026-05-10T15:00:00.000Z"),
        status: ScheduleStatus.TERJADWAL,
        clientId: clientB.id,
      },
      {
        title: "Venue Check Hotel Santika",
        type: ScheduleType.VENDOR,
        startDate: new Date("2026-05-17T16:00:00.000Z"),
        endDate: new Date("2026-05-17T17:00:00.000Z"),
        status: ScheduleStatus.PROSES,
        vendorId: vendors[0].id,
        location: "Hotel Santika",
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        receiptNumber: "INV-KMD-2026-001",
        type: PaymentType.DP,
        status: PaymentStatus.DP,
        description: "DP Paket Elegant",
        amount: 125000000,
        clientId: clientA.id,
      },
      {
        receiptNumber: "INV-KMD-2026-002",
        type: PaymentType.DP,
        status: PaymentStatus.BELUM_BAYAR,
        description: "DP Paket Intimate",
        amount: 45000000,
        clientId: clientB.id,
      },
      {
        receiptNumber: "INV-KMD-2026-003",
        type: PaymentType.PELUNASAN,
        status: PaymentStatus.BELUM_BAYAR,
        description: "Pelunasan Paket Luxury",
        amount: 80000000,
        clientId: clientC.id,
      },
    ],
  });

  await prisma.financeTransaction.createMany({
    data: [
      {
        type: TransactionType.CASH_IN,
        title: "Pembayaran Ana & Dimas",
        category: "Client Payment",
        amount: 250000000,
        transactionDate: new Date("2026-05-01T00:00:00.000Z"),
        clientId: clientA.id,
      },
      {
        type: TransactionType.CASH_OUT,
        title: "Pembayaran Vendor",
        category: "Vendor Cost",
        amount: 120000000,
        transactionDate: new Date("2026-05-08T00:00:00.000Z"),
        clientId: clientB.id,
      },
      {
        type: TransactionType.CASH_IN,
        title: "Laba Bersih Awal",
        category: "Revenue",
        amount: 130000000,
        transactionDate: new Date("2026-05-15T00:00:00.000Z"),
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      {
        title: "Kontrak Ana & Dimas.pdf",
        type: DocumentType.KONTRAK,
        status: DocumentStatus.DISETUJUI,
        fileUrl: "https://example.com/dokumen/kontrak-ana-dimas.pdf",
        clientId: clientA.id,
      },
      {
        title: "Brief Wedding Rina & Fajar.pdf",
        type: DocumentType.BRIEF,
        status: DocumentStatus.DRAFT,
        fileUrl: "https://example.com/dokumen/brief-rina-fajar.pdf",
        clientId: clientB.id,
      },
      {
        title: "Invoice Siska & Andi.pdf",
        type: DocumentType.KUITANSI,
        status: DocumentStatus.DIKIRIM,
        fileUrl: "https://example.com/dokumen/invoice-siska-andi.pdf",
        clientId: clientC.id,
      },
    ],
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Wedding Ana & Dimas",
        category: "Ballroom Wedding",
        description: "Dekorasi elegan untuk acara ballroom yang hangat dan tertata.",
        eventDate: new Date("2026-05-20T00:00:00.000Z"),
        location: "Bandung",
        imageUrl: "/portfolio/hadiyan-annisa.jpg",
        isFeatured: true,
      },
      {
        title: "Wedding Rina & Fajar",
        category: "Intimate Wedding",
        description: "Konsep intimate di rumah dengan detail floral lembut.",
        eventDate: new Date("2026-06-10T00:00:00.000Z"),
        location: "Jakarta",
        imageUrl: "/portfolio/wanda-kalam.jpg",
        isFeatured: true,
      },
      {
        title: "Wedding Siska & Andi",
        category: "Luxury Reception",
        description: "Resepsi malam dengan nuansa modern dan premium.",
        eventDate: new Date("2026-07-05T00:00:00.000Z"),
        location: "Bogor",
        imageUrl: "/portfolio/tedi-nisrina.jpg",
        isFeatured: true,
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "Ana & Dimas",
        eventType: "Elegant Wedding",
        quote: "Tim Kamadeva membantu dari awal sampai hari H dengan sangat rapi dan tenang.",
        rating: 5,
        isFeatured: true,
      },
      {
        clientName: "Rina & Fajar",
        eventType: "Intimate Wedding",
        quote: "Vendor terkoordinasi dengan baik dan keluarga merasa sangat terbantu.",
        rating: 5,
        isFeatured: true,
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        category: "CONTENT:Halaman:Published",
        question: "Tentang Kami",
        answer: "Halaman profil utama Kamadeva Wedding Organizer.",
        sortOrder: 1,
      },
      {
        category: "CONTENT:Halaman:Published",
        question: "Paket Wedding",
        answer: "Halaman daftar paket intimate, elegant, dan luxury.",
        sortOrder: 2,
      },
      {
        category: "CONTENT:Halaman:Draft",
        question: "Portfolio",
        answer: "Halaman dokumentasi event yang pernah ditangani.",
        sortOrder: 3,
      },
    ],
  });

  await prisma.whatsAppSync.createMany({
    data: [
      {
        externalChatId: "chat-nina-budi",
        direction: WhatsAppDirection.INBOUND,
        preview: "Halo, kami tertarik dengan paket wedding yang tersedia.",
        leadId: leadA.id,
      },
      {
        externalChatId: "chat-nina-budi",
        direction: WhatsAppDirection.OUTBOUND,
        preview: "Baik kak Nina & Budi, kami kirim detail paketnya ya.",
        leadId: leadA.id,
      },
      {
        externalChatId: "chat-dewi-ricky",
        direction: WhatsAppDirection.INBOUND,
        preview: "Apakah tanggal 21 April masih tersedia?",
        leadId: leadB.id,
      },
      {
        externalChatId: "chat-dewi-ricky",
        direction: WhatsAppDirection.OUTBOUND,
        preview: "Tanggal masih tersedia, boleh kami bantu pilih paket?",
        leadId: leadB.id,
      },
      {
        externalChatId: "chat-toni-putri",
        direction: WhatsAppDirection.INBOUND,
        preview: "Kami mau wedding intimate di rumah.",
        leadId: leadC.id,
      },
      {
        externalChatId: "chat-toni-putri",
        direction: WhatsAppDirection.OUTBOUND,
        preview: "Siap kak, kami rekomendasikan paket Intimate.",
        leadId: leadC.id,
      },
    ],
  });

  console.log("Seed selesai. Akun demo:");
  console.log("owner@kamadeva.test / kamadeva123");
  console.log("admin@kamadeva.test / kamadeva123");
  console.log("staff@kamadeva.test / kamadeva123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
