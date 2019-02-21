require('dotenv').config()
const axios = require('axios')
const dayjs = require('dayjs')
const _get = require('lodash/get')
const { teams } = require('../data/teams-confs.js')

function normalizeTeam(obj) {

  const teamId = parseInt(_get(obj, 'team.id'))
  let rank = _get(obj, 'curatedRank.current')
  if (rank === 99) {
    rank = ''
  }

  let teamName = _get(obj, 'team.location')
  let kpTeam = teams.find((t) => {
    return t.id === teamId && t.kpTeamName != null
  })

  if (kpTeam) {
    teamName = kpTeam.kpTeamName
  }

  let totalRecord = '',
      vsConfRecord = '',
      ahRecord = '';
  let records = _get(obj, 'records')
  if (records) {
    let tr = records.find((r) => {
      return r.type === 'total'
    })
    if (tr) {
      totalRecord = _get(tr, 'summary')
    }
    let vc = records.find((r) => {
      return r.type === 'vsconf'
    })
    if (vc) {
      vsConfRecord = _get(vc, 'summary')
    }
    if (_get(obj, 'homeAway') === 'away') {
      let ah = records.find((a) => {
        return a.type === 'road'
      })
      if (ah) {
        ahRecord = _get(ah, 'summary')
      }
    } else if (_get(obj, 'homeAway') === 'home') {
      let ah = records.find((h) => {
        return h.type === 'home'
      })
      if (ah) {
        ahRecord = _get(ah, 'summary')
      }
    }
  }

  let ppg = ''
  let statistics = _get(obj, 'statistics')
  if (statistics) {
    avgPoints = statistics.find((s) => {
      return s.name === 'avgPoints'
    })
    if (avgPoints) {
      ppg = avgPoints.displayValue
    }
  }

  return {
    id: teamId,
    abbrev: _get(obj, 'team.abbreviation'),
    name: teamName,
    shortName: _get(obj, 'team.shortDisplayName'),
    nickname: _get(obj, 'team.name'),
    logo: _get(obj, 'team.logo'),
    confId: _get(obj, 'team.conferenceId'),
    score: _get(obj, 'score'),
    rank,
    totalRecord,
    vsConfRecord,
    ahRecord,
    ppg,
  }
}

async function getOdds() {

  const options = {
    url: 'https://jsonodds.com/api/odds/ncaab',
    headers: {
      'x-api-key': process.env.JSONODDS_API_KEY
    }
  }
  const oddsRes = await axios(options)

  let odds = []
  oddsRes.data.forEach((game, i) => {

    const gameOdds = game.Odds.find((o) => {
      return o.OddType === 'Game'
    })
    if (gameOdds) {

      const awayTeam = teams.find((t) => {
        return t.location === game.AwayTeam
      })
      const homeTeam = teams.find((t) => {
        return t.location === game.HomeTeam
      })

      if (awayTeam && homeTeam) {

        //console.log('We Have Both!', awayTeam && homeTeam)
        let spread = '',
            spreadA = gameOdds.PointSpreadAway,
            spreadH = gameOdds.PointSpreadHome,
            awayML = gameOdds.MoneyLineAway,
            homeML = gameOdds.MoneyLineHome;

        if (spreadA.includes('-')) {
          spread = `${awayTeam.abbrev} ${spreadA}`
        } else if (spreadH.includes('-')) {
          spread = `${homeTeam.abbrev} ${spreadH}`
        }

        if (awayML.includes('-')) {
          awayML = `${awayTeam.abbrev} ${awayML}`
        } else {
          awayML = `${awayTeam.abbrev} +${awayML}`
        }

        if (homeML.includes('-')) {
          homeML = `${homeTeam.abbrev} ${homeML}`
        } else {
          homeML = `${homeTeam.abbrev} +${homeML}`
        }

        odds.push({
          date: dayjs(game.MatchTime).subtract(1, 'day').format('YYYYMMDD'),
          awayTeam: game.AwayTeam,
          homeTeam: game.HomeTeam,
          total: gameOdds.TotalNumber,
          spread: spread,
          awayML: awayML,
          homeML: homeML
        })

      }

    }
  })

  return odds

}

module.exports = {
  normalizeTeam,
  getOdds
}
