import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const lineItemSchema = z.object({
  id: z.number(),
  desc: z.string(),
  qty: z.number(),
  price: z.number(),
});

const createSchema = z.object({
  quoteId: z.string().optional(),
  dealId: z.string().optional(),
  client: z.string().min(1),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  scope: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
  gstRate: z.number().default(18),
  discountRate: z.number().default(0),
  currency: z.string().default('₹'),
  terms: z.string().optional(),
  delivery: z.string().optional(),
  notes: z.string().optional(),
  total: z.number().default(0),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Void']).default('Draft'),
  issuedAt: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search') ?? '';
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (status && status !== 'All') where.status = status;
    if (search) {
      where.OR = [
        { client: { contains: search, mode: 'insensitive' } },
        { contact: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.invoice.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.invoice.count({ where }),
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

    const invoice = await prisma.invoice.create({ data: parsed.data });

    // Mark the source quote as Invoiced so it drops out of the "open" view.
    if (parsed.data.quoteId) {
      await prisma.quote.update({
        where: { id: parsed.data.quoteId },
        data: { status: 'Invoiced' },
      }).catch(() => {});
    }

    return apiSuccess(invoice, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
