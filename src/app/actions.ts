"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { DIVISION_PROFILES, isDivision, type Division } from "@/lib/division";
import { BallotError, saveBallotForUser } from "@/lib/db";

export async function saveBallot(teamIds: number[], division: Division) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  if (!isDivision(division)) {
    return { error: "Unknown division." };
  }

  const profile = DIVISION_PROFILES[division];

  try {
    await saveBallotForUser(userId, teamIds, division);
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof BallotError) {
      return { error: error.message };
    }
    return { error: "Could not save the ballot." };
  }

  revalidatePath(profile.standingsHref);
  revalidatePath(profile.ballotHref);
  redirect(profile.standingsHref);
}
