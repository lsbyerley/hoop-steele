<template>

  <section class="page-content">

    <b-loading :active="!allDataLoaded" :canCancel="false"></b-loading>

    <div class="scoreboard">

      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-4">Scoreboard</h1>
            <h2 class="subtitle is-5">Scores, Predictions, Odds, and Rankings</h2>
          </div>
        </div>
      </section>

      <section class="section games">

        <div class="container">
          <div class="box filters-panel">
            <div class="level">
              <div class="level-item game-date filter">
                <b-field label="Game Date">
                  <b-datepicker
                    :value="scoreboardDate"
                    @input="changeScoreboardDate"
                    :focused-date="scoreboardDate"
                    :min-date="dpDates.minDate"
                    :max-date="dpDates.maxDate"
                    :loading="!allDataLoaded"
                    :mobile-native="false"
                    icon-pack="fa"
                    icon="calendar"
                  >
                  </b-datepicker>
                </b-field>
              </div>
              <div class="level-item filter">
                <div class="field">
                  <div class="label">Predictions</div>
                  <div class="control">
                    <span class="icon">
                      <i class="fa fa-check"></i>
                    </span>
                    {{ calculateCorrectPicks() }}
                  </div>
                </div>
              </div>
              <div class="level-item filter">
                <b-field label="Team Search">
                  <b-input v-model.trim="teamSearchInput" placeholder="search.."></b-input>
                </b-field>
              </div>
              <div class="level-item filter">
                <b-field label="Games Filter">
                    <b-select placeholder="Games Filter" v-model="selectedGameFilter" :loading="!allDataLoaded">
                        <option
                            v-for="option in filterOptions"
                            :value="option.value"
                            :key="option.value"
                          >
                          {{ option.display }}
                        </option>
                    </b-select>
                </b-field>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="notification is-danger" v-show="scoreboardError">
            There was error loading the games. Please try reloading the page
          </div>
          <div class="notification is-warning" v-show="showNoGamesNotif">
            No games match the selected filters.
          </div>
          <div class="columns is-multiline">
            <div class="column is-half-tablet is-one-third-fullhd" v-for="game in filteredGames">
              <Game :game="game" :key="game.id"></Game>
            </div>
          </div>
        </div>

      </section>

    </div>

  </section>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { majorConfs, midMajors, conferences } from '@/utils/cbbData'
import { predictionMixin } from '@/components/mixins/predictionMixin'
import Game from '@/components/game/Game'
import moment from 'moment'
//import { TimelineMax, TweenMax } from 'gsap'

