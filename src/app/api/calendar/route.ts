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
