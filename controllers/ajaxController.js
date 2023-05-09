const User = require("../models/users");

exports.checkUsername = async (req, res) => {
  const username = req.query.username;
  const isAvailable = (await User.findOne({ username: username })) === null;
  res.json({ available: isAvailable });
};
