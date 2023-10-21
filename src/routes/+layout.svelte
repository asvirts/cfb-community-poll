<script>
    import "../app.css";
</script>
  
<main class="container mx-auto">
    <div class="navbar bg-base-100">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost normal-case text-xl">CFB Community Poll</a>
        </div>
        <div class="flex-none">
          <ul class="menu menu-horizontal px-1">
            <li><a href="/">Home</a></li>
          </ul>
        </div>
      </div>
    <slot />
</main>
