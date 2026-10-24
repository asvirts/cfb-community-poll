# CFB Community Poll

Each signed-in fan ranks every FBS team. The public poll adds those ballots with a Borda count: first place receives one point per team, and last place receives 1.

## Run locally

1. Start the local database with `npx supabase start`.
2. Copy the API URL and anon key into `.env.local`. See `.env.example`.
3. Run `npm run dev`.

`supabase/seed.sql` loads the 2026 FBS list only when `teams` is empty. A database that already has teams is left as it is. The original hosted project hostname no longer resolves, so local Supabase is the database this app runs against out of the box. Email confirmation is off in the local auth config.
