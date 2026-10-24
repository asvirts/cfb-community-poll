import { z } from "zod";

export const ballotBodySchema = z.object({
  teamIds: z.array(z.number().int()),
});
