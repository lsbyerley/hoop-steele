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
                <option :key="conf" v-for="conf in confs" v-bind:value="conf">{{ conf }}</option>
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
            <!--<div class="form-control">
              <label for="date"><input type="radio" name="sortType" value="date" v-model="sortType">
                Date
              </label>
            </div>-->
            <div class="form-control">
              <label for="date"><input type="radio" name="sortType" value="winPerc" v-model="sortType">
                Win%
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
          <ul class="tabs">
            <li><a class="tab" :class="tabClass('pregames')" href="#" @click="tabClick('pregames', $event)">PreGames ({{ games.length }})</a></li>
            <li><a class="tab" :class="tabClass('halftime')" href="#" @click="tabClick('halftime', $event)">Halftime ({{ htGames.length }})</a></li>
          </ul>

          <h1 class="h5 games-date">{{ gamesDate }}</h1>

          <div class="games-wrap">
            <div class="progress-bar striped animated" v-if="this.dataLoading">
              <span class="progress-bar-blue" style="width: 100%;"></span>
            </div>

            
            <div class="pregames" ref="pregames-section" v-if="this.activeTab === 'pregames'">
              <div class="row">
                <transition name="fade" appear>
                  <div class="col col-sm-12" v-if="showNoPreGames">
                    <div class="alert alert-info align-center">
                      <p>{{ errMsg }}</p>
                    </div>
                  </div>
                </transition>
                <div class="col col-sm-12" v-for="game in sortedGames" :key="game.id">
                  <transition name="fade" appear>
                    <Game :game="game" :sort-type="sortType" />
                  </transition>
                </div>
              </div>
            </div>

            <div class="htgames" ref="halftime-section" v-if="this.activeTab === 'halftime'">
              <div class="row">
                <transition name="fade" appear>
                  <div class="col col-sm-12" v-if="htGames.length === 0">
                    <div class="alert alert-info align-center">
                      <p>There are no games at halftime right now.</p>
                    </div>
                  </div>
                </transition>
                <div class="col col-sm-12 col-md-6" v-for="game in htGames" :key="game.id">
                  <transition name="fade" appear>
                    <HalftimeGame :game="game" :sort-type="sortType" />
                  </transition>
                </div>
              </div>
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
import dayjs from 'dayjs'
import axios from 'axios'
import Game from './components/Game'
import HalftimeGame from './components/HalftimeGame'

export default {
  name: 'App',
  components: {
    Game,
    HalftimeGame
  },
  mounted() {
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let dateParam = params.get('date');
    if (!dateParam) {
      dateParam = dayjs().format('YYYYMMDD')
    }
    this.getData(dateParam)
    // manually tracking page view
    // if/when vue-router is used, remove this
    this.$ga.page('/')
  },
  data() {
    return {
      tabs: ['pregames', 'halftime'],
      activeTab: 'pregames',
      sortType: 'kpDiff',
      sortTypes: ['totalDiff', 'lineDiff', 'shFactor', 'kpDiff', 'date', 'winPerc'],
      showNav: false,
      conf: 'All',
      confs: [],
      games: [],
      htGames: [],
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

        } else if (this.sortType === 'winPerc') {
          aVal = parseFloat(a.prediction.awayWinPerc) > parseFloat(a.prediction.homeWinPerc)
          ? parseFloat(a.prediction.awayWinPerc)
          : parseFloat(a.prediction.homeWinPerc)

          bVal = parseFloat(b.prediction.awayWinPerc) > parseFloat(b.prediction.homeWinPerc)
          ? parseFloat(b.prediction.awayWinPerc)
          : parseFloat(b.prediction.homeWinPerc)

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
    tabClass(tab) {
      return (tab === this.activeTab) ? 'active' : ''
    },
    tabClick(tabType, event) {
      event.preventDefault()
      if (this.activeTab !== tabType) {
        this.activeTab = tabType
        this.$ga.event({
          eventCategory: 'Tab',
          eventAction: 'click',
          eventLabel: tabType
        })
      }
    },
    async getData(date) {
      this.dataLoading = true
      try {
        const host = process.env.API_HOST
        const url = date ? `${host}/api/games/${date}` : `${host}/api/games`
        const res = await axios.get(url)
        this.gamesDate = res.data.date
        this.games = res.data.games
        this.htGames = res.data.htGames
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
    padding: .5rem;
  }
  .games-date {
    font-size: 1rem;
  }
}

.fade-enter{
  opacity: 0;
}
.fade-enter-active{
  transition: opacity 1s;
}
.fade-leave{
  /* opacity: 1; */
}
.fade-leave-active{
  transition: opacity .25s;
  opacity: 0;
}
</style>
