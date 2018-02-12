<template>
  <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <nuxt-link to="/" class="navbar-item" @click.native="showNav = false">
        <img src="~/assets/logo.png" alt="Steele Hoops Logo">
      </nuxt-link>
      <div class="navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': showNav }">
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <nuxt-link to="/" class="navbar-item" active-class="is-active" @click.native="showNav = false" exact>Scoreboard</nuxt-link>
        <nuxt-link to="/team-compare" class="navbar-item" active-class="is-active" @click.native="showNav = false" exact>Team Compare</nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      showNav: false
    }
  }
};
</script>

<style scoped lang="scss">
.navbar {
  z-index: 10;
  font-family: 'Dosis', sans-serif;
  font-weight: 700;
  font-style: normal;

  .navbar-burger {
    span {
      background-color: #bdbdbd;
    }
    &:hover {
      background-color: transparent;
    }
    &.is-active span {
      background-color: #bdbdbd;
    }
  }

  .navbar-menu.is-active {
    background-color: #0A2145;
    box-shadow: inset 0px 0px 10px 5px rgba(0,0,0,0.5), 0px 10px 10px 0px rgba(0,0,0,0.3);
  }
}
</style>
