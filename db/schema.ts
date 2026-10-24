import { sql } from "void/db";
import { check, integer, sqliteTable, text, unique } from "void/schema-d1";

export const teams = sqliteTable(
  "teams",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
    conference: text("conference").notNull(),
    division: text("division").notNull(),
  },
  (table) => [check("teams_division_check", sql`${table.division} in ('FBS', 'FCS')`)],
);

export const ballots = sqliteTable(
  "ballots",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    division: text("division").notNull(),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    unique("ballots_user_id_division_key").on(table.userId, table.division),
    check("ballots_division_check", sql`${table.division} in ('FBS', 'FCS')`),
  ],
);

export const ballotPicks = sqliteTable(
  "ballot_picks",
  {
    ballotId: integer("ballot_id")
      .notNull()
      .references(() => ballots.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
  },
  (table) => [
    unique("ballot_picks_ballot_rank_key").on(table.ballotId, table.rank),
    unique("ballot_picks_ballot_team_key").on(table.ballotId, table.teamId),
    check("ballot_picks_rank_check", sql`${table.rank} >= 1`),
  ],
);
