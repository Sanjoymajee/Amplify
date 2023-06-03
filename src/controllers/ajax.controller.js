const User = require('../models/user.model')

exports.checkUsername = async (req, res) => {
  const username = req.query.username
  const isAvailable = (await User.findOne({ username: username })) === null
  res.json({ available: isAvailable })
}
