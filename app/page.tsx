import GetAllTeams from "@/components/fetch/GetAllTeams";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div className="flex justify-center">
      <h1 className="font-bold text-4xl">Welcome</h1>
    </div>
  );
}
