const { SESSION_NAME, SESSION_SECRET } = require('../config/config')
const SESSION_OPTIONS = {
  secret: SESSION_SECRET,
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
