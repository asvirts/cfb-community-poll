import GetAllTeams from "@/components/fetch/getAllTeams";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div>
      <GetAllTeams />
    </div>
  );
}
