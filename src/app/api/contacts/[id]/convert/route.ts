import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) return apiError('Contact not found', 404);
    if (existing.type === 'contact') return apiError('Already a contact', 400);

    const contact = await prisma.contact.update({
      where: { id },
      data: { type: 'contact', convertedAt: new Date() },
    });
    return apiSuccess(contact);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
