exports.isFriend = (req, res, next) => {
  if (req.user) {
    const user = req.user
    const friendId = req.params.id
    const isFriend =
      user && user.friends.some((friend) => friend.userId === friendId)
    if (!isFriend) {
      return next()
    }
    res.redirect('/profile/' + req.params.id)
  } else {
    res.redirect('/auth/login')
  }
}
