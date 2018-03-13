import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { conferences } from '@/utils/cbbData'

Vue.use(Vuex)

let defaultFilters = [
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
      neutralSite: false,
      selectedAwayTeam: {},
      selectedHomeTeam: {},
      filterOptions: {},
      teamRatings: {},
      scoreboard: {}
    },
    actions: {
      async getTeamRatings ({ commit }) {
        try {
          this.$axios.setHeader('bucedup', 'shclient198827')
          const res = await this.$axios.get('/api/team-ratings')
          commit('setTeamRatings', { teamRatings: res.data })
          commit('setRatingsLoaded', { ratingsLoaded: true })
        } catch(err) {
          console.error(err)
        }
      },
      async getGames ({ commit }, payload) {
        let url = `/api/games`
        if (payload && payload.date) {
          const dateParam = moment(payload.date).format('YYYYMMDD')
          url = `${url}/${dateParam}`
        }
        try {
          this.$axios.setHeader('bucedup', 'shclient198827')
          const res = await this.$axios.get(url)
          commit('setScoreboard', { scoreboard: res.data })
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
        } catch(err) {
          console.error(err)
          commit('setScoreboardLoaded', { scoreboardLoaded: true })
          commit('setScoreboardError', { scoreboardError: true })
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
      setNeutralSite: (state, { neutralSite }) => {
        state.neutralSite = neutralSite
      },
      setScoreboardDate: (state, { newDate }) => {
        state.scoreboardDate = newDate
      }
    },
    getters: {
      filterOptions: state => {
        if (state.scoreboardLoaded && state.ratingsLoaded && !state.scoreboardError) {

          if (state.scoreboard.isNCAATournament) {
            defaultFilters = [
              {
                value: 'ncaa-d1',
                display: 'NCAA-D1'
              }
            ]
            return defaultFilters
          } else {
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
    }
  })
}

export default createStore
