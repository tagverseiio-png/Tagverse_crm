import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { apiError } from './response';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) return { session: null, error: apiError('Unauthorized', 401) };
  return { session, error: null };
}
