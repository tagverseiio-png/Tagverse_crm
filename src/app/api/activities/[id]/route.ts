import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;
  try {
    const { id } = params;
    const body = await req.json();
    
    // allow updating status, scheduledAt, and any other typical fields
    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.scheduledAt ? { scheduledAt: new Date(body.scheduledAt) } : {}),
      },
    });
    
    return apiSuccess(updated);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;
  try {
    const { id } = params;
    await prisma.activity.delete({
      where: { id },
    });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
