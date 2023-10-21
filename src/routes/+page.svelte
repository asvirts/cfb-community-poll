<script>
    import { supabase } from '$lib/supabaseClient.js';
    import { enhance } from '$app/forms';

    export let data;

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
        <th>Score (Higher is better)</th>
        <th>Vote</th>
        <th>Team</th>
        <th>Conference</th>
      </tr>
    </thead>
    <tbody>
      {#each data.teams as team}
      {#key team.id}
      <tr>
        <th>{team.ranking}</th>
        <td>
          <div class="btn-group">
            <button class="btn btn-active" on:click={() => upvoteTeam(`${team.ranking}`, `${team.id}`)}>Up</button>
            <button class="btn" on:click={() => downvoteTeam(`${team.ranking}`, `${team.id}`)}>Down</button>
          </div>
        </td>
        <td>{team.name}</td>
        <td>{team.conference}</td>
      </tr>
      {/key}
    {/each}
    </tbody>
  </table>
</div>