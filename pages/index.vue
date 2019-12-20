<template>
  <section class="w-full py-8 px-3">

    <div class="flex content-center justify-center mb-6">
      <svg class="fill-current text-gray-700 h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"/>
      </svg>
      <p class="font-bold text-center text-gray-700 text-lg pb-4">{{ date }}</p>
    </div>
    
    <tabs>
      
      <tab :name="'pregames'" :value="'PreGames ('+preGames.length+')'"  :selected="true">
        <div v-if="!loading && preGames.length > 0">
          <div class="flex flex-wrap -ml-3 -mr-3">
            <div class="w-full sm:w-1/2 p-3 elfadein" :style="{'--animation-order': index}" v-for="(game, index) in preGames" :key="game.id">
              <Game :game="game" />
            </div>
          </div>
        </div>
        <div v-else-if="loading">
          <div class="flex flex-wrap -ml-3 -mr-3">
            <div class="w-full sm:w-1/2 p-3" v-for="index in 6" :key="index">
              <SkeletonBox />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
              <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p class="font-bold">No PreGames!</p>
                <p class="text-sm">Either all games have started or there are no games today.</p>
              </div>
            </div>
          </div>
        </div>
      </tab>
      
      <tab :name="'halftime'" :value="'Halftime ('+htGames.length+')'">
        <div v-if="!loading && htGames.length > 0">
          <div class="flex flex-wrap -ml-3 -mr-3">
            <div class="w-full sm:w-1/2 p-3 elfadein" :style="{'--animation-order': index}" v-for="(game, index) in htGames" :key="game.id">
              <HalftimeGame :game="game" />
            </div>
          </div>
        </div>
        <div v-else-if="loading">
          <div class="flex flex-wrap -ml-3 -mr-3">
            <div class="w-full sm:w-1/2 p-3" v-for="index in 4" :key="index">
              <SkeletonBox />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
              <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
              <div>
                <p class="font-bold font">No halftime games!</p>
                <p class="text-sm">There are no games at halftime right now. Check back soon.</p>
              </div>
            </div>
          </div>
        </div>
      </tab>

    </tabs>

  </section>
</template>

<script>
import dayjs from 'dayjs';
import { mapState, mapGetters } from 'vuex';
import Tabs from '@/components/Tabs';
import Tab from '@/components/Tab';
import Game from '@/components/Game';
import HalftimeGame from '@/components/HalftimeGame';
import SkeletonBox from '@/components/SkeletonBox';

export default {
  name: 'Index',
  components: {
    Tab, Tabs, Game, HalftimeGame, SkeletonBox
  },
  data() {
    return {
      activeTab: 'pre'
    }
  },
  created() {
    let queryString = window.location.search;
    let params = new URLSearchParams(queryString);
    let gamesDate = params.get('date');
    if (!gamesDate) {
      gamesDate = dayjs().format('YYYYMMDD')
    }
    this.getGames(gamesDate)
  },
  computed: {
    ...mapState({
      loading: state => state.games.loading,
      date: state => state.games.date,
      htGames: state => state.games.halftime,
      conferences: state => state.games.confereces
    }),
    ...mapGetters({
      preGames: 'games/sortedPreGames'
    })
  },
  methods: {
    async getGames(gamesDate) {
      await this.$store.dispatch('games/getGames', { date: gamesDate })
    }
  }
}
</script>

<style>

</style>
