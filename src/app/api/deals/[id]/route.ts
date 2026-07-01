import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  client: z.string().optional(),
  value: z.number().optional(),
  stage: z.string().optional(),
  pipelineId: z.string().optional(),
  pipelineStageKey: z.string().optional(),
  probability: z.number().int().min(0).max(100).optional(),
  source: z.string().optional(),
  serviceType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  expectedClose: z.string().optional(),
  lastContactAt: z.string().optional(),
  nextFollowUpAt: z.string().optional(),
  notes: z.string().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  assignedToId: z.string().optional(),
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
      data: parsed.data,
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
