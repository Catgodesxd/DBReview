import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const username = req.cookies.get('username');

  const publicRoutes = ['/', '/login', '/register'];

  if (!token || !username) {
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)',
};