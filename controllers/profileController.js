const User = require("../models/users");

exports.getUserProfile = async (req, res) => {
  const profileUsername = req.params.profileUsername.toLowerCase();
  const profileUser = await User.findOne({ username : profileUsername });
  const user = req.user;
  const isFriend = user.friends.some((friend) => {
    return friend.userId.toString() == profileUser._id.toString();
  })
  res.render("profile", { profileUser, user, isFriend });
};
