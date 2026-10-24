"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { BallotError, saveBallotForUser } from "@/lib/db";

export async function saveBallot(teamIds: number[]) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  try {
    await saveBallotForUser(userId, teamIds);
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
