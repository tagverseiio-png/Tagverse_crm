import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  title: z.string().nullish(),
  client: z.string().nullish(),
  value: z.number().nullish(),
  stage: z.string().nullish(),
  pipelineId: z.string().nullish(),
  pipelineStageKey: z.string().nullish(),
  probability: z.number().int().min(0).max(100).nullish(),
  source: z.string().nullish(),
  serviceType: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  expectedClose: z.string().nullish(),
  lastContactAt: z.string().nullish(),
  nextFollowUpAt: z.string().nullish(),
  notes: z.string().nullish(),
  contactId: z.string().nullish(),
  companyId: z.string().nullish(),
  assignedToId: z.string().nullish(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        pipeline: { include: { stages: { orderBy: { order: 'asc' } } } },
        contact: { select: { id: true, name: true, email: true } },
        tasks: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!deal) return apiError('Deal not found', 404);
    return apiSuccess(deal);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        title: parsed.data.title ?? undefined,
        client: parsed.data.client ?? undefined,
        value: parsed.data.value ?? undefined,
        stage: parsed.data.stage ?? undefined,
        pipelineId: parsed.data.pipelineId ?? undefined,
        pipelineStageKey: parsed.data.pipelineStageKey ?? undefined,
        probability: parsed.data.probability ?? undefined,
        source: parsed.data.source ?? undefined,
        serviceType: parsed.data.serviceType ?? undefined,
        tags: parsed.data.tags ?? undefined,
        expectedClose: parsed.data.expectedClose ?? undefined,
        lastContactAt: parsed.data.lastContactAt ?? undefined,
        nextFollowUpAt: parsed.data.nextFollowUpAt ?? undefined,
        notes: parsed.data.notes ?? undefined,
        contactId: parsed.data.contactId ?? undefined,
        companyId: parsed.data.companyId ?? undefined,
        assignedToId: parsed.data.assignedToId ?? undefined,
      },
      include: {
        pipeline: { include: { stages: { orderBy: { order: 'asc' } } } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
    return apiSuccess(deal);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
