import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/shared/lib/format";

export default async function ContentPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.content);

  const [site, faqs, testimonials, portfolios] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.portfolioItem.findMany({ orderBy: { eventDate: "desc" } }),
  ]);

  async function updateSiteSetting(formData: FormData) {
    "use server";
    const siteId = String(formData.get("id") ?? "");
    await prisma.siteSetting.update({
      where: { id: siteId },
      data: {
        businessName: String(formData.get("businessName") ?? ""),
        tagline: String(formData.get("tagline") ?? ""),
        about: String(formData.get("about") ?? ""),
        whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        instagram: String(formData.get("instagram") ?? "") || null,
        tiktok: String(formData.get("tiktok") ?? "") || null,
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
      },
    });

    revalidatePath("/");
    revalidatePath("/tentang-kami");
    revalidatePath("/kontak");
    revalidatePath("/admin/content");
    redirect("/admin/content");
  }

  async function createFaq(formData: FormData) {
    "use server";
    await prisma.faqItem.create({
      data: {
        category: String(formData.get("category") ?? ""),
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
        sortOrder: Number(formData.get("sortOrder")) || 0,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    redirect("/admin/content");
  }

  async function createTestimonial(formData: FormData) {
    "use server";
    await prisma.testimonial.create({
      data: {
        clientName: String(formData.get("clientName") ?? ""),
        eventType: String(formData.get("eventType") ?? ""),
        quote: String(formData.get("quote") ?? ""),
        rating: Number(formData.get("rating")) || 5,
        isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/content");
    redirect("/admin/content");
  }

  async function createPortfolio(formData: FormData) {
    "use server";
    await prisma.portfolioItem.create({
      data: {
        title: String(formData.get("title") ?? ""),
        category: String(formData.get("category") ?? ""),
        description: String(formData.get("description") ?? ""),
        eventDate: new Date(String(formData.get("eventDate"))),
        location: String(formData.get("location") ?? ""),
        imageUrl: String(formData.get("imageUrl") ?? ""),
        isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
      },
    });
    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath("/admin/content");
    redirect("/admin/content");
  }

  return (
    <div>
      <AdminTopbar
        title="Konten"
        description="Konten website dan identitas brand."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Identitas bisnis</p>
          <form action={updateSiteSetting} className="mt-5">
            <input type="hidden" name="id" defaultValue={site?.id ?? ""} />
            <div className="form-grid">
              <input name="businessName" defaultValue={site?.businessName ?? ""} placeholder="Nama bisnis" className="input-base" required />
              <input name="tagline" defaultValue={site?.tagline ?? ""} placeholder="Tagline" className="input-base" required />
              <input name="whatsappNumber" defaultValue={site?.whatsappNumber ?? ""} placeholder="WhatsApp" className="input-base" required />
              <input name="email" defaultValue={site?.email ?? ""} placeholder="Email" className="input-base" required />
              <input name="address" defaultValue={site?.address ?? ""} placeholder="Alamat" className="input-base" required />
              <input name="instagram" defaultValue={site?.instagram ?? ""} placeholder="Instagram" className="input-base" />
              <input name="tiktok" defaultValue={site?.tiktok ?? ""} placeholder="TikTok" className="input-base" />
              <input name="heroTitle" defaultValue={site?.heroTitle ?? ""} placeholder="Hero title" className="input-base md:col-span-2" required />
            </div>
            <textarea name="heroSubtitle" defaultValue={site?.heroSubtitle ?? ""} placeholder="Hero subtitle" className="input-base mt-4 min-h-28" required />
            <textarea name="about" defaultValue={site?.about ?? ""} placeholder="Tentang kami" className="input-base mt-4 min-h-32" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan konten...">Update Identitas Bisnis</SubmitButton>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah FAQ</p>
          <form action={createFaq} className="mt-5">
            <div className="form-grid">
              <input name="category" placeholder="Kategori FAQ" className="input-base" required />
              <input name="sortOrder" type="number" placeholder="Urutan" className="input-base" />
              <input name="question" placeholder="Pertanyaan" className="input-base md:col-span-2" required />
            </div>
            <textarea name="answer" placeholder="Jawaban" className="input-base mt-4 min-h-28" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan FAQ...">Tambah FAQ</SubmitButton>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="rounded-[22px] bg-white p-4">
                <p className="font-semibold text-[var(--brand-deep)]">{faq.question}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah testimoni</p>
          <form action={createTestimonial} className="mt-5">
            <div className="form-grid">
              <input name="clientName" placeholder="Nama klien" className="input-base" required />
              <input name="eventType" placeholder="Jenis acara" className="input-base" required />
              <input name="rating" type="number" min="1" max="5" placeholder="Rating" className="input-base" />
              <select name="isFeatured" className="input-base" defaultValue="true">
                <option value="true">Tampilkan di homepage</option>
                <option value="false">Simpan saja</option>
              </select>
            </div>
            <textarea name="quote" placeholder="Isi testimoni" className="input-base mt-4 min-h-28" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan testimoni...">Tambah Testimoni</SubmitButton>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-[22px] bg-white p-4">
                <p className="font-semibold text-[var(--brand-deep)]">{item.clientName}</p>
                <p className="text-sm text-[var(--muted)]">{item.eventType}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah portfolio</p>
          <form action={createPortfolio} className="mt-5">
            <div className="form-grid">
              <input name="title" placeholder="Judul event" className="input-base" required />
              <input name="category" placeholder="Kategori event" className="input-base" required />
              <input name="eventDate" type="date" className="input-base" required />
              <input name="location" placeholder="Lokasi event" className="input-base" required />
              <input name="imageUrl" placeholder="URL gambar" className="input-base md:col-span-2" required />
              <select name="isFeatured" className="input-base" defaultValue="true">
                <option value="true">Featured</option>
                <option value="false">Biasa</option>
              </select>
            </div>
            <textarea name="description" placeholder="Deskripsi event" className="input-base mt-4 min-h-28" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan portfolio...">Tambah Portfolio</SubmitButton>
            </div>
          </form>

          <div className="mt-8 space-y-4">
            {portfolios.map((item) => (
              <div key={item.id} className="rounded-[22px] bg-white p-4">
                <p className="font-semibold text-[var(--brand-deep)]">{item.title}</p>
                <p className="text-sm text-[var(--muted)]">
                  {item.category} · {formatDate(item.eventDate)}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
