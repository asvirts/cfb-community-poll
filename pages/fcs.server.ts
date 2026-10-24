import { defineHandler, type InferProps } from "void";

import { pollStandings } from "@/lib/db";
import type { Standing } from "@/lib/poll";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(
  async (): Promise<{ standings: Standing[]; error: string | null }> => {
    try {
      return { standings: await pollStandings("FCS"), error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown database error";
      return { standings: [], error: message };
    }
  },
);
