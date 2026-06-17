import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

const ADMIN_PATHS = ["/admin", "/api/admin"];
const STAFF_PATHS = ["/beneficiaries", "/api/beneficiaries"];

function matchesPath(pathname: string, patterns: string[]) {
  return patterns.some((pattern) => pathname === pattern || pathname.startsWith(pattern + "/"));
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
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
    }
  );

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/assets") || pathname.startsWith("/static") || pathname.startsWith("/login")) {
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

  if (pathname.startsWith("/api/auth/user")) {
    return res;
  }

  return res;
}

export const config = {
  matcher: ["/beneficiaries/:path*", "/admin/:path*", "/api/admin/:path*", "/api/beneficiaries/:path*"],
};
