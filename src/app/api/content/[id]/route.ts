import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const item = await prisma.contentItem.update({
      where: { id: params.id },
      data: {
        title: data.title,
        type: data.type,
        campaignId: data.campaignId,
        funnelStage: data.funnelStage,
        persona: data.persona,
        author: data.author,
        status: data.status,
        priority: data.priority,
        description: data.description,
      }
    });
    return apiSuccess(item);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.contentItem.delete({ where: { id: params.id } });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
