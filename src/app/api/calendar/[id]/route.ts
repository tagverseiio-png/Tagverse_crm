import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json();
    const { id } = await params;
    
    let scheduledAt = new Date();
    if (data.date) {
       const datePart = data.date; 
       let timePart = data.time || '00:00';
       
       if (timePart.includes('AM') || timePart.includes('PM')) {
         const [time, modifier] = timePart.split(' ');
         let [hours, minutes] = time.split(':');
         if (hours === '12') hours = '00';
         if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
         timePart = `${String(hours).padStart(2, '0')}:${minutes}:00`;
       } else if (timePart.split(':').length === 2) {
         timePart += ':00';
       }
       
       scheduledAt = new Date(`${datePart}T${timePart}Z`);
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: data.title,
        status: data.status,
        scheduledAt,
        metadata: {
          channel: data.channel,
          author: data.author,
          type: data.type,
          company: data.company,
          client: data.client,
          color: data.color,
        } as any,
      }
    });
    
    return apiSuccess(activity);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.activity.delete({ where: { id } });
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
