const app = require('./app')
const homeRouter = require('./routes/home.route')
const authRouter = require('./routes/auth.route')
const friendRouter = require('./routes/friend.route')
const profileRouter = require('./routes/profile.route')
const chatRouter = require('./routes/chat.route')
const ajaxRouter = require('./routes/ajax.route')

// Set up routes

app.use(homeRouter)

app.use(authRouter)

app.use(friendRouter)

app.use(profileRouter)

app.use(chatRouter)

app.use(ajaxRouter)

app.use((req, res, next) => {
  res.status(404).render('error.ejs')
})

app.use((err, req, res, next) => {
  res.status(500).render('error.ejs')
})
