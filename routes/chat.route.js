const { Router } = require('express')
const router = Router()
const { postMessage, getMessage } = require('../controllers/chat.controller')

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')
const { isFriend } = require('../middleware/friend.middleware')

router.get('/chat/:username', isAuth, isFriend, getMessage)

module.exports = router
