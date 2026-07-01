import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';
import { parsePagination } from '@/lib/api/pagination';

const createSchema = z.object({
  type: z.string().min(1), // meeting, task, deadline, followup, note, email, call
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('upcoming'),
  scheduledAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  companyId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;
  try {
    const { searchParams } = req.nextUrl;
    const contactId = searchParams.get('contactId');
    const dealId = searchParams.get('dealId');
    const { skip, limit } = parsePagination(searchParams);

    const where: Record<string, unknown> = {};
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;

    const [data, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } },
          contact: { select: { id: true, name: true } },
          deal: { select: { id: true, title: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);
    return apiSuccess(data, { total, skip, limit });
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

    const activity = await prisma.activity.create({
      data: {
        ...parsed.data,
        createdById: session!.user.id,
      },
    });
    return apiSuccess(activity, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
