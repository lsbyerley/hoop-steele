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

          <div class="columns">
            <div class="column">
              <div v-if="gamePrediction" class="box game-prediction">
                <div class="title is-4 has-text-centered">Game Prediction</div>
                <TeamPredictions homeAway="away" :team="selectedAwayTeam" :gamePrediction="gamePrediction"></TeamPredictions>
                <TeamPredictions homeAway="home" :team="selectedHomeTeam" :gamePrediction="gamePrediction"></TeamPredictions>
              </div>
            </div>
          </div>

          <div class="columns">

            <div class="column is-half">
              <div class="box">
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
              <div class="box">
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
import { mapState, mapGetters } from 'vuex'
import TeamRatings from '@/components/compare/TeamRatings'
import TeamPredictions from '@/components/compare/TeamPredictions'
import { predictionMixin } from '@/components/mixins/predictionMixin'
//import { TimelineMax, TweenMax, Back } from 'gsap'

export default {
  name: "TeamCompare",
  components: {
    TeamRatings,
    TeamPredictions
  },
  mixins: [predictionMixin],
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
    //console.log(this.$route.params)
    return {
      awayTeam: (this.$store.state.selectedAwayTeam) ? this.$store.state.selectedAwayTeam.team : '',
      homeTeam: (this.$store.state.selectedHomeTeam) ? this.$store.state.selectedHomeTeam.team : ''
    };
  },
  computed: {
    ...mapState([
      "teamRatings",
      "ratingsLoaded",
      "selectedAwayTeam",
      "selectedHomeTeam"
    ]),
    gamePrediction() {
      if (this.ratingsLoaded && this.selectedAwayTeam && this.selectedHomeTeam) {
        if (Object.keys(this.selectedAwayTeam).length > 0 && Object.keys(this.selectedHomeTeam).length > 0) {
          const avgTempo = this.teamRatings.averageTempo
          const avgEff = this.teamRatings.averageEfficiency
          const prediction = this.buildGamePrediction(this.selectedAwayTeam, this.selectedHomeTeam, avgTempo, avgEff)
          return prediction
        }
      }
    }
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
        this.$store.commit("setTeamSelected", { team: option, type: 'away' })
      } else {
        this.$store.commit("setTeamSelected", { team: {}, type: 'away' })
      }
    },
    selectHomeTeam(option) {
      if (option) {
        this.$store.commit("setTeamSelected", { team: option, type: 'home' })
      } else {
        this.$store.commit("setTeamSelected", { team: {}, type: 'home' })
      }
    }
  },
  destroyed() {
    this.awayTeam = ''
    this.homeTeam = ''
    this.$store.commit("setTeamSelected", { team: {}, type: 'away' })
    this.$store.commit("setTeamSelected", { team: {}, type: 'home' })
  }
};
</script>

<style lang="scss">
.column.compare {
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}
.columns.prediction {
  .column {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
.field {
  text-align: center;
}
.control {
  text-align: center;
}
</style>
