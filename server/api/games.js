const router = require('express').Router()
const cors = require('cors')
const dayjs = require('dayjs')
const axios = require('axios')
const _get = require('lodash/get')
const round = require('lodash/round')
const getTeamRatings = require('./utils/teamRatings')
const gamePredictor = require('./utils/gamePredictor')
const util = require('./utils/util')
const isDev = process.env.ENV === 'dev'

var corsOptions = isDev ? {
  origin: 'http://localhost:1234',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} : {}

router.get('/games/:date*?', cors(corsOptions), async (req, res) => {

	try{

    //TODO: NCAA tourney support (group 100)
    let groups = 50;
    const paramDate = req.params.date
    let gamesDate = dayjs().format('YYYYMMDD');
    if (paramDate && paramDate.length === 8) {
      if (dayjs(paramDate).isValid()) {
        gamesDate = paramDate
      }
    }

    const apiBase = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'
    const apiParams = `lang=en&region=us&calendartype=blacklist&limit=300&tz=America%2FNew_York&groups=${groups}`
    const url = `${apiBase}?${apiParams}&dates=${gamesDate}`
    const gamesRes = await axios.get(url)
    const teamRatings = await getTeamRatings()
    //const odds = await util.getOdds()

    let games = [], inpostGames = [], noOdds = [], nonMatches = [], confs = ['All'];
    let gamesData = _get(gamesRes, 'data.events')

    if (gamesData) {
      gamesData.forEach((game, i) => {

        const startTime = dayjs(_get(game, 'competitions[0].date')).format('h:mm A')
        const teamOne = _get(game, 'competitions[0].competitors[0]')
        const teamTwo = _get(game, 'competitions[0].competitors[1]')
        let vegasLine = _get(game, 'competitions[0].odds[0].details')
        let vegasTotal = _get(game, 'competitions[0].odds[0].overUnder')
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

        let prediction, kpDiff = 0;
        if (awayTeam.kenPom && homeTeam.kenPom) {
          prediction = gamePredictor(neutralSite, awayTeam.kenPom, homeTeam.kenPom, teamRatings.avgTempo, teamRatings.avgEfficiency)
          kpDiff = Math.abs(awayTeam.kenPom.rank - homeTeam.kenPom.rank);
        }

        if (!awayTeam.kenPom) {
          nonMatches.push('Away - '+awayTeam.name)
        }
        if (!homeTeam.kenPom) {
          nonMatches.push('Home - '+homeTeam.name)
        }

        let totalDiff = 0,
          lineDiff = 0,
          shFactor = 0,
          addPre = false;

        if (prediction && (vegasLine || vegasTotal)) {

          addPre = true;

          if (vegasTotal && vegasTotal > 0) {
            totalDiff = Math.abs(vegasTotal - prediction.total)
            totalDiff = round(totalDiff, 1)
          }

          if (vegasLine) {

            let vegasSpread = 0
            if (vegasLine !== 'EVEN') {
              let split = vegasLine.split(' ');
              if (split.length == 2) {
                vegasSpread = split[1]
                vegasSpread = vegasSpread.replace('-', '')
                vegasSpread = round(vegasSpread, '1')
              }
            }

            let shSpread = (prediction.awayLine > 0) ? prediction.awayLine : prediction.homeLine
            lineDiff = (vegasSpread > shSpread) ? vegasSpread - shSpread : shSpread - vegasSpread
            //lineDiff = Math.abs(vegasSpread - shSpread)
            lineDiff = round(lineDiff, '1')
          }

          shFactor = lineDiff + totalDiff
          shFactor = round(shFactor, '1')
        }

        let g = {
          id: game.id,
          date: _get(game, 'competitions[0].date'),
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
          lineDiff,
          kpDiff,
          shFactor,
        }

        if (status.state === "pre" && addPre) {
          //console.log('PREGAME -', g.startTime, g.status.state, g.away.abbrev, g.home.abbrev)
          games.push(g)
          if (awayTeam.kenPom && homeTeam.kenPom) {
            if (awayTeam.kenPom.conf && !confs.includes(awayTeam.kenPom.conf)) {
              confs.push(awayTeam.kenPom.conf)
            }
            if (homeTeam.kenPom.conf && !confs.includes(homeTeam.kenPom.conf)) {
              confs.push(homeTeam.kenPom.conf)
            }
          }
        } else if (status.state === "pre" && !addPre) {
          noOdds.push(g)
        } else if (status.state === "in" || status.state === "post") {
          inpostGames.push(g)
        }

      })
    }

    //console.log('GamesCheck-', 'Pre:', games.length, 'Time:', dayjs().format('YYYYMMDD hh:mm A'))

    return res.status(200).json({
      url,
      date: dayjs(gamesDate).format('MMMM D, YYYY'),
      confs,
      totalGames: (games.length),
      totalInPost: (inpostGames.length),
      totalNoOdds: (noOdds.length),
      nonMatches,
      games: games,
      noOdds,
      inpostGames
    })

	} catch (err) {
    console.error(err)
		return res.status(500).json({ error: 'error in the external games fetch' })
	}

})

module.exports = router
