import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const updateSchema = z.object({
  type: z.enum(['lead', 'contact']).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  whatsapp: z.boolean().optional(),
  company: z.string().optional(),
  companyId: z.string().optional(),
  role: z.string().optional(),
  source: z.string().optional(),
  leadScore: z.number().int().min(0).max(100).optional(),
  stage: z.string().optional(),
  intent: z.string().optional(),
  tags: z.array(z.string()).optional(),
  lastContactAt: z.string().datetime().optional(),
  assignedToId: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        deals: { orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!contact) return apiError('Contact not found', 404);
    return apiSuccess(contact);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    // Always sync intent → tags so Contacts page stays up to date
    const updateData: Record<string, unknown> = { ...parsed.data };

    // Fetch current record to get type + existing tags
    const existing = await prisma.contact.findUnique({
      where: { id },
      select: { type: true, intent: true, tags: true },
    });

    if (existing?.type === 'lead') {
      // Determine the new intent value (may be explicitly set or fall back to existing)
      const newIntent =
        typeof updateData.intent === 'string'
          ? updateData.intent
          : (existing.intent ?? '');

      // Tags derived from the OLD intent (to remove them)
      const oldIntentTags = (existing.intent ?? '')
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      // Tags derived from the NEW intent (to add them)
      const newIntentTags = newIntent
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);

      // Keep any manually-added tags that weren't from the old intent
      const manualTags = (existing.tags ?? []).filter(
        (t: string) => !oldIntentTags.includes(t)
      );

      // Final tags = manual tags + new intent tags (deduped)
      updateData.tags = Array.from(
        new Set([...manualTags, ...newIntentTags])
      );
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.contact.update>[0]['data'],
    });
    return apiSuccess(contact);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
