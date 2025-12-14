import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname, hostname } = req.nextUrl;

  // Localhost bypass for development testing
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for protected routes
  if (!token && pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for admin routes
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Add the user information to the request
    req.user = decoded;
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to signin
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
