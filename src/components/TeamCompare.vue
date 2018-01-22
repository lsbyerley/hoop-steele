<template>

  <section class="page-content">

    <div class="team-compare">

      <section class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">Team Comparison</h1>
            <h2 class="subtitle">Compare offense, defense, and other metrics</h2>
          </div>
        </div>
      </section>

      <section class="section team-select">

        <div class="container">
          <div class="columns">

            <div class="column is-half">
              <div class="box">
                <b-field>
                  <b-autocomplete
                    icon="search"
                    icon-pack="fa"
                    :maxResults="3"
                    v-model="teamOne"
                    placeholder="team one.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('teamOne')"
                    field="team"
                    @select="selectTeamOne">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="!selectedTeamOne">Pick a team..</p>
                <TeamRatings :team="selectedTeamOne"></TeamRatings>
              </div>
            </div>

            <div class="column is-half">
              <div class="box">
                <b-field>
                  <b-autocomplete
                    icon="search"
                    icon-pack="fa"
                    :maxResults="3"
                    v-model="teamTwo"
                    placeholder="team two.."
                    :loading="!ratingsLoaded"
                    :data="filteredTeamRatings('teamTwo')"
                    field="team"
                    @select="selectTeamTwo">
                  </b-autocomplete>
                </b-field>
                <hr>
                <p class="has-text-centered" v-if="!selectedTeamTwo">Pick a team..</p>
                <TeamRatings :team="selectedTeamTwo"></TeamRatings>
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
import TeamRatings from './TeamRatings'
//import { TimelineMax, TweenMax } from 'gsap'

export default {
  name: "TeamCompare",
  components: {
    TeamRatings
  },
  data() {
    return {
      teamOne: (this.$store.state.selectedTeamOne) ? this.$store.state.selectedTeamOne.team : '',
      teamTwo: (this.$store.state.selectedTeamTwo) ? this.$store.state.selectedTeamTwo.team : '',
    };
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "selectedTeamOne",
      "selectedTeamTwo",
      "teamRatings"
    ])
  },
  methods: {
    filteredTeamRatings(type) {
      if (this.ratingsLoaded) {
        const team = (type === 'teamOne') ? this.teamOne : this.teamTwo
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
    selectTeamOne(option) {
      if (option) {
        this.$store.commit("setTeamSelected", { team: option, type: 'one' })
      } else {
        this.$store.commit("setTeamSelected", { team: undefined, type: 'one' })
      }
    },
    selectTeamTwo(option) {
      if (option) {
        this.$store.commit("setTeamSelected", { team: option, type: 'two' })
      } else {
        this.$store.commit("setTeamSelected", { team: undefined, type: 'two' })
      }
    }
  },
  destroyed() {
    this.$store.commit("setTeamSelected", { team: undefined, type: 'one' })
    this.$store.commit("setTeamSelected", { team: undefined, type: 'two' })
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
.field {
  text-align: center;
}
.control {
  text-align: center;
}
</style>
