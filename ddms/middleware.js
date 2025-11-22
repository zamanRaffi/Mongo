import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/categories",
  "/products",
  "/employees",
  "/suppliers",
  "/sales",
  "/billing"
];

export function middleware(req) {
  const url = req.nextUrl.clone();

  // Get auth token from cookies (must match your login cookie)
  const token = req.cookies.get("token")?.value;

  // Redirect to login if trying to access protected route without token
  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Static matcher for protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/products/:path*",
    "/employees/:path*",
    "/suppliers/:path*",
    "/sales/:path*",
    "/billing/:path*"
  ]
};
