<template>
  <div class="columns" v-if="Object.keys(away).length > 0 && Object.keys(home).length > 0">
    <div class="column">
      <div class="box game-prediction">
        <div class="title is-4 has-text-centered">Game Prediction</div>
        <TeamPredictions homeAway="away" :team="away" :gamePrediction="gamePrediction"></TeamPredictions>
        <TeamPredictions homeAway="home" :team="home" :gamePrediction="gamePrediction"></TeamPredictions>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TeamPredictions from '@/components/compare/TeamPredictions'
import { predictionMixin } from '@/components/mixins/predictionMixin'

export default {
  name: 'GamePrediction',
  components: {
    TeamPredictions
  },
  mixins: [predictionMixin],
  props: {
    away: {
      type: Object,
      default: {}
    },
    home: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapState([
      "teamRatings",
      "ratingsLoaded"
    ]),
    gamePrediction() {
      if (this.ratingsLoaded && this.away && this.home) {
        const avgTempo = this.teamRatings.averageTempo
        const avgEff = this.teamRatings.averageEfficiency
        const prediction = this.buildGamePrediction(this.away, this.home, avgTempo, avgEff)
        return prediction
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>
