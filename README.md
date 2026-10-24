# CFB Community Poll

Each signed-in fan ranks every FBS team, and can rank every FCS team on a separate board. Each poll adds its own ballots with a Borda count: first place receives one point per team in that subdivision, and last place receives 1.

The app runs on [Void](https://void.cloud) with Vite+. Authentication is email and password. Teams and ballots live in D1.

## Run locally

```bash
npm install
npm run dev
```

The dev server is at `http://localhost:5173`. The first request loads the 2026 FBS and FCS lists into the local database. Later requests add any missing programs.

`npm run check` formats, lints, and typechecks. `npm test` runs the ranking tests. `npm run deploy` publishes to Cloudflare after you connect an account with `npx void connect`.
