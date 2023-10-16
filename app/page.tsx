import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  return (
    <div className="flex justify-center py-2">
      <h1 className="font-bold text-4xl">Welcome</h1>
    </div>
  );
}
