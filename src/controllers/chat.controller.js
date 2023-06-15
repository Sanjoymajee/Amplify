const User = require('../models/user.model')
const Messages = require('../models/message.model')
const { Router } = require('express')
const router = Router()

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')
const { isFriend } = require('../middleware/friend.middleware')

const getMessage = async (req, res) => {
  const friendUsername = req.params.username
  const user = req.user
  if (!user) {
    res.status(404).render('error.ejs')
    return
  }
  if (friendUsername === user.username) {
    res.status(404).render('error.ejs')
    return
  }
  const friendUser = await User.findOne({ username: friendUsername })
  if (!friendUser) {
    res.status(404).render('error.ejs')
    return
  }
  const userMessages = await Messages.find({
    'receiver.id': friendUser._id,
    'sender.id': user._id,
  })
  const friendUserMessages = await Messages.find({
    'receiver.id': user._id,
    'sender.id': friendUser._id,
  })
  const messages = [...userMessages, ...friendUserMessages]
  messages.sort((a, b) => a.timestamp - b.timestamp)
  res.render('chats', { user, friendUsername, messages })
}


router.get('/chat/:username', isAuth, isFriend, getMessage)


module.exports = router