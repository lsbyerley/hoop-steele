import { cumulativeDistribution } from '@/utils/util'
//https://www.reddit.com/r/CollegeBasketball/comments/5xir8t/calculating_win_probability_and_margin_of_victory/

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
      const awayOffensiveEfficiency = awayTeamRating.adjO
      const awayDefensiveEfficiency = awayTeamRating.adjD
      //const awayOffensiveEfficiency = awayTeamRating.adjO * defWeight;
      //const awayDefensiveEfficiency = awayTeamRating.adjD * offWeight;

      // HOME TEAM VARIABLES
      const homeAdjEM = parseFloat(homeTeamRating.adjEM)
      const homeTempo = homeTeamRating.adjT
      const homeOffensiveEfficiency = homeTeamRating.adjO
      const homeDefensiveEfficiency = homeTeamRating.adjD
      //const homeOffensiveEfficiency = homeTeamRating.adjO * offWeight
      //const homeDefensiveEfficiency = homeTeamRating.adjD * defWeight

      // EXPECTED TEMPO
      //const expectedTempoTest = D1AverageTempo * (awayTempo/D1AverageTempo) * (homeTempo/D1AverageTempo)
      const expectedTempo = (awayTempo + homeTempo - D1AverageTempo)

      // AWAY EXPECTED OUTPUT
      //const awayExpectedOutput = (awayOffensiveEfficiency/D1AverageEfficiency) * (homeDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)
      let awayExpectedOutput = ((awayOffensiveEfficiency+homeDefensiveEfficiency-D1AverageEfficiency)/100) * expectedTempo
      awayExpectedOutput = awayExpectedOutput - (homeCourtAdvantage/2)

      // HOME EXPECTED OUTPUT
      //const homeExpectedOutput = (homeOffensiveEfficiency/D1AverageEfficiency) * (awayDefensiveEfficiency/D1AverageEfficiency) * D1AverageEfficiency * (expectedTempo/100)
      let homeExpectedOutput = ((homeOffensiveEfficiency+awayDefensiveEfficiency-D1AverageEfficiency)/100) * expectedTempo
      homeExpectedOutput = homeExpectedOutput + (homeCourtAdvantage/2)

      // AWAY POINT DIFFERENTIAL AND WIN PROBABILITY
      const awayPointDiff = ((awayAdjEM - homeAdjEM) * (awayTempo + homeTempo) / 200) - homeCourtAdvantage
      const awayWinProbability = cumulativeDistribution(awayPointDiff, 0, standardDeviation)

      // HOME POINT DIFFERENTIAL AND WIN PROBABILITY
      const homePointDiff = ((homeAdjEM - awayAdjEM) * (awayTempo + homeTempo) / 200) + homeCourtAdvantage
      const homeWinProbability = cumulativeDistribution(homePointDiff, 0, standardDeviation)

      let fixedValue = 0
      if ( (awayPointDiff>=0 && awayPointDiff<=2) || (homePointDiff>=0 && homePointDiff<=2) ) {
        fixedValue = 1
      }

      return {
        expectedTempo,
        away: {
          expectedPointDiff: parseFloat(awayPointDiff.toFixed(fixedValue)),
          winProbability: (awayWinProbability * 100).toFixed(1) + '%',
          expectedOutput: parseFloat(awayExpectedOutput.toFixed(fixedValue))
        },
        home: {
          expectedPointDiff: parseFloat(homePointDiff.toFixed(fixedValue)),
          winProbability: (homeWinProbability * 100).toFixed(1) + '%',
          expectedOutput: parseFloat(homeExpectedOutput.toFixed(fixedValue))
        }
      }

    }
  }
}
