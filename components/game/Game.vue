<template>
  <div class="box game" v-bind:class="game.state" v-if="game !== null">
    <div class="level game-header is-mobile">
      <div class="level-left">
        <div class="level-item" v-if="game.broadcast">
          <span class="icon">
            <i class="fa fa-television"></i>
          </span>
          {{ game.broadcast }}
        </div>
        <div class="level-item" v-if="game.neutralSite">
          <b-tooltip label="Neutral Site" :active="true" animated type="is-info">
            <span class="tag is-info">NS</span>
          </b-tooltip>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item team-compare" v-if="game.away.predictions && game.home.predictions">
          <span class="icon" v-on:click="loadTeamCompare(game)">
            <i class="fa fa-lg fa-exchange"></i>
          </span>
        </div>
        <div class="level-item">{{ game.statusText }}</div>
        <div class="level-item prediction-result" v-if="game.state === 'post' && game.away.predictions && game.home.predictions">
          <span class="icon">
            <i class="fa" v-bind:class="predictionClass(game)"></i>
          </span>
        </div>
      </div>
    </div>
    <TeamRow :game="game" teamType="away"></TeamRow>
    <TeamRow :game="game" teamType="home"></TeamRow>
    <div class="level game-note" v-if="game.gameNote">
      <div class="level-item">
        <p>{{ game.gameNote }}</p>
      </div>
    </div>
    <div class="level game-footer is-mobile" v-if="game.state === 'pre' && (game.gameOdds.ou || game.expectedTempo)">
      <div class="level-item" v-if="game.gameOdds.ou">
        <p>O/U: {{game.gameOdds.ou}}</p>
      </div>
      <div class="level-item" v-if="game.away.predictions && game.home.predictions">
        <p>Total Pred: {{ formatTotalPredicted(game) }}</p>
      </div>
      <div class="level-item" v-if="game.expectedTempo">
        <p>Pred Tempo: {{ tempoType(game.expectedTempo) }} ({{ game.expectedTempo }})</p>
      </div>
    </div>
  </div>
</template>

<script>
import TeamRow from './TeamRow'
import { mapState } from 'vuex'
import inRange from 'lodash/inRange'

export default {
  name: "Game",
  components: {
    TeamRow
  },
  props: {
    game: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "teamRatings"
    ])
  },
  methods: {
    formatTotalPredicted(game) {
      const total = game.away.predictions.expectedOutput + game.home.predictions.expectedOutput
      return total.toFixed(0)
    },
    tempoType(tempo) {
      if (this.ratingsLoaded) {

        const avgTempo = this.teamRatings.averageTempo //68.2
        const highestTempo = avgTempo + 10
        const lowestTempo = avgTempo - 10

        if (tempo >= highestTempo) { return 'Very Fast' }
        else if (inRange(tempo, highestTempo, (avgTempo+2) )) { return 'Fast' }
        else if (inRange(tempo, (avgTempo+2), (avgTempo-2) )) { return 'Normal' }
        else if (inRange(tempo, (avgTempo-2), lowestTempo)) { return 'Slow' }
        else if (tempo <= lowestTempo) { return 'Very Slow' }

      }
    },
    loadTeamCompare(game) {
      this.$store.commit('setTeamSelected', { team: game.away.kenPomRating, type: 'away' })
      this.$store.commit('setTeamSelected', { team: game.home.kenPomRating, type: 'home' })
      if (game.neutralSite) {
        this.$store.commit('setNeutralSite', { neutralSite: true })
      }
      this.$router.push({ path: 'team-compare' })
    },
    predictionClass(game) {
      const awayPredicted = game.away.predictions.expectedOutput;
      const homePredicted = game.home.predictions.expectedOutput;
      const predictedWinner = (awayPredicted > homePredicted) ? 'away' : 'home';
      const actualWinner = (parseInt(game.away.score) > parseInt(game.home.score)) ? 'away' : 'home';
      return {
        "fa-check": predictedWinner === actualWinner,
        "fa-times": predictedWinner !== actualWinner
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/styles/style-vars';

.game {
  padding: 0;

  .game-header {
    padding: .5rem 1rem;
    background: $etsu-blue;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: .85rem;
    font-weight: 600;
    color: #fff;
    margin: 0;

    .level-right .level-item:last-child {
      margin-right: 0;
    }

    .team-compare .icon {
      color: #36b14d;
      &:hover {
        cursor: pointer;
      }
    }

    .prediction-result {
      .fa-check {
        color: $green;
      }
      .fa-times {
        color: $red;
      }
    }
  }

  .game-note {
    padding: .5rem 1rem;
    background: #eaeaea;
    font-size: .65rem;
    color: #4a4a4a;
    margin: 0;
  }

  .game-footer {
    padding: .5rem 1rem;
    background: $etsu-blue;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    color: #fff;
    font-size: .85rem;
    font-weight: 600;
  }

}
</style>
