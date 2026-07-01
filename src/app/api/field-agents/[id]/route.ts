import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  status: z.enum(['Active', 'On Delivery', 'Idle', 'Offline']).optional(),
  location: z.string().optional(),
  tasksCompleted: z.number().int().min(0).optional(),
  battery: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const agent = await prisma.fieldAgent.findUnique({
      where: { id },
      include: { feedEntries: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!agent) return apiError('Field agent not found', 404);
    return apiSuccess(agent);
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

    const agent = await prisma.fieldAgent.update({
      where: { id },
      data: { ...parsed.data, lastUpdate: new Date() },
    });
    return apiSuccess(agent);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.fieldAgent.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
