import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const { id } = await params;
    const stage = await prisma.contentStage.update({
      where: { id },
      data: {
        label: data.label,
      }
    });
    return apiSuccess(stage);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.contentStage.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
