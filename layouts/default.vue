<template>
  <div id="app">
    <NavBar />
      <nuxt/>
    <FootBar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import FootBar from '@/components/FootBar'

export default {
  name: "App",
  components: {
    NavBar,
    FootBar
  },
  head() {
    return {
      titleTemplate: '%s - Steele Hoops'
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/mixins';
@import '~assets/styles/style-vars';

#app {
  background-color: #F7F7F7;
  font-family: 'Dosis', sans-serif;
  font-weight: 400;
  font-style: normal;
  display: flex;
  min-height: 100vh;
  flex-direction: column;

  .page-content {
    flex: 1 0 auto;
  }

  @include mobile() {
    display: block;
    min-height: inherit;

    .page-content {
      flex:none;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Dosis', sans-serif;
    //letter-spacing: 3px;
    text-transform: uppercase;
  }

  .title {
    font-weight: 700;
    font-style: normal;
    text-transform: uppercase;
  }

  .subtitle {
    font-weight: 500;
    font-style: normal;
    text-transform: inherit;
  }

  .title, .subtitle {
    //text-align: center;
  }
}

body, button, input, select, textarea {
  font-family: 'Dosis', sans-serif;
  font-weight: 500;
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
