import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Public routes
        if (pathname === '/login' || pathname === '/api/auth/signin' || pathname === '/api/init') {
          return true;
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

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/teacher/:path*',
    '/parent/:path*',
    '/api/:path*'
  ]
};
