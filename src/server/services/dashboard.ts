// Penjelasan file: service backend yang merangkum query dan logika modul.
import { ClientStatus, PaymentStatus, ScheduleType, TransactionType } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function getDashboardData() {
  const [
    activeClients,
    upcomingSchedules,
    pendingPayments,
    activeVendors,
    clientStatusCounts,
    pendingFollowUps,
    transactions,
    latestLeads,
  ] = await Promise.all([
    prisma.client.count({
      where: {
        status: {
          in: [ClientStatus.DEAL, ClientStatus.BERJALAN],
        },
      },
    }),
    prisma.scheduleItem.findMany({
      orderBy: { startDate: "asc" },
      take: 5,
      include: {
        client: true,
        lead: true,
        vendor: true,
      },
      where: {
        startDate: {
          gte: new Date(),
        },
      },
    }),
    prisma.payment.findMany({
      where: {
        status: {
          in: [PaymentStatus.BELUM_BAYAR, PaymentStatus.DP],
        },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: {
        client: true,
      },
    }),
    prisma.vendor.count({
      where: {
        isActive: true,
      },
    }),
    prisma.client.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.scheduleItem.findMany({
      where: {
        type: ScheduleType.FOLLOW_UP,
        startDate: {
          gte: new Date(),
        },
      },
      orderBy: { startDate: "asc" },
      take: 5,
      include: {
        lead: true,
        client: true,
      },
    }),
    prisma.financeTransaction.findMany({
      orderBy: { transactionDate: "desc" },
      take: 8,
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const cashIn = transactions
    .filter((item) => item.type === TransactionType.CASH_IN)
    .reduce((sum, item) => sum + item.amount, 0);
  const cashOut = transactions
    .filter((item) => item.type === TransactionType.CASH_OUT)
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    activeClients,
    upcomingSchedules,
    pendingPayments,
    activeVendors,
    clientStatusCounts,
    pendingFollowUps,
    latestLeads,
    cashflow: {
      cashIn,
      cashOut,
      balance: cashIn - cashOut,
    },
  };
}
