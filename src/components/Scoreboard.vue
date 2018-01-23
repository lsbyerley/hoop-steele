<template>

  <section class="page-content">

    <div class="scoreboard">

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
          <div class="box filters-panel">
            <div class="level">
              <div class="level-item game-date">
                <strong>Game Date:</strong>
                <span v-if="scoreboardLoaded">{{ scoreboard.scoresDateReadable }}</span>
              </div>
              <div class="level-item">
                <strong>Predictions</strong>
                <span class="icon">
                  <i class="fa fa-check"></i>
                </span>
                {{ calculateCorrectPicks() }}
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
                            :value="option"
                            :key="option"
                          >
                          {{ option }}
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
          <div class="scoreboard-loading" v-show="!allDataLoaded">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <span class="sr-only">Loading...</span>
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
import { majorConfs } from '@/teamData'
import { predictionMixin } from './mixins/predictionMixin'
import Game from './game/Game'
import Fuse from 'fuse.js'

export default {
  name: "Scoreboard",
  mixins: [predictionMixin],
  data() {
    return {
      teamSearchInput: '',
      selectedGameFilter: 'NCAA-D1'
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
    games() {
      if (this.allDataLoaded) {

        const searchOptions = {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [ "team" ]
        };
        const ratingsFuse = new Fuse(this.teamRatings.ratings, searchOptions);

        return this.scoreboard.games.map((game) => {

          const awayTeamResult = ratingsFuse.search(game.away.location);
          if (awayTeamResult.length > 0) {
            game.away.kenPomRating = awayTeamResult[0]
            game.away.ratingsMatch = game.away.location+'-'+awayTeamResult[0].team
          }

          const homeTeamResult = ratingsFuse.search(game.home.location);
          if (homeTeamResult.length > 0) {
            game.home.kenPomRating = homeTeamResult[0]
            game.home.ratingsMatch = game.home.location+'-'+homeTeamResult[0].team
          }

          if (game.away.kenPomRating && game.home.kenPomRating) {
            const prediction = this.buildGamePrediction(game.away.kenPomRating, game.home.kenPomRating, this.teamRatings.averageTempo, this.teamRatings.averageEfficiency)

            game.away.predictions = prediction.away;
            game.home.predictions = prediction.home;
          }

          return game;

        });

      }
    },
    filteredGames() {
      if (this.allDataLoaded) {
        let filteredGames = []

        // Team Search input takes precedence over game filter dropdown
        if ( this.teamSearchInput.length >= 2 ) {
          filteredGames = this.games.filter((game) => {
            const away = game.away.shortName.toLowerCase();
            const home = game.home.shortName.toLowerCase();
            return ( away.includes(this.teamSearchInput) || home.includes(this.teamSearchInput) )
          })
          this.selectedGameFilter = 'NCAA-D1'
          return filteredGames

        } else {

          if (this.selectedGameFilter === 'NCAA-D1') {
            return this.games

          } else if (this.selectedGameFilter === 'Top 25') {
            filteredGames = this.games.filter((game) => {
              const awayRank = game.away.rank || ''
              const homeRank = game.home.rank || ''
              return (awayRank || homeRank)
            })

          } else if (this.selectedGameFilter === 'Mid-Majors') {
            filteredGames = this.games.filter((game) => {
              const gameConf = game.conference || ''
              if (gameConf && !majorConfs.includes(gameConf)) {
                return true
              }
              return false
            })

          } else {
            filteredGames = this.games.filter((game) => {
              const gameConf = game.conference || ''
              return ( gameConf && gameConf === this.selectedGameFilter )
            })

          }

          return filteredGames
        }

      }
    }
  },
  methods: {
    calculateCorrectPicks() {
      if (this.allDataLoaded) {
        let totalFinal = 0;
        let totalCorrect = 0;
        this.filteredGames.forEach((game) => {
          if (game.away.predictions && game.home.predictions && game.state === 'post') {
            totalFinal += 1;
            const awayPredicted = game.away.predictions.expectedOutput;
            const homePredicted = game.home.predictions.expectedOutput;
            const predictedWinner = (awayPredicted > homePredicted) ? 'away' : 'home';
            const actualWinner = (game.away.score > game.home.score) ? 'away' : 'home';
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
.scoreboard-loading {
  text-align: center;
  margin: 2rem 0;
}
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
        margin: 0 5px 0 0;
        vertical-align: middle;
      }
    }
  }
}
</style>
