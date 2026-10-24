# CFB Community Poll

Each signed-in fan ranks every FBS team. The public poll adds those ballots with a Borda count: first place receives one point per team, and last place receives 1.

Accounts are email and password rows in the same Neon database as the ballots. Creating an account signs you in immediately.

## Run locally

1. Create a Neon database and copy its pooled connection string.
2. Put it in `.env.local` as `DATABASE_URL`. See `.env.example`.
3. Run `npm run dev`.

The first connection creates the tables and loads the 2026 FBS list when `teams` is empty.
