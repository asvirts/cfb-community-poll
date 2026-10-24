import { defineSeed } from "void/seed";
import { teamSeedRows } from "../src/lib/team-seed";

const CHUNK = 30;

export default defineSeed<typeof import("./schema")>(async ({ db, schema }) => {
  const rows = teamSeedRows();
  for (let index = 0; index < rows.length; index += CHUNK) {
    await db
      .insert(schema.teams)
      .values(rows.slice(index, index + CHUNK))
      .onConflictDoNothing();
  }
});
