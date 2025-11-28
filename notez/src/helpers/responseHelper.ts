import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status: 200 }
  );
}

export function errorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function serverErrorResponse(error: unknown): NextResponse<ApiResponse> {
  const errorMessage =
    error instanceof Error ? error.message : 'Internal server error';
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    },
    { status: 500 }
  );
}

