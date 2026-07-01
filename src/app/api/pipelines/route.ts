import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/api/auth';
import { apiSuccess, apiError, apiErrorFromUnknown } from '@/lib/api/response';

const stageSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  color: z.string().default('new'),
  headerColor: z.string().default('#3b82f6'),
  defaultProbability: z.number().int().min(0).max(100).default(0),
  isClosing: z.boolean().default(false),
  isWon: z.boolean().default(false),
  order: z.number().int().default(0),
});

const createSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
  stages: z.array(stageSchema).default([]),
});

export async function GET(_req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const pipelines = await prisma.pipeline.findMany({
      include: { stages: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
    return apiSuccess(pipelines);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.message, 422);

    const { stages, ...pipelineData } = parsed.data;
    const pipeline = await prisma.pipeline.create({
      data: {
        ...pipelineData,
        stages: { create: stages },
      },
      include: { stages: { orderBy: { order: 'asc' } } },
    });
    return apiSuccess(pipeline, undefined, 201);
  } catch (err) {
    return apiErrorFromUnknown(err);
  }
}
