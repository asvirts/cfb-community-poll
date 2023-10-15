import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";

export default async function Upvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: teams } = await supabase
    .from("teams")
    .update({ ranking: `${props.ranking}` })
    .eq("name", `${props.name}`)
    .select();

  return (
    <button>
      <ArrowCircleUpRoundedIcon />
    </button>
  );
}
