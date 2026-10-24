create table if not exists public.teams (
  id bigint generated always as identity primary key,
  name text not null unique,
  conference text not null,
  ranking integer not null default 0
);

create table if not exists public.ballots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  updated_at timestamptz not null default now()
);

do $picks$
declare
  id_type text;
begin
  select pg_catalog.format_type(a.atttypid, a.atttypmod)
    into id_type
  from pg_catalog.pg_attribute a
  join pg_catalog.pg_class c on c.oid = a.attrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'teams'
    and a.attname = 'id'
    and a.attnum > 0
    and not a.attisdropped;

  if id_type is null then
    raise exception 'public.teams.id is missing';
  end if;

  execute format($sql$
    create table if not exists public.ballot_picks (
      ballot_id uuid not null references public.ballots (id) on delete cascade,
      team_id %1$s not null references public.teams (id) on delete cascade,
      rank integer not null check (rank >= 1),
      primary key (ballot_id, rank),
      unique (ballot_id, team_id)
    )
  $sql$, id_type);
end
$picks$;

create index if not exists ballot_picks_team_id_idx on public.ballot_picks (team_id);

alter table public.teams enable row level security;
alter table public.ballots enable row level security;
alter table public.ballot_picks enable row level security;

do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'teams'
  loop
    execute format('drop policy %I on public.teams', policy_row.policyname);
  end loop;
end $$;

revoke all on table public.teams from anon, authenticated;
grant select on table public.teams to anon, authenticated;

create policy "Anyone can read teams"
  on public.teams
  for select
  to anon, authenticated
  using (true);

create policy "Users read their ballot"
  on public.ballots
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users read their picks"
  on public.ballot_picks
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ballots
      where ballots.id = ballot_picks.ballot_id
        and ballots.user_id = auth.uid()
    )
  );

grant select on table public.ballots to authenticated;
grant select on table public.ballot_picks to authenticated;

do $outer$
declare
  id_type text;
  signature text;
begin
  select pg_catalog.format_type(a.atttypid, a.atttypmod)
    into id_type
  from pg_catalog.pg_attribute a
  join pg_catalog.pg_class c on c.oid = a.attrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname = 'teams'
    and a.attname = 'id'
    and a.attnum > 0
    and not a.attisdropped;

  if id_type is null then
    raise exception 'public.teams.id is missing';
  end if;

  execute format($fn$
    create or replace function public.save_ballot(team_ids %1$s[])
    returns void
    language plpgsql
    security definer
    set search_path = public
    as $body$
    declare
      uid uuid := auth.uid();
      ballot uuid;
      expected integer;
      provided integer;
    begin
      if uid is null then
        raise exception 'Not authenticated';
      end if;

      select count(*) into expected from public.teams;
      provided := coalesce(array_length(team_ids, 1), 0);

      if provided <> expected then
        raise exception 'Ballot must include every team';
      end if;

      if (
        select count(distinct submitted.team_id)
        from unnest(team_ids) as submitted(team_id)
      ) <> expected then
        raise exception 'Ballot contains duplicate teams';
      end if;

      if exists (
        select 1
        from unnest(team_ids) as submitted(team_id)
        where not exists (
          select 1 from public.teams where teams.id = submitted.team_id
        )
      ) then
        raise exception 'Ballot contains an unknown team';
      end if;

      insert into public.ballots (user_id)
      values (uid)
      on conflict (user_id) do update
        set updated_at = now()
      returning id into ballot;

      delete from public.ballot_picks where ballot_id = ballot;

      insert into public.ballot_picks (ballot_id, team_id, rank)
      select ballot, picked.team_id, picked.ordinality::integer
      from unnest(team_ids) with ordinality as picked(team_id, ordinality);
    end;
    $body$;
  $fn$, id_type);

  select p.oid::regprocedure::text
    into signature
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'save_ballot';

  execute format('revoke all on function %s from public, anon, authenticated', signature);
  execute format('grant execute on function %s to authenticated', signature);
end
$outer$;

create or replace function public.poll_standings()
returns table (
  team_id bigint,
  name text,
  conference text,
  points bigint,
  first_place_votes bigint,
  ballot_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with sized as (
    select count(*)::integer as team_count from public.teams
  ),
  scored as (
    select
      t.id::bigint as team_id,
      t.name,
      t.conference,
      coalesce(sum(sized.team_count - bp.rank + 1), 0)::bigint as points,
      count(bp.rank) filter (where bp.rank = 1)::bigint as first_place_votes
    from public.teams t
    cross join sized
    left join public.ballot_picks bp on bp.team_id = t.id
    group by t.id, t.name, t.conference, sized.team_count
  )
  select
    scored.team_id,
    scored.name,
    scored.conference,
    scored.points,
    scored.first_place_votes,
    (select count(*) from public.ballots)::bigint as ballot_count
  from scored
  order by scored.points desc, scored.first_place_votes desc, scored.name asc;
$$;

revoke all on function public.poll_standings() from public, anon, authenticated;
grant execute on function public.poll_standings() to anon, authenticated;
