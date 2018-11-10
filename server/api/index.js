const router = require('express').Router();
const games = require('./games')

router.use(games)

module.exports = router
