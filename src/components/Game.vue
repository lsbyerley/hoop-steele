<template>
  <div class="panel game">
    <div class="panel-head">
      <div class="panel-title left">{{ game.status.detail }}</div>
      <div class="panel-title right">SHFactor: {{ game.shFactor }}</div>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col col-sm-12 col-md-4" class="game-stats">
          <div class="row matchup">
            <div class="col team visitor">
              <div class="team-name">{{ game.away.abbrev }}</div>
              <img class="team-logo" :src="game.away.logo">
              <div class="team-record">({{ game.away.totalRecord }}, {{ game.away.ahRecord }} Away)</div>
              <div class="score" v-if="game.status.state !== 'pre'">{{ game.away.score }}</div>
            </div>
            <div class="col team home">
              <div class="team-name">{{ game.home.abbrev }}</div>
              <img class="team-logo" :src="game.home.logo">
              <div class="team-record">({{ game.home.totalRecord }}, {{ game.home.ahRecord }} Home)</div>
              <div class="score" v-if="game.status.state !== 'pre'">{{ game.home.score }}</div>
            </div>
            <div class="col details">
              <!--<div class="status">{{ game.statusText }}</div>-->
              <!--<div class="at">@</div>-->
              <div class="odds">
                <div class="title">Spread</div>
                <div class="value">{{ game.odds.spread }}</div>
              </div>
              <div class="odds">
                <div class="title">Total</div>
                <div class="value">{{ game.odds.total }}</div>
              </div>
            </div>
          </div>
          <div class="row diffs">
            <div class="col col-sm-6"><div class="tag">SPR Diff: {{ game.spreadDiff }}</div></div>
            <div class="col col-sm-6"><div class="tag">TOT Diff: {{ game.totalDiff }}</div></div>
          </div>
        </div>
        <div class="col col-sm-12 col-md-4" class="predictions">
          <table>
            <thead><tr>
              <th>Predictions</th>
              <th><img class="team-logo" :src="game.away.logo"></th>
              <th><img class="team-logo" :src="game.home.logo"></th>
            </tr></thead>
            <tbody>
              <tr>
                <td>Win %</td>
                <td>{{ game.prediction.away.winProbability }}</td>
                <td>{{ game.prediction.home.winProbability }}</td>
              </tr>
              <tr>
                <td>Score</td>
                <td>{{ game.prediction.away.expectedOutput }}</td>
                <td>{{ game.prediction.home.expectedOutput }}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td colspan="2">{{ game.prediction.totalOutput }}</td>
              </tr>
              <tr>
                <td>Spread</td>
                <td colspan="2">{{ pointDiff(game) }}</td>
              </tr>
              <tr>
                <td>Tempo</td>
                <td colspan="2">{{ game.prediction.tempoText }} ({{ game.prediction.expectedTempo }})</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col col-sm-12 col-md-4" class="kenpom-stats">
          <table>
            <thead><tr>
              <th>KenPom</th>
              <th><img class="team-logo" :src="game.away.logo"></th>
              <th><img class="team-logo" :src="game.home.logo"></th>
            </tr></thead>
            <tbody>
              <tr>
                <td>Rank</td>
                <td>{{ game.away.kenPom.rank }}</td>
                <td>{{ game.home.kenPom.rank }}</td>
              </tr>
              <tr>
                <td>Offense</td>
                <td>{{ game.away.kenPom.adjORank }}</td>
                <td>{{ game.home.kenPom.adjORank }}</td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>{{ game.away.kenPom.adjDRank }}</td>
                <td>{{ game.home.kenPom.adjDRank }}</td>
              </tr>
              <tr>
                <td>Tempo</td>
                <td>{{ game.away.kenPom.adjT }}</td>
                <td>{{ game.home.kenPom.adjT }}</td>
              </tr>
              <tr>
                <td>Record</td>
                <td>{{ game.away.kenPom.record }}</td>
                <td>{{ game.home.kenPom.record }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: {
    game: {
      type: Object,
      default: {}
    }
  },
  methods: {
    pointDiff(game) {
      const aDiff = game.prediction.away.expectedPointDiff
      const hDiff = game.prediction.home.expectedPointDiff
      return (aDiff > 0) ? aDiff : hDiff
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.scss';

.panel.game {
  font-family: 'EZLight', sans-serif;
  border-left: 1px solid $color-green-900;
  border-right: 1px solid $color-green-900;
  border-bottom: 1px solid $color-green-900;

  &:first-child {
    margin-top: 0;
  }

  .panel-head, .panel-footer {
    background: $color-blue;
    color: #fff;
  }

  .panel-head {
    margin: 0;

    .panel-title {
      font-size: 1rem;
    }
  }

  .panel-body {
    padding: .5rem;

    > .row {
      margin: 0;
    }
  }

  .row.diffs {
    text-align: center;

    .tag {
      background: #fafafa;
      border: 1px solid #e3e3e3;
      color: #666;
      font-size: 0.85rem;
    }
  }

  .row.matchup {
    align-items: center;
    justify-content: space-around;
    margin: 0;

    .visitor, .details, .home {
      text-align: center;
    }

    .visitor {
      order: 1;
      flex: 1 1 35%;
    }
    .details {
      flex: 1 1 30%;
      order: 2;
    }
    .home {
      order: 3;
      flex: 1 1 35%;
    }

    .team {

      .team-name {
        font-size: .75rem;
        font-family: 'EZMedium', sans-serif;
        text-transform: uppercase;
      }
      .team-logo {
        width: 3rem;
      }
      .team-record {
        font-size: .75rem;
      }
      .score {
        font-size: 2rem;
      }
    }

    .details {
      .at {
        font-size: 3rem;
      }
      .odds {
        .title {
          background: #fafafa;
          border-bottom: 1px solid #e3e3e3;
          color: #666;
          font-size: .85rem;
        }
        .value {
          font-size: 1rem;
        }
        &:first-child {
          margin-bottom: 1rem;
        }
      }
    }

    @media (max-width: $game-breakpoint) {
      flex-wrap: wrap;

      .team {

        .team-name {
          font-size: .75rem;
          text-transform: uppercase;
        }
        .team-logo {
          width: 3rem;
        }
        .team-record {
          font-size: .5rem;
        }
        .score {
          font-size: 2rem;
        }
      }

      .visitor {
        order: 1;
        flex: 1 0 45%;
        max-width: 225px;
      }
      .details {
        margin: 0;
        order: 3;
        flex: 1 1 100%;
        font-size: .75rem;
      }
      .home {
        order: 2;
        flex: 1 0 45%;
        max-width: 225px;
      }
    }

  }

  table {
    margin: 0;

    thead th {
      padding: 2px;
      text-align: center;
      background: #fafafa;
      border-bottom: 1px solid #e3e3e3;
      color: #666;
      font-size: .85rem;
      font-family: 'EZMedium', sans-serif;

      .team-logo {
        width: 1.5rem;
      }

      @media (max-width: $game-breakpoint) {
        font-size: .65rem;
      }

    }
    tbody td {
      padding: 2px;
      text-align: center;
      font-size: .85rem;

      &.green {
        //background: rgba(76,175,80,0.33);
        color: $color-green-500;
      }
      &.red {
        //background: rgba(244,67,54,0.33);
        color: $color-red-500;
      }

      @media (max-width: $game-breakpoint) {
        font-size: .65rem;

        .team-logo {
          width: 1rem;
        }
      }

    }
  }
}

.team-logo {
  width: 1rem;
}
</style>
