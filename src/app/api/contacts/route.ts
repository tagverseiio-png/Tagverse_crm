import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  type: z.enum(['lead', 'contact']).default('lead'),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  whatsapp: z.boolean().default(false),
  company: z.string().optional(),
  companyId: z.string().optional(),
  role: z.string().optional(),
  source: z.string().optional(),
  leadScore: z.number().int().min(0).max(100).default(0),
  stage: z.string().default('new'),
  intent: z.string().optional(),
  tags: z.array(z.string()).default([]),
  assignedToId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type'); // 'lead' | 'contact' | null = all
    const stage = searchParams.get('stage');
    const search = searchParams.get('search') ?? '';
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (stage) where.stage = stage;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { assignedTo: { select: { id: true, name: true } } },
      }),
      prisma.contact.count({ where }),
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

    const contact = await prisma.contact.create({ data: parsed.data });
    return apiSuccess(contact, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
