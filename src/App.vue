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

#app {
  background-color: #F7F7F7;
  font-family: 'Oswald', sans-serif;
  //display: flex;
  //min-height: 100vh;
  //flex-direction: column;

  .page-content {
    //flex: 1 0 auto;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Anton', sans-serif;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .title {
    text-transform: uppercase;
  }

  .subtitle {
    font-family: 'Oswald';
    text-transform: inherit;
  }

  .title, .subtitle {
    //text-align: center;
  }
}

body, button, input, select, textarea {
  font-family: 'Oswald', sans-serif;
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
