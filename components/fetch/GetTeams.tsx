import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function GetTeams(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

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
          <button className="inline-flex items-center justify-center rounded-md px-4 py-1 text-white bg-slate-500 me-1">
            Up
          </button>
          Rank: {team.ranking} | Team: {team.name}
        </li>
      ))}
    </ul>
  );
}
