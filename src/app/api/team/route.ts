import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Helper to generate a consistent color based on a string (e.g. name)
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777215)).toString(16);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
}

// Helper to format 'lastActive' time from a Date
function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return Math.floor(seconds) + 's ago';
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Map Prisma User to the Team page's 'rep' format
    const formattedReps = users.map(user => {
      // Create initials from name
      const nameParts = user.name.split(' ');
      let initials = 'U';
      if (nameParts.length >= 2) {
        initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      } else if (nameParts.length === 1 && nameParts[0].length > 0) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
      }

      // Map roles
      let displayRole = 'Viewer';
      if (user.role === 'admin') displayRole = 'Admin';
      if (user.role === 'manager') displayRole = 'Manager';
      if (user.role === 'agent') displayRole = 'Sales Rep';

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: initials,
        color: user.avatar ? undefined : stringToColor(user.email), // Or use actual avatar if we support images later
        role: displayRole,
        status: user.emailVerified ? 'Active' : 'Invited',
        lastActive: formatTimeAgo(user.updatedAt),
      };
    });

    // Fetch recent activities across all users for the Activity Log
    const activities = await prisma.activity.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: true,
      }
    });

    const formattedFeed = activities.map(act => ({
      id: act.id,
      repId: act.createdById,
      action: act.type, // e.g. "meeting", "call"
      target: act.title, // e.g. "Discussed Q3 goals"
      time: formatTimeAgo(act.createdAt),
    }));

    return NextResponse.json({ reps: formattedReps, feed: formattedFeed });
  } catch (error) {
    console.error('Error fetching team data:', error);
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 });
  }
}
