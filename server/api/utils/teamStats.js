const axios = require('axios')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const connectToDatabase = require('../../db');
const StatsModel = require('../../models/Stats');
const minutesExpire = 60

async function getTeamStats() {

  const statsDocId = '5c702544f351a945e64d0e7c'

  try {
    await connectToDatabase()

    const statsDoc = await StatsModel.findById(statsDocId)
    if (!statsDoc)
      return []

		let statsUpdatedDate = dayjs(statsDoc.updated)
		let minutesOld = dayjs().diff(statsUpdatedDate, 'minute')
		if (minutesOld > minutesExpire) {
			console.log('outdated! getting new stats..')

			const teamStats = await scrape()
			let updated = new Date()
			let updatedReadable = dayjs(updated).format('M/D/YYYY h:m a')
			let updatedStats = await StatsModel.findOneAndUpdate(statsDocId, {
        title: 'AdvancedTeamStats',
				updated,
				updatedReadable,
				data: JSON.stringify(teamStats)
			})
			return JSON.parse(updatedStats.data)

		} else {
			console.log('returning stats from db..')
			return JSON.parse(statsDoc.data)
		}

  } catch(err) {
    console.log('ERROR', err)
    return []
  }

}

/*
// If we need to create a new stats document again
let teamStats = await scrape()
let updated = new Date()
let updatedReadable = dayjs(updated).format('M/D/YYYY h:m a')
let createInfo = {
  title: 'AdvancedTeamStats',
  updated,
  updatedReadable,
  data: JSON.stringify(teamStats)
}
StatsModel.create(createInfo)
  .then((s) => {
    console.log('created!',s._id)
  })
  .catch((err) => {
    console.log('not created', err)
  })
*/

async function scrape() {

  const url = 'https://www.sports-reference.com/cbb/seasons/2019-advanced-school-stats.html'
  const statsRes = await axios.get(url)

  console.time('STATSCRAPE')
  const $ = cheerio.load(statsRes.data, { normalizeWhitespace: true })
  const advDiv = $('#all_adv_school_stats')
  let rawHtml = advDiv.html()
  rawHtml = rawHtml.replace('<!--', '')
  rawHtml = rawHtml.replace('-->', '')

  const advDomNodes = cheerio.parseHTML(rawHtml)
  const statRows = $(advDomNodes).find('table#adv_school_stats tbody tr')

  let teamStats = []
  statRows.each((i, elem) => {
    teamStats[i] = {
      team: $(elem).find('td[data-stat="school_name"]').text(),
      //blk_pct: $(elem).find('td[data-stat="blk_pct"]').text(),
      efg_pct: $(elem).find('td[data-stat="efg_pct"]').text(),
      tov_pct: $(elem).find('td[data-stat="tov_pct"]').text(),
      orb_pct: $(elem).find('td[data-stat="orb_pct"]').text(),
      ft_rate: $(elem).find('td[data-stat="ft_rate"]').text(),
      //ts_pct: $(elem).find('td[data-stat="ts_pct"]').text(),
      //stl_pct: $(elem).find('td[data-stat="stl_pct"]').text(),
      //trb_pct: $(elem).find('td[data-stat="trb_pct"]').text(),
      //orb_pct: $(elem).find('td[data-stat="orb_pct"]').text(),
    }
  })
  console.timeEnd('STATSCRAPE')

  return teamStats

}

module.exports = getTeamStats
