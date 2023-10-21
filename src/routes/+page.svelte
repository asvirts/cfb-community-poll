<script>
    export let data;
  </script>

  <ul>
    {#each data.teams as teams}
      <li>{teams.name}</li>
    {/each}
  </ul>