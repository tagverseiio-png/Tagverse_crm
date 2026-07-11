import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const data = await req.json();
    const { id } = params;
    
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

    try {
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
    } catch (e: any) {
      if (e.code === 'P2025' && (prisma as any).socialPost) {
        const socialPost = await (prisma as any).socialPost.update({
          where: { id },
          data: {
            platform: data.title ? data.title.replace('Social Post: ', '') : undefined,
            scheduledAt,
            content: data.description,
          }
        });
        return apiSuccess(socialPost);
      }
      throw e;
    }
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    // Use deleteMany to avoid P2025 'Record not found' error
    const activityResult = await prisma.activity.deleteMany({ where: { id } });
    
    // If it wasn't an Activity, it might be a SocialPost being deleted from the marketing calendar
    if (activityResult.count === 0 && (prisma as any).socialPost) {
      await (prisma as any).socialPost.deleteMany({ where: { id } });
    }
    
    return apiSuccess({ success: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
