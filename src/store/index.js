import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'
import { cumulativeDistribution } from '../utils/util'

const apiUrlBase = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000' : '';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    scoreboardLoaded: false,
    ratingsLoaded: false,
    isComparisonActive: false,
    selectedTeamOne: undefined,
    selectedTeamTwo: undefined,
    teamRatings: {},
    scoreboard: {}
  },
  actions: {
    getTeamRatings: ({ commit }) => {
      const url = `${apiUrlBase}/api/team-ratings`
      axios.get(url).then((res) => {
        commit('setTeamRatings', { teamRatings: res.data })
        commit('setRatingsLoaded', { ratingsLoaded: true })
      }).catch((err) => {
        console.error(err)
      })
    },
    getGames: ({ commit }) => {
      const url = `${apiUrlBase}/api/games`
      axios.get(url).then((res) => {
        commit('setScoreboard', { scoreboard: res.data })
        commit('setScoreboardLoaded', { scoreboardLoaded: true })
      }).catch((err) => {
        console.error(err)
      })
    }
  },
  mutations: {
    setTeamRatings: (state, { teamRatings }) => {
      state.teamRatings = teamRatings
    },
    setRatingsLoaded: (state, { ratingsLoaded }) => {
      state.ratingsLoaded = ratingsLoaded
    },
    setScoreboard: (state, { scoreboard }) => {
      state.scoreboard = scoreboard
    },
    setScoreboardLoaded: (state, { scoreboardLoaded }) => {
      state.scoreboardLoaded = scoreboardLoaded
    },
    setTeamSelected: (state, { team, type }) => {
      const teamToSelect = (type === 'one') ? 'selectedTeamOne' : 'selectedTeamTwo'
      state[teamToSelect] = team;
    },
    setComparisonStatus: (state, { isActive }) => {
      state.isComparisonActive = isActive
    }
  },
  getters: {
    showTeamComparison: state => {
      return state.isComparisonActive
    },
    getScoreboardDate: state => {
        if (state.scoreboardLoaded && state.ratingsLoaded) {
          return state.scoreboard.scoresDateReadable
        }
    },
    gamesWithTeamRatings: state => {
      //https://gamepredict.us/games
      //https://www.reddit.com/r/CollegeBasketball/comments/15d8wc/google_spreadsheet_to_generate_hypothetical/
      if (state.scoreboardLoaded && state.ratingsLoaded) {
        return state.scoreboard.games.map((game) => {

          let awayTeamRating, homeTeamRating, gamePrediction

          for (var rating of state.teamRatings.ratings) {
            if (rating.team === game.away.kpTeamNameMatch || rating.team === game.away.shortName) {
              awayTeamRating = rating
              break;
            }
          }

          for (var rating of state.teamRatings.ratings) {
            if (rating.team === game.home.kpTeamNameMatch || rating.team === game.home.shortName) {
              homeTeamRating = rating
              break;
            }
          }

          if (awayTeamRating && homeTeamRating) {
            const homeCourtAdvantage = 3.75 //Ken Pomeroy purportedly uses 3.75 points for home court advantage
            const standardDeviation = 11 //Ken Pomeroy purportedly uses 11 points for the standard deviation
            const offWeight = 1.014; // Offensive weight for home game? Not sure how accurate these are
            const defWeight = 0.986; // Defensive weight for home game? Not sure how accurate these are
            const D1AverageTempo = state.teamRatings.averageTempo
            const D1AverageEfficiency = state.teamRatings.averageEfficiency

            // AWAY TEAM VARIABLES
            const awayAdjEM = parseFloat(awayTeamRating.adjEM)
            const awayTempo = awayTeamRating.adjT
            //const awayOffensiveEfficiency = awayTeamRating.adjO
            //const awayDefensiveEfficiency = awayTeamRating.adjD
            const awayOffensiveEfficiency = awayTeamRating.adjO * defWeight;
            const awayDefensiveEfficiency = awayTeamRating.adjD * offWeight;

            // HOME TEAM VARIABLES
            const homeAdjEM = parseFloat(homeTeamRating.adjEM)
            const homeTempo = homeTeamRating.adjT
            //const homeOffensiveEfficiency = homeTeamRating.adjO
            //const homeDefensiveEfficiency = homeTeamRating.adjD
            const homeOffensiveEfficiency = homeTeamRating.adjO * offWeight
            const homeDefensiveEfficiency = homeTeamRating.adjD * defWeight

            // EXPECTED TEMPO
            const expectedTempo = D1AverageTempo * (awayTempo/D1AverageTempo) * (homeTempo/D1AverageTempo)

            // AWAY POINT DIFFERENTIAL AND WIN PROBABILITY
            const awayPointDiff = ((awayAdjEM - homeAdjEM) * (awayTempo + homeTempo) / 200) - homeCourtAdvantage
            const awayWinProbability = cumulativeDistribution(awayPointDiff, 0, standardDeviation)

            // HOME POINT DIFFERENTIAL AND WIN PROBABILITY
            const homePointDiff = ((homeAdjEM - awayAdjEM) * (awayTempo + homeTempo) / 200) + homeCourtAdvantage
            const homeWinProbability = cumulativeDistribution(homePointDiff, 0, standardDeviation)

            // AWAY AND HOME EXPECTED OUTPUT
            const awayExpectedOutput = (awayOffensiveEfficiency/D1AverageEfficiency) * (homeDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)
            const homeExpectedOutput = (homeOffensiveEfficiency/D1AverageEfficiency) * (awayDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)

            game.expectedTempo = expectedTempo
            game.home.predictions = {
              expectedPointDiff: homePointDiff.toFixed(1),
              winProbability: (homeWinProbability * 100).toFixed(1) + '%',
              expectedOutput: homeExpectedOutput.toFixed(1)
            }
            game.away.predictions = {
              expectedPointDiff: awayPointDiff.toFixed(1),
              winProbability: (awayWinProbability * 100).toFixed(1) + '%',
              expectedOutput: awayExpectedOutput.toFixed(1)
            }
          }

          game.away.kenPomRating = awayTeamRating
          game.home.kenPomRating = homeTeamRating

          return game
        })
      }
    }
  }
})
