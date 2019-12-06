<template>
  <transition name="fade" appear>
    <article class="game halftime rounded overflow-hidden shadow-md text-xxs md:text-xs">

      <header class="flex justify-between bg-blue-900 px-2 py-2">
        <div class="text-white">{{ game.status.detail }}</div>
        <div class="text-white">KenPom Diff: {{ game.kpDiff }}</div>
      </header>

      <section class="flex px-2 py-2">

        <table class="table-fixed">
          <thead>
            <tr>
              <th></th>
              <th class="text-gray-600 text-xxs md:text-xs uppercase">Score</th>
              <th class="text-gray-600 text-xxs md:text-xs uppercase">3PM-3PA</th>
              <th class="text-gray-600 text-xxs md:text-xs uppercase">Season%</th>
              <th class="text-gray-600 text-xxs md:text-xs uppercase">Surplus 3s</th>
            </tr>
          </thead>
          <tbody>
            <tr :class="surplusDiffClass('away')">
              <td class="flex pl-1 py-2 justify-start items-center">
                <img class="w-4 sm:w-8 mr-2 self-center" :src="game.away.logo">
                <div class="flex flex-col">
                  <a class="hidden md:block" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.away.id" target="_blank">{{ game.away.shortName }}</a>
                  <a class="block md:hidden" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.away.id" target="_blank">{{ game.away.abbrev }}</a>
                </div>
              </td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.away.score }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.away.threePtMade }} - {{ game.away.threePtAtt }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.away.stats.fg3_pct }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.away.stats.surplusThrees }}</td>
            </tr>
            <tr :class="surplusDiffClass('home')">
              <td class="flex pl-1 py-2 justify-start items-center">
                <img class="w-4 sm:w-8 mr-2 self-center" :src="game.home.logo">
                <div class="flex flex-col">
                  <a class=" hidden md:block" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.home.id" target="_blank" :src="game.home.logo">{{ game.home.shortName }}</a>
                  <a class=" block md:hidden" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.home.id" target="_blank" :src="game.home.logo">{{ game.home.abbrev }}</a>
                </div>
              </td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.home.score }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.home.threePtMade }} - {{ game.home.threePtAtt }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.home.stats.fg3_pct }}</td>
              <td class="text-center text-gray-800 text-sm font-semibold">{{ game.home.stats.surplusThrees }}</td>
            </tr>
          </tbody>
        </table>

      </section>

      <section class="flex justify-center items-center bg-gray-100 text-gray-700">
        <div class="flex-1 w-1/3 text-center py-2 px-1">
          <h6 class="text-xxs font-medium text-xxs md:text-xs uppercase mb-2">Scoring Margin</h6>
          <p class="text-gray-800 text-sm font-semibold">{{ Math.abs(game.away.score - game.home.score) }}</p>
        </div>
        <div class="flex-1 w-1/3 text-center py-2 px-1">
          <h6 class="text-xxs font-medium text-xxs md:text-xs uppercase mb-2">Surplus Diff</h6>
          <p class="text-gray-800 text-sm font-semibold">{{ game.surplusThreeDiff }}</p>
        </div>
        <div class="flex-1 w-1/3 text-center py-2 px-1">
          <h6 class="text-xxs font-medium text-xxs md:text-xs uppercase mb-2">Action</h6>
            <p style="min-height:21px;">
            <svg class="w-5 m-auto fill-current text-green-800" v-if="game.halftimeAction==='yes-bet'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/></svg>
            <svg class="w-5 m-auto fill-current text-red-800" v-if="game.halftimeAction==='no-bet'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"/></svg>
            </p>
        </div>
      </section>

    </article>
  </transition>
</template>

<script>
export default {
  name: 'Game',
  props: {
    game: {
      type: Object,
      default: {}
    }
  },
  methods: {
    surplusDiffClass(ah) {

      let result = false;
      let team = this.game[ah];
      if (this.game.halftimeAction === 'yes-bet' && this.game.surplusTeam === ah) {
        result = true
      } 

      return {
        'bg-yellow-300': result
      }
    }
  }
}
</script>

<style>

</style>