//TODO: hook up the store, not used yet.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
    gamesDate: '',
    preGames: [],
    htGames: [],
    conferences: [],
		appLoading: false
	},
	actions: {
    async fetchGames({ commit }, payload) {
      commit('setAppLoading', { loading: true })

      const host = process.env.API_HOST
      const url = payload.date ? `${host}/api/games/${payload.date}` : `${host}/api/games`
      const res = await axios.get(url)

      commit('setGames', {
        gamesDate: res.data.gamesDate,
        preGames: res.data.preGames,
        htGames: res.data.htGames,
        conferences: res.data.confs
      })
      commit('setAppLoading', { loading: false })

    }
	},
	mutations: {
    setGames(state, payload) {
      Vue.set(state, 'preGames', payload.preGames),
      Vue.set(state, 'htGames', payload.htGames)
    },
		setAppLoading(state, payload) {
			Vue.set(state, 'appLoading', payload.loading)
		}
	},
	getters: {

	}
})

export default store