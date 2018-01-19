const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	methodOverride = require('method-override'),
	router = express.Router(),
	path = require('path'),
  axios = require('axios'),
  cheerio = require('cheerio'),
  mcache = require('memory-cache'),
	env = (process.env.NODE_ENV === 'development') ? 'development' : 'production',
	moment = require('moment');

// for all dates
process.env.TZ = 'America/New_York';

// express config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.set('port', process.env.PORT || 8000);

app.use(express.static(__dirname + '/dist'));

// Need to allow cross-domain requests in development since dev runs on webpack-dev-server
if (env === 'development') {
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
}

const cache = function cache(duration) {
	return function(req, res, next) {
		const key = '__hoopsteele-cache-__' + req.originalUrl || req.url;
		const cachedBody = mcache.get(key);
		if (cachedBody) {
			if (env === 'development') { console.log('HITTIN CACHE') }
			res.send(cachedBody);
			return;
		} else {
			if (env === 'development') { console.log('FRESH RESPONSE') }
			res.sendResponse = res.send;
			res.send = function(body) {
				mcache.put(key, body, duration * 1000);
				res.sendResponse(body);
			};
			next();
		}
	};
};

function normalizeTeam(obj, gameOdds) {

	const teamAbbrev = obj.team.abbreviation
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
		const split = gameOdds.spread.split(' ')
		const spreadTeam = split[0]
		const spread = split[1]

		if (teamAbbrev.includes(spreadTeam) || spreadTeam.includes(teamAbbrev)) {
			teamSpread = spread
		} else {
			teamSpread = `${spread.replace('-','+')}`
		}
	}

	let kpTeamNameMatch = obj.team.location
	kpTeamNameMatch = kpTeamNameMatch.replace('St ', 'Saint ')
	kpTeamNameMatch = kpTeamNameMatch.replace('State', 'St.')

	let rank
	if (obj.curatedRank && obj.curatedRank.current !== 99) {
		rank = obj.curatedRank.current
	}

	return {
		id: obj.team.id,
		location: obj.team.location,
		name: obj.team.name,
		shortName: obj.team.shortDisplayName,
		abbrev: teamAbbrev,
		rank,
		teamSpread,
		kpTeamNameMatch,
		score: obj.score,
		color: obj.team.color,
		record: record,
		logo: `http://a1.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/${obj.team.id}.png&h=150&w=150`
	}
}

// define api routes
router.get('/games', cache(100), (req, res) => {

	//const scoresDateParam = moment().format('YYYYMMDD')
	const scoresDateParam = moment().subtract(1, "day").format('YYYYMMDD') //for testing

	const scoresDateReadable = moment(scoresDateParam).format('MMMM Do')

	const url = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=50&lang=en&region=us&contentorigin=espn&tz=America/New_York&limit=300&dates='+scoresDateParam;

	axios.get(url).then((resp) => {

		let events = resp.data.events
		const games = events.map((event) => {

			const statusState = event.competitions[0].status.type.state
			const gameDate = moment(event.date).format('MMMM Do YYYY')
			const gameTime = moment(event.date).format('h:mm A')
			const isConfGame = event.competitions[0].conferenceCompetition

			let conference = ''
			if (isConfGame) {
				conference = event.competitions[0].groups.shortName
			}

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

			const teamA = (event.competitions[0].competitors[0].homeAway === "away") ? event.competitions[0].competitors[0] : event.competitions[0].competitors[1]
			const awayTeam = normalizeTeam(teamA, gameOdds)

			const teamB = (event.competitions[0].competitors[0].homeAway === "home") ? event.competitions[0].competitors[0] : event.competitions[0].competitors[1]
			const homeTeam = normalizeTeam(teamB, gameOdds)

			const venueName = event.competitions[0].venue.fullName
			const venueLocation = `${event.competitions[0].venue.address.city}, ${event.competitions[0].venue.address.state}`

			return {
				id: event.id,
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
				isConfGame,
				conference
			}

		})

		res.status(200).json({
			scoresDateParam,
			scoresDateReadable,
			games
		})

	}).catch((err) => {
		console.error(err)
	})

})

router.get('/team-ratings', cache(300), (req, res) => {

  const url = 'https://kenpom.com';
  axios.get(url).then((resp) => {

    const $ = cheerio.load(resp.data)
    const ratings = $('table#ratings-table tbody tr')
    let teamRatings = [];
		let totalTeams = 0;
		let totalTempo = 0;
		let totalEfficiency = 0;

    ratings.each((i, el) => {
      const tds = $(el).children();

			//USE toFixed() FOR DISPLAYYING AFTER PARSING

			const offensiveEfficiency = parseFloat( $(tds[5]).text().trim() )
			const defensiveEfficiency = parseFloat( $(tds[7]).text().trim() )
			const tempo = parseFloat( $(tds[9]).text().trim() )

      const teamRating = {
        "rank": $(tds[0]).text(),
        "team": $(tds[1]).find('a').text().trim(),
        "conf": $(tds[2]).find('a').text().trim(),
        "record": $(tds[3]).text().trim(),
        "adjEM": $(tds[4]).text().trim(),
        "adjO": offensiveEfficiency,
        "adjORank": $(tds[6]).find('.seed').text().trim(),
        "adjD": defensiveEfficiency,
        "adjDRank": $(tds[8]).find('.seed').text().trim(),
        "adjT": tempo,
        "adjTRank": $(tds[10]).find('.seed').text().trim(),
        "luck": $(tds[11]).text().trim(),
        "luckRank": $(tds[12]).find('.seed').text().trim(),
        "sosAdjEM": $(tds[13]).text().trim(),
        "sosAdjEMRank": $(tds[14]).find('.seed').text().trim(),
        "sosOppO": $(tds[15]).text().trim(),
        "sosOppORank": $(tds[16]).find('.seed').text().trim(),
        "sosOppD": $(tds[17]).text().trim(),
        "sosOppDRank": $(tds[18]).find('.seed').text().trim(),
        "nonConfAdjEM": $(tds[19]).text().trim(),
        "nonConfAdjEMRank": $(tds[20]).find('.seed').text().trim()
      };
			totalTeams += 1;
			totalTempo = totalTempo + tempo;
			totalEfficiency = totalEfficiency + ((offensiveEfficiency + defensiveEfficiency) / 2)
      teamRatings.push(teamRating);

    })

		const averageTempo = totalTempo / totalTeams
		const averageEfficiency = totalEfficiency / totalTeams

    res.status(200).json({
			totalTeams,
			averageTempo,
			averageEfficiency,
			ratings: teamRatings
		})

  }).catch((err) => {
    console.error(err)
  })

});

// register api routes
app.use('/api', router);

// load index.html for all routes
app.get('/', (req, res) => {
	res.sendFile('index')
})

// start server
app.listen(app.get('port'), function () {
  console.log("Server started on port", app.get('port'));
});
