import { prisma } from '@/lib/db';
import { apiSuccess, apiErrorFromUnknown } from '@/lib/api/response';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return apiSuccess({ status: 'ok', db: 'connected' });
  } catch (error) {
    return apiErrorFromUnknown(error);
  }
}
