const { Router } = require('express')
const router = Router()
const { checkUsername } = require('../controllers/ajax.controller')

router.get('/check-username', checkUsername)

module.exports = router
