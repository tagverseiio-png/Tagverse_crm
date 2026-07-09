import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  contextType: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  projectId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    let dataToUpdate: any = { ...parsed.data };
    
    // Convert YYYY-MM-DD to ISO if needed, or Prisma might handle it if schema is String
    // Assuming schema is String for dueDate in this mock

    const task = await prisma.task.update({
      where: { id: params.id },
      data: dataToUpdate
    });

    return apiSuccess(task);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    await prisma.task.delete({
      where: { id: params.id },
    });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
