"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function loginRedirect(kind: "error" | "message", text: string): never {
  redirect(`/login?${kind}=${encodeURIComponent(text)}`);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginRedirect("error", error.message);
  }

  redirect("/ballot");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin ? { emailRedirectTo: `${origin}/auth/callback` } : undefined,
  });

  if (error) {
    loginRedirect("error", error.message);
  }

  if (!data.session) {
    loginRedirect(
      "message",
      "Check your email to confirm your account, then sign in.",
    );
  }

  redirect("/ballot");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveBallot(teamIds: number[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("save_ballot", { team_ids: teamIds });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  redirect("/");
}
