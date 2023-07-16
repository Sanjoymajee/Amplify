const User = require('../models/user.model')
const { Router } = require('express')
const router = Router()

const getUserProfile = async (req, res) => {
  const userId = req.params.id
  // check userId validation
  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .render('error', { message: 'Invalid userId', status: 400 })
  }
  const profileUser = await User.findById(userId)
  const user = req.user
  const isFriend =
    user &&
    user.friends.some(
      (friend) => friend.userId.toString() == profileUser._id.toString()
    )
  console.log(isFriend)
  res.render('profile', { profileUser, user, isFriend })
}
router.get('/profile/:id', getUserProfile)

module.exports = router
