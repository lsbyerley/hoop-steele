<template>
  <div class="panel game halftime">
    <div class="panel-head">
      <div class="panel-title left">{{ game.status.detail }}</div>
      <div class="panel-title right"></div>
    </div>
    <div class="panel-body">

      <table>
        <thead>
          <th></th>
          <th>Score</th>
          <th>3PM-3PA</th>
          <th>Season%</th>
          <th>Surplus 3s</th>
        </thead>
        <tbody>
          <tr>
            <td class="team">
              <img class="team-logo" :src="game.away.logo">
                <a class="team-name" :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.away.id" target="_blank" rel="noopener noreferrer">
                <span v-if="game.away.rank">{{ game.away.rank }}</span>
                {{ game.away.shortName }}
              </a>
            </td>
            <td>{{ game.away.score }}</td>
            <td>{{ game.away.threePtMade }} - {{ game.away.threePtAtt }}</td>
            <td>{{ game.away.stats.fg3_pct }}</td>
            <td>{{ surplusThrees('away') }}</td>
          </tr>
          <tr>
            <td class="team">
              <img class="team-logo" :src="game.home.logo">
                <a class="team-name" :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.home.id" target="_blank" rel="noopener noreferrer">
                <span v-if="game.home.rank">{{ game.home.rank }}</span>
                {{ game.home.shortName }}
              </a>
            </td>
            <td>{{ game.home.score }}</td>
            <td>{{ game.home.threePtMade }} - {{ game.home.threePtAtt }}</td>
            <td>{{ game.home.stats.fg3_pct }}</td>
            <td>{{ surplusThrees('home') }}</td>
          </tr>
        </tbody>
      </table>

      <div class="row ht-action">
        <div class="col col-sm-4">
          <h6>Scoring Margin</h6>
          <p>{{ Math.abs(game.away.score - game.home.score) }}</p>
        </div>
        <div class="col col-sm-4">
          <h6>Surplus Diff</h6>
          <p>{{ game.surplusThreeDiff }}</p>
        </div>
        <div class="col col-sm-4">
          <h6>Action</h6>
          <p>{{ calculateAction(game) }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HalftimeGame',
  props: {
    sortType: {
      type: String,
      default: ''
    },
    game: {
      type: Object,
      default: {}
    }
  },
  methods: {
    surplusThrees(homeAway) {
      const team = this.game[homeAway]
      if (team.stats && team.stats.surplusThrees) {
        return team.stats.surplusThrees
      }
      return '-'
    },
    calculateAction() {
      //TODO: color type of text based on action type
      let halftimeAction = this.game.halftimeAction
      if (halftimeAction) {
        return halftimeAction
      }
      return '-'
    }
  }
}
</script>

<style lang="scss">
.game.halftime {

  td.team {
    display:flex;
    justify-content: center;
    align-items: center;

    .team-logo {
      margin-right: .5rem;
    }
  }

  .ht-action {
    justify-content: center;
    align-items: center;

    .col {
      text-align: center;

      h6 {
        font-size: 1rem;
      }
      p {

      }
    }
  }

}
</style>