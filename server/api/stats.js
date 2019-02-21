const router = require('express').Router()
const cors = require('cors')
const getTeamStats = require('./utils/teamStats')

var corsOptions = process.env.isDev ? {
  origin: 'http://localhost:1234',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} : {}

router.get('/stats', cors(corsOptions), async (req, res) => {

	try{
		const teamStats = await getTeamStats()
    return res.status(200).json(teamStats)

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router
