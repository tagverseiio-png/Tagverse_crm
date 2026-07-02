import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const channel = searchParams.get('channel');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (channel && channel !== 'All channels') where.channel = channel;
    if (status && status !== 'All statuses') where.status = status;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return apiSuccess(campaigns);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        channel: data.channel,
        budget: data.budget,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        status: data.status || 'Draft',
        spent: data.spent || '—',
      }
    });
    return apiSuccess(campaign, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
