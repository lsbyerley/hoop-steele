<template>

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
          <div class="column is-6">
            <div class="box">
              <b-field label="Team One">
                <b-autocomplete
                  icon="search"
                  icon-pack="fa"
                  :maxResults="10"
                  v-model="teamOne"
                  placeholder="enter team name"
                  :loading="!ratingsLoaded"
                  :data="filteredTeamOneRatingsArray"
                  field="team"
                  @select="selectTeamOne">
                </b-autocomplete>
              </b-field>
            </div>
          </div>

          <div class="column is-6">
            <div class="box">
              <b-field label="Team Two">
                <b-autocomplete
                  icon="search"
                  icon-pack="fa"
                  :maxResults="10"
                  v-model="teamTwo"
                  placeholder="enter team name"
                  :loading="!ratingsLoaded"
                  :data="filteredTeamTwoRatingsArray"
                  field="team"
                  @select="selectTeamTwo">
                </b-autocomplete>
              </b-field>
            </div>
          </div>
        </div>
      </div>

      <hr>

      <div class="container">
        <p class="has-text-centered" v-if="!selectedTeamOne && !selectedTeamTwo">Pick a team..</p>
        <div class="columns">
          <div class="column is-half">
            <TeamRatings :team="selectedTeamOne"></TeamRatings>
          </div>
          <div class="column is-half">
            <TeamRatings :team="selectedTeamTwo"></TeamRatings>
          </div>
        </div>
      </div>

    </section>

  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TeamRatings from './TeamRatings'
//import { TimelineMax, TweenMax } from 'gsap'

export default {
  name: "Dashboard",
  components: {
    TeamRatings
  },
  data() {
    return {
      teamOne: '',
      teamTwo: ''
    };
  },
  computed: {
    ...mapState([
      "ratingsLoaded",
      "selectedTeamOne",
      "selectedTeamTwo",
      "teamRatings"
    ]),
    filteredTeamOneRatingsArray() {
      if (this.ratingsLoaded) {
        return this.teamRatings.ratings.filter(option => {
          return (
            option.team
              .toString()
              .toLowerCase()
              .indexOf(this.teamOne.toLowerCase()) >= 0
          );
        });
      }
    },
    filteredTeamTwoRatingsArray() {
      if (this.ratingsLoaded) {
        return this.teamRatings.ratings.filter(option => {
          return (
            option.team
              .toString()
              .toLowerCase()
              .indexOf(this.teamTwo.toLowerCase()) >= 0
          );
        });
      }
    },
    sortedTeamRatings() {
      return this.$store.state.teamRatings.sort((a, b) => {
        const teamA = a.team.toUpperCase();
        const teamB = b.team.toUpperCase();

        if (teamA > teamB) {
          return 1;
        } else if (teamA < teamB) {
          return -1;
        }
        return 0;
      });
    }
  },
  methods: {
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
.box.team-compare {
  max-height: 0;
  //display: none;
}
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
