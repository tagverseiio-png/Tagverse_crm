import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  dealId: z.string().optional(),
  template: z.string().default('Service Agreement'),
  client: z.string().min(1),
  valuePerYear: z.number().default(0),
  currency: z.string().default('INR'),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  status: z.enum(['Active', 'Pending Signature', 'Expiring', 'Terminated']).default('Pending Signature'),
  data: z.record(z.string(), z.unknown()).optional(),
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
      prisma.contract.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.contract.count({ where }),
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

    const contract = await prisma.contract.create({ data: parsed.data });
    return apiSuccess(contract, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
