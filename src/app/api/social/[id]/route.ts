import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const { id } = await params;
    const post = await prisma.socialPost.update({
      where: { id },
      data: {
        platform: data.platform,
        content: data.content,
        mediaUrl: data.mediaUrl,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        status: data.status,
      }
    });
    return apiSuccess(post);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.socialPost.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
