import { prisma } from "@/server/db/prisma";

export async function getChatbotRecommendation({
  venue,
  budget,
  guestCount,
  question,
}: {
  venue?: string;
  budget?: number;
  guestCount?: number;
  question?: string;
}) {
  const packages = await prisma.weddingPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  const faqs = await prisma.faqItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const normalizedQuestion = question?.toLowerCase() ?? "";
  const matchingFaq = faqs.find(
    (item) =>
      normalizedQuestion.includes(item.category.toLowerCase()) ||
      normalizedQuestion.includes(item.question.toLowerCase().slice(0, 12)),
  );

  if (matchingFaq) {
    return {
      type: "faq",
      message: matchingFaq.answer,
      recommendation: null,
    };
  }

  const recommended =
    packages.find((pkg) => {
      const budgetOk = !budget || pkg.price <= budget * 1.15;
      const venueOk =
        !venue ||
        !pkg.recommendedVenue ||
        pkg.recommendedVenue.toLowerCase() === venue.toLowerCase() ||
        pkg.recommendedVenue === "FLEKSIBEL";
      const guestOk =
        !guestCount ||
        ((!pkg.minGuests || guestCount >= pkg.minGuests) &&
          (!pkg.maxGuests || guestCount <= pkg.maxGuests));
      return budgetOk && venueOk && guestOk;
    }) ?? packages[0];

  if (!recommended) {
    return {
      type: "general",
      message: "Saat ini belum ada paket aktif yang cocok, tetapi tim admin bisa bantu susun paket custom untuk Anda.",
      recommendation: null,
    };
  }

  return {
    type: "package",
    message: `Berdasarkan kebutuhan awal Anda, paket ${recommended.name} paling mendekati. Tim kami tetap bisa menyesuaikan vendor, jumlah tamu, dan add-on agar lebih pas.`,
    recommendation: {
      id: recommended.id,
      name: recommended.name,
      price: recommended.price,
      description: recommended.description,
      facilities: recommended.facilities,
    },
  };
}
