const User = require('../models/user.model')
const { Router } = require('express')
const router = Router()

const checkUsername = async (req , res) => {
  const username = req.query.username
  const isAvailable = (await User.findOne({ username: username })) === null
  res.json({ available: isAvailable })
}

router.get('/check-username', checkUsername)

module.exports = router