"use server";

import { clearSession } from "@/lib/auth";
import { loginWithPassword, registerTrader } from "@/lib/auth-credentials";

export async function loginAction(formData: FormData) {
  try {
    return await loginWithPassword(String(formData.get("email") || ""), String(formData.get("password") || ""));
  } catch (error) {
    console.error(error);
    return { ok: false as const, status: 500, error: "Could not sign in" };
  }
}

export async function registerAction(formData: FormData) {
  try {
    return await registerTrader(Object.fromEntries(formData.entries()));
  } catch (error) {
    console.error(error);
    return { ok: false as const, status: 500, error: "Please fill every field correctly" };
  }
}

export async function logoutAction() {
  await clearSession();
  return { ok: true as const };
}
