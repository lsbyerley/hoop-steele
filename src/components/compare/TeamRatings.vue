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
          <p class="subtitle is-6"><strong>Conf</strong>: {{ team.conf }} <strong>Record</strong>: {{ team.record }}</p>
        </div>
      </div>
      <div class="content">

        <div class="columns is-mobile">
          <div class="column has-text-centered">
            <p class="heading">KenPom</p>
            <p class="title">
              {{ team.rank }}
              <sup class="ordinal">{{ getOrdinal(team.rank) }}</sup>
            </p>
          </div>
          <div class="column has-text-centered">
            <p class="heading">Offense</p>
            <p class="title">
              {{ team.adjORank }}
              <sup class="ordinal">{{ getOrdinal(team.adjORank) }}</sup>
            </p>
          </div>
          <div class="column has-text-centered">
            <p class="heading">Defense</p>
            <p class="title">
              {{ team.adjDRank }}
              <sup class="ordinal">{{ getOrdinal(team.adjDRank) }}</sup>
            </p>
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column has-text-centered">
            <p class="heading">Tempo</p>
            <p class="title">
              {{ team.adjTRank }}
              <sup class="ordinal">{{ getOrdinal(team.adjTRank) }}</sup>
            </p>
          </div>
          <div class="column has-text-centered">
            <p class="heading">SoS Rank</p>
            <p class="title">
              {{ team.sosAdjEMRank }}
              <sup class="ordinal">{{ getOrdinal(team.sosAdjEMRank) }}</sup>
            </p>
          </div>
          <div class="column has-text-centered">
            <p class="heading">Non-Conf SoS</p>
            <p class="title">
              {{ team.nonConfAdjEMRank }}
              <sup class="ordinal">{{ getOrdinal(team.nonConfAdjEMRank) }}</sup>
            </p>
          </div>
          <!--<div class="column has-text-centered">
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
import { teams } from '@/cbbData'
import Fuse from 'fuse.js'

const searchOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [ "location" ]
};
const logoFuse = new Fuse(teams, searchOptions);

export default {
  name: "TeamRatings",
  props: {
    team: {
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
    },
    getOrdinal(n) {
      //TODO: issue with 112th, 212th, 312th
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
@import '~bulma/sass/utilities/mixins';

.card.team-rating {

  @include mobile() {
    box-shadow: none;

    .card-content {
      padding: 0
    }

  }

  .content .column {

    @include mobile() {
      .title {
        font-size: 1.5rem;
      }
    }

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
