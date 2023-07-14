const mongoose = require('mongoose')
const { DATABASE } = require('../config/config')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

function dbConnect() {
  return mongoose.connect(DATABASE).then(() => {
    console.log(`Database connected at ${mongoose.connection.host}`)
  })
}

const store = new MongoDBStore({
  uri: DATABASE,
  collection: 'sessions',
})

module.exports = { dbConnect, store }
