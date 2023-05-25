const mongoose = require('mongoose')
const { DATABASE, DATABASE_LOCAL } = require('../config/config')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

function dbConnect() {
  return mongoose.connect(DATABASE_LOCAL).then(() => {
    console.log(`Database connected at ${mongoose.connection.host}`)
  })
}

const store = new MongoDBStore({
  uri: DATABASE_LOCAL,
  collection: 'sessions',
})

module.exports = { dbConnect, store }
