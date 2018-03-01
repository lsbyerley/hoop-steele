const moment = require('moment');
const axios = require('axios');
const kpMatches = require('../utils/kpMatches');

//might be able to do something with this clubhouse feed
//http://site.api.espn.com/apis/v2/flex?league=mens-college-basketball&team=2193&pubkey=ncb-clubhouse&contentorigin=espn
//http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/bpi/season?contentorigin=espn&sort=bpirank:asc,bpi:asc&limit=351&groups=50

function getGames(scoreboardDate) {

  return new Promise((resolve, reject) => {

    const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&lang=en&region=us&contentorigin=espn&tz=America/New_York&limit=300&dates='+scoreboardDate;

    axios.get(url).then((resp) => {

  		let events = resp.data.events
  		const games = events.map((event) => {

  			const statusState = event.competitions[0].status.type.state
  			const gameDate = moment(event.date).format('MMMM Do YYYY')
  			const gameTime = moment(event.date).format('h:mm A')
  			const isConfGame = event.competitions[0].conferenceCompetition

  			let gameOdds = {}
  			if (event.competitions[0].odds && event.competitions[0].odds.length > 0) {
  				gameOdds.spread = event.competitions[0].odds[0].details
  				gameOdds.ou = event.competitions[0].odds[0].overUnder
  			}

  			let statusText = '';
  			if (statusState === 'pre') {
  				statusText = `${gameTime} EST`
  			} else {
  				statusText = event.competitions[0].status.type.detail
  			}

  			let broadcast = ''
  			if (event.competitions[0].geoBroadcasts && event.competitions[0].geoBroadcasts.length > 0) {
  				broadcast = event.competitions[0].geoBroadcasts[0].media.shortName
  			}

        let gameNote = ''
        if (event.competitions[0].notes && event.competitions[0].notes.length > 0) {
          gameNote = event.competitions[0].notes[0].headline
        }

  			const teamA = (event.competitions[0].competitors[0].homeAway === "away") ? event.competitions[0].competitors[0] : event.competitions[0].competitors[1]
  			const awayTeam = normalizeTeam(teamA, gameOdds)

  			const teamB = (event.competitions[0].competitors[0].homeAway === "home") ? event.competitions[0].competitors[0] : event.competitions[0].competitors[1]
  			const homeTeam = normalizeTeam(teamB, gameOdds)

  			const venueName = event.competitions[0].venue.fullName
  			const venueLocation = `${event.competitions[0].venue.address.city}, ${event.competitions[0].venue.address.state}`

        const neutralSite = event.competitions[0].neutralSite

  			return {
  				id: event.id,
          neutralSite,
          gameNote,
  				gameDate,
  				gameTime,
  				state: statusState,
  				statusText,
  				venueName,
  				venueLocation,
  				away: awayTeam,
  				home: homeTeam,
  				gameOdds,
  				broadcast,
  				isConfGame
  			}

  		})

      resolve(games)

    }).catch((err) => {
      reject(err)
    })

  })

}

function normalizeTeam(obj, gameOdds) {

	const teamAbbrev = obj.team.abbreviation
	const teamLocation = obj.team.location
	let overallRecord, confRecord, record;
	if (obj.records) {
		overallRecord = obj.records.find((r) => {
			return r.type === "total"
		})
		confRecord = obj.records.find((r) => {
			return r.type === "vsconf"
		})
		record = `${overallRecord.summary} (${confRecord.summary})`
	}

	let teamSpread = '';
	if ( Object.keys(gameOdds).length > 0) {
		if (gameOdds.spread) {
			const split = gameOdds.spread.split(' ')
			const spreadTeam = split[0]
			const spread = split[1]

			if (teamAbbrev.includes(spreadTeam) || spreadTeam.includes(teamAbbrev)) {
				teamSpread = spread
			} else {
				teamSpread = `${spread.replace('-','+')}`
			}
		}
	}

	let rank
	if (obj.curatedRank && obj.curatedRank.current !== 99) {
		rank = obj.curatedRank.current
	}

	let location = obj.team.location
	if (kpMatches[obj.team.id]) {
		location = kpMatches[obj.team.id].kpTeamName
	}

	return {
		id: obj.team.id,
		location,
		name: obj.team.name,
		shortName: obj.team.shortDisplayName,
		abbrev: teamAbbrev,
		rank,
		teamSpread,
		score: obj.score,
		color: obj.team.color,
		confId: parseInt(obj.team.conferenceId),
		record: record,
		logo: `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${obj.team.id}.png&h=150&w=150`
	}
}

module.exports = getGames
