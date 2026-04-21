// Penjelasan file: endpoint API placeholder untuk sinkronisasi WhatsApp.
import { CommunicationChannel, WhatsAppDirection } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = String(body.phone ?? "");
  const preview = String(body.preview ?? "");
  const direction = (body.direction || WhatsAppDirection.INBOUND) as WhatsAppDirection;

  const client = await prisma.client.findFirst({
    where: { phone: { contains: phone.slice(-8) } },
  });
  const lead = !client
    ? await prisma.lead.findFirst({
        where: { whatsapp: { contains: phone.slice(-8) } },
      })
    : null;

  const sync = await prisma.whatsAppSync.create({
    data: {
      externalChatId: body.externalChatId || null,
      direction,
      preview,
      clientId: client?.id ?? null,
      leadId: lead?.id ?? null,
    },
  });

  await prisma.communicationLog.create({
    data: {
      channel: CommunicationChannel.WHATSAPP,
      summary: preview,
      clientId: client?.id ?? null,
      leadId: lead?.id ?? null,
    },
  });

  return NextResponse.json({
    message: "Sinkronisasi placeholder berhasil disimpan.",
    sync,
    matchedEntity: client?.fullName ?? lead?.name ?? null,
  });
}
