import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseConfig, getSupabaseConfigError } from "@/lib/supabase/env";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/partnerships",
  "/donations",
  "/agape-registration",
  "/agape-registration/register",
  "/agape-registration/bulk",
  "/agape-registration/track",
  "/agape-registration/partner",
  "/login",
  "/register",
  "/offline",
  "/_next",
  "/favicon.ico",
  "/assets",
  "/static",
  "/api/auth",
  "/api/organization-agreements",
  "/api/requests",
  "/api/beneficiaries",
  "/api/public",
  "/api/health",
];
const ADMIN_PATHS = ["/admin", "/dashboard/admin", "/api/admin"];
const STAFF_PATHS = [
  "/dashboard",
  "/dashboard/staff",
  "/beneficiaries",
  "/assessments",
  "/distributions",
  "/records",
  "/reports",
  "/api/beneficiaries",
  "/api/assessments",
  "/api/inventory",
  "/api/requests",
  "/api/follow-ups",
  "/api/donations",
  "/api/equipment-distributions",
  "/api/organization-agreements",
];

function matchesPath(pathname: string, patterns: string[]) {
  return patterns.some((pattern) => pathname === pattern || pathname.startsWith(pattern + "/"));
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const config = getSupabaseConfig();
  const configError = getSupabaseConfigError(config);

  if (configError) {
    return res;
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll: async () => {
        const cookieHeader = req.headers.get("cookie") || "";
        return cookieHeader
          .split("; ")
          .filter(Boolean)
          .map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return { name, value: rest.join("=") };
          });
      },
      setAll: async () => {
        // Middleware does not set cookies here.
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((pattern) => pathname === pattern || pathname.startsWith(pattern + "/"))) {
    return res;
  }

  if (matchesPath(pathname, ADMIN_PATHS)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data, error } = await supabase.from("users").select("role,is_disabled").eq("id", session.user.id).maybeSingle();
    if (error || !data || data.is_disabled || data.role !== "Admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  if (matchesPath(pathname, STAFF_PATHS)) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data, error } = await supabase.from("users").select("role,is_disabled").eq("id", session.user.id).maybeSingle();
    if (error || !data || data.is_disabled || (data.role !== "Admin" && data.role !== "Staff")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  if (pathname.startsWith("/api/auth")) {
    return res;
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/beneficiaries/:path*",
    "/assessments/:path*",
    "/distributions/:path*",
    "/records/:path*",
    "/reports/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/beneficiaries/:path*",
    "/api/assessments/:path*",
    "/api/inventory/:path*",
    "/api/requests/:path*",
    "/api/follow-ups/:path*",
    "/api/donations/:path*",
    "/api/equipment-distributions/:path*",
    "/api/organization-agreements/:path*",
  ],
};
