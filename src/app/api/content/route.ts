import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type = searchParams.get('type');
    const stage = searchParams.get('stage');
    const search = searchParams.get('search');

    const where: any = {};
    if (type && type !== 'All Content') where.type = type;
    if (stage) where.status = stage;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const items = await prisma.contentItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return apiSuccess(items);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const item = await prisma.contentItem.create({
      data: {
        title: data.title,
        type: data.type || 'Blog',
        campaignId: data.campaignId || null,
        funnelStage: data.funnelStage || 'Awareness',
        persona: data.persona || 'Customer',
        author: data.author || 'Unknown',
        status: data.status || 'Draft',
        priority: data.priority || 'Medium',
        description: data.description || '',
      }
    });
    return apiSuccess(item, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
