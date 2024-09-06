import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Protect the "/admin" route
  if (pathname.startsWith('/admin')) {
    // If the user is not authenticated or not an admin, redirect to the login page
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect the "/chat" route (all authenticated users can access)
  if (pathname.startsWith('/chat')) {
    // If the user is not authenticated, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow the request to continue for other routes
  return NextResponse.next();
}

// Configure the middleware to match the "/admin" and "/chat" routes
export const config = {
  matcher: ['/admin/:path*', '/chat/:path*'],
};