const { Router } = require('express')
const router = Router()
const {
  getFriends,
  getAddFriends,
  postAcceptFriendRequest,
  postSendFriendRequest,
} = require('../controllers/friend.controller')

const { isAuth, isNotAuth } = require('../middleware/authentication.middleware')

router.get('/friends', isAuth, getFriends)

router.get('/friends/add', isAuth, getAddFriends)

router.post('/friends/acceptRequest', isAuth, postAcceptFriendRequest)

router.post('/friends/sendRequest', isAuth, postSendFriendRequest)

module.exports = router
