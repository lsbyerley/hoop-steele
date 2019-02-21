const router = require('express').Router();
const games = require('./games')
const stats = require('./stats')

router.use(games)
router.use(stats)

module.exports = router
