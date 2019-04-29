const router = require('express').Router()
const cors = require('cors')
const getOdds = require('./utils/odds')
const corsOptions = process.env.isDev ? {
  origin: 'http://localhost:1234',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
} : {}

router.get('/odds', cors(corsOptions), async (req, res) => {

	try{
		const gameOdds = await getOdds()
    return res.status(200).json(gameOdds)

	} catch (err) {
		console.error(err)
		return res.status(500).json({ error: err })
	}

})

module.exports = router