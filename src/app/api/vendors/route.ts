// Penjelasan file: endpoint API untuk data vendor.
import { VendorCategory } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vendors);
}

export async function POST(request: Request) {
  const body = await request.json();
  const vendor = await prisma.vendor.create({
    data: {
      name: body.name,
      category: (body.category || VendorCategory.LAINNYA) as VendorCategory,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      priceStart: body.priceStart ? Number(body.priceStart) : null,
      rating: body.rating ? Number(body.rating) : null,
      collaborationLog: body.collaborationLog || null,
      performanceNotes: body.performanceNotes || null,
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json(vendor, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const vendor = await prisma.vendor.update({
    where: { id: body.id },
    data: {
      name: body.name,
      category: (body.category || VendorCategory.LAINNYA) as VendorCategory,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      priceStart: body.priceStart ? Number(body.priceStart) : null,
      rating: body.rating ? Number(body.rating) : null,
      collaborationLog: body.collaborationLog || null,
      performanceNotes: body.performanceNotes || null,
      isActive: Boolean(body.isActive),
    },
  });

  return NextResponse.json(vendor);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await prisma.vendor.delete({ where: { id: body.id } });
  return NextResponse.json({ message: "Vendor berhasil dihapus." });
}
