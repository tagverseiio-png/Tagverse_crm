import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.string().default('medium'),
  status: z.string().default('todo'),
  dueDate: z.string().datetime().optional(),
  contextType: z.string().default('general'),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  projectId: z.string().optional(),
  assignedToId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { id: true, name: true } },
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      }
    });
    return apiSuccess(tasks);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const task = await prisma.task.create({
      data: {
        ...parsed.data,
      }
    });

    return apiSuccess(task, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
