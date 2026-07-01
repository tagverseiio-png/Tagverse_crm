import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      activeDeals,
      monthlyRevenue,
      overdueInvoices,
    ] = await Promise.all([
      prisma.contact.count({ where: { type: 'lead' } }),
      prisma.deal.count({ where: { stage: { notIn: ['won', 'lost'] } } }),
      prisma.deal.aggregate({
        where: {
          stage: 'won',
          updatedAt: { gte: monthStart },
        },
        _sum: { value: true },
      }),
      prisma.invoice.count({ where: { status: 'overdue' } }),
    ]);

    return apiSuccess({
      totalLeads,
      activeDeals,
      monthlyRevenue: monthlyRevenue._sum.value ?? 0,
      overdueInvoices,
    });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
