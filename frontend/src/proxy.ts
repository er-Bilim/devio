import { NextResponse, type NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const hasSession = request.cookies.has('access_token');
  if (!hasSession) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*'],
};
