import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default function withAuthorization(middleware, requireAuth) {
  return async (request, next) => {
    const pathname = request.nextUrl.pathname;

    if (requireAuth?.some((path) => pathname.startsWith(path))) {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (token?.name !== "admin" && pathname === "/admin") {
        const url = new URL(`/403`, request.url);
        return NextResponse.rewrite(url);
      } else if (token === null) {
        const url = new URL(`/api/auth/signin`, request.url);
        url.searchParams.set("callbackUrl ", encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
    return middleware(request, next);
  };
}
