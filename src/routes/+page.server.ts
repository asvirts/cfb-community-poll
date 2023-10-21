import { supabase } from "$lib/supabaseClient";

  export async function load() {
    const { data } = await supabase.from("teams").select().order('ranking', { ascending: false });
    return {
      teams: data ?? [],
    };
  }