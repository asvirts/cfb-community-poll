<script>
    import { supabase } from '$lib/supabaseClient.js';
    
    // @ts-ignore
    export let data;
    console.log(data)

    // @ts-ignore
    async function upvoteTeam(ranking, id) {
        // @ts-ignore
        let newRanking = Number(ranking) + 1
        let funcId = Number(id)

        const { data } = await supabase
  .from('teams')
  .update({ ranking: newRanking })
  .eq('id', funcId)
  .select()
    }

    // @ts-ignore
    async function downvoteTeam(ranking, id) {
        // @ts-ignore
        let newRanking = Number(ranking) - 1
        let funcId = Number(id)

        const { data } = await supabase
  .from('teams')
  .update({ ranking: newRanking })
  .eq('id', funcId)
  .select()
    }
</script>

  <ul>
    {#each data.teams as team}
      <li>{team.name} {team.team_name} are in the {team.conference} and their current ranking is {team.ranking} <button on:click={upvoteTeam(`${team.ranking}`, `${team.id}`)}>Up</button> <button on:click={downvoteTeam(`${team.ranking}`, `${team.id}`)}>Down</button></li>
    {/each}
  </ul>