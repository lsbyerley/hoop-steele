<template>
  <div class="footer-wrap">
    <div class="footer">
      <nav class="navbar is-transparent footbar">
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
    </div>
    <div class="footer-bottom">
      <p>Copyright &copy; Hoop Steele</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FootBar"
}
</script>

<style scoped lang="scss">
.footer-wrap {

  .footer {
    padding: 1.5rem 1rem;

    .footbar {
      background-color: transparent;
    }
  }

  .footer-bottom {
    color: #d8d8d8;
    padding: .75rem;
    text-align: center;
  }
}
</style>
