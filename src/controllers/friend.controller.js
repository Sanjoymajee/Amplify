const User = require('../models/user.model')
const { Router } = require('express')
const router = Router()

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')

const getFriends = async (req, res) => {
  const user = req.user
  const message = req.query.message
  res.render('friends', { user, message })
}

const getAddFriends = (req, res) => {
  const message = req.query.message
  res.render('addFriends', { user: req.user, message })
}

const postAcceptFriendRequest = async (req, res) => {
  const userId = req.params.id
  console.log(userId)
  const user = req.user
  try {
    const friendUser = await User.findById(userId)
    console.log(friendUser)
    const requests = user.friendRequests
    const requestIndex = requests.findIndex(
      (friend) => friend.userId.toString() === user._id.toString()
    )
    requests.splice(requestIndex, 1)
    friendUser.friends.push({
      userId: user._id,
      username: user.username,
      email: user.email,
    })
    await friendUser.save()
    user.friends.push({
      userId: friendUser._id,
      username: friendUser.username,
      email: friendUser.email,
    })
    await user.save()
    const message = 'Friend request accepted!'
    res.redirect('/friends?message=' + message)
  } catch (err) {
    console.log(err)
    console.error(`Error accepting friend request: ${err.message}`)
    const message = 'An error occurred while accepting the friend request.'
    res.redirect('/friends?message=' + message)
  }
}

const postSendFriendRequest = async (req, res) => {
  const username = req.body.username.toLowerCase()
  const user = req.user

  try {
    if (username === user.username) {
      const message = 'You cannot send a friend request to yourself.'
      res.redirect('/friends/add-friends?message=' + message)
      return
    }
    const friendUser = await User.findOne({ username: username })
    if (friendUser) {
      const friendId = friendUser._id
      const friendRequests = friendUser.friendRequests
      for (const friend of user.friends) {
        if (friend.userId.toString() === friendId.toString()) {
          const message = 'You are already friends with this user.'
          res.redirect('/friends/add-friends?message=' + message)
          return
        }
      }

      // console.log(friendRequests.includes({userId : req.user._id}));
      for (const friendRequest of friendRequests) {
        if (friendRequest.userId.toString() === user._id.toString()) {
          const message = 'You have already sent a friend request to this user.'
          res.redirect('/friends/add-friends?message=' + message)
          return
        }
      }
      friendRequests.push({
        userId: user._id,
        username: user.username,
        email: user.email,
      })
      await friendUser.save()
      // req.session.message = 'Friend request sent!';
      const message = 'Friend request sent!'
      res.redirect('/friends/add-friends?message=' + message)
      // res.render('addFriends', { user: req.user, message: 'Friend request sent!' });
    } else {
      const message = 'No user with that username was found.'
      res.redirect('/friends/add-friends?message=' + message)
      // res.render('addFriends', { user: req.user, message: 'No user with that username was found.' });
    }
  } catch (err) {
    console.error(`Error sending friend request: ${err.message}`)
    const message = 'An error occurred while sending the friend request.'
    res.redirect('/friends/add-friends?message=' + message)
    // res.render('addFriends', { user: req.user, message: 'An error occurred while sending the friend request.' });
  }
}

router.get('/friends', isAuth, getFriends)

router.get('/friends/add-friends', isAuth, getAddFriends)

router.post('/friends/acceptRequest/:id', isAuth, postAcceptFriendRequest)

router.post('/friends/sendRequest', isAuth, postSendFriendRequest)

module.exports = router
