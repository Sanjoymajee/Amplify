const { Router } = require('express')
const router = Router()
const { getHome } = require('../controllers/home.controller')

router.get('/', (req, res) => {
  res.redirect('/home')
})

router.get('/home', getHome)

module.exports = router
