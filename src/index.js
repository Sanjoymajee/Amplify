const app = require('./app')
const authController = require('./controllers/auth.controller')
const homeController = require('./controllers/home.controller')
const friendController = require('./controllers/friend.controller')
const profileController = require('./controllers/profile.controller')
const chatController = require('./controllers/chat.controller')
const ajaxController = require('./controllers/ajax.controller')

// Set up controllers

app.use(homeController)
app.use(authController)
app.use(friendController)
app.use(profileController)
app.use(chatController)
app.use(ajaxController)

app.use((req, res, next) => {
  res.status(404).render('error.ejs')
})

app.use((err, req, res, next) => {
  res.status(500).render('error.ejs')
})
