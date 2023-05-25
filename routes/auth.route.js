const { Router } = require('express')
const router = Router()
const {
  getLogin,
  getSignup,
  getGoogle,
  getGoogleCallback,
  postSignup,
  postLogin,
  postLogout,
} = require('../controllers/auth.controller')

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')

router.get('/auth/login', isNotAuth, getLogin)

router.get('/auth/signup', isNotAuth, getSignup)

// Google Oauth GET route
router.get('/auth/google', isNotAuth, getGoogle)

// Google Oauth callback route
router.get('/auth/google/callback', isNotAuth, getGoogleCallback)

// Sign up route using Passport and failureFlash option
router.post('/auth/signup', isNotAuth, postSignup)

router.post('/auth/login', isNotAuth, postLogin)

router.post('/auth/logout', isAuth, postLogout)

module.exports = router
