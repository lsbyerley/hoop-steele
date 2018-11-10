const router = require('express').Router()
const cors = require('cors')
const dayjs = require('dayjs')
const axios = require('axios')
const _get = require('lodash/get')
const round = require('lodash/round')
const orderBy = require('lodash/orderBy')
const getTeamRatings = require('./utils/teamRatings')
const gamePredictor = require('./utils/gamePredictor')
const util = require('./utils/util')
const cache = require('./utils/cache')

var corsOptions = {
  origin: 'http://localhost:1234',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/games/:date*?', cors(corsOptions), cache(100), async (req, res) => {

	try{

    //TODO: if its past midnight and games are still going, use the previous day
    const paramDate = req.params.date
    let gamesDate = dayjs().format('YYYYMMDD')
    if (paramDate && paramDate.length === 8) {
      if (dayjs(paramDate).isValid()) {
        gamesDate = paramDate
      }
    }

    const apiBase = 'http://site.web.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'
    const apiParams = '?calendartype=blacklist&limit=300&showAirings=false&lang=en&region=us&contentorigin=espn'
    const url = `${apiBase}${apiParams}&dates=${gamesDate}&groups=50`
    const gamesRes = await axios.get(url)
    const teamRatings = await getTeamRatings()
    //const odds = await util.getOdds()

    let games = []
    let gamesData = _get(gamesRes, 'data.events')
    if (gamesData) {
      gamesData.forEach((game, i) => {

        const startTime = dayjs(_get(game, 'competitions[0].date')).format('h:mm A')
        const teamOne = _get(game, 'competitions[0].competitors[0]')
        const teamTwo = _get(game, 'competitions[0].competitors[1]')
        const spread = _get(game, 'competitions[0].odds[0].details')
        const total = _get(game, 'competitions[0].odds[0].overUnder')
        const status = {
          id: _get(game, 'status.type.id'),
          state: _get(game, 'status.type.state'),
          detail: _get(game, 'status.type.shortDetail')
        }

        let awayTeam = (teamOne.homeAway === "away") ? util.normalizeTeam(teamOne) : util.normalizeTeam(teamTwo)
        let homeTeam = (teamTwo.homeAway === "home") ? util.normalizeTeam(teamTwo) : util.normalizeTeam(teamOne)

        awayTeam.kenPom = teamRatings.ratings.find((tr) => {
          return tr.team === awayTeam.name
        })

        homeTeam.kenPom = teamRatings.ratings.find((tr) => {
          return tr.team === homeTeam.name
        })

        let prediction;
        if (awayTeam.kenPom && homeTeam.kenPom) {
          prediction = gamePredictor(awayTeam.kenPom, homeTeam.kenPom, teamRatings.avgTempo, teamRatings.avgEfficiency)
        }

        if (prediction && (spread || total)) {

          let totalDiff = 0
          if (total) {
            let vegasTotal = parseFloat(total)
            let predictedTotal = parseFloat(prediction.totalOutput)
            totalDiff = (vegasTotal > predictedTotal) ? vegasTotal - predictedTotal : predictedTotal - vegasTotal
            totalDiff = round(totalDiff, 1)
          }

          let spreadDiff = 0
          if (spread) {
            let split = spread.split(' ')
            if (split.length == 2) {
              let vegasSpread = split[1]
              vegasSpread = vegasSpread.replace('-', '')
              vegasSpread = round(vegasSpread, '1')

              let predictedSpread = (prediction.away.expectedPointDiff > 0) ? prediction.away.expectedPointDiff : prediction.home.expectedPointDiff
              spreadDiff = (vegasSpread > predictedSpread) ? vegasSpread - predictedSpread : predictedSpread - vegasSpread
              spreadDiff = round(spreadDiff, '1')
            }
          }

          let shFactor = spreadDiff + totalDiff
          shFactor = round(shFactor, '1')

          games.push({
            id: game.id,
            startTime,
            neutralSite: _get(game, 'competitions[0].neutralSite'),
            status: status,
            away: awayTeam,
            home: homeTeam,
            odds: {
              spread: (spread) ? spread : '-',
              total: (total) ? total : '-'
            },
            prediction,
            totalDiff,
            spreadDiff,
            shFactor,
          })
        }

      })
    }

    games = orderBy(games, ['shFactor'], ['desc'])

    return res.status(200).json({
      date: dayjs(gamesDate).format('dddd MMMM D'),
      total: games.length,
      games: games
    })

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
