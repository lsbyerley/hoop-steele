<template>

  <footer class="footer">

    <div class="footer-top">

      <div class="cointaner">
        <div class="columns">

          <div class="column is-half links">
            <ul>
              <li><nuxt-link to="/" class="footbar-item" active-class="is-active">Scoreboard</nuxt-link></li>
              <li><nuxt-link to="/team-compare" class="footbar-item" active-class="is-active">Team Compare</nuxt-link></li>
            </ul>
          </div>

          <div class="column is-half logo">
            <nuxt-link to="/" class="footbar-item" @click.native="showNav = false">
              <img src="~/assets/logo.png" alt="Steele Hoops Logo">
            </nuxt-link>
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
@import '~assets/styles/style-vars';

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
          font-family: 'Dosis', sans-serif;
          font-weight: 700;
          font-style: normal;

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
