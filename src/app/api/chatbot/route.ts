import { NextResponse } from "next/server";
import { getChatbotRecommendation } from "@/server/services/chatbot";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await getChatbotRecommendation({
    venue: body.venue,
    budget: body.budget,
    guestCount: body.guestCount,
    question: body.question,
  });

  return NextResponse.json(result);
}
