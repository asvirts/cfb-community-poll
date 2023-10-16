import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SupabaseClientOptions } from "@supabase/supabase-js";

export default async function GetTeams(props) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: teams } = await supabase
    .from("teams")
    .select()
    .eq("conference", `${props.conference}`);

  return (
    <table className="my-auto text-foreground">
      <th>Team</th>
      <th>Vote</th>
      <th>Rank</th>
      {teams?.map((team) => (
        <tr key={team.id} className="my-1">
          <td>{team.name}</td>
          <td>
            <button className="inline-flex items-center justify-center rounded-md px-4 py-1 text-white bg-slate-700 hover:bg-slate-600 me-1">
              Up
            </button>
            <button className="inline-flex items-center justify-center rounded-md px-4 py-1 text-white bg-slate-500 hover:bg-slate-400 me-1">
              Down
            </button>
          </td>
          <td className="text-center">{team.ranking}</td>
        </tr>
      ))}
    </table>
  );
}
