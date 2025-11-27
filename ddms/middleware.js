import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

// Define protected routes and role requirements
const routeRoles = {
  "/dashboard": ["admin", "manager", "employee"],
  "/categories": ["admin", "manager"],
  "/products": ["admin", "manager", "employee"],
  "/employees": ["admin"],
  "/suppliers": ["admin", "manager"],
  "/sales": ["admin", "manager"],
  "/billing": ["admin", "manager"]
};

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Not logged in, redirect to login
    if (Object.keys(routeRoles).some(route => url.pathname.startsWith(route))) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    const user = verifyToken(token);
    if (!user) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Check role access
    for (const [route, roles] of Object.entries(routeRoles)) {
      if (url.pathname.startsWith(route) && !roles.includes(user.role)) {
        url.pathname = "/dashboard"; // Redirect to dashboard if no access
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    ]
};