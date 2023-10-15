import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";

export default async function Downvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let { data, error } = await supabase
    .from("teams")
    .update({ ranking: `${props.ranking}` })
    .eq("id", `${props.id}`)
    .select();

  if (error) console.error(error);
  else console.log(data);

  return (
    <button>
      <ArrowCircleDownRoundedIcon />
    </button>
  );
}
