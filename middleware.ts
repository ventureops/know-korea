import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes: require Level 3+
    if (pathname.startsWith('/admin')) {
      if (!token || (token.role as number ?? 0) < 3) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Protected routes that require login
        const authRequired = ['/profile', '/notifications'];
        if (authRequired.some((p) => pathname.startsWith(p))) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/profile/:path*', '/notifications/:path*', '/admin/:path*'],
};
