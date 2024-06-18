import { NextResponse } from 'next/server';
import { verifyIdToken } from 'firebase-admin/auth';

export async function middleware(req) {
  const token = req.cookies.get('token');
  const url = req.nextUrl.clone();

  if (!token && url.pathname !== '/login') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    await verifyIdToken(token);
    return NextResponse.next();
  } catch (error) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
