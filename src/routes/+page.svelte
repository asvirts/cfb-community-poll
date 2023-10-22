<script>
    import { supabase } from '$lib/supabaseClient.js';
    import GoArrowUp from 'svelte-icons/go/GoArrowUp.svelte'
    import GoArrowDown from 'svelte-icons/go/GoArrowDown.svelte'
    
    // @ts-ignore
    export let data;
    console.log(data)

    // @ts-ignore
    async function upvoteTeam(ranking, id) {
        // @ts-ignore
        let newRanking = Number(ranking) + 1
        let funcId = Number(id)

        let { data } = await supabase.from('teams').update({ ranking: newRanking }).eq('id', funcId).select()

        location.reload()
    }

    // @ts-ignore
    async function downvoteTeam(ranking, id) {
        // @ts-ignore
        let newRanking = Number(ranking) - 1
        let funcId = Number(id)

        let { data } = await supabase.from('teams').update({ ranking: newRanking }).eq('id', funcId).select()

        location.reload()
    }
</script>

<div class="overflow-x-auto mx-auto block">
  <table class="table table-zebra">
    <!-- head -->
    <thead>
      <tr>
        <th class="w-1/6 text-sm">Score (higher = better)</th>
        <th class="w-1/4 text-sm">Vote</th>
        <th class="w-1/4 text-sm">Team</th>
        <th class="w-1/4 text-sm">Conference</th>
      </tr>
    </thead>
    <tbody>
      {#each data.teams as team}
      <tr>
        <th class="w-1/6 text-xl">{team.ranking}</th>
        <td class="w-1/4">
          <button class="btn btn-primary" on:click={() => upvoteTeam(`${team.ranking}`, `${team.id}`)}>
            <GoArrowUp class="icon" />
          </button>
          <button class="btn btn-outline btn-primary" on:click={() => downvoteTeam(`${team.ranking}`, `${team.id}`)}>
            <GoArrowDown class="icon" />
          </button>
        </td>
        <td class="w-1/4 text-lg">{team.name}</td>
        <td class="w-1/4 text-lg">{team.conference}</td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>