<template>
  <div id="app-wrapper" :class="{ 'show-nav': showNav }">
    <div id="app-canvas">
      <div id="app-menu">
        <div class="sidebar">
          <div class="exit" @click="showNav = false"></div>
          <h3 class="sidebar-category">Total Games: {{ games.length }}</h3>

          <fieldset>
            <legend>Games Sort</legend>
            <div class="form-control">
              <label><input type="radio" name="sortType" value="shFactor" v-model="sortType">SHFactor</label>
            </div>
            <div class="form-control">
              <label><input type="radio" name="sortType" value="totalDiff" v-model="sortType">Total Diff</label>
            </div>
            <div class="form-control">
              <label><input type="radio" name="sortType" value="spreadDiff" v-model="sortType">Spread Diff</label>
            </div>
          </fieldset>

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
            <div class="col col-sm-12" v-for="game in sortedGames" :key="game.id">
              <Game :game="game" />
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
                <p>All stats used on this page were retrieved from public pages.</p>
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
      sortType: 'shFactor',
      sortTypes: ['totalDiff', 'spreadDiff', 'shFactor'],
      showNav: false,
      games: [],
      inpostGames: [],
      nonMatches: [],
      gamesDate: '',
      dataLoading: true,
      errMsg: 'There was an error, sorry pal'
    };
  },
  computed: {
    sortedGames() {
      return this.games.sort((a, b) => {
        var aVal = a[this.sortType]
        var bVal = b[this.sortType]
        if (aVal > bVal) {
          return -1;
        }
        if (aVal < bVal) {
          return 1;
        }
        return 0;
      })
    },
    showNoPreGames() {
      return (!this.dataLoading && this.games.length === 0)
    },
    showNoInPostGames() {
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
        this.games = res.data.games
        this.inpostGames = res.data.inpostGames
        this.nonMatches = res.data.nonMatches
        this.dataLoading = false
        if (this.games.length === 0) {
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
