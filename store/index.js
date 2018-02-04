import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { conferences } from '@/utils/cbbData'

//const apiUrlBase = (process.env.NODE_ENV === 'development') ? 'http://localhost:8000' : '';
//const apiUrlBase = 'http://localhost:8000'
const apiUrlBase = ''

Vue.use(Vuex)

const defaultFilters = [
  {
    value: 'top-25',
    display: 'Top 25'
  },
  {
    value: 'mid-majors',
    display: 'Mid Majors'
  },
  {
    value: 'ncaa-d1',
    display: 'NCAA-D1'
  }
]

const createStore = () => {
  return new Vuex.Store({
    state: {
      scoreboardLoaded: false,
      scoreboardError: false,
      ratingsLoaded: false,
      isComparisonActive: false,
      selectedAwayTeam: {},
      selectedHomeTeam: {},
      filterOptions: defaultFilters,
      teamRatings: {},
      scoreboard: {}
    },
    actions: {
      async getTeamRatings ({ commit }) {
        try {
          const res = await this.$axios.get('/team-ratings', { headers: { bucedup: 'hsclient198827' } })
          commit('setTeamRatings', { teamRatings: res.data })
          commit('setRatingsLoaded', { ratingsLoaded: true })
        } catch(err) {
          console.error(err)
        }
      },
      async getGames ({ commit }, payload) {
        let url = `/games`
        if (payload && payload.date) {
          const dateParam = moment(payload.date).format('YYYYMMDD')
          url = `${url}/${dateParam}`
        }
        try {
          const res = await this.$axios.get(url, { headers: { bucedup: 'hsclient198827' } })
          commit('setScoreboard', { scoreboard: res.data })
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
        } catch(err) {
          console.error(err)
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
          commit('scoreboardError', { scoreboardError: true })
        }
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

          let totalGames = 0
          let addedFilterOptions = []
          state.scoreboard.games.forEach((game) => {
            totalGames += 1;
            const awayConf = conferences.find(function(conf) {
              return conf.id === game.away.confId
            })
            const homeConf = conferences.find(function(conf) {
              return conf.id === game.home.confId
            })
            if (awayConf && !addedFilterOptions.find(f => f.id === awayConf.id)) {
              addedFilterOptions.push(awayConf)
            }
            if (homeConf && !addedFilterOptions.find(f => f.id === homeConf.id)) {
              addedFilterOptions.push(homeConf)
            }
          })
          addedFilterOptions.sort((a, b) => {
            if (a.display > b.display) { return 1 }
            else if (a.display < b.display) { return -1 }
            return 0;
          })
          const sortedFilterOptions = state.filterOptions.concat(addedFilterOptions)
          return sortedFilterOptions
        }
      }
    }
  })
}

export default createStore
