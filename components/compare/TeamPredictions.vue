<template>
  <div class="columns prediction is-mobile">
    <div class="column is-3 team">
      <figure class="image">
        <span class="at" v-if="this.homeAway === 'home'">@</span>
        <img v-bind:src="getTeamLogo(team)">
      </figure>
    </div>
    <div class="column is-3">
      <p class="heading">Pt Diff</p>
      <p class="title">{{ prediction.expectedPointDiff }}</p>
    </div>
    <div class="column is-3">
      <p class="heading">Win %</p>
      <p class="title">{{ prediction.winProbability }}</p>
    </div>
    <div class="column is-3 score">
      <p class="heading">Score</p>
      <p class="title" v-bind:class="statCompare('expectedOutput')">{{ prediction.expectedOutput }}</p>
    </div>
  </div>
</template>

<script>
import { logoMixin } from '@/components/mixins/logoMixin'

export default {
  name: "TeamPredictions",
  mixins: [logoMixin],
  props: {
    homeAway: String,
    team: {
      type: Object,
      default: {}
    },
    gamePrediction: {
      type: Object,
      default: {}
    }
  },
  computed: {
    prediction() {
      return (this.homeAway === 'away') ? this.gamePrediction.away : this.gamePrediction.home
    }
  },
  methods: {
    statCompare(type) {

      const stat = this.prediction[type]
      const statToCompare = (this.homeAway === 'away') ? this.gamePrediction.home[type] : this.gamePrediction.away[type]

      return {
        'green': stat > statToCompare,
        'red': stat < statToCompare
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bulma/sass/utilities/mixins';
@import '~assets/styles/style-vars';

.prediction {

  .column {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .team {
    flex-direction: row;

    .at {
      position: absolute;
      left: -1rem;
      top: .65rem;
      font-weight: bold;
      font-size: 1rem;
    }

    .image {
      width: 3rem;
    }

    .name {
      margin-left: 1rem;
    }

  }
  .score {
    .green {
      color: $green;
    }
    .red {
      color: $red;
    }
  }
  @include mobile() {
    .title {
      font-size: 1.15rem;
    }
  }
}
</style>