export default {
  name: "Scoreboard",
  mixins: [predictionMixin],
  async fetch ({ store, params }) {
    if (!store.state.ratingsLoaded) {
      await store.dispatch('getTeamRatings')
    }
    if (!store.state.scoreboardLoaded) {
      await store.dispatch('getGames')
    }
  },
  head() {
    return {
      title: 'Scoreboard'
    }
  },
  data() {
    return {
      teamSearchInput: '',
      selectedGameFilter: (this.$store.state.scoreboardLoaded && this.$store.state.scoreboard.isNCAATournament) ? 'ncaa-d1' : 'top-25'
    }
  },
  components: {
    Game
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "scoreboardLoaded",
      "scoreboardError",
      "scoreboard",
      "teamRatings"
    ]),
    ...mapGetters([
      'filterOptions'
    ]),
    allDataLoaded() {
      return (this.scoreboardLoaded && this.ratingsLoaded)
    },
    showNoGamesNotif() {
      return (this.filteredGames.length === 0 && this.scoreboardError === false && this.scoreboardLoaded === true)
    },
    scoreboardDate() {
      return (this.allDataLoaded) ? moment(this.scoreboard.date, 'YYYYMMDD').toDate() : moment( moment().format('YYYYMMDD'), 'YYYYMMDD').toDate()
    },
    dpDates() {

      let minDate = moment( moment().format('YYYYMMDD'), 'YYYYMMDD').subtract(1, "day").toDate();
      let maxDate = moment( moment().format('YYYYMMDD'), 'YYYYMMDD').add(2, "day").toDate();
      if (this.scoreboardLoaded && this.scoreboard.isNCAATournament) {
        // all of march and two days in april
        minDate = moment( moment().format('20180301'), 'YYYYMMDD').toDate();
        maxDate = moment( moment().format('20180402'), 'YYYYMMDD').toDate();
      }
      return {
        minDate: minDate,
        maxDate: maxDate
      }
    },
    games() {
      if (this.allDataLoaded && !this.scoreboardError) {

        return this.scoreboard.games.map((game) => {

          for (var rating of this.teamRatings.ratings) {
            if (rating.team === game.away.location) {
              game.away.kenPomRating = rating
              break;
            }
          }

          for (var rating of this.teamRatings.ratings) {
            if (rating.team === game.home.location) {
              game.home.kenPomRating = rating
              break;
            }
          }

          if (game.away.kenPomRating && game.home.kenPomRating) {
            const prediction = this.buildGamePrediction(game.away.kenPomRating, game.home.kenPomRating, this.teamRatings.averageTempo, this.teamRatings.averageEfficiency)

            game.expectedTempo = prediction.expectedTempo;

            if (game.neutralSite) {
              game.away.predictions = {
                expectedOutput: prediction.away.expectedOutputNeutral,
                expectedPointDiff: prediction.away.expectedPointDiffNeutral,
                winProbability: prediction.away.winProbabilityNeutral
              }
              game.home.predictions = {
                expectedOutput: prediction.home.expectedOutputNeutral,
                expectedPointDiff: prediction.home.expectedPointDiffNeutral,
                winProbability: prediction.home.winProbabilityNeutral
              }
            } else {
              game.away.predictions = prediction.away;
              game.home.predictions = prediction.home;
            }

          }

          return game;

        });

      }
    },
    filteredGames() {
      let filteredGames = []
      if (this.allDataLoaded && !this.scoreboardError) {

        // Team Search input takes precedence over game filter dropdown
        if ( this.teamSearchInput.length >= 2 ) {
          filteredGames = this.games.filter((game) => {
            const away = game.away.shortName.toLowerCase();
            const home = game.home.shortName.toLowerCase();
            return ( away.includes(this.teamSearchInput) || home.includes(this.teamSearchInput) )
          })
          this.selectedGameFilter = 'top-25'
          return filteredGames

        } else {

          if (this.selectedGameFilter === 'ncaa-d1') {
            return this.games

          } else if (this.selectedGameFilter === 'top-25') {
            filteredGames = this.games.filter((game) => {
              const awayRank = game.away.rank || ''
              const homeRank = game.home.rank || ''
              return (awayRank || homeRank)
            })

          } else if (this.selectedGameFilter === 'mid-majors') {
            filteredGames = this.games.filter((game) => {
              if (midMajors.includes(game.away.confId) || midMajors.includes(game.home.confId)) {
                return true
              }
              return false
            })

          } else {
            filteredGames = this.games.filter((game) => {
              const awayConf = conferences.find(function(conf) {
                return conf.id === game.away.confId
              })
              const homeConf = conferences.find(function(conf) {
                return conf.id === game.home.confId
              })
              return ( (awayConf && awayConf.value === this.selectedGameFilter) || (homeConf && homeConf.value === this.selectedGameFilter) )
            })

          }

        }
      }
      return filteredGames
    }
  },
  methods: {
    changeScoreboardDate(newDate) {
      if (newDate !== this.scoreboardDate) {
        this.$store.dispatch('getGames', { date: newDate });
      }
    },
    calculateCorrectPicks() {
      if (this.allDataLoaded && !this.scoreboardError) {
        let totalFinal = 0;
        let totalCorrect = 0;
        this.filteredGames.forEach((game) => {
          if (game.away.predictions && game.home.predictions && game.state === 'post') {
            totalFinal += 1;
            const awayPredicted = game.away.predictions.expectedOutput;
            const homePredicted = game.home.predictions.expectedOutput;
            const predictedWinner = (awayPredicted > homePredicted) ? 'away' : 'home';
            const actualWinner = (parseInt(game.away.score) > parseInt(game.home.score)) ? 'away' : 'home';
            if (predictedWinner === actualWinner) {
              totalCorrect += 1
            }
          }
        })
        if (totalFinal > 0) {
          return `${totalCorrect} / ${totalFinal} (${ ((totalCorrect/totalFinal) * 100).toFixed(0) }%)`
        } else {
          return 'No Games Final'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/mixins';

.box.filters-panel {
  margin-bottom: 3rem;
  padding: .5rem;

  .icon {
    margin: 0 5px;

    .fa-check {
      color: #23d160;
    }
  }

  .level-item.game-date {
    strong {
      margin-right: 5px;
    }
  }

  .level-item.filter {
    .field {
      display: flex;
      vertical-align: middle;
      align-items: center;

      .label {
        margin: 0 10px 0 0;
        vertical-align: middle;
      }
    }
  }

  @include mobile() {
    .level-item.filter .field {
      width: 100%;

      .label {
        margin: 0 1rem 0 0;
        min-width: 80px;
      }
      .control {
        flex-grow: 1;

        input {
          text-align: center;
        }

        span.select {
          width: 100%;

          select {
            width: 100%;
            text-align: center;
            text-align-last: center;

            option {
              //text-align: center;
            }
          }
        }
      }
    }
  }

}
</style>
