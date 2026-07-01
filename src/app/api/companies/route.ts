import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  stage: z.string().optional(),
  health: z.number().int().min(0).max(100).optional(),
  logo: z.string().optional(),
  color: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') ?? '';
    const { skip, limit } = parsePagination(searchParams);

    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [data, total] = await Promise.all([
      prisma.company.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.company.count({ where }),
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
    const company = await prisma.company.create({ data: parsed.data });
    return apiSuccess(company, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
