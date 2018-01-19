<template>
  <div class="card team-rating" v-if="team != null">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img v-bind:src="getTeamLogo(team)">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">{{ team.team }}</p>
          <p class="subtitle is-6">Conf: {{ team.conf }} Record: {{ team.record }}</p>
        </div>
      </div>
      <div class="content">
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">{{ statColumnDesc.rank.abbrev }}</p>
              <p class="title">
                {{ team.rank }}
                <sup class="ordinal">{{ getOrdinal(team.rank) }}</sup>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Offense</p>
              <p class="title">
                {{ team.adjORank }}
                <sup class="ordinal">{{ getOrdinal(team.adjORank) }}</sup>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Defense</p>
              <p class="title">
                {{ team.adjDRank }}
                <sup class="ordinal">{{ getOrdinal(team.adjDRank) }}</sup>
              </p>
            </div>
          </div>
        </div>
        <div class="level is-mobile">
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Tempo</p>
              <p class="title">
                {{ team.adjTRank }}
                <sup class="ordinal">{{ getOrdinal(team.adjTRank) }}</sup>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">SoS Rank</p>
              <p class="title">
                {{ team.sosAdjEMRank }}
                <sup class="ordinal">{{ getOrdinal(team.sosAdjEMRank) }}</sup>
              </p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
              <p class="heading">Non-Conf SoS Rank</p>
              <p class="title">
                {{ team.nonConfAdjEMRank }}
                <sup class="ordinal">{{ getOrdinal(team.nonConfAdjEMRank) }}</sup>
              </p>
            </div>
          </div>
          <!--<div class="level-item has-text-centered">
            <div>
              <p class="heading">Luck</p>
              <p class="title">
                {{ team.luckRank }}
                <sup class="ordinal">{{ getOrdinal(team.luckRank) }}</sup>
              </p>
            </div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamData from '../teamData'

export default {
  name: "TeamRatings",
  data() {
    return {
      teamData: teamData,
      tooltipActive: true,
      statColumnDesc: {
        rank: {
          "abbrev": "KenPom Rank",
          "desc": "KenPom Rank"
        },
        record: {
          "abbrev": "Record",
          "desc": "Win-Loss Record"
        },
        conf: {
          "abbrev": "Conference",
          "desc": "Conference Affiliation"
        },
        adjEM: {
          "abbrev": "Efficiency Margin",
          "desc": "Adjusted Efficiency Margin"
        },
        adjO: {
          "abbrev": "Offensive Efficiency",
          "desc": "Adjusted Offensive Efficiency: Points scored per 100 possessions (adjusted for opponent)"
        },
        adjD: {
          "abbrev": "Defensive Efficiency",
          "desc": "Adjusted Defensive Efficiency: Points allowed per 100 possessions (adjusted for opponent)"
        },
        adjT: {
          "abbrev": "Tempo",
          "desc": "Adjusted Tempo: Possessions per 40 minutes (adjusted for opponent)"
        },
        luck: {
          "abbrev": "Luck",
          "desc": "Luck Rating"
        },
        sosAdjEM: {
          "abbrev": "SoS Rating",
          "desc": "Strength of Schedule Rating"
        },
        sosOppO: {
          "abbrev": "SoS Offensive Efficiency",
          "desc": "Average Adjusted Offensive Efficiency of Opposing Offenses"
        },
        sosOppD: {
          "abbrev": "SoS Defensive Efficiency",
          "desc": "Average Adjusted Defensive Efficiency of Opposing Defenses"
        },
        nonConfAdjEM: {
          "abbrev": "Non-Conf SoS",
          "desc": "Non-Conference Strength of Schedule Rating"
        }
      }
    }
  },
  props: {
    team: {
      type: Object,
      default: null
    }
  },
  methods: {
    getTeamLogo(team) {
      const matchedTeam = this.teamData.find((td) => {
        let match = td.location.replace('State', 'St.')
        return match == team.team
      })

      if (matchedTeam) {
        return `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${matchedTeam.id}.png&h=150&w=150`
      } else {
        return 'https://via.placeholder.com/150x150'
      }
    },
    getOrdinal(n) {
    	return n < 11 || n > 13 ? [ 'st', 'nd', 'rd', 'th' ][ Math.min(( n - 1 ) % 10, 3 )] : 'th';
    },
    teamStatClass(teamOneRank, teamTwoRank) {
      teamOneRank = parseInt(teamOneRank, 10);
      teamTwoRank = parseInt(teamTwoRank, 10);
      return {
        "is-success": teamOneRank < teamTwoRank,
        "is-danger": teamOneRank > teamTwoRank
      };
    }
  }
}
</script>

<style scoped lang="scss">

.card.team-rating {

  .content .level-item {
    width: 33%;
  }

  .media {
    background: #e9e9e9;
    padding: .5rem;
  }

  sup.ordinal {
    font-size: .8rem;
    margin-left: -4px;
    line-height: .8rem;
  }
}
</style>
