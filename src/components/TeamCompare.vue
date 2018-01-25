<template>

  <section class="page-content">

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

            <div class="column is-half">
              <div class="box">
                <b-field label="Away Team">
                  <b-autocomplete
                    icon="search"
                    icon-pack="fa"
                    :maxResults="3"
                    v-model="teamAway"
                    placeholder="type a team name.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('teamAway')"
                    field="team"
                    @select="selectTeamAway">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="!selectedAwayTeam">Pick an away team..</p>
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
                    v-model="teamHome"
                    placeholder="type a team name.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('teamHome')"
                    field="team"
                    @select="selectTeamHome">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="!selectedHomeTeam">Pick a home team..</p>
                <TeamRatings :team="selectedHomeTeam"></TeamRatings>
              </div>
            </div>

          </div>

          <div class="columns">
            <div class="column">
              <div v-if="gamePrediction" class="box game-prediction">
                <div class="title is-4 has-text-centered">Game Prediction</div>
                <TeamPredictions homeAway="away" :team="selectedAwayTeam" :gamePrediction="gamePrediction"></TeamPredictions>
                <TeamPredictions homeAway="home" :team="selectedHomeTeam" :gamePrediction="gamePrediction"></TeamPredictions>
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
import TeamRatings from './compare/TeamRatings'
import TeamPredictions from './compare/TeamPredictions'
import { predictionMixin } from './mixins/predictionMixin'
//import { TimelineMax, TweenMax } from 'gsap'

export default {
  name: "TeamCompare",
  components: {
    TeamRatings,
    TeamPredictions
  },
  mixins: [predictionMixin],
  data() {
    return {
      teamAway: (this.$store.state.selectedAwayTeam) ? this.$store.state.selectedAwayTeam.team : '',
      teamHome: (this.$store.state.selectedHomeTeam) ? this.$store.state.selectedHomeTeam.team : '',
    };
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "selectedAwayTeam",
      "selectedHomeTeam",
      "teamRatings"
    ]),
    gamePrediction() {
      if (this.ratingsLoaded && this.selectedAwayTeam && this.selectedHomeTeam) {
        const prediction = this.buildGamePrediction(this.selectedAwayTeam, this.selectedHomeTeam, this.teamRatings.averageTempo, this.teamRatings.averageEfficiency)
        return prediction
      }
    }
  },
  methods: {
    filteredTeamRatings(type) {
      if (this.ratingsLoaded) {
        const team = (type === 'teamAway') ? this.teamAway : this.teamHome
        return this.teamRatings.ratings.filter(option => {
          return (
            option.team
              .toString()
              .toLowerCase()
              .indexOf(team.toLowerCase()) >= 0
          );
        });
      }
    },
    selectTeamAway(option) {
      if (option) {
        this.$store.commit("setTeamSelected", { team: option, type: 'away' })
      } else {
        this.$store.commit("setTeamSelected", { team: undefined, type: 'away' })
      }
    },
    selectTeamHome(option) {
      if (option) {
        this.$store.commit("setTeamSelected", { team: option, type: 'home' })
      } else {
        this.$store.commit("setTeamSelected", { team: undefined, type: 'home' })
      }
    }
  },
  destroyed() {
    this.$store.commit("setTeamSelected", { team: undefined, type: 'away' })
    this.$store.commit("setTeamSelected", { team: undefined, type: 'home' })
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
