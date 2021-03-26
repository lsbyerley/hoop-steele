<template>
  <article class="overflow-hidden text-xs rounded shadow-md game halftime">
    <header class="flex justify-between px-2 py-2 bg-gray-800">
      <div class="text-white">{{ game.status.detail }}</div>
      <div class="text-white">
        <span class="font-semibold">KenPom Diff:</span>
        <span class="ml-1 font-bold">{{ game.kpDiff }}</span>
      </div>
    </header>

    <section class="flex px-2 py-2">
      <table class="min-w-full">
        <thead>
          <tr>
            <th></th>
            <th class="text-gray-600 uppercase text-xxs md:text-xs">Score</th>
            <th class="text-gray-600 uppercase text-xxs md:text-xs">3PM-3PA</th>
            <th class="text-gray-600 uppercase text-xxs md:text-xs">Season%</th>
            <th class="text-gray-600 uppercase text-xxs md:text-xs">Surplus 3s</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="surplusDiffClass('away')">
            <td class="flex items-center justify-start py-2 pl-1">
              <img class="self-center w-4 mr-2 sm:w-8" :src="game.away.logo" />
              <div class="flex items-center">
                <span class="mr-1 font-semibold text-gray-600 text-xxs" v-if="game.away.rank">{{
                  game.away.rank
                }}</span>
                <a
                  class="hidden font-semibold md:block"
                  :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.away.id"
                  target="_blank"
                  >{{ game.away.shortName }}</a
                >
                <a
                  class="block font-semibold md:hidden"
                  :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.away.id"
                  target="_blank"
                  >{{ game.away.abbrev }}</a
                >
              </div>
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.away.score }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.away.threePtMade }} - {{ game.away.threePtAtt }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.away.stats.fg3_pct }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.away.stats.surplusThrees }}
            </td>
          </tr>
          <tr :class="surplusDiffClass('home')">
            <td class="flex items-center justify-start py-2 pl-1">
              <img class="self-center w-4 mr-2 sm:w-8" :src="game.home.logo" />
              <div class="flex items-center">
                <span class="mr-1 font-semibold text-gray-600 text-xxs" v-if="game.home.rank">{{
                  game.home.rank
                }}</span>
                <a
                  class="hidden font-semibold md:block"
                  :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.home.id"
                  target="_blank"
                  :src="game.home.logo"
                  >{{ game.home.shortName }}</a
                >
                <a
                  class="block font-semibold md:hidden"
                  :href="'https://www.espn.com/mens-college-basketball/team/_/id/' + game.home.id"
                  target="_blank"
                  :src="game.home.logo"
                  >{{ game.home.abbrev }}</a
                >
              </div>
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.home.score }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.home.threePtMade }} - {{ game.home.threePtAtt }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.home.stats.fg3_pct }}
            </td>
            <td class="text-sm font-semibold text-center text-gray-800">
              {{ game.home.stats.surplusThrees }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="flex items-center justify-center text-gray-700 bg-gray-100">
      <div class="flex-1 w-1/3 px-1 py-2 text-center">
        <h6 class="mb-2 font-medium uppercase text-xxs md:text-xs">Scoring Margin</h6>
        <p class="text-sm font-semibold text-gray-800">
          {{ Math.abs(game.away.score - game.home.score) }}
        </p>
      </div>
      <div class="flex-1 w-1/3 px-1 py-2 text-center">
        <h6 class="mb-2 font-medium uppercase text-xxs md:text-xs">Surplus Diff</h6>
        <p class="text-sm font-semibold text-gray-800">
          {{ game.surplusThreeDiff }}
        </p>
      </div>
      <div class="flex-1 w-1/3 px-1 py-2 text-center">
        <h6 class="mb-2 font-medium uppercase text-xxs md:text-xs">Action</h6>
        <p style="min-height: 21px">
          <svg
            class="w-5 m-auto text-green-800 fill-current"
            v-if="game.halftimeAction === 'yes-bet'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"
            />
          </svg>
          <svg
            class="w-5 m-auto text-red-800 fill-current"
            v-if="game.halftimeAction === 'no-bet'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
            />
          </svg>
        </p>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'Game',
  props: {
    game: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    surplusDiffClass(ah) {
      let result = false;
      let team = this.game[ah];
      if (this.game.halftimeAction === 'yes-bet' && this.game.surplusTeam === ah) {
        result = true;
      }

      return {
        'bg-yellow-200 bg-opacity-75': result,
      };
    },
  },
};
</script>

<style></style>
