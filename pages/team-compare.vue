<template>

  <section class="page-content">

    <b-loading :active="!ratingsLoaded" :canCancel="false"></b-loading>

    <div class="team-compare">

      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-4">Team Comparison</h1>
            <h2 class="subtitle is-5">Compare offense, defense, and other metrics</h2>
          </div>
        </div>
      </section>

      <section class="section team-select">

        <div class="container">

          <div class="swap-teams" v-if="Object.keys(selectedAwayTeam).length > 0 && Object.keys(selectedHomeTeam).length > 0">
            <a class="button is-info" @click="swapTeams" :disabled="isSwapDisabled">
              <span class="icon"><i class="fa fa-sliders"></i></span>
              <span>Swap</span>
            </a>
          </div>
          <div class="field" v-if="Object.keys(selectedAwayTeam).length > 0 && Object.keys(selectedHomeTeam).length > 0">
            <b-switch v-model="neutralSite">Neutral Site</b-switch>
          </div>
          <GamePrediction :away="selectedAwayTeam" :home="selectedHomeTeam"></GamePrediction>

          <div class="columns">

            <div class="column is-half">
              <div class="box" ref="awayTeamInput">
                <b-field label="Away Team">
                  <b-autocomplete
                    icon="search"
                    icon-pack="fa"
                    :maxResults="3"
                    v-model="awayTeam"
                    placeholder="type a team name.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('awayTeam')"
                    field="team"
                    @select="selectAwayTeam">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="Object.keys(selectedAwayTeam).length === 0">Pick an away team..</p>
                <TeamRatings :team="selectedAwayTeam"></TeamRatings>
              </div>
            </div>

            <div class="column is-half">
              <div class="box" ref="homeTeamInput">
                <b-field label="Home Team">
                  <b-autocomplete
                    icon="search"
                    icon-pack="fa"
                    :maxResults="3"
                    v-model="homeTeam"
                    placeholder="type a team name.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('homeTeam')"
                    field="team"
                    @select="selectHomeTeam">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="Object.keys(selectedHomeTeam).length === 0">Pick a home team..</p>
                <TeamRatings :team="selectedHomeTeam"></TeamRatings>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>

  </section>

</template>

<script>
import { mapState } from 'vuex'
import TeamRatings from '@/components/compare/TeamRatings'
import GamePrediction from '@/components/compare/GamePrediction'
//import { TimelineMax, TweenMax, Back } from 'gsap'

export default {
  name: 'TeamCompare',
  components: {
    GamePrediction,
    TeamRatings
  },
  async fetch ({ store, params }) {
    if (!store.state.ratingsLoaded) {
      await store.dispatch('getTeamRatings')
    }
  },
  head() {
    return {
      title: 'Team Compare'
    }
  },
  data() {
    return {
      awayTeam: (this.$store.state.selectedAwayTeam) ? this.$store.state.selectedAwayTeam.team : '',
      homeTeam: (this.$store.state.selectedHomeTeam) ? this.$store.state.selectedHomeTeam.team : ''
    };
  },
  computed: {
    isSwapDisabled() {
      return this.$store.state.neutralSite
    },
    neutralSite: {
      get() {
        return this.$store.state.neutralSite
      },
      set(value) {
        this.$store.commit('setNeutralSite', { neutralSite: value })
      }
    },
    ...mapState([
      "teamRatings",
      "ratingsLoaded",
      "selectedAwayTeam",
      "selectedHomeTeam"
    ])
  },
  methods: {
    filteredTeamRatings(type) {
      if (this.ratingsLoaded) {
        if (this.awayTeam || this.homeTeam) {
          const team = (type === 'awayTeam') ? this.awayTeam : this.homeTeam
          if (team) {
            return this.teamRatings.ratings.filter(option => {
              const teamcheck = option.team.toString().toLowerCase();
              return ( teamcheck.indexOf(team.toLowerCase()) >= 0 )
            })
          }
        } else {
          return this.teamRatings.ratings
        }
      }
    },
    selectAwayTeam(option) {
      if (option) {
        this.$store.commit('setTeamSelected', { team: option, type: 'away' })
      } else {
        this.$store.commit('setTeamSelected', { team: {}, type: 'away' })
      }
    },
    selectHomeTeam(option) {
      if (option) {
        this.$store.commit('setTeamSelected', { team: option, type: 'home' })
      } else {
        this.$store.commit('setTeamSelected', { team: {}, type: 'home' })
      }
    },
    swapTeams() {
      if (!this.isSwapDisabled) {
        const selectedAway = this.$store.state.selectedAwayTeam
        const selectedHome = this.$store.state.selectedHomeTeam

        this.$store.commit('setTeamSelected', { team: selectedHome, type: 'away' })
        this.$store.commit('setTeamSelected', { team: selectedAway, type: 'home' })

        this.$nextTick(function () {
          // this is ugly but only way to programmatically change input values with out triggering another change
          this.$refs.awayTeamInput.children[0].children[1].children[0].children[0].value = selectedHome.team
          this.$refs.homeTeamInput.children[0].children[1].children[0].children[0].value = selectedAway.team
        })
      }
    }
  },
  destroyed() {
    this.awayTeam = ''
    this.homeTeam = ''
    this.$store.commit('setTeamSelected', { team: {}, type: 'away' })
    this.$store.commit('setTeamSelected', { team: {}, type: 'home' })
    this.$store.commit('setNeutralSite', { neutralSite: false })
  }
};
</script>

<style scoped lang="scss">
@import '~bulma/sass/utilities/mixins';

.team-select {
  .swap-teams {
    text-align: center;
    margin-bottom: 1rem;
  }
  @include mobile() {
    .swap-teams {
      margin-top: -1.5rem;
    }
  }
  .field {
    text-align: center;
  }
  .control {
    text-align: center;
  }
}
</style>
