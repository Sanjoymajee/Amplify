require('dotenv').config()
require('ejs')
require('./utils/passportAuth')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const flash = require('connect-flash')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const { PORT } = require('./config/config')
const { dbConnect, store } = require('./utils/dbConnect')
const { SESSION_OPTIONS } = require('./utils/session')
const cors = require('cors')
const socketConnection = require('./utils/socket')

app.set('view engine', 'ejs') // Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views')) // Set up views directory
app.use(express.static(path.join(__dirname, 'public'))) // Set up static files
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(flash()) // Set up flash messages
app.use(cors())

// Set up session middleware
app.use(
  session({
    ...SESSION_OPTIONS,
    store: store,
  })
)

// Set up passport middleware
app.use(passport.initialize())
app.use(passport.session())

socketConnection(server)

// Start server
dbConnect().then(() => {
  server.listen(PORT, () => {
    console.log(`listening for requests at PORT ${PORT}`)
  })
})

module.exports = app
