const { Router } = require('express')
const router = Router()

const getHome = (req, res) => {
  res.render('home', { user: req.user })
}

router.get('/', (req, res) => {
  res.redirect('/home')
})

router.get('/home', getHome)

module.exports = router
