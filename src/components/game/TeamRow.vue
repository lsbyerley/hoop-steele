<template>
  <div class="level team is-mobile" v-bind:class="teamType">
    <div class="level-left">
      <div class="level-item">
        <figure class="image is-32x32">
          <img v-bind:src="team.logo">
        </figure>
      </div>
      <div class="level-item team-info">
        <div>
          <p class="team-name">
            <small class="rank" v-if="team.rank">{{ team.rank }}</small>
            {{ team.shortName }}
          </p>
          <p class="team-record">{{ team.record }}</p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item" v-if="team.kenPomRating">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'KenPom Rank')"
            :active="tooltipActive" animated type="is-success">
            <span class="tag is-success">KP</span>
          </b-tooltip>
          <p>{{ team.kenPomRating.rank }}</p>
        </div>
      </div>
      <div class="level-item" v-if="team.teamSpread">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Current Spread')"
            :active="tooltipActive" animated type="is-normal">
            <span class="tag is-normal">ODDS</span>
          </b-tooltip>
          <p>{{ team.teamSpread }}</p>
        </div>
      </div>

      <!--<div class="level-item" v-if="team.predictions && team.predictions.expectedPointDiff">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Expected Pt. Differential')"
            :active="tooltipActive" animated type="is-normal">
            <span class="tag is-normal">Pt. Diff</span>
          </b-tooltip>
          <p>{{ team.predictions.expectedPointDiff }}</p>
        </div>
      </div>-->

      <div class="level-item" v-if="team.predictions && team.predictions.winProbability">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Win Probability')"
            :active="tooltipActive" animated type="is-normal">
            <span class="tag is-normal">%WIN</span>
          </b-tooltip>
          <p>{{ team.predictions.winProbability }}</p>
        </div>
      </div>

      <div class="level-item" v-if="team.predictions && team.predictions.expectedOutput">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Predicted Score')"
            :active="tooltipActive" animated type="is-normal">
            <span class="tag is-normal">PRED</span>
          </b-tooltip>
          <p>{{ team.predictions.expectedOutput }}</p>
        </div>
      </div>

      <div class="level-item" v-if="game.state !== 'pre'">
        <div class="has-text-centered">
          <b-tooltip v-if="game.state === 'in'" :label="tooltipInfo(team.abbrev, 'Live Score')"
            :active="tooltipActive" animated type="is-danger">
            <span class="tag is-danger">LIVE</span>
          </b-tooltip>
          <b-tooltip v-if="game.state === 'post'" :label="tooltipInfo(team.abbrev, 'Final Score')"
            :active="tooltipActive" animated type="is-info">
            <span class="tag is-info">FINAL</span>
          </b-tooltip>
          <p>{{ team.score }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeamRow",
  props: {
    game: {
      type: Object,
      default: null
    },
    teamType: {
        type: String,
        default: 'away'
    }
  },
  data() {
    return {
      team: this.game[this.teamType],
      tooltipActive: true
    }
  },
  methods: {
    tooltipInfo(team, stat) {
      return `${team} ${stat}`
    }
  }
}
</script>

<style scoped lang="scss">
.team {
  padding: .5rem 1rem;
  margin: 0;

  .tag {
    font-weight: bold;
    font-size: .6rem;
  }

  p {
    font-size: .9rem;
  }

  .tag.is-normal {
    background-color: #eaeaea;
    color: #383737;
    font-size: .6rem;
  }
  .tooltip.is-normal:after {
    background-color: #eaeaea;
    color: #383737;
  }

  .rank {
    font-size: .75rem;
    color: #6c6d6f;
  }

  .team-info {

    .team-name {
      font-size: 1rem;
      font-weight: bold;
    }
    .team-record {
      font-size: .75rem;
    }
  }
}
</style>
