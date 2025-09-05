import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./components/auth/services";

const authRoutes = ["/login", "/register"];

const roleBasedRoute = {
  PATIENT: [/^\/patient/],
  ADMIN: [/^\/admin/],
  DOCTOR: [/^\/doctor/],
} as const;

type TRole = keyof typeof roleBasedRoute;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const userInfo = (await getCurrentUser()) as { role?: TRole } | null;

  const isProtectedDynamicRoute =
    /^\/blogs\/[^/]+$/.test(pathname) ||
    /^\/book-appointment\/[^/]+$/.test(pathname);

  // If route is protected and user not logged in
  if (isProtectedDynamicRoute && !userInfo) {
    const response = NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url)
    );
    response.cookies.delete("token");
    return response;
  }

  // Auth routes should remain public even if logged out
  if (!userInfo && authRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is logged in but has no valid role
  if (userInfo && !userInfo.role) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  // Validate role-based private routes
  if (userInfo?.role) {
    const allowedRoutes = roleBasedRoute[userInfo.role];
    if (allowedRoutes && allowedRoutes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  // Allow all other public routes (e.g., /blogs without /:id)
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/blogs/:id*",
    "/book-appointment/:id*",
  ],
};
