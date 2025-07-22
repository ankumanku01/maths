import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    console.log('Middleware - Path:', req.nextUrl.pathname, 'Token:', !!req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes - always allow
        if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth/') || pathname === '/api/init') {
          return true;
        }

        // If no token, redirect to login
        if (!token) {
          return false;
        }

        // API routes need authentication
        if (pathname.startsWith('/api/')) {
          return !!token;
        }

        // Dashboard routes need authentication and proper role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }

        if (pathname.startsWith('/teacher')) {
          return token?.role === 'teacher';
        }

        if (pathname.startsWith('/parent')) {
          return token?.role === 'parent';
        }

        // Default: require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
