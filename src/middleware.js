import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionId,
} from "./lib/session";

export function middleware(request) {
  const response = NextResponse.next();
  const existingSession = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!existingSession) {
    response.cookies.set(SESSION_COOKIE_NAME, createSessionId(), {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
