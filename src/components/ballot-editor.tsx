"use client";

import { useMemo, useState, useTransition } from "react";
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
import { saveBallot } from "@/app/actions";
import type { Team } from "@/lib/poll";

export function BallotEditor({ teams, userId }: { teams: Team[]; userId: string }) {
  const [order, setOrder] = useState(teams);
  const [ownerId, setOwnerId] = useState(userId);

  if (ownerId !== userId) {
    setOwnerId(userId);
    setOrder(teams);
  }
  const [query, setQuery] = useState("");
  const [conference, setConference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const conferences = useMemo(
    () => [...new Set(order.map((team) => team.conference))].sort(),
    [order],
  );
  const needle = query.trim().toLowerCase();
  const visible = order.filter((team) => {
    const matchesConference = conference === "" || team.conference === conference;
    const matchesQuery =
      needle === "" ||
      team.name.toLowerCase().includes(needle) ||
      team.conference.toLowerCase().includes(needle);
    return matchesConference && matchesQuery;
  });
  const rankById = new Map(order.map((team, index) => [team.id, index + 1]));

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

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveBallot(order.map((team) => team.id));
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-16 z-10 flex flex-col gap-3 rounded-2xl border border-line bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-muted">
            Find a team
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              className="rounded-lg border border-line bg-field px-3 py-2 text-cream outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Conference
            <select
              value={conference}
              onChange={(event) => setConference(event.target.value)}
              className="rounded-lg border border-line bg-field px-3 py-2 text-cream outline-none focus:border-gold"
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
            className="rounded-lg bg-gold px-4 py-2 font-semibold text-field disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save ballot"}
          </button>
        </div>
        <p className="text-sm text-muted">
          Showing {visible.length} of {order.length}. A filter only hides teams. Drag a row or type a rank to move it. Rank 1 is the best team.
        </p>
        {error ? (
          <p role="alert" className="text-sm text-gold">
            {error}
          </p>
        ) : null}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={visible.map((team) => String(team.id))} strategy={verticalListSortingStrategy}>
          <ol className="flex flex-col gap-2">
            {visible.map((team) => (
              <SortableTeam
                key={team.id}
                team={team}
                rank={rankById.get(team.id) ?? 0}
                teamCount={order.length}
                onMove={moveToRank}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
      {visible.length === 0 ? <p className="text-muted">No teams match that filter.</p> : null}
    </div>
  );
}

function SortableTeam({
  team,
  rank,
  teamCount,
  onMove,
}: {
  team: Team;
  rank: number;
  teamCount: number;
  onMove: (teamId: number, rank: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: String(team.id),
  });
  function commit(nextValue: string) {
    const next = Number(nextValue);
    if (!Number.isInteger(next)) return;
    onMove(team.id, next);
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2"
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded-md px-2 py-2 text-muted hover:text-cream"
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
        className="w-16 rounded-md border border-line bg-field px-2 py-1 text-center font-display text-lg text-gold outline-none focus:border-gold"
      />
      <div className="min-w-0">
        <p className="truncate font-semibold text-cream">{team.name}</p>
        <p className="text-sm text-muted">{team.conference}</p>
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
