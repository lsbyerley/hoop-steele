<template>
  <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <!-- navbar items, navbar burger... -->
      <router-link to="/" class="navbar-item"><h1>Hoop Steele</h1></router-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <router-link to="/scoreboard" class="navbar-item" active-class="is-active">Scoreboard</router-link>
        <router-link to="/team-compare" class="navbar-item" active-class="is-active">Team Compare</router-link>
      </div>
    </div>
  </nav>
</template>

<script>

</script>

<style scoped lang="scss">
.navbar {

}
</style>
