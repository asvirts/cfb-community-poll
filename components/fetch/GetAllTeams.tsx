import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Upvote from "../Upvote";
import Downvote from "../Downvote";

export default async function GetAllTeams(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: teams } = await supabase.from("teams").select();

  const { data: votes } = await supabase
    .from("teams")
    .update({ ranking: `${props.ranking}` })
    .eq("name", `${props.name}`)
    .select();

  return (
    <ul className="my-auto text-foreground">
      {teams?.map((team) => (
        <li key={team.id}>
          <Downvote name={team.name} ranking={team.ranking - 1} />
          <Upvote name={team.name} ranking={team.ranking + 1} />
          {team.name} - {team.ranking}{" "}
        </li>
      ))}
    </ul>
  );
}
