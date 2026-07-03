import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const stages = await prisma.contentStage.findMany({
      orderBy: { order: 'asc' },
    });
    return apiSuccess(stages);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const count = await prisma.contentStage.count();
    const stage = await prisma.contentStage.create({
      data: {
        key: body.key,
        label: body.label,
        dotColor: body.dotColor || 'var(--text-muted)',
        order: count,
      },
    });
    return apiSuccess(stage, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const updates: { id: string; order: number }[] = await req.json();
    
    // Prisma does not support bulk updates with different values out of the box,
    // so we use a transaction
    await prisma.$transaction(
      updates.map(u => 
        prisma.contentStage.update({
          where: { id: u.id },
          data: { order: u.order }
        })
      )
    );
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
