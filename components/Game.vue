<template>
  <article class="game rounded overflow-hidden shadow-md text-xs">
  
    <header class="flex justify-between bg-gray-800 px-2 py-2">
      <div class="text-white">{{ game.status.detail }}</div>
      <div class="text-white">
        <span class="font-semibold">KenPom Diff:</span>
        <span class="font-bold ml-1">{{ game.kpDiff }}</span>
      </div>
    </header>

    <div class="flex flex-wrap md:flex-no-wrap px-2 py-2">

      <section class="flex w-1/2 md:flex-1 flex-col content-center justify-center px-1">
        <div class="flex py-3 justify-start items-center">
          <img class="w-8 sm:w-6 mr-2 self-center" :src="game.away.logo">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="font-semibold mr-1 text-gray-600" v-if="game.away.rank">{{ game.away.rank }}</span>
              <a class="text-sm font-semibold hidden md:block" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.away.id" target="_blank">{{ game.away.shortName }}</a>
              <a class="text-sm font-semibold block md:hidden" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.away.id" target="_blank">{{ game.away.abbrev }}</a>
            </div>
            <p class="text-gray-600 text-xxs">{{ teamRecord('away') }}</p>
          </div>
        </div>
        <div class="flex py-3 justify-start items-center">
          <img class="w-8 sm:w-6 mr-2 self-center" :src="game.home.logo">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="font-semibold mr-1 text-gray-600" v-if="game.home.rank">{{ game.home.rank }}</span>
              <a class="text-sm font-semibold hidden md:block" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.home.id" target="_blank">{{ game.home.shortName }}</a>
              <a class="text-sm font-semibold block md:hidden" :href="'https://www.espn.com/mens-college-basketball/team/_/id/'+game.home.id" target="_blank">{{ game.home.abbrev }}</a>
            </div>
            <p class="text-gray-600 text-xxs">{{ teamRecord('home') }}</p>
          </div>
        </div>
      </section>

      <section class="flex w-1/2 md:flex-1 flex-col content-center justify-center px-4">
        <div class="flex py-3 items-center justify-center">
          <p class="w-1/2 text-right text-xl text-gray-800 mr-2 font-semibold">{{ game.prediction.awayTotal }}</p>
          <p class="w-1/2 text-left text-xs text-gray-500">{{ game.prediction.awayWinPerc }}%</p>
        </div>
        <div class="flex py-3 items-center justify-center">
          <p class="w-1/2 text-right text-xl text-gray-800 mr-2 font-semibold">{{ game.prediction.homeTotal }}</p>
          <p class="w-1/2 text-left text-xs text-gray-500">{{ game.prediction.homeWinPerc }}%</p>
        </div>
      </section>

      <section class="flex w-full md:w-5/12 flex-col content-center justify-center">
        <table class="table-fixed border-separate bg-gray-100 border-gray-300 border-t border-b mb-2">
          <thead>
            <tr>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">V-Line</th>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">SH-Line</th>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">Diff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center text-gray-800 font-semibold">{{ game.odds.vegasLine }}</td>
              <td class="text-center text-gray-800 font-semibold">{{ shLine() }}</td>
              <td class="text-center text-gray-800 font-bold">{{ game.lineDiff }}</td>
            </tr>
          </tbody>
        </table>
        <table class="table-fixed border-separate bg-gray-100 border-gray-300 border-t border-b">
          <thead>
            <tr>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">V-Total</th>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">SH-Total</th>
              <th class="w-1/3 text-gray-600 text-xxs uppercase">Diff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center text-gray-800 font-semibold">{{ game.odds.vegasTotal }}</td>
              <td class="text-center text-gray-800 font-semibold">{{ game.prediction.total }}</td>
              <td class="text-center text-gray-800 font-bold">{{ game.totalDiff }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="border-t border-gray-300">
      <p class="text-center font-semibold bg-gray-100 text-gray-700 uppercase py-1">KenPom Ranks</p>
      <table class="table-auto border-separate bg-white py-2">
        <thead>
          <tr>
            <th class="text-xxs text-gray-600 uppercase font-semibold"></th>
            <th class="text-xxs text-gray-600 uppercase font-semibold">Rank</th>
            <th class="text-xxs text-gray-600 uppercase font-semibold">Off</th>
            <th class="text-xxs text-gray-600 uppercase font-semibold">Def</th>
            <th class="text-xxs text-gray-600 uppercase font-semibold">SoS</th>
            <th class="text-xxs text-gray-600 uppercase font-semibold">Tempo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img class="w-6 self-center ml-auto mr-auto" :src="game.away.logo" />
            </td>
            <td class="text-center">{{ game.away.kenPom.rank }}<sup>{{ ordinalSuffix(game.away.kenPom.rank) }}</sup></td>
            <td class="text-center">{{ game.away.kenPom.adjORank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjORank) }}</sup></td>
            <td class="text-center">{{ game.away.kenPom.adjDRank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjDRank) }}</sup></td>
            <td class="text-center">{{ game.away.kenPom.sosAdjEMRank }}<sup>{{ ordinalSuffix(game.away.kenPom.sosAdjEMRank) }}</sup></td>
            <td class="text-center">{{ game.away.kenPom.adjTRank }}<sup>{{ ordinalSuffix(game.away.kenPom.adjTRank) }}</sup></td>
          </tr>
          <tr>
            <td>
              <img class="w-6 self-center ml-auto mr-auto" :src="game.home.logo" />
            </td>
            <td class="text-center">{{ game.home.kenPom.rank }}<sup>{{ ordinalSuffix(game.home.kenPom.rank) }}</sup></td>
            <td class="text-center">{{ game.home.kenPom.adjORank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjORank) }}</sup></td>
            <td class="text-center">{{ game.home.kenPom.adjDRank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjDRank) }}</sup></td>
            <td class="text-center">{{ game.home.kenPom.sosAdjEMRank }}<sup>{{ ordinalSuffix(game.home.kenPom.sosAdjEMRank) }}</sup></td>
            <td class="text-center">{{ game.home.kenPom.adjTRank }}<sup>{{ ordinalSuffix(game.home.kenPom.adjTRank) }}</sup></td>
          </tr>
        </tbody>
      </table>
    </div>


    <div v-if="game.note" class="border-t bg-gray-200 text-center px-1 py-1">
      <p class="text-gray-600 text-xxs">{{ game.note }}</p>
    </div>

  </article>
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
    teamRecord(homeAway) {

      const team = this.game[homeAway]
      let totalRecord = team.totalRecord;
      let ahRecord = team.ahRecord;
      let vsConfRecord = team.vsConfRecord;
      let conf = (team.kenPom.conf) ? team.kenPom.conf : ''

      if (totalRecord && conf && vsConfRecord) {
        return `(${totalRecord}, ${vsConfRecord} ${conf})`
      } else if (totalRecord && ahRecord) {
        return `${totalRecord}, ${ahRecord} ${homeAway}`
      } else {
        return ''
      }

    },
    shLine() {
      let aline = (this.game.prediction) ? this.game.prediction.awayLine : '-'
      let hline = (this.game.prediction) ? this.game.prediction.homeLine : '-'

      if (aline === 0 && hline === 0) {
        return 'even'
      } else {
        if (aline > 0) {
          return `${this.game.away.abbrev} ${hline}`
        } else {
          return `${this.game.home.abbrev} ${aline}`
        }
      }
    },  
    ordinalSuffix(i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
        return "st";
      }
      if (j == 2 && k != 12) {
        return "nd";
      }
      if (j == 3 && k != 13) {
        return "rd";
      }
      return "th";
    }
  }
}
</script>

<style>

</style>