import { supabase } from "$lib/supabaseClient";

  export async function load() {
    const { data } = await supabase.from("teams").select();
    return {
      teams: data ?? [],
    };
  }

  export async function updateTeam(name: string, id: number) {
    const { data } = await supabase
  .from('teams')
  .update({ name: name })
  .eq(id, 1)
  .select()
  }