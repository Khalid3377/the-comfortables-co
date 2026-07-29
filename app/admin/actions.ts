"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signSession } from "@/lib/auth";

// TEMPORARY: replace with Supabase Auth + admin_users role check
export async function loginAction(_prevState: { error: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    return { error: "Invalid password. Please try again." };
  }

  const token = await signSession();
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60 // 2 hours
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
