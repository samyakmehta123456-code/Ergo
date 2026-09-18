import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "lunorsoft-super-secret-jwt-key-2026-student-taskflow";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  let isValidToken = false;
  if (token) {
    try {
      await jwtVerify(token, secretKey);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // Protect /dashboard and task APIs
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/tasks") || pathname.startsWith("/api/stats")) {
    if (!isValidToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users away from /login and /register
  if ((pathname === "/login" || pathname === "/register" || pathname === "/") && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/api/tasks/:path*", "/api/stats/:path*"],
};
