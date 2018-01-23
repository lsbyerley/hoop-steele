<template>
  <div id="app">
    <NavBar />
    <router-view></router-view>
    <FootBar />
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import FootBar from './components/FootBar'

export default {
  name: "App",
  components: {
    NavBar,
    FootBar
  },
  created() {
    this.$store.dispatch("getTeamRatings");
    this.$store.dispatch("getGames");
  }
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Site custom variables
@import "./styles/style-vars";

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

body, html, #app {
  //height: 100%;
}
#app {
  background-color: #F7F7F7;
  font-family: 'Ubuntu Condensed', sans-serif;
  display: flex;
  flex-direction: column;

  .page-content {
    flex: 1 0 auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Ubuntu', sans-serif;
  }

  .title, .subtitle {
    //text-align: center;
  }
}

body, button, input, select, textarea {
  font-family: 'Ubuntu Condensed', sans-serif;
}

.navbar {
  background-color: darken($etsu-blue, 5%);
}

.hero {
  background-color: $etsu-blue;

  .hero-body {

    .title, .subtitle {
      color: #fff;
    }
  }
}

.footer {
  background-color: $etsu-blue;
}
.footer-bottom {
  background-color: darken($etsu-blue, 5%);

}
</style>
