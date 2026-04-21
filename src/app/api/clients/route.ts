// Penjelasan file: endpoint API untuk data klien.
import { ClientStatus, VenuePreference } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      selectedPackage: true,
      documents: true,
      interactions: true,
      payments: true,
    },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const body = await request.json();

  const client = await prisma.client.create({
    data: {
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventLocation: body.eventLocation || null,
      eventType: body.eventType || "Wedding",
      budget: body.budget ? Number(body.budget) : null,
      selectedPackageId: body.selectedPackageId || null,
      preferredVenue: (body.preferredVenue || null) as VenuePreference | null,
      guestCount: body.guestCount ? Number(body.guestCount) : null,
      status: (body.status || ClientStatus.LEAD) as ClientStatus,
      specialNotes: body.specialNotes || null,
    },
  });

  return NextResponse.json(client, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const client = await prisma.client.update({
    where: { id: body.id },
    data: {
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      eventDate: body.eventDate ? new Date(body.eventDate) : null,
      eventLocation: body.eventLocation || null,
      eventType: body.eventType || "Wedding",
      budget: body.budget ? Number(body.budget) : null,
      selectedPackageId: body.selectedPackageId || null,
      preferredVenue: (body.preferredVenue || null) as VenuePreference | null,
      guestCount: body.guestCount ? Number(body.guestCount) : null,
      status: (body.status || ClientStatus.LEAD) as ClientStatus,
      specialNotes: body.specialNotes || null,
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await prisma.client.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ message: "Klien berhasil dihapus." });
}
