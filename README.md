# CFB Community Poll

Each signed-in fan ranks every FBS team, and can rank every FCS team on a separate board. Each poll adds its own ballots with a Borda count: first place receives one point per team in that subdivision, and last place receives 1.

Authentication is handled by [Clerk](https://clerk.com).

## Run locally

1. Create a Neon database and copy its pooled connection string.
2. Put `DATABASE_URL` (plus your Clerk `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` when ready) in `.env.local`. See `.env.example`.
3. Run `npm run dev`.

The first connection creates the tables and loads the 2026 FBS and FCS lists. Later connections add any missing programs.
