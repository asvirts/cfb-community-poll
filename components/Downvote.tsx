import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ArrowCircleDownRoundedIcon from "@mui/icons-material/ArrowCircleDownRounded";

export default async function Downvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let { data, error } = await supabase.rpc("decrement", {
    row_id: props.id,
    x: 1
  });

  if (error) console.error(error);
  else console.log(data);

  return (
    <button>
      <ArrowCircleDownRoundedIcon />
    </button>
  );
}
