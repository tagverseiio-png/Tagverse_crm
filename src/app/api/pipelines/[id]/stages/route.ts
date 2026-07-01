import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const createStageSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  color: z.string().default('new'),
  headerColor: z.string().default('#3b82f6'),
  defaultProbability: z.number().int().min(0).max(100).default(0),
  isClosing: z.boolean().default(false),
  isWon: z.boolean().default(false),
});

// Bulk reorder: [{ id, order }, ...]
const reorderSchema = z.array(z.object({ id: z.string(), order: z.number().int() }));

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id: pipelineId } = await params;
    const body = await req.json();
    const parsed = createStageSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const maxOrder = await prisma.pipelineStage.aggregate({
      where: { pipelineId },
      _max: { order: true },
    });

    const stage = await prisma.pipelineStage.create({
      data: {
        ...parsed.data,
        pipelineId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });
    return apiSuccess(stage, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

// PATCH — bulk reorder stages within this pipeline
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id: pipelineId } = await params;
    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    await prisma.$transaction(
      parsed.data.map(({ id, order }) =>
        prisma.pipelineStage.update({ where: { id }, data: { order } })
      )
    );
    const stages = await prisma.pipelineStage.findMany({
      where: { pipelineId },
      orderBy: { order: 'asc' },
    });
    return apiSuccess(stages);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
