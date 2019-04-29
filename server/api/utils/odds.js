const axios = require('axios');
const _get = require('lodash/get');
const _groupBy = require('lodash/groupBy')
const dayjs = require('dayjs');

async function getOdds() {

  try {
    const url = 'https://www.pinnacle.com/webapi/1.17/api/v1/GuestLines/Deadball/4/493'
    const oddsRes = await axios.get(url)
    let events = _get(oddsRes, 'data.Leagues[0].Events');
    const today = dayjs().format('YYYYMMDD');
    let odds = []

    console.time('filterEvents')
    //events = events.filter(e => dayjs(_get(e, 'DateAndTime')).format('YYYYMMDD') === today)
    //console.log(events.length)
    //events = _groupBy(events, 'EventId')
    //console.log(events.length, events)

    let prevEvent = 0;
    if (events && events.length > 0) {
      for(let i = 0; i <= events.length-1; i++) {
        const event = events[i]
        const periodNum = _get(event, 'PeriodNumber') // 0 equals full game
        const eventDate = dayjs(_get(event, 'DateAndTime')).format('YYYYMMDD')
        const eventId = _get(event, 'EventId')

        if (eventDate === today && periodNum === 0) {
          const participants = _get(event, 'Participants')
          const teamOne = participants.find(p => p.Type === 'Team1')
          const teamTwo = participants.find(p => p.Type === 'Team2')
          const isHandicapEmpty = _get(event, 'IsHandicapEmpty')
          const isMoneylineEmpty = _get(event, 'IsMoneyLineEmpty')
          const isTeamTotalEmpty = _get(event, 'IsTeamTotalsEmpty')

          let gameTotal = _get(event, 'Totals.Min')

          let awayOdds = {
            moneyline: _get(teamOne, 'MoneyLine'),
            teamTotal: _get(teamOne, 'TeamTotals.Min'),
            spread: _get(teamOne, 'Handicap.Min')
          }
          let homeOdds = {
            moneyline: _get(teamTwo, 'MoneyLine'),
            teamTotal: _get(teamTwo, 'TeamTotals.Min'),
            spread: _get(teamTwo, 'Handicap.Min')
          }

          odds.push({
            awayTeam: _get(teamOne, 'Name'),
            homeTeam: _get(teamTwo, 'Name'),
            gameTotal,
            awayOdds,
            homeOdds
          })

          if (eventId != prevEvent) {
            //console.log(eventId)
            prevEvent = eventId
          }
        }
      }
    }
    console.timeEnd('filterEvents')

    return {
      error: false,
      odds
    }

  } catch(err) {
    console.error(err)
    return {
      error: true,
      errorNote: err.message || 'no error message'
    }
  }

}

module.exports = getOdds