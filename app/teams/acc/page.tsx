import GetACCTeams from "@/components/fetch/GetACCTeams";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div className="flex justify-center">
      <GetACCTeams />
    </div>
  );
}
