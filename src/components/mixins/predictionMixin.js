import { cumulativeDistribution } from '@/utils/util'

export const predictionMixin = {
  methods: {
    buildGamePrediction(awayTeamRating, homeTeamRating, averageTempo, averageEfficiency) {

      //const awayTeamRating = game.away.kenPomRating
      //const homeTeamRating = game.home.kenPomRating
      const homeCourtAdvantage = 3.75 //Ken Pomeroy purportedly uses 3.75 points for home court advantage
      const standardDeviation = 11 //Ken Pomeroy purportedly uses 11 points for the standard deviation
      const offWeight = 1.014; // Offensive weight for home game? Not sure how accurate these are
      const defWeight = 0.986; // Defensive weight for home game? Not sure how accurate these are
      const D1AverageTempo = averageTempo
      const D1AverageEfficiency = averageEfficiency

      // AWAY TEAM VARIABLES
      const awayAdjEM = parseFloat(awayTeamRating.adjEM)
      const awayTempo = awayTeamRating.adjT
      //const awayOffensiveEfficiency = awayTeamRating.adjO
      //const awayDefensiveEfficiency = awayTeamRating.adjD
      const awayOffensiveEfficiency = awayTeamRating.adjO * defWeight;
      const awayDefensiveEfficiency = awayTeamRating.adjD * offWeight;

      // HOME TEAM VARIABLES
      const homeAdjEM = parseFloat(homeTeamRating.adjEM)
      const homeTempo = homeTeamRating.adjT
      //const homeOffensiveEfficiency = homeTeamRating.adjO
      //const homeDefensiveEfficiency = homeTeamRating.adjD
      const homeOffensiveEfficiency = homeTeamRating.adjO * offWeight
      const homeDefensiveEfficiency = homeTeamRating.adjD * defWeight

      // EXPECTED TEMPO
      const expectedTempo = D1AverageTempo * (awayTempo/D1AverageTempo) * (homeTempo/D1AverageTempo)

      // AWAY POINT DIFFERENTIAL AND WIN PROBABILITY
      const awayPointDiff = ((awayAdjEM - homeAdjEM) * (awayTempo + homeTempo) / 200) - homeCourtAdvantage
      const awayWinProbability = cumulativeDistribution(awayPointDiff, 0, standardDeviation)

      // HOME POINT DIFFERENTIAL AND WIN PROBABILITY
      const homePointDiff = ((homeAdjEM - awayAdjEM) * (awayTempo + homeTempo) / 200) + homeCourtAdvantage
      const homeWinProbability = cumulativeDistribution(homePointDiff, 0, standardDeviation)

      // AWAY AND HOME EXPECTED OUTPUT
      const awayExpectedOutput = (awayOffensiveEfficiency/D1AverageEfficiency) * (homeDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)
      const homeExpectedOutput = (homeOffensiveEfficiency/D1AverageEfficiency) * (awayDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)

      return {
        expectedTempo,
        away: {
          expectedPointDiff: awayPointDiff.toFixed(1),
          winProbability: (awayWinProbability * 100).toFixed(1) + '%',
          expectedOutput: awayExpectedOutput.toFixed(1)
        },
        home: {
          expectedPointDiff: homePointDiff.toFixed(1),
          winProbability: (homeWinProbability * 100).toFixed(1) + '%',
          expectedOutput: homeExpectedOutput.toFixed(1)
        }
      }

    }
  }
}
