import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Add security headers to all responses
    const response = NextResponse.next();
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Additional checks for admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // Check if user has admin role
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
    
    // Handle logout - if token is missing and user is trying to access protected routes
    if (!token && req.nextUrl.pathname.startsWith('/admin')) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes without authentication
        const publicRoutes = [
          '/',
          '/about',
          '/services',
          '/blog',
          '/projects',
          '/contact',
          '/resources',
          '/signin',
          '/signup',
          '/forgot-password',
          '/reset-password',
          '/404',
          '/unauthorized'
        ];
        
        const isPublicRoute = publicRoutes.some(route => 
          req.nextUrl.pathname === route || 
          req.nextUrl.pathname.startsWith(`${route}/`)
        );
        
        // Allow access to API auth routes
        const isAuthApiRoute = req.nextUrl.pathname.startsWith('/api/auth');
        
        // Allow access to public API routes
        const isPublicApiRoute = req.nextUrl.pathname.startsWith('/api/public');
        
        if (isPublicRoute || isAuthApiRoute || isPublicApiRoute) {
          return true;
        }
        
        // For all other routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
      error: "/auth/error",
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/bytes",
    "/api/blog",
    "/api/contact",
    "/api/chat",
    "/api/newsletter",
    "/api/linkedin"
  ],
};
