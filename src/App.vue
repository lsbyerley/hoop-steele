<template>
  <div id="app-wrapper" :class="{ 'show-nav': showNav }">
    <div id="app-canvas">
      <div id="app-menu">
        <div class="sidebar">
          <div class="exit" @click="showNav = false"></div>
          <h3 class="sidebar-category">Total Games: {{ preGames.length }}</h3>
          <p>Want to see anything else here?<br>Maybe a team search?<br>Taking suggestions!</p>
        </div>
      </div>
      <nav class="nav">
        <div class="nav-container">
          <div class="nav-logo">
            <a href="/">SteeleHoops</a>
          </div>
          <a class="mobile-menu-toggle" @click="showNav = !showNav"></a>
        </div>
      </nav>
      <main class="main">
        <div class="section">
          <h1 class="h5 games-date">{{ gamesDate }}</h1>
          <div class="progress-bar striped animated" v-if="this.dataLoading">
            <span class="progress-bar-blue" style="width: 100%;"></span>
          </div>
          <div class="row">
            <div class="col col-sm-12" v-if="showNoPreGames">
              <div class="alert alert-info align-center">
                <p>{{ errMsg }}</p>
                <!--<button class="button-primary" @click="handleReload">Try Again?</button>-->
              </div>
            </div>
            <div class="col col-sm-12" v-for="game in preGames">
              <Game :key="game.id" :game="game" />
            </div>
          </div>
        </div>
      </main>
      <footer class="footer">
        <div class="container">
          <div class="row">
            <div class="col col-sm-12">
              <div class="footer-text">
                <p>Degenerates rejoice</p>
                <p>All stats and formulas used on this page were retrieved from public pages.</p>
              </div>
            </div>
          </div>
        </div>
        <p class="copy align-center">SteeleHoops - Beat. The. Bookie.</p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Game from './components/Game'

export default {
  name: 'App',
  components: {
    Game
  },
  mounted() {
    this.getData()
    // manually tracking page view
    // if/when vue-router is used, remove this
    this.$ga.page('/')
  },
  data() {
    return {
      showNav: false,
      preGames: [],
      inpostGames: [],
      nonMatches: [],
      gamesDate: '',
      dataLoading: true,
      errMsg: 'There was an error, contact your boy'
    };
  },
  computed: {
    showNoPreGames() {
      return (!this.dataLoading && this.preGames.length === 0)
    },
    showNoinpostGames() {
      return (!this.dataLoading && this.inpostGames.length === 0)
    }
  },
  methods: {
    async getData() {
      this.dataLoading = true
      try {
        const host = process.env.API_HOST
        const res = await axios.get(`${host}/api/games`)
        this.gamesDate = res.data.date
        this.preGames = res.data.preGames
        this.inpostGames = res.data.inpostGames
        this.nonMatches = res.data.nonMatches
        this.dataLoading = false
        if (this.preGames.length === 0) {
          this.errMsg = 'Either there\'s no games with odds (yet), or no games today'
        }
      } catch(e) {
        this.errMsg = 'There\'s an error in the api, contact the admin'
        this.dataLoading = false
      }
    },
    handleReload() {
      console.log('reloading!')
      this.getData()
    }
  }
};
</script>

<style lang="scss">
@import './assets/styles/app.scss';

.games-date {
  text-align: center;
}

@media (max-width: $game-breakpoint) {
  .section {
    padding: 1rem;
  }
  .games-date {
    font-size: 1rem;
  }
}
</style>
