import GetSECTeams from "@/components/fetch/GetSECTeams";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div className="flex justify-center">
      <GetSECTeams />
    </div>
  );
}
