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

        const { data } = await supabase.from('teams').update({ ranking: newRanking }).eq('id', funcId).select()
    }

    // @ts-ignore
    async function downvoteTeam(ranking, id) {
        // @ts-ignore
        let newRanking = Number(ranking) - 1
        let funcId = Number(id)

        const { data } = await supabase.from('teams').update({ ranking: newRanking }).eq('id', funcId).select()
    }
</script>

<div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Rank</th>
        <th>Vote</th>
        <th>Team</th>
        <th>Conference</th>
      </tr>
    </thead>
    <tbody>
      {#each data.teams as team}
      <tr>
        <th>{team.ranking}</th>
        <td>
          <button class="btn btn-primary" on:click={() => upvoteTeam(`${team.ranking}`, `${team.id}`)}>Up</button>
          <button class="btn btn-secondary" on:click={() => downvoteTeam(`${team.ranking}`, `${team.id}`)}>Down</button>
        </td>
        <td>{team.name}</td>
        <td>{team.conference}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>