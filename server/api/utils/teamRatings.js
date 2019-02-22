const axios = require('axios')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const connectToDatabase = require('../../db');
const RatingsModel = require('../../models/Ratings');
const minutesExpire = 60

async function getTeamRatings() {

  const ratingsDocId = '5c70474991be4f7d4943bb43'

  try {
    await connectToDatabase()

    const ratingsDoc = await RatingsModel.findById(ratingsDocId)
    if (!ratingsDoc)
      return {}
      
		let ratingsUpdatedDate = dayjs(ratingsDoc.updated)
		let minutesOld = dayjs().diff(ratingsUpdatedDate, 'minute')
		if (minutesOld > minutesExpire) {
			console.log('outdated! getting new ratings..')

			const ratings = await scrape()
			let updated = new Date()
			let updatedReadable = dayjs(updated).format('M/D/YYYY h:m a')
			let updatedRatings = await RatingsModel.findOneAndUpdate(ratingsDocId, {
        title: 'KenPomRatings',
				updated,
				updatedReadable,
				data: JSON.stringify(ratings)
			})
			return JSON.parse(updatedRatings.data)

		} else {
			console.log('returning ratings from db..')
			return JSON.parse(ratingsDoc.data)
		}

  } catch(err) {
    console.log('ERROR', err)
    return {}
  }

}

/*
// If we need to create a new ratings document again
let ratings = await scrape()
let updated = new Date()
let updatedReadable = dayjs(updated).format('M/D/YYYY h:m a')
let createInfo = {
  title: 'KenPomRatings',
  updated,
  updatedReadable,
  data: JSON.stringify(ratings)
}
RatingsModel.create(createInfo)
  .then((s) => {
    console.log('created!',s._id)

    //return JSON.parse()
  })
  .catch((err) => {
    console.log('not created', err)
  })
*/

async function scrape() {

  const url = 'https://kenpom.com';
  const ratingsRes = await axios.get(url);

  const $ = cheerio.load(ratingsRes.data)
  const ratings = $('table#ratings-table tbody tr')
  let teamRatings = [];
  let totalTeams = 0;
  let totalTempo = 0;
  let totalEfficiency = 0;

  ratings.each((i, el) => {
    const tds = $(el).children();

    //USE toFixed() FOR DISPLAYING AFTER PARSING

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
      //"luck": $(tds[11]).text().trim(),
      //"luckRank": $(tds[12]).find('.seed').text().trim(),
      "sosAdjEM": $(tds[13]).text().trim(),
      "sosAdjEMRank": $(tds[14]).find('.seed').text().trim(),
      //"sosOppO": $(tds[15]).text().trim(),
      //"sosOppORank": $(tds[16]).find('.seed').text().trim(),
      //"sosOppD": $(tds[17]).text().trim(),
      //"sosOppDRank": $(tds[18]).find('.seed').text().trim(),
      //"nonConfAdjEM": $(tds[19]).text().trim(),
      //"nonConfAdjEMRank": $(tds[20]).find('.seed').text().trim()
    };
    totalTeams += 1;
    totalTempo = totalTempo + tempo;
    totalEfficiency = totalEfficiency + ((offensiveEfficiency + defensiveEfficiency) / 2)
    teamRatings.push(teamRating);

  })

  const avgTempo = parseFloat((totalTempo / totalTeams).toFixed(1))
  const avgEfficiency = parseFloat((totalEfficiency / totalTeams).toFixed(1))

  return {
    totalTeams,
    avgTempo,
    avgEfficiency,
    ratings: teamRatings
  }

}

module.exports = getTeamRatings
