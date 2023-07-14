const { SESSION_NAME } = require('../config/config')
const SESSION_OPTIONS = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: SESSION_NAME,
  cookie: {
    httpOnly: true, // Prevents client side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    samesite: true,
  },
}

module.exports = { SESSION_OPTIONS }
