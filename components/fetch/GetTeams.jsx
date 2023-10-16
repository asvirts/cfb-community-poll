import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function GetTeams(props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  async function upvote(rank, id) {
    let newRank = rank + 1;

    const { error } = await supabase
      .from("teams")
      .update({ ranking: { newRank } })
      .eq("id", id);
  }

  const { data: teams } = await supabase
    .from("teams")
    .select()
    .eq("conference", `${props.conference}`);

  return (
    <ul className="my-auto text-foreground">
      {teams?.map((team) => (
        <li key={team.id} className="my-1">
          <button className="inline-flex items-center justify-center rounded-md px-4 py-1 text-white bg-slate-500 me-1">
            Down
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md px-4 py-1 text-white bg-slate-500 me-1"
            onClick={(e) => this.upvote({team.ranking}, {team.id})}
          >
            Up
          </button>
          Rank: {team.ranking} | Team: {team.name}
        </li>
      ))}
    </ul>
  );
}
