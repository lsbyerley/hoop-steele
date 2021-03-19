import Vue from 'vue';

export const state = () => ({
  date: '',
  pre: [],
  halftime: [],
  conferences: [],
  loading: false,
  isError: false,
  refreshing: false,
  sortType: 'kpDiff',
  errorNote: '',
});

export const actions = {
  async getGames({ commit, state }) {
    try {
      commit('setLoading', { loading: true });
      const gamesPromise = this.$api.games.get(state.date);
      const gamesRes = await gamesPromise;

      commit('setData', {
        pre: gamesRes.games,
        halftime: gamesRes.htGames,
        conferences: gamesRes.confs,
      });
      commit('setLoading', { loading: false });
      commit('setError', { error: false });
    } catch (err) {
      commit('setLoading', { loading: false });
      commit('setError', { isError: true, errorNote: `${err.name}: ${err.message}` });
    }
  },
  async refreshGames({ commit, state }) {
    try {
      commit('setRefreshing', { refreshing: true });
      const gamesPromise = this.$api.games.get(state.date);
      const gamesRes = await gamesPromise;

      commit('setData', {
        pre: gamesRes.games,
        halftime: gamesRes.htGames,
        conferences: gamesRes.confs,
      });
      commit('setRefreshing', { refreshing: false });
    } catch (err) {
      commit('setRefreshing', { refreshing: false });
      commit('setError', { isError: true, errorNote: `${err.name}: ${err.message}` });
    }
  },
};

export const mutations = {
  setLoading(state, payload) {
    Vue.set(state, 'loading', payload.loading);
  },
  setError(state, payload) {
    Vue.set(state, 'error', payload.isError);
    Vue.set(state, 'errorNote', payload.errorNote);
  },
  setRefreshing(state, payload) {
    Vue.set(state, 'refreshing', payload.refreshing);
  },
  setDate(state, payload) {
    Vue.set(state, 'date', payload.date);
  },
  setData(state, payload) {
    Vue.set(state, 'pre', payload.pre);
    Vue.set(state, 'halftime', payload.halftime);
    Vue.set(state, 'conferences', payload.conferences);
  },
  setSortType(state, payload) {
    Vue.set(state, 'sortType', payload.sortType);
  },
};

export const getters = {
  sortedPreGames: (state) => {
    let sortedGames = state.pre.slice().sort((a, b) => {
      let aVal = a[state.sortType];
      let bVal = b[state.sortType];

      if (aVal == '-' || aVal == '') {
        aVal = 0;
      }
      if (bVal == '-' || bVal == '') {
        bVal = 0;
      }

      if (state.sortType === 'winPerc') {
        aVal =
          parseFloat(a.prediction.awayWinPerc) > parseFloat(a.prediction.homeWinPerc)
            ? parseFloat(a.prediction.awayWinPerc)
            : parseFloat(a.prediction.homeWinPerc);

        bVal =
          parseFloat(b.prediction.awayWinPerc) > parseFloat(b.prediction.homeWinPerc)
            ? parseFloat(b.prediction.awayWinPerc)
            : parseFloat(b.prediction.homeWinPerc);
      }

      if (aVal > bVal) {
        return -1;
      }
      if (aVal < bVal) {
        return 1;
      }
      return 0;
    });
    return sortedGames;
  },
};
