import { VenuePreference } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { slugify } from "@/shared/lib/utils";

export async function GET() {
  const packages = await prisma.weddingPackage.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const packageItem = await prisma.weddingPackage.create({
    data: {
      name: body.name,
      slug: slugify(body.name),
      price: Number(body.price),
      description: body.description,
      facilities: body.facilities,
      includedVendors: body.includedVendors,
      addOns: body.addOns,
      recommendedVenue: (body.recommendedVenue || null) as VenuePreference | null,
      minGuests: body.minGuests ? Number(body.minGuests) : null,
      maxGuests: body.maxGuests ? Number(body.maxGuests) : null,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(packageItem, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const packageItem = await prisma.weddingPackage.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: slugify(body.name),
      price: Number(body.price),
      description: body.description,
      facilities: body.facilities,
      includedVendors: body.includedVendors,
      addOns: body.addOns,
      recommendedVenue: (body.recommendedVenue || null) as VenuePreference | null,
      minGuests: body.minGuests ? Number(body.minGuests) : null,
      maxGuests: body.maxGuests ? Number(body.maxGuests) : null,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(packageItem);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await prisma.weddingPackage.delete({ where: { id: body.id } });
  return NextResponse.json({ message: "Paket berhasil dihapus." });
}
