import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const POST = (request: Request) => {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag('roadmaps', 'max');
  revalidateTag('profile', 'max');
  revalidateTag('badges', 'max');
  return NextResponse.json({ ok: true });
};
