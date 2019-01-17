<template>
  <div id="app-wrapper" :class="{ 'show-nav': showNav }">
    <div id="app-canvas">
      <div id="app-menu">
        <div class="sidebar">
          <div class="exit" @click="showNav = false"></div>
          <h3 class="sidebar-category">Total Games: {{ games.length }}</h3>
          <!--<fieldset>
            <legend>Game Date</legend>

          </fieldset>-->
          <fieldset>
            <legend>Conferences</legend>
              <select name="confs" value="confs" v-model="conf">
                <option v-for="conf in confs" v-bind:value="conf">{{ conf }}</option>
              </select>
          </fieldset>
          <fieldset>
            <legend>Games Sort</legend>
            <div class="form-control">
              <label for="shFactor">
                <input type="radio" name="sortType" value="shFactor" v-model="sortType">
                SHFactor
              </label>
            </div>
            <div class="form-control">
              <label for="totalDiff"><input type="radio" name="sortType" value="totalDiff" v-model="sortType">
                Total Diff
              </label>
            </div>
            <div class="form-control">
              <label for="lineDiff"><input type="radio" name="sortType" value="lineDiff" v-model="sortType">
                Line Diff
              </label>
            </div>
            <div class="form-control">
              <label for="kpDiff"><input type="radio" name="sortType" value="kpDiff" v-model="sortType">
                KenPom Diff
              </label>
            </div>
            <div class="form-control">
              <label for="date"><input type="radio" name="sortType" value="date" v-model="sortType">
                Date
              </label>
            </div>
          </fieldset>
          <p>Want to see anything else here?<br>Maybe a team search?<br>Taking suggestions!</p>
        </div>
      </div>
      <nav class="nav">
        <div class="nav-container">
          <a class="mobile-menu-toggle" @click="showNav = !showNav"></a>
          <div class="nav-logo">
            <a href="/">SteeleHoops</a>
          </div>
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
              </div>
            </div>
            <div class="col col-sm-12" v-for="game in sortedGames" :key="game.id">
              <Game :game="game" :sort-type="sortType" />
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
      sortType: 'kpDiff',
      sortTypes: ['totalDiff', 'lineDiff', 'shFactor', 'kpDiff', 'date'],
      showNav: false,
      conf: 'All',
      confs: [],
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
        let aVal = a[this.sortType]
        let bVal = b[this.sortType]

        if (this.sortType === 'date') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
          if (aVal < bVal) { return -1 }
          if (aVal > bVal) { return 1 }
          return 0;
        }

        if (aVal > bVal) { return -1 }
        if (aVal < bVal) { return 1 }
        return 0;
      })
      .filter((game) => {
        if (this.conf !== 'All') {
          return game.away.kenPom.conf === this.conf || game.home.kenPom.conf === this.conf
        } else {
          return true
        }
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
        this.confs = res.data.confs
        this.dataLoading = false
        if (this.games.length === 0) {
          this.errMsg = 'Either there\'s no games with odds (yet), or no games today'
        }
      } catch(e) {
        this.errMsg = 'There\'s an error in the api, contact the admin'
        this.dataLoading = false
      }
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
