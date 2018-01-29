<template>
  <div class="columns prediction is-mobile">
    <div class="column is-3 team">
      <span class="at" v-if="this.homeAway === 'home'">@</span>
      <figure class="image is-32x32">
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
    <div class="column is-3">
      <p class="heading">Score</p>
      <p class="title">{{ prediction.expectedOutput }}</p>
    </div>
  </div>
</template>

<script>
import { teams } from '@/utils/cbbData'
import Fuse from 'fuse.js'

const searchOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [ "location", "kpTeamName" ]
};
const logoFuse = new Fuse(teams, searchOptions);

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
  },
  methods: {
    getTeamLogo(team) {

      const logoResult = logoFuse.search(team.team);
      if (logoResult.length > 0) {
        const teamId = logoResult[0].id
        return `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${teamId}.png&h=150&w=150`
      } else {
        return 'https://via.placeholder.com/150x150'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bulma/sass/utilities/mixins';

.prediction {
  .team {
    flex-direction: row;
    .at {
      font-size: .75rem;
    }
  }
  @include mobile() {
    .title {
      font-size: 1.25rem;
    }
  }
}
</style>
