const User = require("../models/users");

exports.getUserProfile = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (user) res.render("profile", { user });
  else res.status(404).render("error.ejs");
};
