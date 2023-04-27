const User = require("../models/users");

exports.getUserProfile = async (req, res) => {
  const profileUsername = req.params.profileUsername.toLowerCase();
  const profileUser = await User.findOne({ username : profileUsername });
  res.render("profile", { profileUser, user: req.user });
};
