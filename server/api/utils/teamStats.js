const axios = require('axios')
const cheerio = require('cheerio')

async function getTeamStats() {

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
