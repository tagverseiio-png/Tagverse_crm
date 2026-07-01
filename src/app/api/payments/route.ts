import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  invoiceId: z.string().optional(),
  invoiceLabel: z.string().optional(),
  client: z.string().min(1),
  amount: z.number(),
  method: z.enum(['UPI', 'NEFT', 'Cheque', 'Pending']).default('UPI'),
  status: z.enum(['Received', 'Pending', 'Failed']).default('Received'),
  receivedAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const method = searchParams.get('method');
    const status = searchParams.get('status');
    const search = searchParams.get('search') ?? '';
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (method && method !== 'All') where.method = method;
    if (status && status !== 'All') where.status = status;
    if (search) {
      where.OR = [
        { client: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { invoiceLabel: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.payment.findMany({ where, skip, take: limit, orderBy: { receivedAt: 'desc' } }),
      prisma.payment.count({ where }),
    ]);
    return apiSuccess(data, { total, skip, limit });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const payment = await prisma.payment.create({ data: parsed.data });

    // Recording a "Received" payment against a real Invoice flips it to Paid.
    if (parsed.data.invoiceId && parsed.data.status === 'Received') {
      await prisma.invoice.update({
        where: { id: parsed.data.invoiceId },
        data: { status: 'Paid', paidAt: new Date() },
      }).catch(() => {});
    }

    return apiSuccess(payment, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
