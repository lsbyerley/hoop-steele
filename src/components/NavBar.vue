<template>
  <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item" @click.native="showNav = false"><h1>Steele Hoops</h1></router-link>
      <div class="navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': showNav }">
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <router-link to="/scoreboard" class="navbar-item" active-class="is-active" @click.native="showNav = false">Scoreboard</router-link>
        <router-link to="/team-compare" class="navbar-item" active-class="is-active" @click.native="showNav = false">Team Compare</router-link>
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
