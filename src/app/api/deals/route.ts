import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  title: z.string().nullish(),
  client: z.string().nullish(),
  value: z.number().default(0),
  stage: z.string().default('new'),
  pipelineId: z.string().nullish(),
  pipelineStageKey: z.string().nullish(),
  probability: z.number().int().min(0).max(100).nullish(),
  source: z.string().nullish(),
  serviceType: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  expectedClose: z.string().nullish(),
  lastContactAt: z.string().nullish(),
  nextFollowUpAt: z.string().nullish(),
  notes: z.string().nullish(),
  contactId: z.string().nullish(),
  companyId: z.string().nullish(),
  assignedToId: z.string().nullish(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const pipelineId = searchParams.get('pipelineId');
    const stage = searchParams.get('stage');
    const search = searchParams.get('search') ?? '';
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (pipelineId) where.pipelineId = pipelineId;
    if (stage && stage !== 'all') where.pipelineStageKey = stage;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, name: true } },
          pipeline: { include: { stages: { orderBy: { order: 'asc' } } } },
          contact: { select: { id: true, name: true, email: true, tags: true, intent: true } },
        },
      }),
      prisma.deal.count({ where }),
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

    const { value, stage, tags, ...rest } = parsed.data;
    const deal = await prisma.deal.create({
      data: {
        value,
        stage,
        tags,
        title: rest.title ?? '',       // required String in Prisma schema
        client: rest.client ?? undefined,
        pipelineId: rest.pipelineId ?? undefined,
        pipelineStageKey: rest.pipelineStageKey ?? undefined,
        probability: rest.probability ?? undefined,
        source: rest.source ?? undefined,
        serviceType: rest.serviceType ?? undefined,
        expectedClose: rest.expectedClose ?? undefined,
        lastContactAt: rest.lastContactAt ?? undefined,
        nextFollowUpAt: rest.nextFollowUpAt ?? undefined,
        notes: rest.notes ?? undefined,
        contactId: rest.contactId ?? undefined,
        companyId: rest.companyId ?? undefined,
        assignedToId: rest.assignedToId ?? undefined,
      },
      include: {
        pipeline: { include: { stages: { orderBy: { order: 'asc' } } } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
    return apiSuccess(deal, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
