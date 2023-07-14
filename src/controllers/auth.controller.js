const { SESSION_NAME } = require('../config/config')
const passport = require('passport')
const { Router } = require('express')
const router = Router()
const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')
const validate = require('../middleware/validation.middleware')
const {
  registerSchema,
  loginSchema,
} = require('../validations/user.validation')

const getLogin = (req, res) => {
  const errorMessage = req.flash('error')[0]
  res.render('login', { message: errorMessage, user: req.user })
}

const getSignup = (req, res) => {
  const errorMessage = req.flash('error')[0]
  res.render('signup', { message: errorMessage, user: req.user })
}

const getGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
})

const getGoogleCallback = passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
})

const postSignup = passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/auth/signup',
  failureFlash: true,
})

const postLogin = passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
})

const postLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    req.session.destroy(function (err) {
      if (err) return next(err)
      res.clearCookie(SESSION_NAME)
      res.redirect('/')
    })
  })
}

router.get('/auth/login', isNotAuth, getLogin)

router.get('/auth/signup', isNotAuth, getSignup)

// Google Oauth GET route
router.get('/auth/google', isNotAuth, getGoogle)

// Google Oauth callback route
router.get('/auth/google/callback', isNotAuth, getGoogleCallback)

// Sign up route using Passport and failureFlash option
router.post('/auth/signup', validate(registerSchema), isNotAuth, postSignup)

router.post('/auth/login', validate(loginSchema), isNotAuth, postLogin)

router.post('/auth/logout', isAuth, postLogout)

module.exports = router
