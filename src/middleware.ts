import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith('/dashboard/admin');

    const userRole = req.nextauth.token?.role;

    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only check if token exists globally; specific roles checked inside middleware
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/sign-in',
    },
  },
);

// ✅ Protect routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/add-recipe',
  ],
};
