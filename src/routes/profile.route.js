const { Router } = require('express')
const router = Router()
const { getUserProfile } = require('../controllers/profile.controller')

router.get('/profile/:profileUsername', getUserProfile)

module.exports = router
