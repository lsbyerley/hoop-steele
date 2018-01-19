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
      </div>
      <div class="level-right">
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
  </div>
</template>

<script>
import TeamRow from './TeamRow'

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
  methods: {
    predictionClass(game) {
      const awayPredicted = game.away.predictions.expectedOutput;
      const homePredicted = game.home.predictions.expectedOutput;
      const predictedWinner = (awayPredicted > homePredicted) ? game.away : game.home;
      const actualWinner = (game.away.score > game.home.score) ? game.away : game.home;
      return {
        "fa-check": predictedWinner === actualWinner,
        "fa-times": predictedWinner !== actualWinner
      }
    }
  }
}
</script>

<style scoped lang="scss">
.game {
  padding: 0;

  .game-header {
    padding: .5rem 1rem;
    background: #0A2145;
    border-bottom: 2px solid #ddd;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    font-size: .75rem;
    font-weight: bold;
    color: #fff;
    margin: 0;

    .prediction-result {
      .fa-check {
        color: #23d160;
      }
      .fa-times {
        color: #ff3860;
      }
    }
  }
}
</style>
