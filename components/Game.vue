<template>
  <article class="overflow-hidden text-xs rounded shadow-md game">
    <header class="flex justify-between px-2 py-2 bg-gray-800">
      <div class="text-white">{{ game.status.detail }}</div>
      <div class="text-white">
        <span class="font-semibold">KenPom Diff:</span>
        <span class="ml-1 font-bold">{{ game.kpDiff }}</span>
      </div>
    </header>

    <div class="flex flex-wrap px-2 py-2 md:flex-no-wrap">
      <section
        class="flex flex-col content-center justify-center w-1/2 px-1 md:flex-1"
      >
        <div class="flex items-center justify-start py-3">
          <img class="self-center w-8 mr-2 sm:w-6" :src="game.away.logo" />
          <div class="flex flex-col">
            <div class="flex items-center">
              <span
                class="mr-1 font-semibold text-gray-600"
                v-if="game.away.rank"
                >{{ game.away.rank }}</span
              >
              <a
                class="hidden text-sm font-semibold md:block"
                :href="
                  'https://www.espn.com/mens-college-basketball/team/_/id/' +
                    game.away.id
                "
                target="_blank"
                >{{ game.away.shortName }}</a
              >
              <a
                class="block text-sm font-semibold md:hidden"
                :href="
                  'https://www.espn.com/mens-college-basketball/team/_/id/' +
                    game.away.id
                "
                target="_blank"
                >{{ game.away.abbrev }}</a
              >
            </div>
            <p class="text-gray-600 text-xxs">{{ teamRecord("away") }}</p>
          </div>
        </div>
        <div class="flex items-center justify-start py-3">
          <img class="self-center w-8 mr-2 sm:w-6" :src="game.home.logo" />
          <div class="flex flex-col">
            <div class="flex items-center">
              <span
                class="mr-1 font-semibold text-gray-600"
                v-if="game.home.rank"
                >{{ game.home.rank }}</span
              >
              <a
                class="hidden text-sm font-semibold md:block"
                :href="
                  'https://www.espn.com/mens-college-basketball/team/_/id/' +
                    game.home.id
                "
                target="_blank"
                >{{ game.home.shortName }}</a
              >
              <a
                class="block text-sm font-semibold md:hidden"
                :href="
                  'https://www.espn.com/mens-college-basketball/team/_/id/' +
                    game.home.id
                "
                target="_blank"
                >{{ game.home.abbrev }}</a
              >
            </div>
            <p class="text-gray-600 text-xxs">{{ teamRecord("home") }}</p>
          </div>
        </div>
      </section>

      <section
        class="flex flex-col content-center justify-center w-1/2 px-4 md:flex-1"
      >
        <div class="flex items-center justify-center py-3">
          <p class="w-1/2 mr-2 text-xl font-semibold text-right text-gray-800">
            {{ game.prediction.awayTotal }}
          </p>
          <p class="w-1/2 text-xs text-left text-gray-500">
            {{ game.prediction.awayWinPerc }}%
          </p>
        </div>
        <div class="flex items-center justify-center py-3">
          <p class="w-1/2 mr-2 text-xl font-semibold text-right text-gray-800">
            {{ game.prediction.homeTotal }}
          </p>
          <p class="w-1/2 text-xs text-left text-gray-500">
            {{ game.prediction.homeWinPerc }}%
          </p>
        </div>
      </section>

      <section
        class="flex flex-col content-center justify-center w-full md:w-5/12"
      >
        <table
          class="mb-2 bg-gray-100 border-t border-b border-separate border-gray-300 table-fixed"
        >
          <thead>
            <tr>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">V-Line</th>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">SH-Line</th>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">Diff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-semibold text-center text-gray-800">
                {{ game.odds.vegasLine }}
              </td>
              <td class="font-semibold text-center text-gray-800">
                {{ shLine() }}
              </td>
              <td class="font-bold text-center text-gray-800">
                {{ game.lineDiff }}
              </td>
            </tr>
          </tbody>
        </table>
        <table
          class="bg-gray-100 border-t border-b border-separate border-gray-300 table-fixed"
        >
          <thead>
            <tr>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">V-Total</th>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">SH-Total</th>
              <th class="w-1/3 text-gray-600 uppercase text-xxs">Diff</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-semibold text-center text-gray-800">
                {{ game.odds.vegasTotal }}
              </td>
              <td class="font-semibold text-center text-gray-800">
                {{ game.prediction.total }}
              </td>
              <td class="font-bold text-center text-gray-800">
                {{ game.totalDiff }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="border-t border-gray-300">
      <p
        class="py-1 font-semibold text-center text-gray-700 uppercase bg-gray-100"
      >
        KenPom Ranks
      </p>
      <table class="py-2 bg-white border-separate table-auto">
        <thead>
          <tr>
            <th class="font-semibold text-gray-600 uppercase text-xxs"></th>
            <th class="font-semibold text-gray-600 uppercase text-xxs">Rank</th>
            <th class="font-semibold text-gray-600 uppercase text-xxs">Off</th>
            <th class="font-semibold text-gray-600 uppercase text-xxs">Def</th>
            <th class="font-semibold text-gray-600 uppercase text-xxs">SoS</th>
            <th class="font-semibold text-gray-600 uppercase text-xxs">
              Tempo
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img
                class="self-center w-6 ml-auto mr-auto"
                :src="game.away.logo"
              />
            </td>
            <td class="text-center">
              {{ game.away.kenPom.rank
              }}<sup>{{ ordinalSuffix(game.away.kenPom.rank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.away.kenPom.adjORank
              }}<sup>{{ ordinalSuffix(game.away.kenPom.adjORank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.away.kenPom.adjDRank
              }}<sup>{{ ordinalSuffix(game.away.kenPom.adjDRank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.away.kenPom.sosAdjEMRank
              }}<sup>{{ ordinalSuffix(game.away.kenPom.sosAdjEMRank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.away.kenPom.adjTRank
              }}<sup>{{ ordinalSuffix(game.away.kenPom.adjTRank) }}</sup>
            </td>
          </tr>
          <tr>
            <td>
              <img
                class="self-center w-6 ml-auto mr-auto"
                :src="game.home.logo"
              />
            </td>
            <td class="text-center">
              {{ game.home.kenPom.rank
              }}<sup>{{ ordinalSuffix(game.home.kenPom.rank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.home.kenPom.adjORank
              }}<sup>{{ ordinalSuffix(game.home.kenPom.adjORank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.home.kenPom.adjDRank
              }}<sup>{{ ordinalSuffix(game.home.kenPom.adjDRank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.home.kenPom.sosAdjEMRank
              }}<sup>{{ ordinalSuffix(game.home.kenPom.sosAdjEMRank) }}</sup>
            </td>
            <td class="text-center">
              {{ game.home.kenPom.adjTRank
              }}<sup>{{ ordinalSuffix(game.home.kenPom.adjTRank) }}</sup>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="game.note" class="px-1 py-1 text-center bg-gray-200 border-t">
      <p class="text-gray-600 text-xxs">{{ game.note }}</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "Game",
  props: {
    game: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    teamRecord(homeAway) {
      const team = this.game[homeAway];
      let totalRecord = team.totalRecord;
      let ahRecord = team.ahRecord;
      let vsConfRecord = team.vsConfRecord;
      let conf = team.kenPom.conf ? team.kenPom.conf : "";

      if (totalRecord && conf && vsConfRecord) {
        return `(${totalRecord}, ${vsConfRecord} ${conf})`;
      } else if (totalRecord && ahRecord) {
        return `${totalRecord}, ${ahRecord} ${homeAway}`;
      } else {
        return "";
      }
    },
    shLine() {
      let aline = this.game.prediction ? this.game.prediction.awayLine : "-";
      let hline = this.game.prediction ? this.game.prediction.homeLine : "-";

      if (aline === 0 && hline === 0) {
        return "even";
      } else {
        if (aline > 0) {
          return `${this.game.away.abbrev} ${hline}`;
        } else {
          return `${this.game.home.abbrev} ${aline}`;
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
};
</script>

<style></style>
