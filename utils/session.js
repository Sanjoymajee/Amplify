const SESSION_OPTIONS = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}

module.exports = { SESSION_OPTIONS }