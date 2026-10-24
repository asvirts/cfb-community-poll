"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  clearSession,
  createSession,
  currentUser,
  hashPassword,
  isUniqueViolation,
  verifyPassword,
} from "@/lib/auth";
import { BallotError, ensureReady, getSql, saveBallotForUser } from "@/lib/db";

function loginRedirect(kind: "error" | "message", text: string): never {
  redirect(`/login?${kind}=${encodeURIComponent(text)}`);
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

export async function signIn(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  try {
    await ensureReady();
    const [user] = await getSql()<{ id: string; password_hash: string }[]>`
      select id, password_hash from users where email = ${email}
    `;
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      loginRedirect("error", "Invalid email or password.");
    }
    await createSession(user.id);
  } catch (error) {
    unstable_rethrow(error);
    loginRedirect("error", "Could not sign in. The database did not respond.");
  }

  redirect("/ballot");
}

export async function signUp(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@") || email.length > 254) {
    loginRedirect("error", "Enter a valid email address.");
  }
  if (password.length < 6 || password.length > 200) {
    loginRedirect("error", "Password must be at least 6 characters.");
  }

  try {
    await ensureReady();
    const passwordHash = await hashPassword(password);
    const [user] = await getSql()<{ id: string }[]>`
      insert into users (email, password_hash)
      values (${email}, ${passwordHash})
      returning id
    `;
    await createSession(user.id);
  } catch (error) {
    unstable_rethrow(error);
    if (isUniqueViolation(error)) {
      loginRedirect("error", "An account with that email already exists.");
    }
    loginRedirect("error", "Could not create the account. The database did not respond.");
  }

  redirect("/ballot");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}

export async function saveBallot(teamIds: number[]) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await saveBallotForUser(user.id, teamIds);
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof BallotError) {
      return { error: error.message };
    }
    return { error: "Could not save the ballot." };
  }

  revalidatePath("/");
  redirect("/");
}
