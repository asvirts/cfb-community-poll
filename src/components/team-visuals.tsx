import { AP_TOP_25 } from "@/lib/poll";
import { getConferenceMeta, getTeamStyle } from "@/lib/team-meta";

const AP_RANK_MAP = new Map<string, number>(
  AP_TOP_25.map((name, index) => [name, index + 1]),
);

export function getApRank(teamName: string): number | null {
  return AP_RANK_MAP.get(teamName) ?? null;
}

export function TeamCrest({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const style = getTeamStyle(name);
  const dimensions =
    size === "sm"
      ? "h-8 w-10 text-[10px]"
      : size === "lg"
        ? "h-12 w-14 text-xs"
        : "h-9 w-11 text-[11px]";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/15 font-display font-bold tracking-wider uppercase shadow-inner select-none ${dimensions}`}
      style={{
        backgroundColor: style.primary,
        color: "#ffffff",
      }}
      aria-hidden="true"
    >
      {/* Helmet center stripe */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: style.secondary }}
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-black/35"
      />
      <span
        className="relative z-10 pl-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
      >
        {style.abbrev}
      </span>
    </div>
  );
}

export function ConferenceBadge({ conference }: { conference: string }) {
  const meta = getConferenceMeta(conference);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-display text-xs font-semibold tracking-wider uppercase"
      style={{
        backgroundColor: meta.bg,
        borderColor: meta.border,
        color: meta.accent,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.accent }}
      />
      {conference}
    </span>
  );
}

export function ApComparisonBadge({
  teamName,
  communityRank,
  hasBallots = true,
}: {
  teamName: string;
  communityRank: number;
  hasBallots?: boolean;
}) {
  const apRank = getApRank(teamName);

  if (!hasBallots) {
    if (apRank !== null) {
      return (
        <span className="inline-flex items-center gap-1 rounded border border-gold/35 bg-gold/10 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gold">
          AP #{apRank}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded border border-line/70 bg-field/60 px-1.5 py-0.5 font-mono text-[11px] text-muted">
        NR
      </span>
    );
  }

  if (apRank === null) {
    if (communityRank <= 25) {
      return (
        <span
          title="Unranked in Oct. 18 AP Poll"
          className="inline-flex items-center gap-1 rounded border border-emerald-400/35 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[11px] font-medium text-emerald-300"
        >
          ★ NR in AP
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded border border-line/60 bg-field/40 px-1.5 py-0.5 font-mono text-[11px] text-muted/75">
        AP NR
      </span>
    );
  }

  const delta = apRank - communityRank;
  if (delta === 0) {
    return (
      <span
        title={`Matches AP #${apRank}`}
        className="inline-flex items-center gap-1 rounded border border-line bg-field/70 px-1.5 py-0.5 font-mono text-[11px] text-muted"
      >
        = AP #{apRank}
      </span>
    );
  }

  if (delta > 0) {
    return (
      <span
        title={`Ranked ${delta} spots higher than AP #${apRank}`}
        className="inline-flex items-center gap-1 rounded border border-emerald-400/35 bg-emerald-500/12 px-1.5 py-0.5 font-mono text-[11px] font-medium text-emerald-300"
      >
        ▲{delta} <span className="text-emerald-200/70">AP #{apRank}</span>
      </span>
    );
  }

  return (
    <span
      title={`Ranked ${Math.abs(delta)} spots lower than AP #${apRank}`}
      className="inline-flex items-center gap-1 rounded border border-amber-400/35 bg-amber-500/12 px-1.5 py-0.5 font-mono text-[11px] font-medium text-amber-300"
    >
      ▼{Math.abs(delta)} <span className="text-amber-200/70">AP #{apRank}</span>
    </span>
  );
}

export function RankTierPill({ rank }: { rank: number }) {
  if (rank <= 4) {
    return (
      <span className="inline-flex items-center rounded bg-gold/20 px-1.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-gold uppercase ring-1 ring-gold/40">
        CFP Bye
      </span>
    );
  }
  if (rank <= 12) {
    return (
      <span className="inline-flex items-center rounded bg-emerald-500/15 px-1.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-emerald-300 uppercase ring-1 ring-emerald-400/35">
        CFP Top 12
      </span>
    );
  }
  if (rank <= 25) {
    return (
      <span className="inline-flex items-center rounded bg-sky-500/15 px-1.5 py-0.5 font-display text-[10px] font-bold tracking-widest text-sky-300 uppercase ring-1 ring-sky-400/30">
        Top 25
      </span>
    );
  }
  return null;
}
