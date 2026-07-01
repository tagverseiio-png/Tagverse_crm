import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const lineItemSchema = z.object({
  id: z.number(),
  desc: z.string(),
  qty: z.number(),
  price: z.number(),
});

const updateSchema = z.object({
  dealId: z.string().optional(),
  client: z.string().min(1).optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  scope: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
  gstRate: z.number().optional(),
  discountRate: z.number().optional(),
  currency: z.string().optional(),
  terms: z.string().optional(),
  delivery: z.string().optional(),
  notes: z.string().optional(),
  total: z.number().optional(),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Expired', 'Invoiced', 'Rejected']).optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({ where: { id }, include: { invoices: true } });
    if (!quote) return apiError('Quote not found', 404);
    return apiSuccess(quote);
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

    const quote = await prisma.quote.update({ where: { id }, data: parsed.data });
    return apiSuccess(quote);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const { id } = await params;
    await prisma.quote.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
