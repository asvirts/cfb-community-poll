import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Upvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("teams")
    .update({ ranking: "1" }).
    .eq("name", `${props.name}`)
    .select();

  return <div>up</div>;
}
