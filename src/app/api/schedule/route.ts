import { ScheduleStatus, ScheduleType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export async function GET() {
  const schedules = await prisma.scheduleItem.findMany({
    orderBy: { startDate: "asc" },
    include: { client: true, lead: true, vendor: true },
  });

  return NextResponse.json(schedules);
}

export async function POST(request: Request) {
  const body = await request.json();
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);

  const conflict = await prisma.scheduleItem.findFirst({
    where: {
      AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { message: "Bentrok jadwal terdeteksi.", conflictId: conflict.id },
      { status: 409 },
    );
  }

  const schedule = await prisma.scheduleItem.create({
    data: {
      title: body.title,
      type: (body.type || ScheduleType.MEETING) as ScheduleType,
      startDate,
      endDate,
      location: body.location || null,
      notes: body.notes || null,
      status: (body.status || ScheduleStatus.TERJADWAL) as ScheduleStatus,
      clientId: body.clientId || null,
      leadId: body.leadId || null,
      vendorId: body.vendorId || null,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
