<template>
  <div class="panel game">
    <div class="panel-head">
      <div class="panel-title left">{{ game.status.detail }}</div>
      <div class="panel-title right">{{ sortTypeString() }}</div>
    </div>
    <div class="panel-body">
      <div class="row">
        <div class="col col-sm-12 col-md-3">
          <div class="row matchup">
            <div v-if="game.neutralSite" class="neutral-tag">Neutral Site</div>
            <div class="col team visitor">
              <a class="team-name" :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.away.id" target="_blank" rel="noopener noreferrer">
                <span v-if="game.away.rank">{{ game.away.rank }}</span>
                {{ game.away.shortName }}
              </a>
              <img class="team-logo" :src="game.away.logo">
              <div class="team-record">{{ teamRecord('away') }}</div>
              <div class="score">{{ scoreValue(game, 'away') }}</div>
            </div>
            <div class="col team home">
              <a class="team-name" :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.home.id" target="_blank" rel="noopener noreferrer">
                <span v-if="game.home.rank">{{ game.home.rank }}</span>
                {{ game.home.shortName }}
              </a>
              <img class="team-logo" :src="game.home.logo">
              <div class="team-record">{{ teamRecord('home') }}</div>
              <div class="score">{{ scoreValue(game, 'home') }}</div>
            </div>
          </div>
        </div>
        <div class="col col-sm-12 col-md-3">

            <div class="row vegas-sh">
              <div class="col odds">
                <div class="title">V-Line</div>
                <div class="value">{{ game.odds.vegasLine }}</div>
              </div>
              <div class="col odds">
                <div class="title">SH-Line</div>
                <div class="value">{{ shLine(game) }}</div>
              </div>
              <div class="col odds diff">
                <div class="title">Diff</div>
                <div class="value">{{ game.lineDiff }}</div>
              </div>
              <div class="col odds">
                <div class="title">V-Total</div>
                <div class="value">{{ game.odds.vegasTotal }}</div>
              </div>
              <div class="col odds">
                <div class="title">SH-Total</div>
                <div class="value">{{ game.prediction.total }}</div>
              </div>
              <div class="col odds diff">
                <div class="title">Diff</div>
                <div class="value">{{ game.totalDiff }}</div>
              </div>
            </div>

        </div>
        <div class="col col-sm-12 col-md-3 predictions">
          <table>
            <thead><tr>
              <th>Predictions</th>
              <th><img class="team-logo" :src="game.away.logo"></th>
              <th><img class="team-logo" :src="game.home.logo"></th>
            </tr></thead>
            <tbody>
              <tr>
                <td>Win %</td>
                <td>{{ game.prediction.awayWinPerc }}</td>
                <td>{{ game.prediction.homeWinPerc }}</td>
              </tr>
              <tr>
                <td>Score</td>
                <td>{{ game.prediction.awayTotal }}</td>
                <td>{{ game.prediction.homeTotal }}</td>
              </tr>
              <tr>
                <td>Tempo</td>
                <td colspan="2">{{ game.prediction.tempoText }} ({{ game.prediction.expectedTempo }})</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col col-sm-12 col-md-3 kenpom-stats">
          <table>
            <thead><tr>
              <th>KenPom</th>
              <th><img class="team-logo" :src="game.away.logo"></th>
              <th><img class="team-logo" :src="game.home.logo"></th>
            </tr></thead>
            <tbody>
              <tr>
                <td>Rank</td>
                <td>{{ game.away.kenPom.rank }}<sup>{{ ordinalSuffix(game.away.kenPom.rank) }}</sup></td>
                <td>{{ game.home.kenPom.rank }}<sup>{{ ordinalSuffix(game.home.kenPom.rank) }}</sup></td>
              </tr>
              <tr>
                <td>Offense</td>
                <td>{{ game.away.kenPom.adjORank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjORank) }}</sup></td>
                <td>{{ game.home.kenPom.adjORank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjORank) }}</sup></td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>{{ game.away.kenPom.adjDRank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjDRank) }}</sup></td>
                <td>{{ game.home.kenPom.adjDRank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjDRank) }}</sup></td>
              </tr>
              <tr>
                <td>SOS</td>
                <td>{{ game.away.kenPom.sosAdjEMRank }}<sup>{{ ordinalSuffix(game.away.kenPom.sosAdjEMRank) }}</sup></td>
                <td>{{ game.home.kenPom.sosAdjEMRank }}<sup>{{ ordinalSuffix(game.home.kenPom.sosAdjEMRank) }}</sup></td>
              </tr>
              <tr>
                <td>Tempo</td>
                <td>{{ game.away.kenPom.adjTRank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjTRank) }}</sup></td>
                <td>{{ game.home.kenPom.adjTRank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjTRank) }}</sup></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel-footer" v-if="game.note">
      <p class="footer-text left">{{ game.note }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
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
    teamRecord(homeAway) {

      const team = this.game[homeAway]
      let totalRecord = team.totalRecord;
      let ahRecord = team.ahRecord;
      let vsConf = team.vsConfRecord;
      let conf = (team.kenPom.conf) ? team.kenPom.conf : ''

      if (totalRecord && conf && vsConfRecord) {
        return `(${totalRecord}, ${vsConfRecord} ${conf})`
      } else if (totalRecord && ahRecord) {
        return `${totalRecord}, ${ahRecord} ${homeAway}`
      } else {
        return ''
      }

    },
    sortTypeString() {
      if (this.sortType === 'date') {
        return 'Sort: Game Date'
      } else if (this.sortType === 'winPerc') {
        let winPerc = parseFloat(this.game.prediction.awayWinPerc) > parseFloat(this.game.prediction.homeWinPerc)
        ? this.game.prediction.awayWinPerc
        : this.game.prediction.homeWinPerc

        return `Sort: Win% - ${winPerc}`
      } else {
        return `${this.sortType}: ${this.game[this.sortType]}`
      }
    },
    shLine(game) {
      let aline = (game.prediction) ? game.prediction.awayLine : '-'
      let hline = (game.prediction) ? game.prediction.homeLine : '-'

      if (aline > 0) {
        return `${game.away.abbrev} ${hline}`
      } else {
        return `${game.home.abbrev} ${aline}`
      }
    },
    scoreValue(game, type) {
      if (game.status.state === 'pre' && game.away.ppg && game.home.ppg) {
        return (type === 'away') ? `${game.away.ppg} PPG` : `${game.home.ppg} PPG`
      } else if (game.status.state !== 'pre') {
        return (type === 'away') ? `${game.away.score}` : `${game.home.score}`
      }
    },
    ordinalSuffix(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
        return "st";
      }
      if (j == 2 && k != 12) {
        return "nd";
      }
      if (j == 3 && k != 13) {
        return "rd";
      }
      return "th";
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/variables.scss';

.panel.game {
  font-family: 'EZLight', sans-serif;
  border-left: 1px solid $color-green-900;
  border-right: 1px solid $color-green-900;
  border-bottom: 1px solid $color-green-900;

  &:first-child {
    margin-top: 0;
  }

  .panel-head {
    margin: 0;
    color: #fff;
    background: $color-blue;

    .panel-title {
      font-size: 1rem;
    }
  }

  .panel-footer {
    font-size: .65rem;
    background: $color-gray-200;
    color: $color-blue;
    border-top: 1px solid $color-blue;
    padding: 10px 15px;
    text-align: center;

    @media (max-width: $game-breakpoint) {
      font-size: .55rem;
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
    position: relative;
    align-items: center;
    justify-content: space-around;
    margin: 0;

    .neutral-tag {
      position: absolute;
      background: $color-green-500;
      color: #fff;
      border-radius: 5px;
      top: 40%;
      left: 42%;
      font-size: 8px;
      padding: 2px 5px;
    }

    .visitor, .home {
      text-align: center;
      flex: 1 1 50%;
    }

    .team {

      .team-name {
        display: block;
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
        font-size: .75rem;
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
          font-size: .65rem;
        }
      }

      .visitor, .home {
        max-width: 225px;
      }
    }

  }

  .row.vegas-sh {
    text-align: center;
    margin: 0;

    .odds {
      flex: 1 1 40%;

      &.diff {
        flex: 1 1 20%;
      }

      .title {
        padding: 2px;
        background: #fafafa;
        border-bottom: 1px solid #e3e3e3;
        color: #666;
        font-size: 0.85rem;
        font-family: "EZMedium", sans-serif;
        text-transform: uppercase;
      }
      .value {
        font-size: .85rem;
      }

      @media (max-width: $game-breakpoint) {
        .title, .value {
          font-size: .65rem;
        }
      }
    }
  }


  table {
    margin: 0;

    th {
      padding: 2px;
      text-align: center;
      background: #fafafa;
      border-bottom: 1px solid #e3e3e3;
      color: #666;
      font-size: .85rem;
      font-family: 'EZMedium', sans-serif;
      text-transform: uppercase;

      .team-logo {
        width: 1.25rem;
        display: inline-block;
        vertical-align: middle;
      }

      @media (max-width: $game-breakpoint) {
        font-size: .65rem;
      }

    }
    td {
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
