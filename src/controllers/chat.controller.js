const User = require('../models/user.model')
const Messages = require('../models/message.model')
const { Router } = require('express')
const router = Router()

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')
const { isFriend } = require('../middleware/friend.middleware')

const getMessage = async (req, res) => {
  const userId = req.params.id
  const user = req.user
  if (!user) {
    res
      .status(404)
      .render('error.ejs', { message: 'User not found', status: 404 })
    return
  }
  if (userId === user._id.toString()) {
    res
      .status(404)
      .render('error.ejs', {
        message: 'Cannot chat with yourself',
        status: 404,
      })
    return
  }
  const friendUser = await User.findById(userId)
  if (!friendUser) {
    res
      .status(404)
      .render('error.ejs', { message: 'Friend user not found', status: 404 })
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
  res.render('chats', { user, friendUser, messages })
}

router.get('/chat/:id', isAuth, isFriend, getMessage)

module.exports = router
