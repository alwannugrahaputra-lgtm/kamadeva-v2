// Penjelasan file: endpoint API untuk proses login admin.
import { NextResponse } from "next/server";
import { loginWithCredentials } from "@/server/auth/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const result = await loginWithCredentials(email, password);
  if (!result.success) {
    const errorMessage = result.message ?? "Login gagal.";
    const url = new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url);
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.redirect(new URL(next, request.url), { status: 303 });
}
