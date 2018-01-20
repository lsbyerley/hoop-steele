<template>

  <section class="page-content">

    <div class="scoreboard">

      <!--<b-loading :active.sync="allDataLoaded()" :canCancel="false"></b-loading>-->
      <!--<div class="title is-3">Date</div>
      <template>
        <b-field label="Select a date">
            <b-datepicker
                placeholder="Click to select..."
                icon="calendar-today">
            </b-datepicker>
        </b-field>
      </template>
      <hr>-->

      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Scoreboard</h1>
            <h2 class="subtitle">Live scores, game predictions, odds, and rankings</h2>
          </div>
        </div>
      </section>

      <section class="section games">
        <div class="container">
          <div class="title is-5">Games on {{ getScoreboardDate }}</div>

          <div class="scoreboard-loading" v-show="!allDataLoaded">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <span class="sr-only">Loading...</span>
          </div>

          <div class="columns is-multiline">
            <div class="column is-half-tablet is-one-third-fullhd" v-for="game in gamesWithTeamRatings">
              <Game :game="game"></Game>
            </div>
          </div>
        </div>
      </section>

    </div>

  </section>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Game from './game/Game'

export default {
  name: "Scoreboard",
  components: {
    Game
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "scoreboardLoaded",
      "scoreboard"
    ]),
    ...mapGetters([
      'gamesWithTeamRatings',
      'getScoreboardDate'
    ]),
    allDataLoaded() {
      return (this.scoreboardLoaded && this.ratingsLoaded)
    }
  },
  methods: {

  }
};
</script>

<style lang="scss">
.scoreboard-loading {
  text-align: center;
  margin: 2rem 0;
}
</style>
