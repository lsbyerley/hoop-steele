<template>
  <div class="level team-row is-mobile" v-bind:class="teamClass(teamType)">

    <div class="level-left">

      <div class="level-item team-logo">
        <figure ref="teamlogo" class="image is-32x32">
          <img :src="team.logo" @error="teamImgError">
        </figure>
      </div>

      <div class="level-item team-info">
        <div>
          <div class="team-name">
            <small class="rank" v-if="team.rank">{{ team.rank }}</small>
            <div class="short-name">{{ team.shortName }}</div>
            <div class="abbrev">{{ team.abbrev }}</div>
          </div>
          <div class="team-record">{{ team.record }}</div>
        </div>
      </div>

    </div>

    <div class="level-right">

      <div class="level-item" v-if="team.kenPomRating">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'KenPom Rank')" :active="true" animated type="is-normal">
            <span class="tag is-normal">KP</span>
          </b-tooltip>
          <div class="stat-value">{{ team.kenPomRating.rank }}</div>
        </div>
      </div>

      <div class="level-item" v-if="team.teamSpread">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Current Spread')" :active="true" animated type="is-normal">
            <span class="tag is-normal">ODDS</span>
          </b-tooltip>
          <div class="stat-value">{{ team.teamSpread }}</div>
        </div>
      </div>

      <!--<div class="level-item" v-if="team.predictions && team.predictions.expectedPointDiff">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Expected Pt. Differential')"
            :active="true" animated type="is-normal">
            <span class="tag is-normal">Pt. Diff</span>
          </b-tooltip>
          <div>{{ team.predictions.expectedPointDiff }}</div>
        </div>
      </div>-->

      <div class="level-item" v-if="team.predictions && team.predictions.winProbability">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Win Probability')" :active="true" animated type="is-normal">
            <span class="tag is-normal">%WIN</span>
          </b-tooltip>
          <div class="stat-value">{{ team.predictions.winProbability }}</div>
        </div>
      </div>

      <div class="level-item" v-if="team.predictions && team.predictions.expectedOutput">
        <div class="has-text-centered">
          <b-tooltip :label="tooltipInfo(team.abbrev, 'Predicted Score')" :active="true" animated type="is-normal">
            <span class="tag is-normal">PRED</span>
          </b-tooltip>
          <div class="stat-value">{{ team.predictions.expectedOutput }}</div>
        </div>
      </div>

      <div class="level-item" v-if="game.state !== 'pre'">
        <div class="has-text-centered">
          <b-tooltip v-if="game.state === 'in'" :label="tooltipInfo(team.abbrev, 'Live Score')" :active="true" animated type="is-danger">
            <span class="tag is-danger">LIVE</span>
          </b-tooltip>
          <b-tooltip v-if="game.state === 'post'" :label="tooltipInfo(team.abbrev, 'Final Score')" :active="true" animated type="is-info">
            <span class="tag is-info">FINAL</span>
          </b-tooltip>
          <div class="stat-value score">{{ team.score }}</div>
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
      team: this.game[this.teamType]
    }
  },
  methods: {
    teamClass(teamType) {

      let winner = false
      if (this.game.state === 'post') {
        if (teamType === 'away') {
          if (parseInt(this.game.away.score) > parseInt(this.game.home.score)) { winner = true }
        } else if (teamType === 'home') {
          if (parseInt(this.game.home.score) > parseInt(this.game.away.score)) { winner = true }
        }
      }

      return {
        'away': (teamType === 'away'),
        'home': (teamType === 'home'),
        'winner': winner
      }
    },
    tooltipInfo(team, stat) {
      return `${team} ${stat}`
    },
    teamImgError() {
      //this.team.logo = 'http://placehold.it/32x32'
      this.$refs.teamlogo.style.display = 'none'
    }
  }
}
</script>

<style scoped lang="scss">
@import '~bulma/sass/utilities/mixins';

.team-row {
  position: relative;
  padding: .5rem 1rem;
  margin: 0;

  &.winner::before {
    content: '\F0DA';
    font-family: FontAwesome;
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    left: 0;
  }

  .level-right {

    .tag {
      font-weight: bold;
      font-size: .75rem;
      @include mobile() {
        font-size: .6rem;
      }

      &.is-normal {
        background-color: #eaeaea;
        color: #383737;
      }
    }

    .stat-value {
      font-size: .8rem;
      @include mobile() {
        font-size: .75rem;
      }

      &.score {
        font-weight: bold;
      }
    }

    .tooltip.is-normal:after {
      background-color: #eaeaea;
      color: #383737;
    }

    .level-item:last-child {
      margin-right: 0;
    }
  }

  .team-info {

    .team-name {
      font-size: 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;

      .rank {
        font-size: .75rem;
        color: #6c6d6f;
        margin-right: 4px;
      }

      .short-name {

      }
      .abbrev {
        display: none;
      }

      @include mobile() {
        .short-name { display: none; }
        .abbrev { display: block; }
      }

    }
    .team-record {
      font-size: .75rem;
    }
  }
}
</style>
