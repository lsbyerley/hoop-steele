<template>
  <!--<div class="footer-wrap">
    <div class="footer">
      <nav class="navbar is-transparent footbar">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item" @click.native="showNav = false">
            <img src="../assets/logo.png" alt="Steele Hoops Logo">
          </router-link>
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
      <p>Copyright &copy; Steele Hoops {{ getYear }}</p>
    </div>
  </div>-->

  <footer class="footer">

    <div class="footer-top">

      <div class="cointaner">
        <div class="columns">

          <div class="column is-half links">
            <ul>
              <li><router-link to="/scoreboard" class="footbar-item" active-class="is-active">Scoreboard</router-link></li>
              <li><router-link to="/team-compare" class="footbar-item" active-class="is-active">Team Compare</router-link></li>
            </ul>
          </div>

          <div class="column is-half logo">
            <router-link to="/" class="footbar-item" @click.native="showNav = false">
              <img src="../assets/logo.png" alt="Steele Hoops Logo">
            </router-link>
          </div>

        </div>
      </div>

    </div>

    <div class="footer-bottom">
      <p>Copyright &copy; Steele Hoops {{ getYear }}</p>
    </div>

  </footer>
</template>

<script>
import moment from 'moment'

export default {
  name: "FootBar",
  computed: {
    getYear() {
      return moment().format('YYYY')
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bulma/sass/utilities/mixins';
@import "../styles/style-vars";

.footer {
  padding: 0;

  .footer-top {
    padding: 1rem .5rem;

    .columns {
      align-items: center;
    }

    .links {
      ul {
        display: flex;
        justify-content: flex-start;
        height: 100%;

        li a {
          padding: 0.5rem 1rem;
          color: #fff;
          font-family: 'Anton', sans-serif;

          &:hover {
            color: $etsu-gold;
          }
        }
      }
    }

    .logo {
      text-align: right;
    }

    @include mobile() {
      .links ul {
        justify-content: center;
      }
      .logo {
        text-align: center;
      }
    }

  }

  .footer-bottom {
    color: #d8d8d8;
    padding: .75rem;
    text-align: center;
  }
}
</style>
