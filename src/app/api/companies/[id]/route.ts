import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().optional(),
  stage: z.string().optional(),
  health: z.number().int().min(0).max(100).optional(),
  logo: z.string().optional(),
  color: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: { select: { id: true, name: true, role: true, email: true } },
        deals: { select: { id: true, title: true, value: true, stage: true } },
      },
    });
    if (!company) return apiError('Company not found', 404);
    return apiSuccess(company);
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
    const company = await prisma.company.update({ where: { id }, data: parsed.data });
    return apiSuccess(company);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.company.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
