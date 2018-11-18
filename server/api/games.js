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

router.get('/games/:date*?', cors(corsOptions), /*cache(100),*/ async (req, res) => {

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
    const apiParams = '?tz=America/New_York&calendartype=blacklist&limit=300&showAirings=false&lang=en&region=us&contentorigin=espn'
    const url = `${apiBase}${apiParams}&dates=${gamesDate}&groups=50`
    const gamesRes = await axios.get(url)
    const teamRatings = await getTeamRatings()
    //const odds = await util.getOdds()

    let preGames = [], inpostGames = [], noOdds = [], nonMatches = [];
    let gamesData = _get(gamesRes, 'data.events')
    if (gamesData) {
      gamesData.forEach((game, i) => {

        const startTime = dayjs(_get(game, 'competitions[0].date')).format('h:mm A')
        const teamOne = _get(game, 'competitions[0].competitors[0]')
        const teamTwo = _get(game, 'competitions[0].competitors[1]')
        const vegasLine = _get(game, 'competitions[0].odds[0].details')
        const vegasTotal = _get(game, 'competitions[0].odds[0].overUnder')
        const neutralSite = _get(game, 'competitions[0].neutralSite')
        const note = _get(game, 'competitions[0].notes[0].headline')
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
          prediction = gamePredictor(neutralSite, awayTeam.kenPom, homeTeam.kenPom, teamRatings.avgTempo, teamRatings.avgEfficiency)
        }

        if (!awayTeam.kenPom) {
          nonMatches.push('Away - '+awayTeam.name)
        }
        if (!homeTeam.kenPom) {
          nonMatches.push('Home - '+homeTeam.name)
        }

        let totalDiff = 0,
          spreadDiff = 0,
          shFactor = 0,
          addPre = false;

        if (prediction && (vegasLine || vegasTotal)) {

          addPre = true;

          if (vegasTotal && vegasTotal > 0) {
            totalDiff = (vegasTotal > prediction.total) ? vegasTotal - prediction.total : prediction.total - vegasTotal
            totalDiff = round(totalDiff, 1)
          }

          if (vegasLine) {
            let split = vegasLine.split(' ')
            if (split.length == 2) {
              let vegasSpread = split[1]
              vegasSpread = vegasSpread.replace('-', '')
              vegasSpread = round(vegasSpread, '1')

              let shSpread = (prediction.awayLine > 0) ? prediction.awayLine : prediction.homeLine
              spreadDiff = (vegasSpread > shSpread) ? vegasSpread - shSpread : shSpread - vegasSpread
              spreadDiff = round(spreadDiff, '1')
            }
          }

          shFactor = spreadDiff + totalDiff
          shFactor = round(shFactor, '1')
        }

        let g = {
          id: game.id,
          startTime,
          neutralSite,
          note,
          status: status,
          away: awayTeam,
          home: homeTeam,
          odds: {
            vegasLine: (vegasLine) ? vegasLine : '-',
            vegasTotal: (vegasTotal) ? vegasTotal : '-'
          },
          prediction,
          totalDiff,
          spreadDiff,
          shFactor,
        }

        if (status.state === "pre" && addPre) {
          preGames.push(g)
        } else if (status.state === "pre" && !addPre) {
          noOdds.push(g)
        } else if (status.state === "in" || status.state === "post") {
          inpostGames.push(g)
        }

      })
    }

    preGames = orderBy(preGames, ['shFactor'], ['desc'])

    return res.status(200).json({
      url,
      date: dayjs(gamesDate).format('dddd MMMM D'),
      totalPre: (preGames.length),
      totalInPost: (inpostGames.length),
      totalNoOdds: (noOdds.length),
      nonMatches,
      preGames,
      noOdds,
      inpostGames
    })

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
