import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ArrowCircleUpRoundedIcon from "@mui/icons-material/ArrowCircleUpRounded";

export default async function Upvote(props: any) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  let { data, error } = await supabase.rpc("increment", {
    row_id: props.id,
    x: 1
  });

  if (error) console.error(error);
  else console.log(data);

  return (
    <button>
      <ArrowCircleUpRoundedIcon className="me-2" />
    </button>
  );
}
