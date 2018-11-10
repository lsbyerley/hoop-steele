<template>
  <div>
    <nav class="nav">
      <div class="nav-container">
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
          <div class="col col-sm-12" v-if="showNoGames">
            <div class="alert alert-info align-center">
              <p><strong>No Games!</strong> Either there's no games today or no games with odds (yet)</p>
              <button class="button-primary" @click="handleReload">Try Again?</button>
            </div>
          </div>
          <div class="col col-sm-12" v-for="game in games">
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
            </div>
          </div>
        </div>
      </div>
      <p class="copy align-center">SteeleHoops - Beat. The. Odds.</p>
    </footer>
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
  },
  data() {
    return {
      games: [],
      gamesDate: '',
      dataLoading: true,
    };
  },
  computed: {
    showNoGames() {
      if (!this.dataLoading && this.games.length === 0) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async getData() {
      this.dataLoading = true
      const host = process.env.API_HOST
      const res = await axios.get(`${host}/api/games`)
      this.gamesDate = res.data.date
      this.games = res.data.games
      this.dataLoading = false
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
