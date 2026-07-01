import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  status: z.enum(['Active', 'On Delivery', 'Idle', 'Offline']).default('Idle'),
  location: z.string().optional(),
  tasksCompleted: z.number().int().min(0).default(0),
  battery: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (status && status !== 'All') where.status = status;

    const [data, total] = await Promise.all([
      prisma.fieldAgent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastUpdate: 'desc' },
      }),
      prisma.fieldAgent.count({ where }),
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

    const agent = await prisma.fieldAgent.create({ data: parsed.data });
    return apiSuccess(agent, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
