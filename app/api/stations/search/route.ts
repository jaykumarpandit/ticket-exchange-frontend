import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.BACKEND_URL ?? 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const limit = request.nextUrl.searchParams.get('limit') ?? '10';

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/stations/search?q=${encodeURIComponent(q.trim())}&limit=${limit}`,
    );
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
