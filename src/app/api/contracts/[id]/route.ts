import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  dealId: z.string().optional(),
  template: z.string().optional(),
  client: z.string().min(1).optional(),
  valuePerYear: z.number().optional(),
  currency: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  status: z.enum(['Active', 'Pending Signature', 'Expiring', 'Terminated']).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  signedAt: z.string().datetime().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) return apiError('Contract not found', 404);
    return apiSuccess(contract);
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

    const data = { ...parsed.data } as Record<string, unknown>;
    if (parsed.data.status === 'Active' && !parsed.data.signedAt) data.signedAt = new Date().toISOString();

    const contract = await prisma.contract.update({ where: { id }, data });
    return apiSuccess(contract);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.contract.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
