import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        name: data.name,
        channel: data.channel,
        budget: data.budget,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        status: data.status,
      }
    });
    return apiSuccess(campaign);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.campaign.delete({ where: { id: params.id } });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
