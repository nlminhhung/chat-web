import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Protect the "/admin" route
  if (pathname.startsWith('/admin')) {
    // If the user is not authenticated or not an admin, redirect to the landing page
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect the "/chat" route 
  if (pathname.startsWith('/chat')) {
    // If the user is not authenticated, redirect to the landing page
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname === '/chat') {
      return NextResponse.redirect(new URL(`/chat/${token.id}`, req.url));
    }
  }

  // Allow the request to continue for other routes
  return NextResponse.next();
}

// Configure the middleware to match the "/admin" and "/chat" routes
export const config = {
  matcher: ['/admin/:path*', '/chat/:path*'],
};
