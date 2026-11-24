import { NextResponse } from "next/server";
import { appUrl } from "@/lib/app-url";
import { SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.redirect(appUrl("/"));
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
