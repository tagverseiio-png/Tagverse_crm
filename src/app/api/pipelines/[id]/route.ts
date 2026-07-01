import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const pipeline = await prisma.pipeline.findUnique({
      where: { id },
      include: { stages: { orderBy: { order: 'asc' } } },
    });
    if (!pipeline) return apiError('Pipeline not found', 404);
    return apiSuccess(pipeline);
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

    const pipeline = await prisma.pipeline.update({
      where: { id },
      data: parsed.data,
      include: { stages: { orderBy: { order: 'asc' } } },
    });
    return apiSuccess(pipeline);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.pipeline.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
