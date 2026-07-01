import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export function apiSuccess<T>(data: T, meta?: PaginationMeta, status = 200) {
  return NextResponse.json({ data, meta }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function apiErrorFromUnknown(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(error.issues.map((issue) => issue.message).join(', '), 422);
  }
  if (error instanceof Error) {
    return apiError(error.message, 500);
  }
  return apiError('Internal Server Error', 500);
}
