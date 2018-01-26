import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

const apiUrlBase = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000' : '';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    scoreboardLoaded: false,
    scoreboardError: false,
    ratingsLoaded: false,
    isComparisonActive: false,
    selectedAwayTeam: undefined,
    selectedHomeTeam: undefined,
    filterOptions: ['Top 25', 'Mid-Majors', 'NCAA-D1'],
    teamRatings: {},
    scoreboard: {}
  },
  actions: {
    getTeamRatings: ({ commit }) => {
      const url = `${apiUrlBase}/api/team-ratings`
      axios.get(url, { headers: { bucedup: 'hsclient198827' } }).then((res) => {
        commit('setTeamRatings', { teamRatings: res.data })
        commit('setRatingsLoaded', { ratingsLoaded: true })
      }).catch((err) => {
        console.error(err)
      })
    },
    getGames: ({ commit }, payload) => {

      let url = `${apiUrlBase}/api/games`
      if (payload && payload.date) {
        const dateParam = moment(payload.date).format('YYYYMMDD')
        url = `${url}/${dateParam}`
      }

      return new Promise((resolve, reject) => {
        commit('setScoreboardLoaded', { scoreboardLoaded: false })
        axios.get(url, { headers: { bucedup: 'hsclient198827' } }).then((res) => {
          commit('setScoreboard', { scoreboard: res.data })
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
          resolve()
        }).catch((err) => {
          console.error(err)
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
          commit('scoreboardError', { scoreboardError: true })
          reject()
        })
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
    setScoreboardError: (state, { scoreboardError }) => {
      state.scoreboardError = scoreboardError
    },
    setTeamSelected: (state, { team, type }) => {
      const teamToSelect = (type === 'away') ? 'selectedAwayTeam' : 'selectedHomeTeam'
      state[teamToSelect] = team
    },
    setScoreboardDate: (state, { newDate }) => {
      state.scoreboardDate = newDate
    }
  },
  getters: {
    filterOptions: state => {
      if (state.scoreboardLoaded && state.ratingsLoaded) {
        let addedFilterOptions = []
        state.scoreboard.games.forEach((game) => {
          if (game.conference && !addedFilterOptions.includes(game.conference)) {
            addedFilterOptions.push(game.conference)
          }
        })
        addedFilterOptions.sort((a, b) => {
          if (a > b) { return 1 }
          else if (a < b) { return -1 }
          return 0;
        })
        const sortedFilterOptions = state.filterOptions.concat(addedFilterOptions)
        return sortedFilterOptions
      }
    }
  }
})
