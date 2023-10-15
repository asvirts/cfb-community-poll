import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";

export default async function Downvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: teams } = await supabase
    .from("teams")
    .update({ ranking: `${props.ranking}` })
    .eq("name", `${props.name}`)
    .select();

  return (
    <button>
      <ArrowCircleDownRoundedIcon />
    </button>
  );
}
