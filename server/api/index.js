const router = require('express').Router();
const games = require('./games')
const stats = require('./stats')
const odds = require('./odds')

router.use(games)
router.use(stats)
router.use(odds)

module.exports = router
