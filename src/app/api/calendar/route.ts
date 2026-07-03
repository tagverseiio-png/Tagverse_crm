import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';
import { requireSession } from '@/lib/api/auth';

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { searchParams } = req.nextUrl;
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const activities = await prisma.activity.findMany({
      where: {
        scheduledAt: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        }
      },
      include: {
        contact: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      }
    });

    const socialPosts = await prisma.socialPost.findMany({
      where: {
        scheduledAt: {
          gte: start ? new Date(start) : undefined,
          lte: end ? new Date(end) : undefined,
        }
      }
    });

    // Merge and format
    const events = [
      ...activities.map(a => {
        const d = a.scheduledAt ? new Date(a.scheduledAt) : new Date();
        return {
          id: a.id,
          title: a.title,
          type: a.type,
          date: d.toISOString().split('T')[0],
          time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
          duration: (a.metadata as any)?.duration || 60,
          attendees: [],
          color: a.type === 'meeting' ? '#3b82f6' : a.type === 'task' ? '#8b5cf6' : '#10b981',
          description: a.description || '',
          linkedRecord: a.dealId ? { type: 'deal', id: a.dealId, title: a.deal?.title } : a.contactId ? { type: 'contact', id: a.contactId, title: a.contact?.name } : undefined
        };
      }),
      ...socialPosts.map(s => {
        const d = new Date(s.scheduledAt);
        return {
          id: s.id,
          title: `Social Post: ${s.platform}`,
          type: 'social',
          date: d.toISOString().split('T')[0],
          time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
          duration: 30,
          attendees: [],
          color: '#ec4899',
          description: s.content,
        };
      })
    ];

    return apiSuccess(events);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const data = await req.json();
    
    // Convert local date/time string to ISO datetime for scheduledAt
    // Date format expected: YYYY-MM-DD
    // Time format expected: HH:MM (12h or 24h, handled by frontend converting to 24h before API call ideally, 
    // but the frontend sends it as 'HH:MM AM/PM' to local state. We need to parse it if so, 
    // or tell the frontend to send a standard ISO string or 24h time).
    // Wait, the frontend stores `time` as 12h format ("H:MM AM/PM"). 
    // Let's parse it securely here.
    
    let scheduledAt = new Date();
    if (data.date) {
       const datePart = data.date; 
       let timePart = data.time || '00:00';
       
       // Handle 12h to 24h
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

    const activity = await prisma.activity.create({
      data: {
        type: 'marketing',
        title: data.title,
        status: data.status || 'upcoming',
        scheduledAt,
        metadata: {
          channel: data.channel,
          author: data.author,
          type: data.type,
          company: data.company,
          client: data.client,
          color: data.color,
        } as any,
        createdById: session!.user.id,
      }
    });
    
    return apiSuccess(activity, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

