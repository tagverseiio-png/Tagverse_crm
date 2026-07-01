import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  label: z.string().min(1).optional(),
  color: z.string().optional(),
  headerColor: z.string().optional(),
  defaultProbability: z.number().int().min(0).max(100).optional(),
  isClosing: z.boolean().optional(),
  isWon: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ stageId: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { stageId } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const stage = await prisma.pipelineStage.update({ where: { id: stageId }, data: parsed.data });
    return apiSuccess(stage);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ stageId: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { stageId } = await params;
    // Deals sitting in this stage lose their stage key so they don't vanish silently.
    const stage = await prisma.pipelineStage.findUnique({ where: { id: stageId } });
    if (stage) {
      await prisma.deal.updateMany({
        where: { pipelineId: stage.pipelineId, pipelineStageKey: stage.key },
        data: { pipelineStageKey: null },
      });
    }
    await prisma.pipelineStage.delete({ where: { id: stageId } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
