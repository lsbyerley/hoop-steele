import Vue from 'vue';

export const state = () => ({
  date: '',
  pre: [],
  halftime: [],
  conferences: [],
  loading: false,
  isError: false,
  sortType: 'kpDiff',
  errorNote: ''
});

export const actions = {
  async getGames({ commit }, params) {
    try {
      commit('setLoading', { loading: true });
      const gamesPromise = this.$api.games.get(params.date)
      const gamesRes = await gamesPromise;

      commit('setData', {
        date: gamesRes.date,
        pre: gamesRes.games,
        halftime: gamesRes.htGames,
        conferences: gamesRes.confs
      });
      commit('setLoading', { loading: false });
      commit('setError', { error: false });
    } catch (err) {
      commit('setLoading', { loading: false });
      commit('setError', { isError: true, errorNote: `${err.name}: ${err.message}` });
    }
  }
};

export const mutations = {
  setLoading(state, payload) {
    Vue.set(state, 'loading', payload.loading);
  },
  setError(state, payload) {
    Vue.set(state, 'error', payload.isError);
    Vue.set(state, 'errorNote', payload.errorNote)
  },
  setData(state, payload) {
    Vue.set(state, 'date', payload.date);
    Vue.set(state, 'pre', payload.pre);
    Vue.set(state, 'halftime', payload.halftime);
    Vue.set(state, 'conferences', payload.conferences);
  },
  setSortType(state, payload) {
    Vue.set(state, 'sortType', payload.sortType)
  }
};

export const getters = {
  sortedPreGames: state => {
    let sortedGames = state.pre.slice().sort((a, b) => {
      let aVal = a[state.sortType]
      let bVal = b[state.sortType]

      if (aVal == '-' || aVal == '') { aVal = 0 }
      if (bVal == '-' || bVal == '') { bVal = 0 }

      if (state.sortType === 'winPerc') {
        aVal = parseFloat(a.prediction.awayWinPerc) > parseFloat(a.prediction.homeWinPerc)
        ? parseFloat(a.prediction.awayWinPerc)
        : parseFloat(a.prediction.homeWinPerc)

        bVal = parseFloat(b.prediction.awayWinPerc) > parseFloat(b.prediction.homeWinPerc)
        ? parseFloat(b.prediction.awayWinPerc)
        : parseFloat(b.prediction.homeWinPerc)

      }

      if (aVal > bVal) { return -1 }
      if (aVal < bVal) { return 1 }
      return 0;
    })
    return sortedGames;
  }
}