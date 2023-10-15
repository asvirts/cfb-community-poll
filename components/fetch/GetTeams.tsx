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
        <li key={team.id}>{team.name}</li>
      ))}
    </ul>
  );
}