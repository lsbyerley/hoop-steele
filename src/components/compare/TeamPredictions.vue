<template>
  <div class="columns prediction">
    <div class="column is-3">
      <p class="title is-5">
        <span v-if="this.homeAway === 'away'">@</span>
        {{ team.team }}
      </p>
    </div>
    <div class="column is-3">
      <p class="heading">Point Diff</p>
      <p class="title">{{ prediction.expectedPointDiff }}</p>
    </div>
    <div class="column is-3">
      <p class="heading">Win %</p>
      <p class="title">{{ prediction.winProbability }}</p>
    </div>
    <div class="column is-3">
      <p class="heading">Output</p>
      <p class="title">{{ prediction.expectedOutput }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeamPredictions",
  data() {
    return {
      prediction: (this.homeAway === 'away') ? this.gamePrediction.away : this.gamePrediction.home
    }
  },
  props: {
    homeAway: String,
    team: {
      type: Object,
      default: null
    },
    gamePrediction: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped lang="scss">

</style>
