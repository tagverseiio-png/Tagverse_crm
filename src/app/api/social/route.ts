import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    const where: any = {};
    if (platform && platform !== 'all') where.platform = platform;
    if (status && status !== 'all') where.status = status;

    const posts = await prisma.socialPost.findMany({
      where,
      orderBy: { scheduledAt: 'asc' }
    });

    return apiSuccess(posts);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const post = await prisma.socialPost.create({
      data: {
        platform: data.platform || 'linkedin',
        content: data.content || '',
        mediaUrl: data.mediaUrl || null,
        scheduledAt: new Date(data.scheduledAt || Date.now()),
        status: data.status || 'scheduled',
      }
    });
    return apiSuccess(post, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
