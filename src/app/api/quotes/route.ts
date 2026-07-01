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
  dealId: z.string().optional(),
  client: z.string().min(1),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  scope: z.string().optional(),
  lineItems: z.array(lineItemSchema).default([]),
  gstRate: z.number().default(18),
  discountRate: z.number().default(0),
  currency: z.string().default('₹'),
  terms: z.string().optional(),
  delivery: z.string().optional(),
  notes: z.string().optional(),
  total: z.number().default(0),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Expired', 'Invoiced', 'Rejected']).default('Draft'),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
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
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.quote.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.quote.count({ where }),
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

    const quote = await prisma.quote.create({ data: parsed.data });
    return apiSuccess(quote, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
