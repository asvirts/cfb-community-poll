import GetTeams from "@/components/fetch/GetTeams";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div className="flex justify-center">
      <GetTeams conference="ACC" />
    </div>
  );
}
