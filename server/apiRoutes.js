const router = require('express').Router();
const env = (process.env.NODE_ENV === 'development') ? 'development' : 'production';
const mcache = require('memory-cache');
const moment = require('moment');
const axios = require('axios');
const cheerio = require('cheerio');
const getGames = require('./gamesUtil')

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

function checkHeader(req, res, next) {
	if (req.headers.bucedup && req.headers.bucedup === 'shclient198827') {
		return next();
	} else {
		return res.status(401).json({'valid': false})
	}
}

router.get('/testheader', checkHeader, (req, res) => {
	res.status(200).json({'gamedata': 'data'})
})

router.get('/games/:date*?', checkHeader, cache(200), (req, res) => {

	let scoreboardDate = moment().format('YYYYMMDD')
	if (req.params && req.params.date) {
		const paramDate = req.params.date
		if ( moment(paramDate, 'YYYYMMDD').isValid() ) {
			scoreboardDate = paramDate
		}
	}

	let isNCAATournament = false;

	const ncaaStart = moment('20180312', 'YYYYMMDD')
	const ncaaEnd = moment('20180402', 'YYYYMMDD')

	// Looking for the day after NCAA Selection Sunday and the day of the Final Four
  if ( scoreboardDate >= ncaaStart && scoreboardDate <= ncaaEnd ) {
    isNCAATournament = true
  }

	getGames(scoreboardDate, isNCAATournament).then((games) => {
		res.status(200).json({
			date: scoreboardDate,
			isNCAATournament,
			games
		})
	}).catch((err) => {
		console.error(err)
		res.status(500).json({'error': 'Something went wrong with game retrieval'})
	})

})

router.get('/team-ratings', checkHeader, cache(1000), (req, res) => {

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

		const averageTempo = parseFloat((totalTempo / totalTeams).toFixed(1))
		const averageEfficiency = parseFloat((totalEfficiency / totalTeams).toFixed(1))

    res.status(200).json({
			totalTeams,
			averageTempo,
			averageEfficiency,
			ratings: teamRatings
		})

  }).catch((err) => {
    console.error(err)
		res.status(500).json({'error': 'Something went wrong with team ratings retrieval'})
  })

});

module.exports = router
