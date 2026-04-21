import { NextResponse } from "next/server";
import { logout } from "@/server/auth/session";

export async function POST(request: Request) {
  await logout();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
