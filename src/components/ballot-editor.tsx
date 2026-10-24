import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { action } from "@void/react";
import { useMemo, useState } from "react";

import {
  ApComparisonBadge,
  ConferenceBadge,
  RankTierPill,
  TeamCrest,
} from "@/components/team-visuals";
import { DIVISION_PROFILES, type Division } from "@/lib/division";
import { startingOrder, type Team } from "@/lib/poll";
import { getTeamStyle } from "@/lib/team-meta";

type TierSlice = "all" | "top25" | "26-50" | "51-100" | "101-end";

function messageFromAction(error: { body: unknown }) {
  const body = error.body;
  if (
    body &&
    typeof body === "object" &&
    "errors" in body &&
    body.errors &&
    typeof body.errors === "object"
  ) {
    const messages = Object.values(body.errors as Record<string, unknown>).filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
    if (messages.length > 0) return messages.join(". ");
  }
  return "Could not save the ballot.";
}

export function BallotEditor({
  teams,
  userId,
  division,
  hasExistingBallot = false,
}: {
  teams: Team[];
  userId: string;
  division: Division;
  hasExistingBallot?: boolean;
}) {
  const profile = DIVISION_PROFILES[division];
  const [order, setOrder] = useState(teams);
  const [ownerId, setOwnerId] = useState(userId);

  if (ownerId !== userId) {
    setOwnerId(userId);
    setOrder(teams);
  }
  const [query, setQuery] = useState("");
  const [conference, setConference] = useState("");
  const [tierSlice, setTierSlice] = useState<TierSlice>("all");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const conferences = useMemo(
    () => [...new Set(order.map((team) => team.conference))].sort(),
    [order],
  );

  const rankById = useMemo(
    () => new Map(order.map((team, index) => [team.id, index + 1])),
    [order],
  );

  const isDirty = useMemo(() => {
    if (order.length !== teams.length) return true;
    for (let i = 0; i < order.length; i++) {
      if (order[i].id !== teams[i].id) return true;
    }
    return false;
  }, [order, teams]);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    return order.filter((team) => {
      const rank = rankById.get(team.id) ?? 999;
      if (tierSlice === "top25" && rank > 25) return false;
      if (tierSlice === "26-50" && (rank < 26 || rank > 50)) return false;
      if (tierSlice === "51-100" && (rank < 51 || rank > 100)) return false;
      if (tierSlice === "101-end" && rank < 101) return false;

      const matchesConference = conference === "" || team.conference === conference;
      if (!matchesConference) return false;

      if (needle !== "") {
        const style = getTeamStyle(team.name);
        const matchesQuery =
          team.name.toLowerCase().includes(needle) ||
          team.conference.toLowerCase().includes(needle) ||
          style.mascot.toLowerCase().includes(needle) ||
          style.abbrev.toLowerCase().includes(needle);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [order, rankById, tierSlice, conference, needle]);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const visibleIds = new Set(visible.map((team) => team.id));
    setOrder((full) => {
      const shown = full.filter((team) => visibleIds.has(team.id));
      const oldIndex = shown.findIndex((team) => String(team.id) === String(active.id));
      const newIndex = shown.findIndex((team) => String(team.id) === String(over.id));
      if (oldIndex < 0 || newIndex < 0) return full;

      const nextShown = arrayMove(shown, oldIndex, newIndex);
      let cursor = 0;
      return full.map((team) => (visibleIds.has(team.id) ? nextShown[cursor++] : team));
    });
  }

  function moveToRank(teamId: number, rank: number) {
    setOrder((full) => {
      const current = full.findIndex((team) => team.id === teamId);
      if (current < 0) return full;
      const next = full.slice();
      const [team] = next.splice(current, 1);
      const target = Math.min(Math.max(rank, 1), next.length + 1) - 1;
      next.splice(target, 0, team);
      return next;
    });
  }

  function resetToApBaseline() {
    setOrder((full) => startingOrder(full, profile.seed));
  }

  function revertChanges() {
    setOrder(teams);
  }

  async function onSave() {
    setError(null);
    setPending(true);
    try {
      const teamIds = order.map((team) => team.id);
      const result =
        division === "FBS"
          ? await action("/ballot", { data: { teamIds } })
          : await action("/ballot/fcs", { data: { teamIds } });
      if (!result.ok) setError(messageFromAction(result.error));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the ballot.");
    } finally {
      setPending(false);
    }
  }

  const topPick = order[0];

  return (
    <div className="flex flex-col gap-5">
      {/* Ballot Status & Quick Summary Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
          <div>
            <p className="font-display text-xs font-semibold tracking-wider text-muted uppercase">
              Your #1 Pick ({order.length} Pts)
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-gold uppercase">
              {topPick?.name ?? "—"}
            </p>
          </div>
          {topPick ? <TeamCrest name={topPick.name} size="sm" /> : null}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3">
          <div>
            <p className="font-display text-xs font-semibold tracking-wider text-muted uppercase">
              Ballot State
            </p>
            <p className="mt-0.5 text-sm font-semibold text-cream">
              {isDirty
                ? "Unsaved ranking adjustments"
                : hasExistingBallot
                  ? "Saved to public poll"
                  : profile.savedSeed}
            </p>
          </div>
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isDirty
                ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                : "bg-emerald-400 shadow-[0_0_8px_#34d399]"
            }`}
          />
        </div>

        <div className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-card px-4 py-3">
          <div>
            <p className="font-display text-xs font-semibold tracking-wider text-muted uppercase">
              Quick Presets
            </p>
            <p className="mt-0.5 text-xs text-muted">Re-seed or undo edits</p>
          </div>
          <div className="flex items-center gap-1.5">
            {isDirty ? (
              <button
                type="button"
                onClick={revertChanges}
                className="rounded-lg border border-line bg-field px-2.5 py-1.5 font-display text-xs font-semibold tracking-wider text-cream uppercase transition hover:border-gold"
              >
                Undo
              </button>
            ) : null}
            <button
              type="button"
              onClick={resetToApBaseline}
              className="rounded-lg border border-line bg-field px-2.5 py-1.5 font-display text-xs font-semibold tracking-wider text-muted uppercase transition hover:border-gold hover:text-cream"
            >
              {profile.seedButton}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Command Deck */}
      <div className="sticky top-20 z-20 flex flex-col gap-3 rounded-2xl border border-line-bright bg-card/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-semibold tracking-wider text-muted uppercase">
            Find a team
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              className="rounded-xl border border-line bg-field px-3.5 py-2 text-sm font-normal text-cream normal-case transition outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold tracking-wider text-muted uppercase">
            Conference
            <select
              value={conference}
              onChange={(event) => setConference(event.target.value)}
              className="rounded-xl border border-line bg-field px-3.5 py-2 text-sm font-normal text-cream normal-case transition outline-none focus:border-gold"
            >
              <option value="">All conferences</option>
              {conferences.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onSave}
            disabled={pending}
            className="rounded-xl bg-gold px-5 py-2 font-display text-base font-bold tracking-wider text-field uppercase shadow-md transition hover:bg-gold-bright disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save ballot"}
          </button>
        </div>

        {/* Tier Range Slice Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: `All ${order.length}` },
                { id: "top25", label: "Top 25" },
                { id: "26-50", label: "#26–50" },
                { id: "51-100", label: "#51–100" },
                { id: "101-end", label: `#101–${order.length}` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTierSlice(tab.id)}
                className={`rounded-lg px-2.5 py-1 font-display text-xs font-semibold tracking-wider uppercase transition ${
                  tierSlice === tab.id
                    ? "bg-gold text-field"
                    : "bg-field/70 text-muted hover:text-cream"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted">
            Showing {visible.length} of {order.length}. A filter only hides teams. Drag a row or
            type a rank to move it. Rank 1 is the best team.
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-medium text-gold"
          >
            {error}
          </p>
        ) : null}
      </div>

      {/* Sortable Ballot List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={visible.map((team) => String(team.id))}
          strategy={verticalListSortingStrategy}
        >
          <ol className="flex flex-col gap-2">
            {visible.map((team) => (
              <SortableTeam
                key={team.id}
                team={team}
                rank={rankById.get(team.id) ?? 0}
                teamCount={order.length}
                division={division}
                onMove={moveToRank}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-card py-10 text-center">
          <p className="text-muted">No teams match that filter.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setConference("");
              setTierSlice("all");
            }}
            className="rounded-lg border border-gold/40 bg-gold/15 px-3 py-1 font-display text-xs font-bold tracking-wider text-gold uppercase"
          >
            Show All Teams
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SortableTeam({
  team,
  rank,
  teamCount,
  division,
  onMove,
}: {
  team: Team;
  rank: number;
  teamCount: number;
  division: Division;
  onMove: (teamId: number, rank: number) => void;
}) {
  const profile = DIVISION_PROFILES[division];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(team.id),
  });

  function commit(nextValue: string) {
    const next = Number(nextValue);
    if (!Number.isInteger(next)) return;
    onMove(team.id, next);
  }

  const style = getTeamStyle(team.name);
  const pointsValue = Math.max(1, teamCount - rank + 1);

  const rowBorder = isDragging
    ? "border-gold bg-card-hover shadow-2xl ring-2 ring-gold/40 z-20"
    : rank <= profile.byeRank
      ? "border-gold/35 bg-card hover:border-gold/60"
      : rank <= profile.playoffRank
        ? "border-emerald-400/25 bg-card hover:border-emerald-400/50"
        : rank <= 25
          ? "border-sky-400/20 bg-card hover:border-sky-400/40"
          : "border-line bg-card hover:border-line-bright";

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors ${rowBorder}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          className="cursor-grab touch-none rounded-lg border border-transparent p-2 text-muted transition hover:border-line hover:bg-field hover:text-cream active:cursor-grabbing"
          aria-label={`Drag to reorder ${team.name}`}
          {...attributes}
          {...listeners}
        >
          <GripIcon />
        </button>

        <label className="sr-only" htmlFor={`rank-${team.id}`}>
          Rank for {team.name}
        </label>
        <input
          key={rank}
          id={`rank-${team.id}`}
          type="number"
          min={1}
          max={teamCount}
          inputMode="numeric"
          defaultValue={rank}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit(event.currentTarget.value);
            }
          }}
          className="w-16 shrink-0 rounded-lg border border-line bg-field px-2 py-1.5 text-center font-display text-xl font-bold text-gold tabular-nums transition outline-none focus:border-gold"
        />

        <TeamCrest name={team.name} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-cream">{team.name}</p>
            <RankTierPill
              rank={rank}
              byeRank={profile.byeRank}
              playoffRank={profile.playoffRank}
              byeLabel={profile.tierBye}
              fieldLabel={profile.tierField}
            />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="hidden sm:inline">{style.mascot}</span>
            <span className="hidden text-line-bright sm:inline">•</span>
            <span>{team.conference}</span>
          </div>
        </div>
      </div>

      {/* Right side metadata + quick nudge buttons */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 md:flex">
          <ConferenceBadge conference={team.conference} />
          <ApComparisonBadge
            teamName={team.name}
            communityRank={rank}
            hasBallots={true}
            pollShort={profile.pollShort}
            pollTitle={profile.pollTitle}
            seed={profile.seed}
          />
        </div>

        <span className="hidden w-16 text-right font-mono text-xs text-muted tabular-nums sm:inline-block">
          {pointsValue} {pointsValue === 1 ? "pt" : "pts"}
        </span>

        <div className="flex items-center gap-1 rounded-lg border border-line bg-field p-0.5">
          <button
            type="button"
            disabled={rank <= 1}
            onClick={() => onMove(team.id, rank - 1)}
            title={`Move ${team.name} up one spot`}
            aria-label={`Move ${team.name} up`}
            className="rounded px-1.5 py-1 font-mono text-xs text-muted transition hover:bg-card hover:text-cream disabled:opacity-30"
          >
            ▲
          </button>
          <button
            type="button"
            disabled={rank >= teamCount}
            onClick={() => onMove(team.id, rank + 1)}
            title={`Move ${team.name} down one spot`}
            aria-label={`Move ${team.name} down`}
            className="rounded px-1.5 py-1 font-mono text-xs text-muted transition hover:bg-card hover:text-cream disabled:opacity-30"
          >
            ▼
          </button>
        </div>
      </div>
    </li>
  );
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
      <circle cx="5" cy="3" r="1.2" />
      <circle cx="11" cy="3" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="13" r="1.2" />
      <circle cx="11" cy="13" r="1.2" />
    </svg>
  );
}
