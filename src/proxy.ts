// Penjelasan file: middleware atau proxy untuk proteksi route aplikasi.
import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedPrefixes = ["/admin"];
const COOKIE_NAME = "kamadeva_session";

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return false;
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return false;
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isLoginPage = pathname === "/login";
  const hasCookie = Boolean(request.cookies.get(COOKIE_NAME)?.value);
  const hasSession = await hasValidSession(request);

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (hasCookie) {
      response.cookies.delete(COOKIE_NAME);
    }
    return response;
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isLoginPage && hasCookie && !hasSession) {
    const response = NextResponse.next();
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
