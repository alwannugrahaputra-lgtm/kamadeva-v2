// Penjelasan file: endpoint API untuk data calon klien.
import { CommunicationChannel, LeadStatus, VenuePreference } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      interactions: true,
      documents: true,
      schedules: true,
    },
  });

  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      whatsapp: body.whatsapp,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      location: body.location,
      budget: body.budget ? Number(body.budget) : null,
      preferredVenue: (body.preferredVenue || null) as VenuePreference | null,
      guestCount: body.guestCount ? Number(body.guestCount) : null,
      neededServices: body.neededServices,
      notes: body.notes || null,
      status: (body.status || LeadStatus.LEAD) as LeadStatus,
      source: body.source || "Website",
    },
  });

  await prisma.communicationLog.create({
    data: {
      channel: CommunicationChannel.WEBSITE,
      summary: `Calon klien baru masuk dari form konsultasi website: ${lead.neededServices}`,
      leadId: lead.id,
    },
  });

  return NextResponse.json(
    {
      ...lead,
      message: "Terima kasih. Konsultasi Anda sudah masuk ke sistem Kamadeva dan akan segera ditindaklanjuti admin.",
    },
    { status: 201 },
  );
}

export async function PUT(request: Request) {
  const body = await request.json();

  const lead = await prisma.lead.update({
    where: { id: body.id },
    data: {
      name: body.name,
      whatsapp: body.whatsapp,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      location: body.location,
      budget: body.budget ? Number(body.budget) : null,
      preferredVenue: (body.preferredVenue || null) as VenuePreference | null,
      guestCount: body.guestCount ? Number(body.guestCount) : null,
      neededServices: body.neededServices,
      notes: body.notes || null,
      status: (body.status || LeadStatus.LEAD) as LeadStatus,
    },
  });

  return NextResponse.json(lead);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await prisma.lead.delete({ where: { id: body.id } });
  return NextResponse.json({ message: "Lead berhasil dihapus." });
}
