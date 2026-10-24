import { defineHandler, type InferProps } from "void";
import { requireAuth } from "void/auth";
import { ValidationError } from "void/handler";

import { ballotBodySchema } from "@/lib/ballot-schema";
import { BallotError, loadOrderedBallot, saveBallotForUser } from "@/lib/db";
import { DIVISION_PROFILES } from "@/lib/division";
import type { Team } from "@/lib/poll";

export type Props = InferProps<typeof loader>;

const division = "FCS" as const;

export const loader = defineHandler(
  async (
    c,
  ): Promise<{
    teams: Team[];
    userId: string;
    hasExistingBallot: boolean;
    error: string | null;
  }> => {
    const user = requireAuth(c);
    try {
      const ballot = await loadOrderedBallot(user.id, division);
      return { ...ballot, userId: user.id, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown database error";
      return { teams: [], userId: user.id, hasExistingBallot: false, error: message };
    }
  },
);

export const action = defineHandler.withValidator({
  body: ballotBodySchema,
})(async (c, { body }) => {
  const user = requireAuth(c);
  try {
    await saveBallotForUser(user.id, body.teamIds, division);
  } catch (error) {
    if (error instanceof BallotError) {
      throw new ValidationError({ teamIds: error.message });
    }
    throw error;
  }
  return c.redirect(DIVISION_PROFILES[division].standingsHref);
});
